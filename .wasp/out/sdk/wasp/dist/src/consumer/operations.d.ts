import type { ServiceRequest, RewardAccount, RewardTransaction, Redemption, CommunicationLog, ServiceCategory, Provider, ProviderCategory, Lead, Review, Referral } from "wasp/entities";
import type { GetMyRequests, GetMyRewardAccount, SubmitServiceRequest, RedeemPoints, SendCustomerMessage, GetServiceCategories, GetProviders, GetProviderById, GetConsumerStats, SubmitLead, SendOtp, VerifyOtp, SubmitReview, GetReviewsForProvider, GetMessagesForRequest, GetMyReferral, ApplyReferralCode, SaveGuestRequest } from "wasp/server/operations";
export declare const getServiceCategories: GetServiceCategories<void, ServiceCategory[]>;
export declare const getMyRequests: GetMyRequests<void, any[]>;
export declare const getMyRewardAccount: GetMyRewardAccount<void, {
    account: RewardAccount | null;
    transactions: RewardTransaction[];
    redemptions: Redemption[];
}>;
export declare const redeemPoints: RedeemPoints<{
    points: number;
    giftCardEmail: string;
}, Redemption>;
export declare const POINTS: {
    readonly SERVICE_REQUEST: 500;
    readonly APPOINTMENT_BOOKED: 500;
    readonly JOB_COMPLETED: 5000;
    readonly REFERRAL: 500;
};
export declare const submitServiceRequest: SubmitServiceRequest<{
    name: string;
    email?: string;
    phone?: string;
    postalCode: string;
    description: string;
    urgency: "EMERGENCY" | "STANDARD" | "PLANNED";
    serviceType?: string;
    preferredProviderId?: string;
    estimatedSchedule?: string;
    preferredTime?: string;
    smsConsentGiven?: boolean;
    smsConsentFormVersion?: string;
}, ServiceRequest>;
type ProviderWithCategories = {
    id: string;
    businessName: string;
    contactName: string | null;
    ratingInternal: number | null;
    verificationStatus: string;
    serviceAreas: string[];
    servicesJson: string | null;
    bio: string | null;
    profilePhotoUrl: string | null;
    categories: (ProviderCategory & {
        serviceCategory: ServiceCategory;
    })[];
    completedJobsCount: number;
    reviewCount: number;
};
export declare const getProviders: GetProviders<{
    categorySlug?: string;
    search?: string;
    areaSlug?: string;
}, ProviderWithCategories[]>;
export declare const sendCustomerMessage: SendCustomerMessage<{
    requestId: string;
    body: string;
}, CommunicationLog>;
type ProviderDetail = Provider & {
    categories: (ProviderCategory & {
        serviceCategory: ServiceCategory;
    })[];
    services: {
        id: string;
        name: string;
        description: string;
        price: number | null;
        categorySlug: string;
    }[];
    reviews: Review[];
};
export declare const getProviderById: GetProviderById<{
    providerId: string;
}, ProviderDetail | null>;
type ConsumerStats = {
    totalRequests: number;
    completedRequests: number;
    pendingRequests: number;
    totalPointsEarned: number;
    totalPointsRedeemed: number;
    currentBalance: number;
    lifetimePoints: number;
    requestsByStatus: Record<string, number>;
    requestsByCategory: Record<string, number>;
    monthlyPoints: {
        month: string;
        earned: number;
        redeemed: number;
    }[];
};
export declare const getConsumerStats: GetConsumerStats<void, ConsumerStats>;
export declare const submitLead: SubmitLead<{
    name: string;
    email: string;
    phone?: string;
    postalCode?: string;
    serviceType?: string;
    message?: string;
    source?: string;
}, Lead>;
export declare const sendOtp: SendOtp<{
    phone: string;
}, {
    sent: boolean;
}>;
export declare const verifyOtp: VerifyOtp<{
    phone: string;
    code: string;
}, {
    verified: boolean;
}>;
export declare const submitReview: SubmitReview<{
    providerId: string;
    serviceRequestId?: string;
    rating: number;
    title?: string;
    body: string;
}, Review>;
export declare const getReviewsForProvider: GetReviewsForProvider<{
    providerId: string;
}, Review[]>;
export declare const getMessagesForRequest: GetMessagesForRequest<{
    requestId: string;
}, {
    messages: CommunicationLog[];
    request: {
        id: string;
        name: string;
        status: string;
        assignedProvider: {
            businessName: string;
            id: string;
            slug: string | null;
        } | null;
    } | null;
}>;
export declare const getMyReferral: GetMyReferral<void, Referral>;
export declare const applyReferralCode: ApplyReferralCode<{
    code: string;
}, {
    success: boolean;
    message: string;
}>;
type SaveGuestRequestInput = {
    firstName: string;
    phone: string;
    postalCode: string;
    smsConsent: boolean;
    serviceCategoryId?: string;
    description: string;
    qualifierAnswers?: Record<string, string | string[]>;
    referralCode?: string;
};
export declare const saveGuestRequest: SaveGuestRequest<SaveGuestRequestInput, {
    requestId: string;
}>;
export {};
//# sourceMappingURL=operations.d.ts.map