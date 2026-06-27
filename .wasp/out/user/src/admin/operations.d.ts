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
export declare const getAdminCategories: (_args: void, context: any) => Promise<any>;
type UpsertCategoryInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    imageUrl?: string;
    active?: boolean;
};
export declare const upsertAdminCategory: (args: UpsertCategoryInput, context: any) => Promise<any>;
export declare const deleteAdminCategory: ({ id }: {
    id: string;
}, context: any) => Promise<any>;
export declare const getAdminReviews: GetAdminReviews<void, Review[]>;
export declare const moderateReview: ModerateReview<{
    reviewId: string;
    status: string;
}, Review>;
export {};
