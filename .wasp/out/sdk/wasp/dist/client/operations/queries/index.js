import { createQuery } from './core';
// PUBLIC API
export const getProviderSlugById = createQuery('operations/get-provider-slug-by-id', ['Provider']);
// PUBLIC API
export const getMyRequests = createQuery('operations/get-my-requests', ['ServiceRequest', 'Appointment', 'Provider', 'CommunicationLog', 'ServiceCategory']);
// PUBLIC API
export const getServiceCategories = createQuery('operations/get-service-categories', ['ServiceCategory']);
// PUBLIC API
export const getProviders = createQuery('operations/get-providers', ['Provider', 'ProviderCategory', 'ServiceCategory']);
// PUBLIC API
export const getMyRewardAccount = createQuery('operations/get-my-reward-account', ['RewardAccount', 'RewardTransaction', 'Redemption']);
// PUBLIC API
export const getProviderById = createQuery('operations/get-provider-by-id', ['Provider', 'ProviderCategory', 'ServiceCategory', 'Review']);
// PUBLIC API
export const getConsumerStats = createQuery('operations/get-consumer-stats', ['ServiceRequest', 'RewardAccount', 'RewardTransaction', 'ServiceCategory']);
// PUBLIC API
export const getMessagesForRequest = createQuery('operations/get-messages-for-request', ['CommunicationLog', 'ServiceRequest', 'Provider']);
// PUBLIC API
export const getReviewsForProvider = createQuery('operations/get-reviews-for-provider', ['Review']);
// PUBLIC API
export const getMyReferral = createQuery('operations/get-my-referral', ['Referral']);
// PUBLIC API
export const getProviderLeads = createQuery('operations/get-provider-leads', ['ServiceRequest', 'Provider']);
// PUBLIC API
export const getProviderAppointments = createQuery('operations/get-provider-appointments', ['Appointment', 'Provider', 'ServiceRequest', 'CommunicationLog']);
// PUBLIC API
export const getProviderProfile = createQuery('operations/get-provider-profile', ['Provider', 'ProviderCategory', 'ServiceCategory']);
// PUBLIC API
export const getProviderFees = createQuery('operations/get-provider-fees', ['ProviderFee', 'Provider']);
// PUBLIC API
export const getPublicLeadFeed = createQuery('operations/get-public-lead-feed', ['ServiceRequest', 'Provider', 'ProviderCategory', 'ServiceCategory']);
// PUBLIC API
export const getPublicProvider = createQuery('operations/get-public-provider', ['Provider', 'Review', 'ProviderCategory', 'ServiceCategory']);
// PUBLIC API
export const getAdminReviews = createQuery('operations/get-admin-reviews', ['Review', 'Provider']);
// PUBLIC API
export const getAdminCategories = createQuery('operations/get-admin-categories', ['ServiceCategory']);
// PUBLIC API
export const getPaginatedUsers = createQuery('operations/get-paginated-users', ['User']);
// PUBLIC API
export const getAllFilesByUser = createQuery('operations/get-all-files-by-user', ['User', 'File']);
// PUBLIC API
export const getDownloadFileSignedURL = createQuery('operations/get-download-file-signed-url', ['User', 'File']);
// PUBLIC API
export const getDailyStats = createQuery('operations/get-daily-stats', ['User', 'DailyStats']);
// PUBLIC API
export const getAdminRequests = createQuery('operations/get-admin-requests', ['ServiceRequest', 'Provider', 'User']);
// PUBLIC API
export const getAdminProviders = createQuery('operations/get-admin-providers', ['Provider', 'User']);
// PUBLIC API
export const getAdminRewards = createQuery('operations/get-admin-rewards', ['RewardTransaction', 'Redemption', 'ServiceRequest', 'User']);
// PUBLIC API
export const getAdminLeads = createQuery('operations/get-admin-leads', ['Lead']);
// PRIVATE API (used in SDK)
export { buildAndRegisterQuery } from './core';
//# sourceMappingURL=index.js.map