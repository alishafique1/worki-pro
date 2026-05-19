import type { ServiceRequest, Provider, RewardTransaction, Lead, Review } from 'wasp/entities';
import type { GetAdminRequests, GetAdminProviders, GetAdminRewards, ApproveProvider, AssignRequestToProvider, ApproveRewardTransaction, RejectRewardTransaction, RejectProvider, GetAdminLeads, UpdateLead, GetAdminReviews, ModerateReview } from 'wasp/server/operations';
export declare const getAdminRequests: GetAdminRequests<void, ServiceRequest[]>;
export declare const getAdminProviders: GetAdminProviders<void, Provider[]>;
export declare const getAdminRewards: GetAdminRewards<void, RewardTransaction[]>;
export declare const approveProvider: ApproveProvider<{
    providerId: string;
}, Provider>;
type RejectProviderInput = {
    providerId: string;
    reason?: string;
};
export declare const rejectProvider: RejectProvider<RejectProviderInput, Provider>;
export declare const assignRequestToProvider: AssignRequestToProvider<{
    requestId: string;
    providerId: string;
}, ServiceRequest>;
export declare const approveRewardTransaction: ApproveRewardTransaction<{
    transactionId: string;
}, RewardTransaction>;
export declare const rejectRewardTransaction: RejectRewardTransaction<{
    transactionId: string;
}, RewardTransaction>;
export declare const getAdminLeads: GetAdminLeads<void, Lead[]>;
type UpdateLeadInput = {
    leadId: string;
    status?: string;
    assignedTo?: string;
    notes?: string;
};
export declare const updateLead: UpdateLead<UpdateLeadInput, Lead>;
export declare const getAdminReviews: GetAdminReviews<void, Review[]>;
export declare const moderateReview: ModerateReview<{
    reviewId: string;
    status: string;
}, Review>;
export {};
//# sourceMappingURL=operations.d.ts.map