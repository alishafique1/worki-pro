import { prisma } from 'wasp/server';
import { createAuthenticatedOperation, } from '../wrappers.js';
import { completeOnboarding as completeOnboarding_ext } from 'wasp/src/auth/onboardingOperations';
import { redeemPoints as redeemPoints_ext } from 'wasp/src/consumer/operations';
import { submitServiceRequest as submitServiceRequest_ext } from 'wasp/src/consumer/operations';
import { submitLead as submitLead_ext } from 'wasp/src/consumer/operations';
import { sendCustomerMessage as sendCustomerMessage_ext } from 'wasp/src/consumer/operations';
import { sendOtp as sendOtp_ext } from 'wasp/src/consumer/operations';
import { verifyOtp as verifyOtp_ext } from 'wasp/src/consumer/operations';
import { submitReview as submitReview_ext } from 'wasp/src/consumer/operations';
import { applyReferralCode as applyReferralCode_ext } from 'wasp/src/consumer/operations';
import { acceptServiceRequest as acceptServiceRequest_ext } from 'wasp/src/provider/operations';
import { markJobCompleted as markJobCompleted_ext } from 'wasp/src/provider/operations';
import { submitProviderApplication as submitProviderApplication_ext } from 'wasp/src/provider/operations';
import { updateProviderServices as updateProviderServices_ext } from 'wasp/src/provider/operations';
import { createProviderProfile as createProviderProfile_ext } from 'wasp/src/provider/operations';
import { updateProviderAppointment as updateProviderAppointment_ext } from 'wasp/src/provider/operations';
import { sendProviderMessage as sendProviderMessage_ext } from 'wasp/src/provider/operations';
import { updateProviderProfile as updateProviderProfile_ext } from 'wasp/src/provider/operations';
import { claimLead as claimLead_ext } from 'wasp/src/provider/operations';
import { moderateReview as moderateReview_ext } from 'wasp/src/admin/operations';
import { updateIsUserAdminById as updateIsUserAdminById_ext } from 'wasp/src/user/operations';
import { updateUserProfile as updateUserProfile_ext } from 'wasp/src/user/operations';
import { generateGptResponse as generateGptResponse_ext } from 'wasp/src/demo-ai-app/operations';
import { createTask as createTask_ext } from 'wasp/src/demo-ai-app/operations';
import { deleteTask as deleteTask_ext } from 'wasp/src/demo-ai-app/operations';
import { updateTask as updateTask_ext } from 'wasp/src/demo-ai-app/operations';
import { createFileUploadUrl as createFileUploadUrl_ext } from 'wasp/src/file-upload/operations';
import { addFileToDb as addFileToDb_ext } from 'wasp/src/file-upload/operations';
import { deleteFile as deleteFile_ext } from 'wasp/src/file-upload/operations';
import { updateLead as updateLead_ext } from 'wasp/src/admin/operations';
import { approveProvider as approveProvider_ext } from 'wasp/src/admin/operations';
import { rejectProvider as rejectProvider_ext } from 'wasp/src/admin/operations';
import { assignRequestToProvider as assignRequestToProvider_ext } from 'wasp/src/admin/operations';
import { approveRewardTransaction as approveRewardTransaction_ext } from 'wasp/src/admin/operations';
import { rejectRewardTransaction as rejectRewardTransaction_ext } from 'wasp/src/admin/operations';
// PUBLIC API
export const completeOnboarding = createAuthenticatedOperation(completeOnboarding_ext, {
    User: prisma.user,
    Provider: prisma.provider,
    RewardAccount: prisma.rewardAccount,
    RewardTransaction: prisma.rewardTransaction,
    ServiceRequest: prisma.serviceRequest,
    Referral: prisma.referral,
});
// PUBLIC API
export const redeemPoints = createAuthenticatedOperation(redeemPoints_ext, {
    RewardAccount: prisma.rewardAccount,
    RewardTransaction: prisma.rewardTransaction,
    Redemption: prisma.redemption,
});
// PUBLIC API
export const submitServiceRequest = createAuthenticatedOperation(submitServiceRequest_ext, {
    ServiceRequest: prisma.serviceRequest,
    ServiceCategory: prisma.serviceCategory,
    RewardTransaction: prisma.rewardTransaction,
    RewardAccount: prisma.rewardAccount,
    Provider: prisma.provider,
    WebhookLog: prisma.webhookLog,
});
// PUBLIC API
export const submitLead = createAuthenticatedOperation(submitLead_ext, {
    Lead: prisma.lead,
});
// PUBLIC API
export const sendCustomerMessage = createAuthenticatedOperation(sendCustomerMessage_ext, {
    ServiceRequest: prisma.serviceRequest,
    CommunicationLog: prisma.communicationLog,
    Provider: prisma.provider,
});
// PUBLIC API
export const sendOtp = createAuthenticatedOperation(sendOtp_ext, {
    OtpVerification: prisma.otpVerification,
});
// PUBLIC API
export const verifyOtp = createAuthenticatedOperation(verifyOtp_ext, {
    OtpVerification: prisma.otpVerification,
});
// PUBLIC API
export const submitReview = createAuthenticatedOperation(submitReview_ext, {
    Review: prisma.review,
    Provider: prisma.provider,
    ServiceRequest: prisma.serviceRequest,
});
// PUBLIC API
export const applyReferralCode = createAuthenticatedOperation(applyReferralCode_ext, {
    Referral: prisma.referral,
});
// PUBLIC API
export const acceptServiceRequest = createAuthenticatedOperation(acceptServiceRequest_ext, {
    ServiceRequest: prisma.serviceRequest,
    Appointment: prisma.appointment,
    ProviderFee: prisma.providerFee,
    Provider: prisma.provider,
    RewardTransaction: prisma.rewardTransaction,
    RewardAccount: prisma.rewardAccount,
});
// PUBLIC API
export const markJobCompleted = createAuthenticatedOperation(markJobCompleted_ext, {
    Appointment: prisma.appointment,
    ServiceRequest: prisma.serviceRequest,
    RewardTransaction: prisma.rewardTransaction,
    RewardAccount: prisma.rewardAccount,
    ProviderFee: prisma.providerFee,
    Provider: prisma.provider,
    Referral: prisma.referral,
});
// PUBLIC API
export const submitProviderApplication = createAuthenticatedOperation(submitProviderApplication_ext, {
    User: prisma.user,
    Provider: prisma.provider,
    ProviderCategory: prisma.providerCategory,
    ServiceCategory: prisma.serviceCategory,
});
// PUBLIC API
export const updateProviderServices = createAuthenticatedOperation(updateProviderServices_ext, {
    Provider: prisma.provider,
});
// PUBLIC API
export const createProviderProfile = createAuthenticatedOperation(createProviderProfile_ext, {
    Provider: prisma.provider,
});
// PUBLIC API
export const updateProviderAppointment = createAuthenticatedOperation(updateProviderAppointment_ext, {
    Appointment: prisma.appointment,
    ServiceRequest: prisma.serviceRequest,
    Provider: prisma.provider,
});
// PUBLIC API
export const sendProviderMessage = createAuthenticatedOperation(sendProviderMessage_ext, {
    ServiceRequest: prisma.serviceRequest,
    CommunicationLog: prisma.communicationLog,
    Provider: prisma.provider,
});
// PUBLIC API
export const updateProviderProfile = createAuthenticatedOperation(updateProviderProfile_ext, {
    Provider: prisma.provider,
});
// PUBLIC API
export const claimLead = createAuthenticatedOperation(claimLead_ext, {
    ServiceRequest: prisma.serviceRequest,
    Provider: prisma.provider,
    ProviderFee: prisma.providerFee,
    CommunicationLog: prisma.communicationLog,
});
// PUBLIC API
export const moderateReview = createAuthenticatedOperation(moderateReview_ext, {
    Review: prisma.review,
});
// PUBLIC API
export const updateIsUserAdminById = createAuthenticatedOperation(updateIsUserAdminById_ext, {
    User: prisma.user,
});
// PUBLIC API
export const updateUserProfile = createAuthenticatedOperation(updateUserProfile_ext, {
    User: prisma.user,
});
// PUBLIC API
export const generateGptResponse = createAuthenticatedOperation(generateGptResponse_ext, {
    User: prisma.user,
    Task: prisma.task,
    GptResponse: prisma.gptResponse,
});
// PUBLIC API
export const createTask = createAuthenticatedOperation(createTask_ext, {
    Task: prisma.task,
});
// PUBLIC API
export const deleteTask = createAuthenticatedOperation(deleteTask_ext, {
    Task: prisma.task,
});
// PUBLIC API
export const updateTask = createAuthenticatedOperation(updateTask_ext, {
    Task: prisma.task,
});
// PUBLIC API
export const createFileUploadUrl = createAuthenticatedOperation(createFileUploadUrl_ext, {
    User: prisma.user,
    File: prisma.file,
});
// PUBLIC API
export const addFileToDb = createAuthenticatedOperation(addFileToDb_ext, {
    User: prisma.user,
    File: prisma.file,
});
// PUBLIC API
export const deleteFile = createAuthenticatedOperation(deleteFile_ext, {
    User: prisma.user,
    File: prisma.file,
});
// PUBLIC API
export const updateLead = createAuthenticatedOperation(updateLead_ext, {
    Lead: prisma.lead,
});
// PUBLIC API
export const approveProvider = createAuthenticatedOperation(approveProvider_ext, {
    Provider: prisma.provider,
});
// PUBLIC API
export const rejectProvider = createAuthenticatedOperation(rejectProvider_ext, {
    Provider: prisma.provider,
});
// PUBLIC API
export const assignRequestToProvider = createAuthenticatedOperation(assignRequestToProvider_ext, {
    ServiceRequest: prisma.serviceRequest,
    Provider: prisma.provider,
    CommunicationLog: prisma.communicationLog,
});
// PUBLIC API
export const approveRewardTransaction = createAuthenticatedOperation(approveRewardTransaction_ext, {
    RewardTransaction: prisma.rewardTransaction,
    RewardAccount: prisma.rewardAccount,
    ServiceRequest: prisma.serviceRequest,
});
// PUBLIC API
export const rejectRewardTransaction = createAuthenticatedOperation(rejectRewardTransaction_ext, {
    RewardTransaction: prisma.rewardTransaction,
});
//# sourceMappingURL=index.js.map