
import { prisma } from 'wasp/server'
import {
  type UnauthenticatedOperationFor,
  createUnauthenticatedOperation,
  type AuthenticatedOperationFor,
  createAuthenticatedOperation,
} from '../wrappers.js'
import { completeOnboarding as completeOnboarding_ext } from 'wasp/src/auth/onboardingOperations'
import { redeemPoints as redeemPoints_ext } from 'wasp/src/consumer/operations'
import { saveGuestRequest as saveGuestRequest_ext } from 'wasp/src/consumer/operations'
import { submitServiceRequest as submitServiceRequest_ext } from 'wasp/src/consumer/operations'
import { submitLead as submitLead_ext } from 'wasp/src/consumer/operations'
import { sendCustomerMessage as sendCustomerMessage_ext } from 'wasp/src/consumer/operations'
import { sendOtp as sendOtp_ext } from 'wasp/src/consumer/operations'
import { verifyOtp as verifyOtp_ext } from 'wasp/src/consumer/operations'
import { submitReview as submitReview_ext } from 'wasp/src/consumer/operations'
import { applyReferralCode as applyReferralCode_ext } from 'wasp/src/consumer/operations'
import { acceptServiceRequest as acceptServiceRequest_ext } from 'wasp/src/provider/operations'
import { markJobCompleted as markJobCompleted_ext } from 'wasp/src/provider/operations'
import { submitProviderApplication as submitProviderApplication_ext } from 'wasp/src/provider/operations'
import { updateProviderServices as updateProviderServices_ext } from 'wasp/src/provider/operations'
import { createProviderProfile as createProviderProfile_ext } from 'wasp/src/provider/operations'
import { updateProviderAppointment as updateProviderAppointment_ext } from 'wasp/src/provider/operations'
import { sendProviderMessage as sendProviderMessage_ext } from 'wasp/src/provider/operations'
import { updateProviderProfile as updateProviderProfile_ext } from 'wasp/src/provider/operations'
import { claimLead as claimLead_ext } from 'wasp/src/provider/operations'
import { moderateReview as moderateReview_ext } from 'wasp/src/admin/operations'
import { updateIsUserAdminById as updateIsUserAdminById_ext } from 'wasp/src/user/operations'
import { updateUserProfile as updateUserProfile_ext } from 'wasp/src/user/operations'
import { generateGptResponse as generateGptResponse_ext } from 'wasp/src/demo-ai-app/operations'
import { createTask as createTask_ext } from 'wasp/src/demo-ai-app/operations'
import { deleteTask as deleteTask_ext } from 'wasp/src/demo-ai-app/operations'
import { updateTask as updateTask_ext } from 'wasp/src/demo-ai-app/operations'
import { createFileUploadUrl as createFileUploadUrl_ext } from 'wasp/src/file-upload/operations'
import { addFileToDb as addFileToDb_ext } from 'wasp/src/file-upload/operations'
import { deleteFile as deleteFile_ext } from 'wasp/src/file-upload/operations'
import { updateLead as updateLead_ext } from 'wasp/src/admin/operations'
import { approveProvider as approveProvider_ext } from 'wasp/src/admin/operations'
import { rejectProvider as rejectProvider_ext } from 'wasp/src/admin/operations'
import { assignRequestToProvider as assignRequestToProvider_ext } from 'wasp/src/admin/operations'
import { approveRewardTransaction as approveRewardTransaction_ext } from 'wasp/src/admin/operations'
import { rejectRewardTransaction as rejectRewardTransaction_ext } from 'wasp/src/admin/operations'

// PRIVATE API
export type CompleteOnboarding_ext = typeof completeOnboarding_ext

// PUBLIC API
export const completeOnboarding: AuthenticatedOperationFor<CompleteOnboarding_ext> =
  createAuthenticatedOperation(
    completeOnboarding_ext,
    {
      User: prisma.user,
      Provider: prisma.provider,
      RewardAccount: prisma.rewardAccount,
      RewardTransaction: prisma.rewardTransaction,
      ServiceRequest: prisma.serviceRequest,
      Referral: prisma.referral,
      ConsumerInterest: prisma.consumerInterest,
      ProviderCategory: prisma.providerCategory,
      ServiceCategory: prisma.serviceCategory,
    },
  )

// PRIVATE API
export type RedeemPoints_ext = typeof redeemPoints_ext

// PUBLIC API
export const redeemPoints: AuthenticatedOperationFor<RedeemPoints_ext> =
  createAuthenticatedOperation(
    redeemPoints_ext,
    {
      RewardAccount: prisma.rewardAccount,
      RewardTransaction: prisma.rewardTransaction,
      Redemption: prisma.redemption,
    },
  )

// PRIVATE API
export type SaveGuestRequest_ext = typeof saveGuestRequest_ext

// PUBLIC API
export const saveGuestRequest: AuthenticatedOperationFor<SaveGuestRequest_ext> =
  createAuthenticatedOperation(
    saveGuestRequest_ext,
    {
      ServiceRequest: prisma.serviceRequest,
      User: prisma.user,
      RewardAccount: prisma.rewardAccount,
      RewardTransaction: prisma.rewardTransaction,
      Referral: prisma.referral,
    },
  )

// PRIVATE API
export type SubmitServiceRequest_ext = typeof submitServiceRequest_ext

// PUBLIC API
export const submitServiceRequest: AuthenticatedOperationFor<SubmitServiceRequest_ext> =
  createAuthenticatedOperation(
    submitServiceRequest_ext,
    {
      ServiceRequest: prisma.serviceRequest,
      ServiceCategory: prisma.serviceCategory,
      RewardTransaction: prisma.rewardTransaction,
      RewardAccount: prisma.rewardAccount,
      Provider: prisma.provider,
      WebhookLog: prisma.webhookLog,
    },
  )

// PRIVATE API
export type SubmitLead_ext = typeof submitLead_ext

// PUBLIC API
export const submitLead: AuthenticatedOperationFor<SubmitLead_ext> =
  createAuthenticatedOperation(
    submitLead_ext,
    {
      Lead: prisma.lead,
    },
  )

// PRIVATE API
export type SendCustomerMessage_ext = typeof sendCustomerMessage_ext

// PUBLIC API
export const sendCustomerMessage: AuthenticatedOperationFor<SendCustomerMessage_ext> =
  createAuthenticatedOperation(
    sendCustomerMessage_ext,
    {
      ServiceRequest: prisma.serviceRequest,
      CommunicationLog: prisma.communicationLog,
      Provider: prisma.provider,
    },
  )

// PRIVATE API
export type SendOtp_ext = typeof sendOtp_ext

// PUBLIC API
export const sendOtp: AuthenticatedOperationFor<SendOtp_ext> =
  createAuthenticatedOperation(
    sendOtp_ext,
    {
      OtpVerification: prisma.otpVerification,
    },
  )

// PRIVATE API
export type VerifyOtp_ext = typeof verifyOtp_ext

// PUBLIC API
export const verifyOtp: AuthenticatedOperationFor<VerifyOtp_ext> =
  createAuthenticatedOperation(
    verifyOtp_ext,
    {
      OtpVerification: prisma.otpVerification,
    },
  )

// PRIVATE API
export type SubmitReview_ext = typeof submitReview_ext

// PUBLIC API
export const submitReview: AuthenticatedOperationFor<SubmitReview_ext> =
  createAuthenticatedOperation(
    submitReview_ext,
    {
      Review: prisma.review,
      Provider: prisma.provider,
      ServiceRequest: prisma.serviceRequest,
    },
  )

// PRIVATE API
export type ApplyReferralCode_ext = typeof applyReferralCode_ext

// PUBLIC API
export const applyReferralCode: AuthenticatedOperationFor<ApplyReferralCode_ext> =
  createAuthenticatedOperation(
    applyReferralCode_ext,
    {
      Referral: prisma.referral,
    },
  )

// PRIVATE API
export type AcceptServiceRequest_ext = typeof acceptServiceRequest_ext

// PUBLIC API
export const acceptServiceRequest: AuthenticatedOperationFor<AcceptServiceRequest_ext> =
  createAuthenticatedOperation(
    acceptServiceRequest_ext,
    {
      ServiceRequest: prisma.serviceRequest,
      Appointment: prisma.appointment,
      ProviderFee: prisma.providerFee,
      Provider: prisma.provider,
      RewardTransaction: prisma.rewardTransaction,
      RewardAccount: prisma.rewardAccount,
    },
  )

// PRIVATE API
export type MarkJobCompleted_ext = typeof markJobCompleted_ext

// PUBLIC API
export const markJobCompleted: AuthenticatedOperationFor<MarkJobCompleted_ext> =
  createAuthenticatedOperation(
    markJobCompleted_ext,
    {
      Appointment: prisma.appointment,
      ServiceRequest: prisma.serviceRequest,
      RewardTransaction: prisma.rewardTransaction,
      RewardAccount: prisma.rewardAccount,
      ProviderFee: prisma.providerFee,
      Provider: prisma.provider,
      Referral: prisma.referral,
    },
  )

// PRIVATE API
export type SubmitProviderApplication_ext = typeof submitProviderApplication_ext

// PUBLIC API
export const submitProviderApplication: AuthenticatedOperationFor<SubmitProviderApplication_ext> =
  createAuthenticatedOperation(
    submitProviderApplication_ext,
    {
      User: prisma.user,
      Provider: prisma.provider,
      ProviderCategory: prisma.providerCategory,
      ServiceCategory: prisma.serviceCategory,
    },
  )

// PRIVATE API
export type UpdateProviderServices_ext = typeof updateProviderServices_ext

// PUBLIC API
export const updateProviderServices: AuthenticatedOperationFor<UpdateProviderServices_ext> =
  createAuthenticatedOperation(
    updateProviderServices_ext,
    {
      Provider: prisma.provider,
    },
  )

// PRIVATE API
export type CreateProviderProfile_ext = typeof createProviderProfile_ext

// PUBLIC API
export const createProviderProfile: AuthenticatedOperationFor<CreateProviderProfile_ext> =
  createAuthenticatedOperation(
    createProviderProfile_ext,
    {
      Provider: prisma.provider,
    },
  )

// PRIVATE API
export type UpdateProviderAppointment_ext = typeof updateProviderAppointment_ext

// PUBLIC API
export const updateProviderAppointment: AuthenticatedOperationFor<UpdateProviderAppointment_ext> =
  createAuthenticatedOperation(
    updateProviderAppointment_ext,
    {
      Appointment: prisma.appointment,
      ServiceRequest: prisma.serviceRequest,
      Provider: prisma.provider,
    },
  )

// PRIVATE API
export type SendProviderMessage_ext = typeof sendProviderMessage_ext

// PUBLIC API
export const sendProviderMessage: AuthenticatedOperationFor<SendProviderMessage_ext> =
  createAuthenticatedOperation(
    sendProviderMessage_ext,
    {
      ServiceRequest: prisma.serviceRequest,
      CommunicationLog: prisma.communicationLog,
      Provider: prisma.provider,
    },
  )

// PRIVATE API
export type UpdateProviderProfile_ext = typeof updateProviderProfile_ext

// PUBLIC API
export const updateProviderProfile: AuthenticatedOperationFor<UpdateProviderProfile_ext> =
  createAuthenticatedOperation(
    updateProviderProfile_ext,
    {
      Provider: prisma.provider,
    },
  )

// PRIVATE API
export type ClaimLead_ext = typeof claimLead_ext

// PUBLIC API
export const claimLead: AuthenticatedOperationFor<ClaimLead_ext> =
  createAuthenticatedOperation(
    claimLead_ext,
    {
      ServiceRequest: prisma.serviceRequest,
      Provider: prisma.provider,
      ProviderFee: prisma.providerFee,
      CommunicationLog: prisma.communicationLog,
    },
  )

// PRIVATE API
export type ModerateReview_ext = typeof moderateReview_ext

// PUBLIC API
export const moderateReview: AuthenticatedOperationFor<ModerateReview_ext> =
  createAuthenticatedOperation(
    moderateReview_ext,
    {
      Review: prisma.review,
      Provider: prisma.provider,
    },
  )

// PRIVATE API
export type UpdateIsUserAdminById_ext = typeof updateIsUserAdminById_ext

// PUBLIC API
export const updateIsUserAdminById: AuthenticatedOperationFor<UpdateIsUserAdminById_ext> =
  createAuthenticatedOperation(
    updateIsUserAdminById_ext,
    {
      User: prisma.user,
    },
  )

// PRIVATE API
export type UpdateUserProfile_ext = typeof updateUserProfile_ext

// PUBLIC API
export const updateUserProfile: AuthenticatedOperationFor<UpdateUserProfile_ext> =
  createAuthenticatedOperation(
    updateUserProfile_ext,
    {
      User: prisma.user,
    },
  )

// PRIVATE API
export type GenerateGptResponse_ext = typeof generateGptResponse_ext

// PUBLIC API
export const generateGptResponse: AuthenticatedOperationFor<GenerateGptResponse_ext> =
  createAuthenticatedOperation(
    generateGptResponse_ext,
    {
      User: prisma.user,
      Task: prisma.task,
      GptResponse: prisma.gptResponse,
    },
  )

// PRIVATE API
export type CreateTask_ext = typeof createTask_ext

// PUBLIC API
export const createTask: AuthenticatedOperationFor<CreateTask_ext> =
  createAuthenticatedOperation(
    createTask_ext,
    {
      Task: prisma.task,
    },
  )

// PRIVATE API
export type DeleteTask_ext = typeof deleteTask_ext

// PUBLIC API
export const deleteTask: AuthenticatedOperationFor<DeleteTask_ext> =
  createAuthenticatedOperation(
    deleteTask_ext,
    {
      Task: prisma.task,
    },
  )

// PRIVATE API
export type UpdateTask_ext = typeof updateTask_ext

// PUBLIC API
export const updateTask: AuthenticatedOperationFor<UpdateTask_ext> =
  createAuthenticatedOperation(
    updateTask_ext,
    {
      Task: prisma.task,
    },
  )

// PRIVATE API
export type CreateFileUploadUrl_ext = typeof createFileUploadUrl_ext

// PUBLIC API
export const createFileUploadUrl: AuthenticatedOperationFor<CreateFileUploadUrl_ext> =
  createAuthenticatedOperation(
    createFileUploadUrl_ext,
    {
      User: prisma.user,
      File: prisma.file,
    },
  )

// PRIVATE API
export type AddFileToDb_ext = typeof addFileToDb_ext

// PUBLIC API
export const addFileToDb: AuthenticatedOperationFor<AddFileToDb_ext> =
  createAuthenticatedOperation(
    addFileToDb_ext,
    {
      User: prisma.user,
      File: prisma.file,
    },
  )

// PRIVATE API
export type DeleteFile_ext = typeof deleteFile_ext

// PUBLIC API
export const deleteFile: AuthenticatedOperationFor<DeleteFile_ext> =
  createAuthenticatedOperation(
    deleteFile_ext,
    {
      User: prisma.user,
      File: prisma.file,
    },
  )

// PRIVATE API
export type UpdateLead_ext = typeof updateLead_ext

// PUBLIC API
export const updateLead: AuthenticatedOperationFor<UpdateLead_ext> =
  createAuthenticatedOperation(
    updateLead_ext,
    {
      Lead: prisma.lead,
    },
  )

// PRIVATE API
export type ApproveProvider_ext = typeof approveProvider_ext

// PUBLIC API
export const approveProvider: AuthenticatedOperationFor<ApproveProvider_ext> =
  createAuthenticatedOperation(
    approveProvider_ext,
    {
      Provider: prisma.provider,
    },
  )

// PRIVATE API
export type RejectProvider_ext = typeof rejectProvider_ext

// PUBLIC API
export const rejectProvider: AuthenticatedOperationFor<RejectProvider_ext> =
  createAuthenticatedOperation(
    rejectProvider_ext,
    {
      Provider: prisma.provider,
    },
  )

// PRIVATE API
export type AssignRequestToProvider_ext = typeof assignRequestToProvider_ext

// PUBLIC API
export const assignRequestToProvider: AuthenticatedOperationFor<AssignRequestToProvider_ext> =
  createAuthenticatedOperation(
    assignRequestToProvider_ext,
    {
      ServiceRequest: prisma.serviceRequest,
      Provider: prisma.provider,
      CommunicationLog: prisma.communicationLog,
    },
  )

// PRIVATE API
export type ApproveRewardTransaction_ext = typeof approveRewardTransaction_ext

// PUBLIC API
export const approveRewardTransaction: AuthenticatedOperationFor<ApproveRewardTransaction_ext> =
  createAuthenticatedOperation(
    approveRewardTransaction_ext,
    {
      RewardTransaction: prisma.rewardTransaction,
      RewardAccount: prisma.rewardAccount,
      ServiceRequest: prisma.serviceRequest,
    },
  )

// PRIVATE API
export type RejectRewardTransaction_ext = typeof rejectRewardTransaction_ext

// PUBLIC API
export const rejectRewardTransaction: AuthenticatedOperationFor<RejectRewardTransaction_ext> =
  createAuthenticatedOperation(
    rejectRewardTransaction_ext,
    {
      RewardTransaction: prisma.rewardTransaction,
    },
  )
