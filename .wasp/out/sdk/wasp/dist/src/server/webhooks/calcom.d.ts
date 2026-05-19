import type { CalcomWebhook } from 'wasp/server/api';
/**
 * Cal.com webhook handler — receives booking events and syncs them to The Helper.
 *
 * Set up in cal.com: Settings → Webhooks → Add webhook
 *   URL: https://your-domain.com/calcom-webhook
 *   Events: BOOKING_CREATED, BOOKING_CANCELLED, BOOKING_RESCHEDULED
 *   Secret: set CALCOM_WEBHOOK_SECRET in .env.server
 */
export declare const calcomWebhook: CalcomWebhook;
//# sourceMappingURL=calcom.d.ts.map