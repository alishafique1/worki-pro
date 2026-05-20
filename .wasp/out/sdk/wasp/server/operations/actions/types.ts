import {
  type _User,
  type _Provider,
  type _RewardAccount,
  type _RewardTransaction,
  type _ServiceRequest,
  type _Referral,
  type _ConsumerInterest,
  type _ProviderCategory,
  type _ServiceCategory,
  type _Redemption,
  type _WebhookLog,
  type _Lead,
  type _CommunicationLog,
  type _OtpVerification,
  type _Review,
  type _Appointment,
  type _ProviderFee,
  type _Task,
  type _GptResponse,
  type _File,
  type AuthenticatedActionDefinition,
  type Payload,
} from 'wasp/server/_types'

// PUBLIC API
export type CompleteOnboarding<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _User,
      _Provider,
      _RewardAccount,
      _RewardTransaction,
      _ServiceRequest,
      _Referral,
      _ConsumerInterest,
      _ProviderCategory,
      _ServiceCategory,
    ],
    Input,
    Output
  >

// PUBLIC API
export type RedeemPoints<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _RewardAccount,
      _RewardTransaction,
      _Redemption,
    ],
    Input,
    Output
  >

// PUBLIC API
export type SaveGuestRequest<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _ServiceRequest,
      _User,
      _RewardAccount,
      _RewardTransaction,
      _Referral,
    ],
    Input,
    Output
  >

// PUBLIC API
export type SubmitServiceRequest<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _ServiceRequest,
      _ServiceCategory,
      _RewardTransaction,
      _RewardAccount,
      _Provider,
      _WebhookLog,
    ],
    Input,
    Output
  >

// PUBLIC API
export type SubmitLead<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _Lead,
    ],
    Input,
    Output
  >

// PUBLIC API
export type SendCustomerMessage<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _ServiceRequest,
      _CommunicationLog,
      _Provider,
    ],
    Input,
    Output
  >

// PUBLIC API
export type SendOtp<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _OtpVerification,
    ],
    Input,
    Output
  >

// PUBLIC API
export type VerifyOtp<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _OtpVerification,
    ],
    Input,
    Output
  >

// PUBLIC API
export type SubmitReview<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _Review,
      _Provider,
      _ServiceRequest,
    ],
    Input,
    Output
  >

// PUBLIC API
export type ApplyReferralCode<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _Referral,
    ],
    Input,
    Output
  >

// PUBLIC API
export type AcceptServiceRequest<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _ServiceRequest,
      _Appointment,
      _ProviderFee,
      _Provider,
      _RewardTransaction,
      _RewardAccount,
    ],
    Input,
    Output
  >

// PUBLIC API
export type MarkJobCompleted<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _Appointment,
      _ServiceRequest,
      _RewardTransaction,
      _RewardAccount,
      _ProviderFee,
      _Provider,
      _Referral,
    ],
    Input,
    Output
  >

// PUBLIC API
export type SubmitProviderApplication<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _User,
      _Provider,
      _ProviderCategory,
      _ServiceCategory,
    ],
    Input,
    Output
  >

// PUBLIC API
export type UpdateProviderServices<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _Provider,
    ],
    Input,
    Output
  >

// PUBLIC API
export type CreateProviderProfile<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _Provider,
    ],
    Input,
    Output
  >

// PUBLIC API
export type UpdateProviderAppointment<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _Appointment,
      _ServiceRequest,
      _Provider,
    ],
    Input,
    Output
  >

// PUBLIC API
export type SendProviderMessage<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _ServiceRequest,
      _CommunicationLog,
      _Provider,
    ],
    Input,
    Output
  >

// PUBLIC API
export type UpdateProviderProfile<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _Provider,
    ],
    Input,
    Output
  >

// PUBLIC API
export type ClaimLead<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _ServiceRequest,
      _Provider,
      _ProviderFee,
      _CommunicationLog,
    ],
    Input,
    Output
  >

// PUBLIC API
export type ModerateReview<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _Review,
      _Provider,
    ],
    Input,
    Output
  >

// PUBLIC API
export type UpdateIsUserAdminById<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _User,
    ],
    Input,
    Output
  >

// PUBLIC API
export type UpdateUserProfile<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _User,
    ],
    Input,
    Output
  >

// PUBLIC API
export type GenerateGptResponse<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _User,
      _Task,
      _GptResponse,
    ],
    Input,
    Output
  >

// PUBLIC API
export type CreateTask<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _Task,
    ],
    Input,
    Output
  >

// PUBLIC API
export type DeleteTask<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _Task,
    ],
    Input,
    Output
  >

// PUBLIC API
export type UpdateTask<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _Task,
    ],
    Input,
    Output
  >

// PUBLIC API
export type CreateFileUploadUrl<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _User,
      _File,
    ],
    Input,
    Output
  >

// PUBLIC API
export type AddFileToDb<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _User,
      _File,
    ],
    Input,
    Output
  >

// PUBLIC API
export type DeleteFile<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _User,
      _File,
    ],
    Input,
    Output
  >

// PUBLIC API
export type UpdateLead<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _Lead,
    ],
    Input,
    Output
  >

// PUBLIC API
export type ApproveProvider<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _Provider,
    ],
    Input,
    Output
  >

// PUBLIC API
export type RejectProvider<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _Provider,
    ],
    Input,
    Output
  >

// PUBLIC API
export type AssignRequestToProvider<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _ServiceRequest,
      _Provider,
      _CommunicationLog,
    ],
    Input,
    Output
  >

// PUBLIC API
export type ApproveRewardTransaction<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _RewardTransaction,
      _RewardAccount,
      _ServiceRequest,
    ],
    Input,
    Output
  >

// PUBLIC API
export type RejectRewardTransaction<Input extends Payload = never, Output extends Payload = Payload> = 
  AuthenticatedActionDefinition<
    [
      _RewardTransaction,
    ],
    Input,
    Output
  >

