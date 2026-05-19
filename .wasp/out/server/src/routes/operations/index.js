import express from 'express'

import auth from 'wasp/core/auth'

import completeOnboarding from './completeOnboarding.js'
import redeemPoints from './redeemPoints.js'
import submitServiceRequest from './submitServiceRequest.js'
import submitLead from './submitLead.js'
import sendCustomerMessage from './sendCustomerMessage.js'
import sendOtp from './sendOtp.js'
import verifyOtp from './verifyOtp.js'
import submitReview from './submitReview.js'
import applyReferralCode from './applyReferralCode.js'
import acceptServiceRequest from './acceptServiceRequest.js'
import markJobCompleted from './markJobCompleted.js'
import submitProviderApplication from './submitProviderApplication.js'
import updateProviderServices from './updateProviderServices.js'
import createProviderProfile from './createProviderProfile.js'
import updateProviderAppointment from './updateProviderAppointment.js'
import sendProviderMessage from './sendProviderMessage.js'
import updateProviderProfile from './updateProviderProfile.js'
import claimLead from './claimLead.js'
import moderateReview from './moderateReview.js'
import updateIsUserAdminById from './updateIsUserAdminById.js'
import updateUserProfile from './updateUserProfile.js'
import generateGptResponse from './generateGptResponse.js'
import createTask from './createTask.js'
import deleteTask from './deleteTask.js'
import updateTask from './updateTask.js'
import createFileUploadUrl from './createFileUploadUrl.js'
import addFileToDb from './addFileToDb.js'
import deleteFile from './deleteFile.js'
import updateLead from './updateLead.js'
import approveProvider from './approveProvider.js'
import rejectProvider from './rejectProvider.js'
import assignRequestToProvider from './assignRequestToProvider.js'
import approveRewardTransaction from './approveRewardTransaction.js'
import rejectRewardTransaction from './rejectRewardTransaction.js'
import getMyRequests from './getMyRequests.js'
import getServiceCategories from './getServiceCategories.js'
import getProviders from './getProviders.js'
import getMyRewardAccount from './getMyRewardAccount.js'
import getProviderById from './getProviderById.js'
import getConsumerStats from './getConsumerStats.js'
import getMessagesForRequest from './getMessagesForRequest.js'
import getReviewsForProvider from './getReviewsForProvider.js'
import getMyReferral from './getMyReferral.js'
import getProviderLeads from './getProviderLeads.js'
import getProviderAppointments from './getProviderAppointments.js'
import getProviderProfile from './getProviderProfile.js'
import getProviderFees from './getProviderFees.js'
import getPublicLeadFeed from './getPublicLeadFeed.js'
import getPublicProvider from './getPublicProvider.js'
import getAdminReviews from './getAdminReviews.js'
import getPaginatedUsers from './getPaginatedUsers.js'
import getGptResponses from './getGptResponses.js'
import getAllTasksByUser from './getAllTasksByUser.js'
import getAllFilesByUser from './getAllFilesByUser.js'
import getDownloadFileSignedURL from './getDownloadFileSignedURL.js'
import getDailyStats from './getDailyStats.js'
import getAdminRequests from './getAdminRequests.js'
import getAdminProviders from './getAdminProviders.js'
import getAdminRewards from './getAdminRewards.js'
import getAdminLeads from './getAdminLeads.js'

const router = express.Router()

router.post('/complete-onboarding', auth, completeOnboarding)
router.post('/redeem-points', auth, redeemPoints)
router.post('/submit-service-request', auth, submitServiceRequest)
router.post('/submit-lead', auth, submitLead)
router.post('/send-customer-message', auth, sendCustomerMessage)
router.post('/send-otp', auth, sendOtp)
router.post('/verify-otp', auth, verifyOtp)
router.post('/submit-review', auth, submitReview)
router.post('/apply-referral-code', auth, applyReferralCode)
router.post('/accept-service-request', auth, acceptServiceRequest)
router.post('/mark-job-completed', auth, markJobCompleted)
router.post('/submit-provider-application', auth, submitProviderApplication)
router.post('/update-provider-services', auth, updateProviderServices)
router.post('/create-provider-profile', auth, createProviderProfile)
router.post('/update-provider-appointment', auth, updateProviderAppointment)
router.post('/send-provider-message', auth, sendProviderMessage)
router.post('/update-provider-profile', auth, updateProviderProfile)
router.post('/claim-lead', auth, claimLead)
router.post('/moderate-review', auth, moderateReview)
router.post('/update-is-user-admin-by-id', auth, updateIsUserAdminById)
router.post('/update-user-profile', auth, updateUserProfile)
router.post('/generate-gpt-response', auth, generateGptResponse)
router.post('/create-task', auth, createTask)
router.post('/delete-task', auth, deleteTask)
router.post('/update-task', auth, updateTask)
router.post('/create-file-upload-url', auth, createFileUploadUrl)
router.post('/add-file-to-db', auth, addFileToDb)
router.post('/delete-file', auth, deleteFile)
router.post('/update-lead', auth, updateLead)
router.post('/approve-provider', auth, approveProvider)
router.post('/reject-provider', auth, rejectProvider)
router.post('/assign-request-to-provider', auth, assignRequestToProvider)
router.post('/approve-reward-transaction', auth, approveRewardTransaction)
router.post('/reject-reward-transaction', auth, rejectRewardTransaction)
router.post('/get-my-requests', auth, getMyRequests)
router.post('/get-service-categories', auth, getServiceCategories)
router.post('/get-providers', auth, getProviders)
router.post('/get-my-reward-account', auth, getMyRewardAccount)
router.post('/get-provider-by-id', auth, getProviderById)
router.post('/get-consumer-stats', auth, getConsumerStats)
router.post('/get-messages-for-request', auth, getMessagesForRequest)
router.post('/get-reviews-for-provider', auth, getReviewsForProvider)
router.post('/get-my-referral', auth, getMyReferral)
router.post('/get-provider-leads', auth, getProviderLeads)
router.post('/get-provider-appointments', auth, getProviderAppointments)
router.post('/get-provider-profile', auth, getProviderProfile)
router.post('/get-provider-fees', auth, getProviderFees)
router.post('/get-public-lead-feed', auth, getPublicLeadFeed)
router.post('/get-public-provider', auth, getPublicProvider)
router.post('/get-admin-reviews', auth, getAdminReviews)
router.post('/get-paginated-users', auth, getPaginatedUsers)
router.post('/get-gpt-responses', auth, getGptResponses)
router.post('/get-all-tasks-by-user', auth, getAllTasksByUser)
router.post('/get-all-files-by-user', auth, getAllFilesByUser)
router.post('/get-download-file-signed-url', auth, getDownloadFileSignedURL)
router.post('/get-daily-stats', auth, getDailyStats)
router.post('/get-admin-requests', auth, getAdminRequests)
router.post('/get-admin-providers', auth, getAdminProviders)
router.post('/get-admin-rewards', auth, getAdminRewards)
router.post('/get-admin-leads', auth, getAdminLeads)

export default router
