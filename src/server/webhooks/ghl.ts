import type { GhlWebhook } from 'wasp/server/api';

/**
 * GoHighLevel → Worki inbound webhook
 *
 * GHL fires this when a contact's status changes in the pipeline.
 *
 * Expected payload from GHL:
 * {
 *   event: string,              // e.g. 'conversation.qualified', 'appointment.booked'
 *   requestId: string,          // Worki ServiceRequest.id — stored as custom field in GHL
 *   ghlContactId?: string,
 *   status?: string,            // optional override status string
 *   providerId?: string,        // Worki Provider.id if a pro is assigned
 *   appointmentTime?: string,   // ISO datetime
 *   notes?: string,
 *   secret?: string,            // must match GHL_WEBHOOK_SECRET env var
 * }
 *
 * GHL pipeline stage → Worki RequestStatus mapping:
 *   conversation.started    → SMS_STARTED
 *   conversation.qualifying → QUALIFYING
 *   conversation.qualified  → QUALIFIED
 *   lead.assigned           → ASSIGNED
 *   appointment.booked      → BOOKED
 *   job.completed           → COMPLETED
 *   lead.lost               → LOST
 */
export const handleGhlWebhook: GhlWebhook = async (req, res, context) => {
  // ── Authenticate ──────────────────────────────────────────────────────────
  const isProduction = process.env.NODE_ENV === 'production';
  const secret = process.env.GHL_WEBHOOK_SECRET;
  if (isProduction && !secret) {
    return res.status(401).json({ error: 'Webhook secret is required in production' });
  }

  const headerSecret = req.headers['x-worki-secret'];
  const bodySecret = (req.body as { secret?: string })?.secret;
  if (secret && headerSecret !== secret && bodySecret !== secret) {
    return res.status(401).json({ error: 'Invalid webhook secret' });
  }

  const {
    event,
    requestId,
    ghlContactId,
    status,
    providerId,
    appointmentTime,
    notes,
  } = req.body as {
    event: string;
    requestId?: string;
    ghlContactId?: string;
    status?: string;
    providerId?: string;
    appointmentTime?: string;
    notes?: string;
    secret?: string;
  };

  // Log every inbound call to WebhookLog for debugging
  await (context.entities as any).WebhookLog.create({
    data: {
      direction: 'INBOUND',
      source: 'GHL',
      event: event ?? 'unknown',
      serviceRequestId: requestId ?? null,
      payload: req.body,
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
  const statusMap: Record<string, string> = {
    'conversation.started':    'SMS_STARTED',
    'conversation.qualifying': 'QUALIFYING',
    'conversation.qualified':  'QUALIFIED',
    'lead.assigned':           'ASSIGNED',
    'appointment.booked':      'BOOKED',
    'job.completed':           'COMPLETED',
    'lead.lost':               'LOST',
  };

  const newStatus = statusMap[event] ?? status ?? undefined;

  // ── Update ServiceRequest ─────────────────────────────────────────────────
  await context.entities.ServiceRequest.update({
    where: { id: requestId },
    data: {
      ...(newStatus && { status: newStatus as any }),
      ...(providerId && { assignedProviderId: providerId }),
      ...(appointmentTime && { bookedAt: new Date(appointmentTime) }),
      ...(event === 'job.completed' && { completedAt: new Date() }),
    },
  });

  // ── Log to CommunicationLog ───────────────────────────────────────────────
  await context.entities.CommunicationLog.create({
    data: {
      serviceRequestId: requestId,
      channel: 'SMS',
      direction: 'INBOUND',
      from: ghlContactId ?? 'ghl-system',
      to: 'worki-system',
      body: notes ?? `GHL event: ${event}`,
      status: newStatus ?? event,
      rawPayload: req.body,
    },
  });

  return res.status(200).json({ received: true, updatedStatus: newStatus ?? event });
};
