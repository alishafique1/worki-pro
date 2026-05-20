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
export declare function sendLeadToGHL(payload: GhlContactPayload, prisma: PrismaClient): Promise<void>;
