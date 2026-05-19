-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CONSUMER', 'PROVIDER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "ProviderStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ProviderPlan" AS ENUM ('STARTER', 'GROWTH', 'EXCLUSIVE');

-- CreateEnum
CREATE TYPE "SubStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PAST_DUE');

-- CreateEnum
CREATE TYPE "RequestSource" AS ENUM ('WEBSITE', 'PHONE', 'SMS', 'ADMIN', 'REFERRAL');

-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('EMERGENCY', 'STANDARD', 'PLANNED');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('NEW', 'SMS_STARTED', 'QUALIFYING', 'QUALIFIED', 'ASSIGNED', 'ACCEPTED_BY_PROVIDER', 'BOOKED', 'COMPLETED', 'REWARD_PENDING', 'REWARD_APPROVED', 'CLOSED', 'LOST', 'INVALID', 'SPAM');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PROPOSED', 'CONFIRMED', 'RESCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "RewardLevel" AS ENUM ('NEW_HOMEOWNER', 'ACTIVE_HOMEOWNER', 'SMART_MAINTAINER', 'HOME_REWARDS_PRO');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('SIGNUP_BONUS', 'PROFILE_COMPLETION', 'SERVICE_REQUEST', 'BOOKED_APPOINTMENT', 'COMPLETED_SERVICE', 'REFERRAL', 'MANUAL_ADJUSTMENT', 'REDEMPTION');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REDEEMED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "RedemptionStatus" AS ENUM ('REQUESTED', 'APPROVED', 'SENT', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('CREATED', 'SIGNED_UP', 'SERVICE_COMPLETED', 'REWARDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Channel" AS ENUM ('SMS', 'EMAIL', 'PHONE', 'INTERNAL_NOTE');

-- CreateEnum
CREATE TYPE "Direction" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "FeeType" AS ENUM ('MONTHLY_SUBSCRIPTION', 'QUALIFIED_LEAD', 'BOOKED_APPOINTMENT', 'COMPLETED_JOB', 'SUCCESS_FEE');

-- CreateEnum
CREATE TYPE "FeeStatus" AS ENUM ('PENDING', 'INVOICED', 'PAID', 'WAIVED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "RewardStatus" AS ENUM ('PENDING_VERIFICATION', 'APPROVED', 'REJECTED', 'ISSUED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT,
    "username" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "postalCode" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CONSUMER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "smsConsent" BOOLEAN NOT NULL DEFAULT false,
    "smsConsentAt" TIMESTAMP(3),
    "emailConsent" BOOLEAN NOT NULL DEFAULT false,
    "paymentProcessorUserId" TEXT,
    "lemonSqueezyCustomerPortalUrl" TEXT,
    "subscriptionStatus" TEXT,
    "subscriptionPlan" TEXT,
    "datePaid" TIMESTAMP(3),
    "credits" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GptResponse" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "GptResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "time" TEXT NOT NULL DEFAULT '1',
    "isDone" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyStats" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "prevDayViewsChangePercent" TEXT NOT NULL DEFAULT '0',
    "userCount" INTEGER NOT NULL DEFAULT 0,
    "paidUserCount" INTEGER NOT NULL DEFAULT 0,
    "userDelta" INTEGER NOT NULL DEFAULT 0,
    "paidUserDelta" INTEGER NOT NULL DEFAULT 0,
    "totalRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalProfit" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "DailyStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageViewSource" (
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dailyStatsId" INTEGER,
    "visitors" INTEGER NOT NULL,

    CONSTRAINT "PageViewSource_pkey" PRIMARY KEY ("date","name")
);

-- CreateTable
CREATE TABLE "Logs" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "level" TEXT NOT NULL,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactFormMessage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "repliedAt" TIMESTAMP(3),

    CONSTRAINT "ContactFormMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "parentCategoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "contactName" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "website" TEXT,
    "licenceNumber" TEXT,
    "licenceUrl" TEXT,
    "insuranceUrl" TEXT,
    "insuranceStatus" BOOLEAN NOT NULL DEFAULT false,
    "serviceAreas" TEXT[],
    "ratingInternal" DOUBLE PRECISION,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "verificationStatus" "ProviderStatus" NOT NULL DEFAULT 'PENDING',
    "plan" "ProviderPlan" NOT NULL DEFAULT 'STARTER',
    "stripeCustomerId" TEXT,
    "stripeSubId" TEXT,
    "subscriptionStatus" "SubStatus" NOT NULL DEFAULT 'INACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderCategory" (
    "providerId" TEXT NOT NULL,
    "serviceCategoryId" TEXT NOT NULL,

    CONSTRAINT "ProviderCategory_pkey" PRIMARY KEY ("providerId","serviceCategoryId")
);

-- CreateTable
CREATE TABLE "ServiceRequest" (
    "id" TEXT NOT NULL,
    "source" "RequestSource" NOT NULL DEFAULT 'WEBSITE',
    "consumerId" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "city" TEXT,
    "email" TEXT,
    "smsConsentGiven" BOOLEAN NOT NULL DEFAULT false,
    "smsConsentIp" TEXT,
    "serviceCategoryId" TEXT,
    "description" TEXT NOT NULL,
    "urgency" "Urgency" NOT NULL DEFAULT 'STANDARD',
    "propertyType" TEXT,
    "ownOrRent" TEXT,
    "preferredTime" TEXT,
    "twilioCallSid" TEXT,
    "callRecordingUrl" TEXT,
    "callerLocation" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'NEW',
    "rewardEligible" BOOLEAN NOT NULL DEFAULT true,
    "rewardStatus" "RewardStatus",
    "assignedProviderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bookedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "serviceRequestId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "consumerId" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PROPOSED',
    "providerNotes" TEXT,
    "consumerNotes" TEXT,
    "completionProofUrl" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardAccount" (
    "id" TEXT NOT NULL,
    "consumerId" TEXT NOT NULL,
    "pointsBalance" INTEGER NOT NULL DEFAULT 0,
    "lifetimePoints" INTEGER NOT NULL DEFAULT 0,
    "level" "RewardLevel" NOT NULL DEFAULT 'NEW_HOMEOWNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RewardAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardTransaction" (
    "id" TEXT NOT NULL,
    "consumerId" TEXT NOT NULL,
    "serviceRequestId" TEXT,
    "type" "TransactionType" NOT NULL,
    "points" INTEGER NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "approvedByAdminId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "RewardTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Redemption" (
    "id" TEXT NOT NULL,
    "consumerId" TEXT NOT NULL,
    "pointsUsed" INTEGER NOT NULL,
    "cashValue" DECIMAL(10,2) NOT NULL,
    "giftCardProvider" TEXT,
    "giftCardEmail" TEXT,
    "tremendousOrderId" TEXT,
    "tremendousRewardId" TEXT,
    "status" "RedemptionStatus" NOT NULL DEFAULT 'REQUESTED',
    "issuedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Redemption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "referrerUserId" TEXT NOT NULL,
    "referredUserId" TEXT,
    "referralCode" TEXT NOT NULL,
    "status" "ReferralStatus" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "rewardTransactionId" TEXT,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunicationLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "serviceRequestId" TEXT,
    "providerId" TEXT,
    "channel" "Channel" NOT NULL,
    "direction" "Direction" NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "body" TEXT,
    "providerMessageId" TEXT,
    "status" TEXT,
    "duration" INTEGER,
    "recordingUrl" TEXT,
    "digits" TEXT,
    "rawPayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunicationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderFee" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "serviceRequestId" TEXT,
    "appointmentId" TEXT,
    "feeType" "FeeType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "FeeStatus" NOT NULL DEFAULT 'PENDING',
    "invoiceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "ProviderFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestNote" (
    "id" TEXT NOT NULL,
    "serviceRequestId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auth" (
    "id" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthIdentity" (
    "providerName" TEXT NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "providerData" TEXT NOT NULL DEFAULT '{}',
    "authId" TEXT NOT NULL,

    CONSTRAINT "AuthIdentity_pkey" PRIMARY KEY ("providerName","providerUserId")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_paymentProcessorUserId_key" ON "User"("paymentProcessorUserId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyStats_date_key" ON "DailyStats"("date");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_slug_key" ON "ServiceCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_userId_key" ON "Provider"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceRequest_twilioCallSid_key" ON "ServiceRequest"("twilioCallSid");

-- CreateIndex
CREATE UNIQUE INDEX "RewardAccount_consumerId_key" ON "RewardAccount"("consumerId");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_referredUserId_key" ON "Referral"("referredUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_referralCode_key" ON "Referral"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_userId_key" ON "Auth"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_id_key" ON "Session"("id");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- AddForeignKey
ALTER TABLE "GptResponse" ADD CONSTRAINT "GptResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageViewSource" ADD CONSTRAINT "PageViewSource_dailyStatsId_fkey" FOREIGN KEY ("dailyStatsId") REFERENCES "DailyStats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactFormMessage" ADD CONSTRAINT "ContactFormMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCategory" ADD CONSTRAINT "ServiceCategory_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "ServiceCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderCategory" ADD CONSTRAINT "ProviderCategory_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderCategory" ADD CONSTRAINT "ProviderCategory_serviceCategoryId_fkey" FOREIGN KEY ("serviceCategoryId") REFERENCES "ServiceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_serviceCategoryId_fkey" FOREIGN KEY ("serviceCategoryId") REFERENCES "ServiceCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_assignedProviderId_fkey" FOREIGN KEY ("assignedProviderId") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "ServiceRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardAccount" ADD CONSTRAINT "RewardAccount_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardTransaction" ADD CONSTRAINT "RewardTransaction_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardTransaction" ADD CONSTRAINT "RewardTransaction_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "ServiceRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Redemption" ADD CONSTRAINT "Redemption_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referrerUserId_fkey" FOREIGN KEY ("referrerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referredUserId_fkey" FOREIGN KEY ("referredUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunicationLog" ADD CONSTRAINT "CommunicationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunicationLog" ADD CONSTRAINT "CommunicationLog_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "ServiceRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunicationLog" ADD CONSTRAINT "CommunicationLog_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderFee" ADD CONSTRAINT "ProviderFee_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderFee" ADD CONSTRAINT "ProviderFee_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "ServiceRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderFee" ADD CONSTRAINT "ProviderFee_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestNote" ADD CONSTRAINT "RequestNote_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "ServiceRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auth" ADD CONSTRAINT "Auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthIdentity" ADD CONSTRAINT "AuthIdentity_authId_fkey" FOREIGN KEY ("authId") REFERENCES "Auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;
