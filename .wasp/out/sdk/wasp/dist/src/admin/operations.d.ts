import type { ServiceRequest, Provider, RewardTransaction } from 'wasp/entities';
import type { GetAdminRequests, GetAdminProviders, GetAdminRewards, ApproveProvider, AssignRequestToProvider, ApproveRewardTransaction, RejectRewardTransaction, RejectProvider } from 'wasp/server/operations';
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
export declare const getAdminLeads: any;
export declare const updateLead: any;
export declare const getAdminReviews: any;
export declare const moderateReview: any;
export {};
//# sourceMappingURL=operations.d.ts.map