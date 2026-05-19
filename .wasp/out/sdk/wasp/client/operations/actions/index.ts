import { type ActionFor, createAction } from './core'
import { CompleteOnboarding_ext } from 'wasp/server/operations/actions'
import { RedeemPoints_ext } from 'wasp/server/operations/actions'
import { SubmitServiceRequest_ext } from 'wasp/server/operations/actions'
import { SubmitLead_ext } from 'wasp/server/operations/actions'
import { SendCustomerMessage_ext } from 'wasp/server/operations/actions'
import { SendOtp_ext } from 'wasp/server/operations/actions'
import { VerifyOtp_ext } from 'wasp/server/operations/actions'
import { SubmitReview_ext } from 'wasp/server/operations/actions'
import { ApplyReferralCode_ext } from 'wasp/server/operations/actions'
import { AcceptServiceRequest_ext } from 'wasp/server/operations/actions'
import { MarkJobCompleted_ext } from 'wasp/server/operations/actions'
import { SubmitProviderApplication_ext } from 'wasp/server/operations/actions'
import { UpdateProviderServices_ext } from 'wasp/server/operations/actions'
import { CreateProviderProfile_ext } from 'wasp/server/operations/actions'
import { UpdateProviderAppointment_ext } from 'wasp/server/operations/actions'
import { SendProviderMessage_ext } from 'wasp/server/operations/actions'
import { UpdateProviderProfile_ext } from 'wasp/server/operations/actions'
import { ClaimLead_ext } from 'wasp/server/operations/actions'
import { ModerateReview_ext } from 'wasp/server/operations/actions'
import { UpdateIsUserAdminById_ext } from 'wasp/server/operations/actions'
import { UpdateUserProfile_ext } from 'wasp/server/operations/actions'
import { GenerateGptResponse_ext } from 'wasp/server/operations/actions'
import { CreateTask_ext } from 'wasp/server/operations/actions'
import { DeleteTask_ext } from 'wasp/server/operations/actions'
import { UpdateTask_ext } from 'wasp/server/operations/actions'
import { CreateFileUploadUrl_ext } from 'wasp/server/operations/actions'
import { AddFileToDb_ext } from 'wasp/server/operations/actions'
import { DeleteFile_ext } from 'wasp/server/operations/actions'
import { UpdateLead_ext } from 'wasp/server/operations/actions'
import { ApproveProvider_ext } from 'wasp/server/operations/actions'
import { RejectProvider_ext } from 'wasp/server/operations/actions'
import { AssignRequestToProvider_ext } from 'wasp/server/operations/actions'
import { ApproveRewardTransaction_ext } from 'wasp/server/operations/actions'
import { RejectRewardTransaction_ext } from 'wasp/server/operations/actions'

// PUBLIC API
export const completeOnboarding: ActionFor<CompleteOnboarding_ext> = createAction<CompleteOnboarding_ext>(
  'operations/complete-onboarding',
  ['User', 'Provider', 'RewardAccount', 'RewardTransaction', 'ServiceRequest', 'Referral'],
)

// PUBLIC API
export const redeemPoints: ActionFor<RedeemPoints_ext> = createAction<RedeemPoints_ext>(
  'operations/redeem-points',
  ['RewardAccount', 'RewardTransaction', 'Redemption'],
)

// PUBLIC API
export const submitServiceRequest: ActionFor<SubmitServiceRequest_ext> = createAction<SubmitServiceRequest_ext>(
  'operations/submit-service-request',
  ['ServiceRequest', 'ServiceCategory', 'RewardTransaction', 'RewardAccount', 'Provider', 'WebhookLog'],
)

// PUBLIC API
export const submitLead: ActionFor<SubmitLead_ext> = createAction<SubmitLead_ext>(
  'operations/submit-lead',
  ['Lead'],
)

// PUBLIC API
export const sendCustomerMessage: ActionFor<SendCustomerMessage_ext> = createAction<SendCustomerMessage_ext>(
  'operations/send-customer-message',
  ['ServiceRequest', 'CommunicationLog', 'Provider'],
)

// PUBLIC API
export const sendOtp: ActionFor<SendOtp_ext> = createAction<SendOtp_ext>(
  'operations/send-otp',
  ['OtpVerification'],
)

// PUBLIC API
export const verifyOtp: ActionFor<VerifyOtp_ext> = createAction<VerifyOtp_ext>(
  'operations/verify-otp',
  ['OtpVerification'],
)

// PUBLIC API
export const submitReview: ActionFor<SubmitReview_ext> = createAction<SubmitReview_ext>(
  'operations/submit-review',
  ['Review', 'Provider', 'ServiceRequest'],
)

// PUBLIC API
export const applyReferralCode: ActionFor<ApplyReferralCode_ext> = createAction<ApplyReferralCode_ext>(
  'operations/apply-referral-code',
  ['Referral'],
)

// PUBLIC API
export const acceptServiceRequest: ActionFor<AcceptServiceRequest_ext> = createAction<AcceptServiceRequest_ext>(
  'operations/accept-service-request',
  ['ServiceRequest', 'Appointment', 'ProviderFee', 'Provider', 'RewardTransaction', 'RewardAccount'],
)

// PUBLIC API
export const markJobCompleted: ActionFor<MarkJobCompleted_ext> = createAction<MarkJobCompleted_ext>(
  'operations/mark-job-completed',
  ['Appointment', 'ServiceRequest', 'RewardTransaction', 'RewardAccount', 'ProviderFee', 'Provider', 'Referral'],
)

// PUBLIC API
export const submitProviderApplication: ActionFor<SubmitProviderApplication_ext> = createAction<SubmitProviderApplication_ext>(
  'operations/submit-provider-application',
  ['User', 'Provider', 'ProviderCategory', 'ServiceCategory'],
)

// PUBLIC API
export const updateProviderServices: ActionFor<UpdateProviderServices_ext> = createAction<UpdateProviderServices_ext>(
  'operations/update-provider-services',
  ['Provider'],
)

// PUBLIC API
export const createProviderProfile: ActionFor<CreateProviderProfile_ext> = createAction<CreateProviderProfile_ext>(
  'operations/create-provider-profile',
  ['Provider'],
)

// PUBLIC API
export const updateProviderAppointment: ActionFor<UpdateProviderAppointment_ext> = createAction<UpdateProviderAppointment_ext>(
  'operations/update-provider-appointment',
  ['Appointment', 'ServiceRequest', 'Provider'],
)

// PUBLIC API
export const sendProviderMessage: ActionFor<SendProviderMessage_ext> = createAction<SendProviderMessage_ext>(
  'operations/send-provider-message',
  ['ServiceRequest', 'CommunicationLog', 'Provider'],
)

// PUBLIC API
export const updateProviderProfile: ActionFor<UpdateProviderProfile_ext> = createAction<UpdateProviderProfile_ext>(
  'operations/update-provider-profile',
  ['Provider'],
)

// PUBLIC API
export const claimLead: ActionFor<ClaimLead_ext> = createAction<ClaimLead_ext>(
  'operations/claim-lead',
  ['ServiceRequest', 'Provider', 'ProviderFee', 'CommunicationLog'],
)

// PUBLIC API
export const moderateReview: ActionFor<ModerateReview_ext> = createAction<ModerateReview_ext>(
  'operations/moderate-review',
  ['Review', 'Provider'],
)

// PUBLIC API
export const updateIsUserAdminById: ActionFor<UpdateIsUserAdminById_ext> = createAction<UpdateIsUserAdminById_ext>(
  'operations/update-is-user-admin-by-id',
  ['User'],
)

// PUBLIC API
export const updateUserProfile: ActionFor<UpdateUserProfile_ext> = createAction<UpdateUserProfile_ext>(
  'operations/update-user-profile',
  ['User'],
)

// PUBLIC API
export const generateGptResponse: ActionFor<GenerateGptResponse_ext> = createAction<GenerateGptResponse_ext>(
  'operations/generate-gpt-response',
  ['User', 'Task', 'GptResponse'],
)

// PUBLIC API
export const createTask: ActionFor<CreateTask_ext> = createAction<CreateTask_ext>(
  'operations/create-task',
  ['Task'],
)

// PUBLIC API
export const deleteTask: ActionFor<DeleteTask_ext> = createAction<DeleteTask_ext>(
  'operations/delete-task',
  ['Task'],
)

// PUBLIC API
export const updateTask: ActionFor<UpdateTask_ext> = createAction<UpdateTask_ext>(
  'operations/update-task',
  ['Task'],
)

// PUBLIC API
export const createFileUploadUrl: ActionFor<CreateFileUploadUrl_ext> = createAction<CreateFileUploadUrl_ext>(
  'operations/create-file-upload-url',
  ['User', 'File'],
)

// PUBLIC API
export const addFileToDb: ActionFor<AddFileToDb_ext> = createAction<AddFileToDb_ext>(
  'operations/add-file-to-db',
  ['User', 'File'],
)

// PUBLIC API
export const deleteFile: ActionFor<DeleteFile_ext> = createAction<DeleteFile_ext>(
  'operations/delete-file',
  ['User', 'File'],
)

// PUBLIC API
export const updateLead: ActionFor<UpdateLead_ext> = createAction<UpdateLead_ext>(
  'operations/update-lead',
  ['Lead'],
)

// PUBLIC API
export const approveProvider: ActionFor<ApproveProvider_ext> = createAction<ApproveProvider_ext>(
  'operations/approve-provider',
  ['Provider'],
)

// PUBLIC API
export const rejectProvider: ActionFor<RejectProvider_ext> = createAction<RejectProvider_ext>(
  'operations/reject-provider',
  ['Provider'],
)

// PUBLIC API
export const assignRequestToProvider: ActionFor<AssignRequestToProvider_ext> = createAction<AssignRequestToProvider_ext>(
  'operations/assign-request-to-provider',
  ['ServiceRequest', 'Provider', 'CommunicationLog'],
)

// PUBLIC API
export const approveRewardTransaction: ActionFor<ApproveRewardTransaction_ext> = createAction<ApproveRewardTransaction_ext>(
  'operations/approve-reward-transaction',
  ['RewardTransaction', 'RewardAccount', 'ServiceRequest'],
)

// PUBLIC API
export const rejectRewardTransaction: ActionFor<RejectRewardTransaction_ext> = createAction<RejectRewardTransaction_ext>(
  'operations/reject-reward-transaction',
  ['RewardTransaction'],
)
