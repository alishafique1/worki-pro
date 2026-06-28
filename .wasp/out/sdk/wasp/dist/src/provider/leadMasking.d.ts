export declare const FORBIDDEN_LEAD_FIELDS: readonly ["name", "phone", "email"];
export type MaskedLead = {
    id: string;
    createdAt: Date;
    serviceCategory: {
        name: string;
        slug: string;
    } | null;
    postalCode: string;
    city: string | null;
    urgency: string;
    description: string;
    estimatedSchedule: string | null;
    status: string;
    claimed: boolean;
};
export type RawLead = {
    id: string;
    createdAt: Date;
    serviceCategory: {
        name: string;
        slug: string;
    } | null;
    postalCode: string;
    city: string | null;
    urgency: string;
    description: string;
    estimatedSchedule: string | null;
    status: string;
    assignedProviderId: string | null;
    name?: string | null;
    phone?: string | null;
    email?: string | null;
};
export declare function maskLead(r: RawLead): MaskedLead;
//# sourceMappingURL=leadMasking.d.ts.map