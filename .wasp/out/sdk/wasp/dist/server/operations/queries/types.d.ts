import { type _ServiceRequest, type _Appointment, type _Provider, type _CommunicationLog, type _ServiceCategory, type _ProviderCategory, type _RewardAccount, type _RewardTransaction, type _Redemption, type _Review, type _Referral, type _ProviderFee, type _User, type _File, type _DailyStats, type _Lead, type AuthenticatedQueryDefinition, type Payload } from 'wasp/server/_types';
export type GetMyRequests<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _ServiceRequest,
    _Appointment,
    _Provider,
    _CommunicationLog,
    _ServiceCategory
], Input, Output>;
export type GetServiceCategories<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _ServiceCategory
], Input, Output>;
export type GetProviders<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _Provider,
    _ProviderCategory,
    _ServiceCategory
], Input, Output>;
export type GetMyRewardAccount<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _RewardAccount,
    _RewardTransaction,
    _Redemption
], Input, Output>;
export type GetProviderById<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _Provider,
    _ProviderCategory,
    _ServiceCategory,
    _Review
], Input, Output>;
export type GetConsumerStats<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _ServiceRequest,
    _RewardAccount,
    _RewardTransaction,
    _ServiceCategory
], Input, Output>;
export type GetMessagesForRequest<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _CommunicationLog,
    _ServiceRequest,
    _Provider
], Input, Output>;
export type GetReviewsForProvider<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _Review
], Input, Output>;
export type GetMyReferral<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _Referral
], Input, Output>;
export type GetProviderLeads<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _ServiceRequest,
    _Provider
], Input, Output>;
export type GetProviderAppointments<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _Appointment,
    _Provider,
    _ServiceRequest,
    _CommunicationLog
], Input, Output>;
export type GetProviderProfile<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _Provider,
    _ProviderCategory,
    _ServiceCategory
], Input, Output>;
export type GetProviderFees<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _ProviderFee,
    _Provider
], Input, Output>;
export type GetPublicLeadFeed<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _ServiceRequest,
    _Provider,
    _ProviderCategory,
    _ServiceCategory
], Input, Output>;
export type GetPublicProvider<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _Provider,
    _Review,
    _ProviderCategory,
    _ServiceCategory
], Input, Output>;
export type GetAdminReviews<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _Review,
    _Provider
], Input, Output>;
export type GetPaginatedUsers<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _User
], Input, Output>;
export type GetAllFilesByUser<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _User,
    _File
], Input, Output>;
export type GetDownloadFileSignedURL<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _User,
    _File
], Input, Output>;
export type GetDailyStats<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _User,
    _DailyStats
], Input, Output>;
export type GetAdminRequests<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _ServiceRequest,
    _Provider,
    _User
], Input, Output>;
export type GetAdminProviders<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _Provider,
    _User
], Input, Output>;
export type GetAdminRewards<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _RewardTransaction,
    _Redemption,
    _ServiceRequest,
    _User
], Input, Output>;
export type GetAdminLeads<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _Lead
], Input, Output>;
//# sourceMappingURL=types.d.ts.map