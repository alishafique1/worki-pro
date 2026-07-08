import crypto from 'crypto';
import { prisma } from 'wasp/server';
import { RequestStatus, ProviderStatus } from '@prisma/client';
import { canTransition } from '../../shared/requestStatusMachine';
/** Constant-time string comparison — avoids leaking the secret via timing. */
const safeEqual = (a, b) => {
    const aBuf = Buffer.from(a);
    const bBuf = Buffer.from(b);
    return aBuf.length === bBuf.length && crypto.timingSafeEqual(aBuf, bBuf);
};
/**
 * GoHighLevel → The Helper inbound webhook
 *
 * GHL fires this when a contact's status changes in the pipeline.
 *
 * Expected payload from GHL:
 * {
 *   event: string,              // e.g. 'conversation.qualified', 'appointment.booked'
 *   requestId: string,          // The Helper ServiceRequest.id — stored as custom field in GHL
 *   ghlContactId?: string,
 *   status?: string,            // optional override status string
 *   providerId?: string,        // The Helper Provider.id if a pro is assigned
 *   appointmentTime?: string,   // ISO datetime
 *   notes?: string,
 *   secret?: string,            // must match GHL_WEBHOOK_SECRET env var
 * }
 *
 * GHL pipeline stage → The Helper RequestStatus mapping:
 *   conversation.started    → SMS_STARTED
 *   conversation.qualifying → QUALIFYING
 *   conversation.qualified  → QUALIFIED
 *   lead.assigned           → ASSIGNED
 *   appointment.booked      → BOOKED
 *   job.completed           → COMPLETED
 *   lead.lost               → LOST
 */
export const handleGhlWebhook = async (req, res, context) => {
    // ── Authenticate ──────────────────────────────────────────────────────────
    const isProduction = process.env.NODE_ENV === 'production';
    const secret = process.env.GHL_WEBHOOK_SECRET;
    if (!secret) {
        // Fail closed in production: never process unauthenticated payloads.
        if (isProduction) {
            console.error('[GHL] GHL_WEBHOOK_SECRET is not set in production — rejecting webhook. Configure the secret to process GHL events.');
            return res.status(503).json({ error: 'Webhook misconfigured' });
        }
        console.warn('[GHL] GHL_WEBHOOK_SECRET not set — skipping auth (dev only).');
    }
    else {
        const headerSecret = req.headers['x-thehelper-secret'];
        const bodySecret = req.body?.secret;
        const headerOk = typeof headerSecret === 'string' && safeEqual(headerSecret, secret);
        const bodyOk = typeof bodySecret === 'string' && safeEqual(bodySecret, secret);
        if (!headerOk && !bodyOk) {
            return res.status(401).json({ error: 'Invalid webhook secret' });
        }
    }
    const { event, requestId, ghlContactId, status, providerId, appointmentTime, notes, } = req.body;
    // Log every inbound call to WebhookLog for debugging.
    // Redact the shared webhook secret before persisting — never store it plaintext.
    const { secret: _secret, ...loggedPayload } = (req.body ?? {});
    await context.entities.WebhookLog.create({
        data: {
            direction: 'INBOUND',
            source: 'GHL',
            event: event ?? 'unknown',
            serviceRequestId: requestId ?? null,
            payload: loggedPayload,
            statusCode: 200,
        },
    });
    if (!requestId) {
        return res.status(200).json({ received: true, skipped: 'no requestId' });
    }
    const serviceRequest = await context.entities.ServiceRequest.findUnique({
        where: { id: requestId },
    });
    if (!serviceRequest) {
        return res.status(200).json({ received: true, skipped: 'request not found' });
    }
    // ── Map GHL event → RequestStatus ─────────────────────────────────────────
    const statusMap = {
        'conversation.started': RequestStatus.SMS_STARTED,
        'conversation.qualifying': RequestStatus.QUALIFYING,
        'conversation.qualified': RequestStatus.QUALIFIED,
        'lead.assigned': RequestStatus.ASSIGNED,
        'appointment.booked': RequestStatus.BOOKED,
        'job.completed': RequestStatus.COMPLETED,
        'lead.lost': RequestStatus.LOST,
    };
    // Whitelist caller-supplied status against the real RequestStatus enum —
    // ignore anything that isn't a known value.
    const candidateStatus = statusMap[event] ?? status;
    const validStatuses = new Set(Object.values(RequestStatus));
    let newStatus;
    if (candidateStatus) {
        if (validStatuses.has(candidateStatus)) {
            newStatus = candidateStatus;
        }
        else {
            console.warn(`[GHL] Ignoring unknown status "${candidateStatus}" for request ${requestId}`);
        }
    }
    // Status machine gate: skip illegal transitions (incl. same-status retries)
    // with a warning instead of failing the webhook — GHL retries on 5xx.
    if (newStatus && !canTransition(serviceRequest.status, newStatus)) {
        console.warn(`[GHL] Skipping invalid status transition ${serviceRequest.status}→${newStatus} for request ${requestId}`);
        newStatus = undefined;
    }
    // Only assign a provider that exists AND is VERIFIED — otherwise skip.
    let verifiedProviderId;
    if (providerId) {
        const provider = await prisma.provider.findUnique({
            where: { id: providerId },
            select: { id: true, verificationStatus: true },
        });
        if (provider && provider.verificationStatus === ProviderStatus.VERIFIED) {
            // Never silently steal a lead another provider already claimed (and paid for).
            if (serviceRequest.assignedProviderId &&
                serviceRequest.assignedProviderId !== providerId) {
                console.warn(`[GHL] Skipping provider assignment for request ${requestId} — already assigned to provider ${serviceRequest.assignedProviderId}, refusing to reassign to ${providerId}`);
            }
            else {
                verifiedProviderId = providerId;
            }
        }
        else {
            console.warn(`[GHL] Skipping provider assignment for request ${requestId} — provider ${providerId} ${provider ? `has status ${provider.verificationStatus}` : 'not found'}`);
        }
    }
    // Validate appointmentTime before handing it to Prisma — garbage input must
    // not become an Invalid Date (Prisma throws → 500 → GHL retry loop).
    let bookedAtDate;
    if (appointmentTime) {
        const parsed = new Date(appointmentTime);
        if (isNaN(parsed.getTime())) {
            console.warn(`[GHL] Ignoring unparseable appointmentTime "${appointmentTime}" for request ${requestId}`);
        }
        else {
            bookedAtDate = parsed;
        }
    }
    // ── Update ServiceRequest ─────────────────────────────────────────────────
    await context.entities.ServiceRequest.update({
        where: { id: requestId },
        data: {
            ...(newStatus && { status: newStatus }),
            ...(verifiedProviderId && { assignedProviderId: verifiedProviderId }),
            // Timestamps only when the corresponding status is actually being
            // written — a rejected transition must not stamp bookedAt/completedAt.
            ...(newStatus === RequestStatus.BOOKED && bookedAtDate && { bookedAt: bookedAtDate }),
            ...(newStatus === RequestStatus.COMPLETED && { completedAt: new Date() }),
        },
    });
    // ── Log to CommunicationLog ───────────────────────────────────────────────
    await context.entities.CommunicationLog.create({
        data: {
            serviceRequestId: requestId,
            channel: 'SMS',
            direction: 'INBOUND',
            from: ghlContactId ?? 'ghl-system',
            to: 'thehelper-system',
            body: notes ?? `GHL event: ${event}`,
            status: newStatus ?? event,
            rawPayload: loggedPayload,
        },
    });
    return res.status(200).json({ received: true, updatedStatus: newStatus ?? event });
};
//# sourceMappingURL=ghl.js.map