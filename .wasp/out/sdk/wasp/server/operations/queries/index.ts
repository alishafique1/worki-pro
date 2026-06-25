
import { prisma } from 'wasp/server'
import {
  type UnauthenticatedOperationFor,
  createUnauthenticatedOperation,
  type AuthenticatedOperationFor,
  createAuthenticatedOperation,
} from '../wrappers.js'
import { getProviderSlugById as getProviderSlugById_ext } from 'wasp/src/consumer/operations'
import { getMyRequests as getMyRequests_ext } from 'wasp/src/consumer/operations'
import { getServiceCategories as getServiceCategories_ext } from 'wasp/src/consumer/operations'
import { getProviders as getProviders_ext } from 'wasp/src/consumer/operations'
import { getMyRewardAccount as getMyRewardAccount_ext } from 'wasp/src/consumer/operations'
import { getProviderById as getProviderById_ext } from 'wasp/src/consumer/operations'
import { getConsumerStats as getConsumerStats_ext } from 'wasp/src/consumer/operations'
import { getMessagesForRequest as getMessagesForRequest_ext } from 'wasp/src/consumer/operations'
import { getReviewsForProvider as getReviewsForProvider_ext } from 'wasp/src/consumer/operations'
import { getMyReferral as getMyReferral_ext } from 'wasp/src/consumer/operations'
import { getProviderLeads as getProviderLeads_ext } from 'wasp/src/provider/operations'
import { getProviderAppointments as getProviderAppointments_ext } from 'wasp/src/provider/operations'
import { getProviderProfile as getProviderProfile_ext } from 'wasp/src/provider/operations'
import { getProviderFees as getProviderFees_ext } from 'wasp/src/provider/operations'
import { getPublicLeadFeed as getPublicLeadFeed_ext } from 'wasp/src/provider/operations'
import { getPublicProvider as getPublicProvider_ext } from 'wasp/src/provider/operations'
import { getAdminReviews as getAdminReviews_ext } from 'wasp/src/admin/operations'
import { getAdminCategories as getAdminCategories_ext } from 'wasp/src/admin/operations'
import { getPaginatedUsers as getPaginatedUsers_ext } from 'wasp/src/user/operations'
import { getAllFilesByUser as getAllFilesByUser_ext } from 'wasp/src/file-upload/operations'
import { getDownloadFileSignedURL as getDownloadFileSignedURL_ext } from 'wasp/src/file-upload/operations'
import { getDailyStats as getDailyStats_ext } from 'wasp/src/analytics/operations'
import { getAdminRequests as getAdminRequests_ext } from 'wasp/src/admin/operations'
import { getAdminProviders as getAdminProviders_ext } from 'wasp/src/admin/operations'
import { getAdminRewards as getAdminRewards_ext } from 'wasp/src/admin/operations'
import { getAdminLeads as getAdminLeads_ext } from 'wasp/src/admin/operations'

// PRIVATE API
export type GetProviderSlugById_ext = typeof getProviderSlugById_ext

// PUBLIC API
export const getProviderSlugById: AuthenticatedOperationFor<GetProviderSlugById_ext> =
  createAuthenticatedOperation(
    getProviderSlugById_ext,
    {
      Provider: prisma.provider,
    },
  )


// PRIVATE API
export type GetMyRequests_ext = typeof getMyRequests_ext

// PUBLIC API
export const getMyRequests: AuthenticatedOperationFor<GetMyRequests_ext> =
  createAuthenticatedOperation(
    getMyRequests_ext,
    {
      ServiceRequest: prisma.serviceRequest,
      Appointment: prisma.appointment,
      Provider: prisma.provider,
      CommunicationLog: prisma.communicationLog,
      ServiceCategory: prisma.serviceCategory,
    },
  )


// PRIVATE API
export type GetServiceCategories_ext = typeof getServiceCategories_ext

// PUBLIC API
export const getServiceCategories: AuthenticatedOperationFor<GetServiceCategories_ext> =
  createAuthenticatedOperation(
    getServiceCategories_ext,
    {
      ServiceCategory: prisma.serviceCategory,
    },
  )


// PRIVATE API
export type GetProviders_ext = typeof getProviders_ext

// PUBLIC API
export const getProviders: AuthenticatedOperationFor<GetProviders_ext> =
  createAuthenticatedOperation(
    getProviders_ext,
    {
      Provider: prisma.provider,
      ProviderCategory: prisma.providerCategory,
      ServiceCategory: prisma.serviceCategory,
    },
  )


// PRIVATE API
export type GetMyRewardAccount_ext = typeof getMyRewardAccount_ext

// PUBLIC API
export const getMyRewardAccount: AuthenticatedOperationFor<GetMyRewardAccount_ext> =
  createAuthenticatedOperation(
    getMyRewardAccount_ext,
    {
      RewardAccount: prisma.rewardAccount,
      RewardTransaction: prisma.rewardTransaction,
      Redemption: prisma.redemption,
    },
  )


// PRIVATE API
export type GetProviderById_ext = typeof getProviderById_ext

// PUBLIC API
export const getProviderById: AuthenticatedOperationFor<GetProviderById_ext> =
  createAuthenticatedOperation(
    getProviderById_ext,
    {
      Provider: prisma.provider,
      ProviderCategory: prisma.providerCategory,
      ServiceCategory: prisma.serviceCategory,
      Review: prisma.review,
    },
  )


// PRIVATE API
export type GetConsumerStats_ext = typeof getConsumerStats_ext

// PUBLIC API
export const getConsumerStats: AuthenticatedOperationFor<GetConsumerStats_ext> =
  createAuthenticatedOperation(
    getConsumerStats_ext,
    {
      ServiceRequest: prisma.serviceRequest,
      RewardAccount: prisma.rewardAccount,
      RewardTransaction: prisma.rewardTransaction,
      ServiceCategory: prisma.serviceCategory,
    },
  )


// PRIVATE API
export type GetMessagesForRequest_ext = typeof getMessagesForRequest_ext

// PUBLIC API
export const getMessagesForRequest: AuthenticatedOperationFor<GetMessagesForRequest_ext> =
  createAuthenticatedOperation(
    getMessagesForRequest_ext,
    {
      CommunicationLog: prisma.communicationLog,
      ServiceRequest: prisma.serviceRequest,
      Provider: prisma.provider,
    },
  )


// PRIVATE API
export type GetReviewsForProvider_ext = typeof getReviewsForProvider_ext

// PUBLIC API
export const getReviewsForProvider: AuthenticatedOperationFor<GetReviewsForProvider_ext> =
  createAuthenticatedOperation(
    getReviewsForProvider_ext,
    {
      Review: prisma.review,
    },
  )


// PRIVATE API
export type GetMyReferral_ext = typeof getMyReferral_ext

// PUBLIC API
export const getMyReferral: AuthenticatedOperationFor<GetMyReferral_ext> =
  createAuthenticatedOperation(
    getMyReferral_ext,
    {
      Referral: prisma.referral,
    },
  )


// PRIVATE API
export type GetProviderLeads_ext = typeof getProviderLeads_ext

// PUBLIC API
export const getProviderLeads: AuthenticatedOperationFor<GetProviderLeads_ext> =
  createAuthenticatedOperation(
    getProviderLeads_ext,
    {
      ServiceRequest: prisma.serviceRequest,
      Provider: prisma.provider,
    },
  )


// PRIVATE API
export type GetProviderAppointments_ext = typeof getProviderAppointments_ext

// PUBLIC API
export const getProviderAppointments: AuthenticatedOperationFor<GetProviderAppointments_ext> =
  createAuthenticatedOperation(
    getProviderAppointments_ext,
    {
      Appointment: prisma.appointment,
      Provider: prisma.provider,
      ServiceRequest: prisma.serviceRequest,
      CommunicationLog: prisma.communicationLog,
    },
  )


// PRIVATE API
export type GetProviderProfile_ext = typeof getProviderProfile_ext

// PUBLIC API
export const getProviderProfile: AuthenticatedOperationFor<GetProviderProfile_ext> =
  createAuthenticatedOperation(
    getProviderProfile_ext,
    {
      Provider: prisma.provider,
      ProviderCategory: prisma.providerCategory,
      ServiceCategory: prisma.serviceCategory,
    },
  )


// PRIVATE API
export type GetProviderFees_ext = typeof getProviderFees_ext

// PUBLIC API
export const getProviderFees: AuthenticatedOperationFor<GetProviderFees_ext> =
  createAuthenticatedOperation(
    getProviderFees_ext,
    {
      ProviderFee: prisma.providerFee,
      Provider: prisma.provider,
    },
  )


// PRIVATE API
export type GetPublicLeadFeed_ext = typeof getPublicLeadFeed_ext

// PUBLIC API
export const getPublicLeadFeed: AuthenticatedOperationFor<GetPublicLeadFeed_ext> =
  createAuthenticatedOperation(
    getPublicLeadFeed_ext,
    {
      ServiceRequest: prisma.serviceRequest,
      Provider: prisma.provider,
      ProviderCategory: prisma.providerCategory,
      ServiceCategory: prisma.serviceCategory,
    },
  )


// PRIVATE API
export type GetPublicProvider_ext = typeof getPublicProvider_ext

// PUBLIC API
export const getPublicProvider: AuthenticatedOperationFor<GetPublicProvider_ext> =
  createAuthenticatedOperation(
    getPublicProvider_ext,
    {
      Provider: prisma.provider,
      Review: prisma.review,
      ProviderCategory: prisma.providerCategory,
      ServiceCategory: prisma.serviceCategory,
    },
  )


// PRIVATE API
export type GetAdminReviews_ext = typeof getAdminReviews_ext

// PUBLIC API
export const getAdminReviews: AuthenticatedOperationFor<GetAdminReviews_ext> =
  createAuthenticatedOperation(
    getAdminReviews_ext,
    {
      Review: prisma.review,
      Provider: prisma.provider,
    },
  )


// PRIVATE API
export type GetAdminCategories_ext = typeof getAdminCategories_ext

// PUBLIC API
export const getAdminCategories: AuthenticatedOperationFor<GetAdminCategories_ext> =
  createAuthenticatedOperation(
    getAdminCategories_ext,
    {
      ServiceCategory: prisma.serviceCategory,
    },
  )


// PRIVATE API
export type GetPaginatedUsers_ext = typeof getPaginatedUsers_ext

// PUBLIC API
export const getPaginatedUsers: AuthenticatedOperationFor<GetPaginatedUsers_ext> =
  createAuthenticatedOperation(
    getPaginatedUsers_ext,
    {
      User: prisma.user,
    },
  )


// PRIVATE API
export type GetAllFilesByUser_ext = typeof getAllFilesByUser_ext

// PUBLIC API
export const getAllFilesByUser: AuthenticatedOperationFor<GetAllFilesByUser_ext> =
  createAuthenticatedOperation(
    getAllFilesByUser_ext,
    {
      User: prisma.user,
      File: prisma.file,
    },
  )


// PRIVATE API
export type GetDownloadFileSignedURL_ext = typeof getDownloadFileSignedURL_ext

// PUBLIC API
export const getDownloadFileSignedURL: AuthenticatedOperationFor<GetDownloadFileSignedURL_ext> =
  createAuthenticatedOperation(
    getDownloadFileSignedURL_ext,
    {
      User: prisma.user,
      File: prisma.file,
    },
  )


// PRIVATE API
export type GetDailyStats_ext = typeof getDailyStats_ext

// PUBLIC API
export const getDailyStats: AuthenticatedOperationFor<GetDailyStats_ext> =
  createAuthenticatedOperation(
    getDailyStats_ext,
    {
      User: prisma.user,
      DailyStats: prisma.dailyStats,
    },
  )


// PRIVATE API
export type GetAdminRequests_ext = typeof getAdminRequests_ext

// PUBLIC API
export const getAdminRequests: AuthenticatedOperationFor<GetAdminRequests_ext> =
  createAuthenticatedOperation(
    getAdminRequests_ext,
    {
      ServiceRequest: prisma.serviceRequest,
      Provider: prisma.provider,
      User: prisma.user,
    },
  )


// PRIVATE API
export type GetAdminProviders_ext = typeof getAdminProviders_ext

// PUBLIC API
export const getAdminProviders: AuthenticatedOperationFor<GetAdminProviders_ext> =
  createAuthenticatedOperation(
    getAdminProviders_ext,
    {
      Provider: prisma.provider,
      User: prisma.user,
    },
  )


// PRIVATE API
export type GetAdminRewards_ext = typeof getAdminRewards_ext

// PUBLIC API
export const getAdminRewards: AuthenticatedOperationFor<GetAdminRewards_ext> =
  createAuthenticatedOperation(
    getAdminRewards_ext,
    {
      RewardTransaction: prisma.rewardTransaction,
      Redemption: prisma.redemption,
      ServiceRequest: prisma.serviceRequest,
      User: prisma.user,
    },
  )


// PRIVATE API
export type GetAdminLeads_ext = typeof getAdminLeads_ext

// PUBLIC API
export const getAdminLeads: AuthenticatedOperationFor<GetAdminLeads_ext> =
  createAuthenticatedOperation(
    getAdminLeads_ext,
    {
      Lead: prisma.lead,
    },
  )

