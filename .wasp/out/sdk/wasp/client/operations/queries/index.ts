import { type QueryFor, createQuery } from './core'
import { GetMyRequests_ext } from 'wasp/server/operations/queries'
import { GetServiceCategories_ext } from 'wasp/server/operations/queries'
import { GetProviders_ext } from 'wasp/server/operations/queries'
import { GetMyRewardAccount_ext } from 'wasp/server/operations/queries'
import { GetProviderById_ext } from 'wasp/server/operations/queries'
import { GetConsumerStats_ext } from 'wasp/server/operations/queries'
import { GetMessagesForRequest_ext } from 'wasp/server/operations/queries'
import { GetReviewsForProvider_ext } from 'wasp/server/operations/queries'
import { GetMyReferral_ext } from 'wasp/server/operations/queries'
import { GetProviderLeads_ext } from 'wasp/server/operations/queries'
import { GetProviderAppointments_ext } from 'wasp/server/operations/queries'
import { GetProviderProfile_ext } from 'wasp/server/operations/queries'
import { GetProviderFees_ext } from 'wasp/server/operations/queries'
import { GetPublicLeadFeed_ext } from 'wasp/server/operations/queries'
import { GetPublicProvider_ext } from 'wasp/server/operations/queries'
import { GetAdminReviews_ext } from 'wasp/server/operations/queries'
import { GetPaginatedUsers_ext } from 'wasp/server/operations/queries'
import { GetAllFilesByUser_ext } from 'wasp/server/operations/queries'
import { GetDownloadFileSignedURL_ext } from 'wasp/server/operations/queries'
import { GetDailyStats_ext } from 'wasp/server/operations/queries'
import { GetAdminRequests_ext } from 'wasp/server/operations/queries'
import { GetAdminProviders_ext } from 'wasp/server/operations/queries'
import { GetAdminRewards_ext } from 'wasp/server/operations/queries'
import { GetAdminLeads_ext } from 'wasp/server/operations/queries'

// PUBLIC API
export const getMyRequests: QueryFor<GetMyRequests_ext> = createQuery<GetMyRequests_ext>(
  'operations/get-my-requests',
  ['ServiceRequest', 'Appointment', 'Provider', 'CommunicationLog', 'ServiceCategory'],
)

// PUBLIC API
export const getServiceCategories: QueryFor<GetServiceCategories_ext> = createQuery<GetServiceCategories_ext>(
  'operations/get-service-categories',
  ['ServiceCategory'],
)

// PUBLIC API
export const getProviders: QueryFor<GetProviders_ext> = createQuery<GetProviders_ext>(
  'operations/get-providers',
  ['Provider', 'ProviderCategory', 'ServiceCategory'],
)

// PUBLIC API
export const getMyRewardAccount: QueryFor<GetMyRewardAccount_ext> = createQuery<GetMyRewardAccount_ext>(
  'operations/get-my-reward-account',
  ['RewardAccount', 'RewardTransaction', 'Redemption'],
)

// PUBLIC API
export const getProviderById: QueryFor<GetProviderById_ext> = createQuery<GetProviderById_ext>(
  'operations/get-provider-by-id',
  ['Provider', 'ProviderCategory', 'ServiceCategory', 'Review'],
)

// PUBLIC API
export const getConsumerStats: QueryFor<GetConsumerStats_ext> = createQuery<GetConsumerStats_ext>(
  'operations/get-consumer-stats',
  ['ServiceRequest', 'RewardAccount', 'RewardTransaction', 'ServiceCategory'],
)

// PUBLIC API
export const getMessagesForRequest: QueryFor<GetMessagesForRequest_ext> = createQuery<GetMessagesForRequest_ext>(
  'operations/get-messages-for-request',
  ['CommunicationLog', 'ServiceRequest', 'Provider'],
)

// PUBLIC API
export const getReviewsForProvider: QueryFor<GetReviewsForProvider_ext> = createQuery<GetReviewsForProvider_ext>(
  'operations/get-reviews-for-provider',
  ['Review'],
)

// PUBLIC API
export const getMyReferral: QueryFor<GetMyReferral_ext> = createQuery<GetMyReferral_ext>(
  'operations/get-my-referral',
  ['Referral'],
)

// PUBLIC API
export const getProviderLeads: QueryFor<GetProviderLeads_ext> = createQuery<GetProviderLeads_ext>(
  'operations/get-provider-leads',
  ['ServiceRequest', 'Provider'],
)

// PUBLIC API
export const getProviderAppointments: QueryFor<GetProviderAppointments_ext> = createQuery<GetProviderAppointments_ext>(
  'operations/get-provider-appointments',
  ['Appointment', 'Provider', 'ServiceRequest', 'CommunicationLog'],
)

// PUBLIC API
export const getProviderProfile: QueryFor<GetProviderProfile_ext> = createQuery<GetProviderProfile_ext>(
  'operations/get-provider-profile',
  ['Provider', 'ProviderCategory', 'ServiceCategory'],
)

// PUBLIC API
export const getProviderFees: QueryFor<GetProviderFees_ext> = createQuery<GetProviderFees_ext>(
  'operations/get-provider-fees',
  ['ProviderFee', 'Provider'],
)

// PUBLIC API
export const getPublicLeadFeed: QueryFor<GetPublicLeadFeed_ext> = createQuery<GetPublicLeadFeed_ext>(
  'operations/get-public-lead-feed',
  ['ServiceRequest', 'Provider', 'ProviderCategory', 'ServiceCategory'],
)

// PUBLIC API
export const getPublicProvider: QueryFor<GetPublicProvider_ext> = createQuery<GetPublicProvider_ext>(
  'operations/get-public-provider',
  ['Provider', 'Review', 'ProviderCategory', 'ServiceCategory'],
)

// PUBLIC API
export const getAdminReviews: QueryFor<GetAdminReviews_ext> = createQuery<GetAdminReviews_ext>(
  'operations/get-admin-reviews',
  ['Review', 'Provider'],
)

// PUBLIC API
export const getPaginatedUsers: QueryFor<GetPaginatedUsers_ext> = createQuery<GetPaginatedUsers_ext>(
  'operations/get-paginated-users',
  ['User'],
)

// PUBLIC API
export const getAllFilesByUser: QueryFor<GetAllFilesByUser_ext> = createQuery<GetAllFilesByUser_ext>(
  'operations/get-all-files-by-user',
  ['User', 'File'],
)

// PUBLIC API
export const getDownloadFileSignedURL: QueryFor<GetDownloadFileSignedURL_ext> = createQuery<GetDownloadFileSignedURL_ext>(
  'operations/get-download-file-signed-url',
  ['User', 'File'],
)

// PUBLIC API
export const getDailyStats: QueryFor<GetDailyStats_ext> = createQuery<GetDailyStats_ext>(
  'operations/get-daily-stats',
  ['User', 'DailyStats'],
)

// PUBLIC API
export const getAdminRequests: QueryFor<GetAdminRequests_ext> = createQuery<GetAdminRequests_ext>(
  'operations/get-admin-requests',
  ['ServiceRequest', 'Provider', 'User'],
)

// PUBLIC API
export const getAdminProviders: QueryFor<GetAdminProviders_ext> = createQuery<GetAdminProviders_ext>(
  'operations/get-admin-providers',
  ['Provider', 'User'],
)

// PUBLIC API
export const getAdminRewards: QueryFor<GetAdminRewards_ext> = createQuery<GetAdminRewards_ext>(
  'operations/get-admin-rewards',
  ['RewardTransaction', 'Redemption', 'ServiceRequest', 'User'],
)

// PUBLIC API
export const getAdminLeads: QueryFor<GetAdminLeads_ext> = createQuery<GetAdminLeads_ext>(
  'operations/get-admin-leads',
  ['Lead'],
)

// PRIVATE API (used in SDK)
export { buildAndRegisterQuery } from './core'
