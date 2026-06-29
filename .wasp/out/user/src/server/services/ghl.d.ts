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
export interface GhlOnboardingContact {
    firstName: string;
    lastName?: string;
    phone: string;
    email?: string;
    postalCode: string;
    role: 'CONSUMER' | 'PROVIDER';
    businessName?: string;
}
/**
 * Syncs a freshly-onboarded user to GoHighLevel as a contact.
 *
 * Onboarding has no ServiceRequest, so this is separate from sendLeadToGHL:
 * it logs with serviceRequestId = null (the FK is nullable) and tags the
 * contact with the user's role instead of a lead/service type. Without this,
 * a phone collected at signup never reached GHL until the user later filed a
 * request. Fire-and-forget — never blocks onboarding.
 */
export declare function syncContactToGHL(contact: GhlOnboardingContact, prisma: PrismaClient): Promise<void>;
