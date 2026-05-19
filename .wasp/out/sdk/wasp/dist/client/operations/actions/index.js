import { createAction } from './core';
// PUBLIC API
export const completeOnboarding = createAction('operations/complete-onboarding', ['User', 'Provider', 'RewardAccount', 'RewardTransaction', 'ServiceRequest', 'Referral', 'ConsumerInterest', 'ProviderCategory', 'ServiceCategory']);
// PUBLIC API
export const redeemPoints = createAction('operations/redeem-points', ['RewardAccount', 'RewardTransaction', 'Redemption']);
// PUBLIC API
export const submitServiceRequest = createAction('operations/submit-service-request', ['ServiceRequest', 'ServiceCategory', 'RewardTransaction', 'RewardAccount', 'Provider', 'WebhookLog']);
// PUBLIC API
export const submitLead = createAction('operations/submit-lead', ['Lead']);
// PUBLIC API
export const sendCustomerMessage = createAction('operations/send-customer-message', ['ServiceRequest', 'CommunicationLog', 'Provider']);
// PUBLIC API
export const sendOtp = createAction('operations/send-otp', ['OtpVerification']);
// PUBLIC API
export const verifyOtp = createAction('operations/verify-otp', ['OtpVerification']);
// PUBLIC API
export const submitReview = createAction('operations/submit-review', ['Review', 'Provider', 'ServiceRequest']);
// PUBLIC API
export const applyReferralCode = createAction('operations/apply-referral-code', ['Referral']);
// PUBLIC API
export const acceptServiceRequest = createAction('operations/accept-service-request', ['ServiceRequest', 'Appointment', 'ProviderFee', 'Provider', 'RewardTransaction', 'RewardAccount']);
// PUBLIC API
export const markJobCompleted = createAction('operations/mark-job-completed', ['Appointment', 'ServiceRequest', 'RewardTransaction', 'RewardAccount', 'ProviderFee', 'Provider', 'Referral']);
// PUBLIC API
export const submitProviderApplication = createAction('operations/submit-provider-application', ['User', 'Provider', 'ProviderCategory', 'ServiceCategory']);
// PUBLIC API
export const updateProviderServices = createAction('operations/update-provider-services', ['Provider']);
// PUBLIC API
export const createProviderProfile = createAction('operations/create-provider-profile', ['Provider']);
// PUBLIC API
export const updateProviderAppointment = createAction('operations/update-provider-appointment', ['Appointment', 'ServiceRequest', 'Provider']);
// PUBLIC API
export const sendProviderMessage = createAction('operations/send-provider-message', ['ServiceRequest', 'CommunicationLog', 'Provider']);
// PUBLIC API
export const updateProviderProfile = createAction('operations/update-provider-profile', ['Provider']);
// PUBLIC API
export const claimLead = createAction('operations/claim-lead', ['ServiceRequest', 'Provider', 'ProviderFee', 'CommunicationLog']);
// PUBLIC API
export const moderateReview = createAction('operations/moderate-review', ['Review', 'Provider']);
// PUBLIC API
export const updateIsUserAdminById = createAction('operations/update-is-user-admin-by-id', ['User']);
// PUBLIC API
export const updateUserProfile = createAction('operations/update-user-profile', ['User']);
// PUBLIC API
export const generateGptResponse = createAction('operations/generate-gpt-response', ['User', 'Task', 'GptResponse']);
// PUBLIC API
export const createTask = createAction('operations/create-task', ['Task']);
// PUBLIC API
export const deleteTask = createAction('operations/delete-task', ['Task']);
// PUBLIC API
export const updateTask = createAction('operations/update-task', ['Task']);
// PUBLIC API
export const createFileUploadUrl = createAction('operations/create-file-upload-url', ['User', 'File']);
// PUBLIC API
export const addFileToDb = createAction('operations/add-file-to-db', ['User', 'File']);
// PUBLIC API
export const deleteFile = createAction('operations/delete-file', ['User', 'File']);
// PUBLIC API
export const updateLead = createAction('operations/update-lead', ['Lead']);
// PUBLIC API
export const approveProvider = createAction('operations/approve-provider', ['Provider']);
// PUBLIC API
export const rejectProvider = createAction('operations/reject-provider', ['Provider']);
// PUBLIC API
export const assignRequestToProvider = createAction('operations/assign-request-to-provider', ['ServiceRequest', 'Provider', 'CommunicationLog']);
// PUBLIC API
export const approveRewardTransaction = createAction('operations/approve-reward-transaction', ['RewardTransaction', 'RewardAccount', 'ServiceRequest']);
// PUBLIC API
export const rejectRewardTransaction = createAction('operations/reject-reward-transaction', ['RewardTransaction']);
//# sourceMappingURL=index.js.map