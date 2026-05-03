import type { PrismaClient } from '@prisma/client';

export interface GhlContactPayload {
  serviceRequestId: string;
  name: string;
  phone: string;
  email?: string;
  postalCode: string;
  serviceType?: string;
  description: string;
  urgency: string;
  source: string;
}

/**
 * Sends a new service request to GoHighLevel as a contact + trigger.
 * Fire-and-forget — never blocks the main request flow.
 * Logs success/failure to WebhookLog for debugging.
 */
export async function sendLeadToGHL(
  payload: GhlContactPayload,
  prisma: PrismaClient,
): Promise<void> {
  const webhookUrl = process.env.GHL_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('[GHL] GHL_WEBHOOK_URL not set — skipping outbound webhook');
    return;
  }

  const body = {
    contact: {
      firstName: payload.name.split(' ')[0] ?? payload.name,
      lastName: payload.name.split(' ').slice(1).join(' ') || undefined,
      phone: normalizePhone(payload.phone),
      email: payload.email,
      postalCode: payload.postalCode,
      tags: ['worki-lead', payload.serviceType ?? 'general', payload.urgency.toLowerCase()],
      customFields: {
        worki_request_id: payload.serviceRequestId,
        service_type: payload.serviceType ?? 'general',
        description: payload.description,
        urgency: payload.urgency,
        source: payload.source,
      },
    },
  };

  let statusCode: number | undefined;
  let error: string | undefined;

  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (process.env.GHL_WEBHOOK_SECRET) {
      headers['x-worki-secret'] = process.env.GHL_WEBHOOK_SECRET;
    }

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    statusCode = res.status;

    if (!res.ok) {
      error = `GHL responded ${res.status}: ${await res.text()}`;
      console.error('[GHL] Outbound webhook failed:', error);
    } else {
      console.log(`[GHL] Lead sent for request ${payload.serviceRequestId}`);
    }
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
    console.error('[GHL] Outbound webhook error:', error);
  }

  // Log regardless of success/failure — never throw
  try {
    await (prisma as any).webhookLog.create({
      data: {
        direction: 'OUTBOUND',
        source: 'GHL',
        event: 'lead.created',
        serviceRequestId: payload.serviceRequestId,
        payload: body as any,
        statusCode,
        error,
      },
    });
  } catch (logErr) {
    console.error('[GHL] Failed to write WebhookLog:', logErr);
  }
}

/** Normalize Canadian/US phone to E.164 format */
function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return `+${digits}`;
}
