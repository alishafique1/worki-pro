import { prisma } from 'wasp/server';
import { createAuthenticatedOperation, } from '../wrappers.js';
import { getMyRequests as getMyRequests_ext } from 'wasp/src/consumer/operations';
import { getServiceCategories as getServiceCategories_ext } from 'wasp/src/consumer/operations';
import { getProviders as getProviders_ext } from 'wasp/src/consumer/operations';
import { getMyRewardAccount as getMyRewardAccount_ext } from 'wasp/src/consumer/operations';
import { getProviderById as getProviderById_ext } from 'wasp/src/consumer/operations';
import { getConsumerStats as getConsumerStats_ext } from 'wasp/src/consumer/operations';
import { getMessagesForRequest as getMessagesForRequest_ext } from 'wasp/src/consumer/operations';
import { getReviewsForProvider as getReviewsForProvider_ext } from 'wasp/src/consumer/operations';
import { getMyReferral as getMyReferral_ext } from 'wasp/src/consumer/operations';
import { getProviderLeads as getProviderLeads_ext } from 'wasp/src/provider/operations';
import { getProviderAppointments as getProviderAppointments_ext } from 'wasp/src/provider/operations';
import { getProviderProfile as getProviderProfile_ext } from 'wasp/src/provider/operations';
import { getProviderFees as getProviderFees_ext } from 'wasp/src/provider/operations';
import { getPublicLeadFeed as getPublicLeadFeed_ext } from 'wasp/src/provider/operations';
import { getPublicProvider as getPublicProvider_ext } from 'wasp/src/provider/operations';
import { getAdminReviews as getAdminReviews_ext } from 'wasp/src/admin/operations';
import { getPaginatedUsers as getPaginatedUsers_ext } from 'wasp/src/user/operations';
import { getAllFilesByUser as getAllFilesByUser_ext } from 'wasp/src/file-upload/operations';
import { getDownloadFileSignedURL as getDownloadFileSignedURL_ext } from 'wasp/src/file-upload/operations';
import { getDailyStats as getDailyStats_ext } from 'wasp/src/analytics/operations';
import { getAdminRequests as getAdminRequests_ext } from 'wasp/src/admin/operations';
import { getAdminProviders as getAdminProviders_ext } from 'wasp/src/admin/operations';
import { getAdminRewards as getAdminRewards_ext } from 'wasp/src/admin/operations';
import { getAdminLeads as getAdminLeads_ext } from 'wasp/src/admin/operations';
// PUBLIC API
export const getMyRequests = createAuthenticatedOperation(getMyRequests_ext, {
    ServiceRequest: prisma.serviceRequest,
    Appointment: prisma.appointment,
    Provider: prisma.provider,
    CommunicationLog: prisma.communicationLog,
    ServiceCategory: prisma.serviceCategory,
});
// PUBLIC API
export const getServiceCategories = createAuthenticatedOperation(getServiceCategories_ext, {
    ServiceCategory: prisma.serviceCategory,
});
// PUBLIC API
export const getProviders = createAuthenticatedOperation(getProviders_ext, {
    Provider: prisma.provider,
    ProviderCategory: prisma.providerCategory,
    ServiceCategory: prisma.serviceCategory,
});
// PUBLIC API
export const getMyRewardAccount = createAuthenticatedOperation(getMyRewardAccount_ext, {
    RewardAccount: prisma.rewardAccount,
    RewardTransaction: prisma.rewardTransaction,
    Redemption: prisma.redemption,
});
// PUBLIC API
export const getProviderById = createAuthenticatedOperation(getProviderById_ext, {
    Provider: prisma.provider,
    ProviderCategory: prisma.providerCategory,
    ServiceCategory: prisma.serviceCategory,
    Review: prisma.review,
});
// PUBLIC API
export const getConsumerStats = createAuthenticatedOperation(getConsumerStats_ext, {
    ServiceRequest: prisma.serviceRequest,
    RewardAccount: prisma.rewardAccount,
    RewardTransaction: prisma.rewardTransaction,
    ServiceCategory: prisma.serviceCategory,
});
// PUBLIC API
export const getMessagesForRequest = createAuthenticatedOperation(getMessagesForRequest_ext, {
    CommunicationLog: prisma.communicationLog,
    ServiceRequest: prisma.serviceRequest,
    Provider: prisma.provider,
});
// PUBLIC API
export const getReviewsForProvider = createAuthenticatedOperation(getReviewsForProvider_ext, {
    Review: prisma.review,
});
// PUBLIC API
export const getMyReferral = createAuthenticatedOperation(getMyReferral_ext, {
    Referral: prisma.referral,
});
// PUBLIC API
export const getProviderLeads = createAuthenticatedOperation(getProviderLeads_ext, {
    ServiceRequest: prisma.serviceRequest,
    Provider: prisma.provider,
});
// PUBLIC API
export const getProviderAppointments = createAuthenticatedOperation(getProviderAppointments_ext, {
    Appointment: prisma.appointment,
    Provider: prisma.provider,
    ServiceRequest: prisma.serviceRequest,
    CommunicationLog: prisma.communicationLog,
});
// PUBLIC API
export const getProviderProfile = createAuthenticatedOperation(getProviderProfile_ext, {
    Provider: prisma.provider,
    ProviderCategory: prisma.providerCategory,
    ServiceCategory: prisma.serviceCategory,
});
// PUBLIC API
export const getProviderFees = createAuthenticatedOperation(getProviderFees_ext, {
    ProviderFee: prisma.providerFee,
    Provider: prisma.provider,
});
// PUBLIC API
export const getPublicLeadFeed = createAuthenticatedOperation(getPublicLeadFeed_ext, {
    ServiceRequest: prisma.serviceRequest,
    Provider: prisma.provider,
    ProviderCategory: prisma.providerCategory,
    ServiceCategory: prisma.serviceCategory,
});
// PUBLIC API
export const getPublicProvider = createAuthenticatedOperation(getPublicProvider_ext, {
    Provider: prisma.provider,
    Review: prisma.review,
    ProviderCategory: prisma.providerCategory,
    ServiceCategory: prisma.serviceCategory,
});
// PUBLIC API
export const getAdminReviews = createAuthenticatedOperation(getAdminReviews_ext, {
    Review: prisma.review,
    Provider: prisma.provider,
});
// PUBLIC API
export const getPaginatedUsers = createAuthenticatedOperation(getPaginatedUsers_ext, {
    User: prisma.user,
});
// PUBLIC API
export const getAllFilesByUser = createAuthenticatedOperation(getAllFilesByUser_ext, {
    User: prisma.user,
    File: prisma.file,
});
// PUBLIC API
export const getDownloadFileSignedURL = createAuthenticatedOperation(getDownloadFileSignedURL_ext, {
    User: prisma.user,
    File: prisma.file,
});
// PUBLIC API
export const getDailyStats = createAuthenticatedOperation(getDailyStats_ext, {
    User: prisma.user,
    DailyStats: prisma.dailyStats,
});
// PUBLIC API
export const getAdminRequests = createAuthenticatedOperation(getAdminRequests_ext, {
    ServiceRequest: prisma.serviceRequest,
    Provider: prisma.provider,
    User: prisma.user,
});
// PUBLIC API
export const getAdminProviders = createAuthenticatedOperation(getAdminProviders_ext, {
    Provider: prisma.provider,
    User: prisma.user,
});
// PUBLIC API
export const getAdminRewards = createAuthenticatedOperation(getAdminRewards_ext, {
    RewardTransaction: prisma.rewardTransaction,
    Redemption: prisma.redemption,
    ServiceRequest: prisma.serviceRequest,
    User: prisma.user,
});
// PUBLIC API
export const getAdminLeads = createAuthenticatedOperation(getAdminLeads_ext, {
    Lead: prisma.lead,
});
//# sourceMappingURL=index.js.map