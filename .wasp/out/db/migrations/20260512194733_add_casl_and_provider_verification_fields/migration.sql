-- AlterTable
ALTER TABLE "Provider" ADD COLUMN     "insuranceCertExpiry" TIMESTAMP(3),
ADD COLUMN     "onboardingCallDone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "referencesChecked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tssaRegistrationNumber" TEXT,
ADD COLUMN     "tssaVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "wsibCertExpiry" TIMESTAMP(3),
ADD COLUMN     "wsibClearanceNumber" TEXT;

-- AlterTable
ALTER TABLE "ServiceRequest" ADD COLUMN     "smsConsentFormVersion" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "smsMarketingConsent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "smsMarketingConsentAt" TIMESTAMP(3),
ADD COLUMN     "smsMarketingConsentIp" TEXT;
