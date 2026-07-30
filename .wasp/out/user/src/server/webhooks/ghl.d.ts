import type { GhlWebhook } from 'wasp/server/api';
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
export declare const handleGhlWebhook: GhlWebhook;
