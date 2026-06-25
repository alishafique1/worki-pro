import type { ServiceRequest, Provider, Appointment, ProviderFee, ProviderCategory, ServiceCategory, CommunicationLog, Review } from "wasp/entities";
import type { GetProviderLeads, GetProviderAppointments, GetProviderProfile, GetProviderFees, AcceptServiceRequest, MarkJobCompleted, SubmitProviderApplication, CreateProviderProfile, UpdateProviderServices, UpdateProviderProfile, UpdateProviderAppointment, SendProviderMessage, GetPublicLeadFeed, ClaimLead, GetPublicProvider, ResubmitProviderApplication, AddPortfolioPhoto, RemovePortfolioPhoto, SetProfilePhoto } from "wasp/server/operations";
export declare const getProviderLeads: GetProviderLeads<void, ServiceRequest[]>;
export declare const getProviderAppointments: GetProviderAppointments<void, any[]>;
export declare const getProviderProfile: GetProviderProfile<void, Provider & {
    categories: (ProviderCategory & {
        serviceCategory: ServiceCategory;
    })[];
}>;
export declare const getProviderFees: GetProviderFees<void, ProviderFee[]>;
export declare const acceptServiceRequest: AcceptServiceRequest<{
    requestId: string;
}, Appointment>;
type UpdateProviderProfileInput = {
    businessName?: string;
    contactName?: string;
    phone?: string;
    email?: string;
    website?: string;
    serviceAreas?: string[];
    calComUsername?: string;
    slug?: string;
    bio?: string;
    profilePhotoUrl?: string;
    portfolioJson?: string;
    accreditationsJson?: string;
    responseTimeMins?: number;
};
type CreateProviderProfileInput = {
    businessName: string;
    contactName?: string;
    phone: string;
    email?: string;
    website?: string;
    serviceAreas?: string[];
};
type SubmitProviderApplicationInput = {
    businessName: string;
    contactName: string;
    phone: string;
    email: string;
    website?: string;
    serviceAreas: string[];
    calComUsername?: string;
    serviceCategorySlugs?: string[];
};
export declare const createProviderProfile: CreateProviderProfile<CreateProviderProfileInput, Provider>;
export declare const submitProviderApplication: SubmitProviderApplication<SubmitProviderApplicationInput, Provider>;
export declare const updateProviderProfile: UpdateProviderProfile<UpdateProviderProfileInput, Provider>;
export declare const markJobCompleted: MarkJobCompleted<{
    appointmentId: string;
}, Appointment>;
type ServiceListing = {
    id: string;
    name: string;
    description: string;
    price: number | null;
    categorySlug: string;
};
type UpdateProviderServicesInput = {
    services: ServiceListing[];
};
export declare const updateProviderServices: UpdateProviderServices<UpdateProviderServicesInput, Provider>;
type UpdateProviderAppointmentInput = {
    appointmentId: string;
    scheduledAt?: string;
    status?: "PROPOSED" | "CONFIRMED" | "RESCHEDULED" | "CANCELLED" | "NO_SHOW";
    providerNotes?: string;
};
export declare const updateProviderAppointment: UpdateProviderAppointment<UpdateProviderAppointmentInput, Appointment>;
export declare const sendProviderMessage: SendProviderMessage<{
    requestId: string;
    body: string;
}, CommunicationLog>;
type MaskedLead = {
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
export declare const getPublicLeadFeed: GetPublicLeadFeed<{
    categorySlug?: string;
    urgency?: string;
    limit?: number;
    offset?: number;
}, MaskedLead[]>;
export declare const claimLead: ClaimLead<{
    requestId: string;
}, {
    request: ServiceRequest;
    alreadyClaimed: boolean;
}>;
type PublicProviderProfile = Provider & {
    categories: (ProviderCategory & {
        serviceCategory: ServiceCategory;
    })[];
    reviews: Review[];
};
export declare const getPublicProvider: GetPublicProvider<{
    slug: string;
}, PublicProviderProfile | null>;
export declare const resubmitProviderApplication: ResubmitProviderApplication<void, Provider>;
type PortfolioItem = {
    url: string;
    caption?: string;
};
export declare const addPortfolioPhoto: AddPortfolioPhoto<{
    s3Key: string;
    caption?: string;
}, PortfolioItem[]>;
export declare const removePortfolioPhoto: RemovePortfolioPhoto<{
    url: string;
}, PortfolioItem[]>;
export declare const setProfilePhoto: SetProfilePhoto<{
    url: string;
}, {
    profilePhotoUrl: string;
}>;
export {};
//# sourceMappingURL=operations.d.ts.map