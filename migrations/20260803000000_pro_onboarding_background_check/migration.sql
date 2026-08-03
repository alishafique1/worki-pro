-- WRK-8: Pro onboarding & verification
-- Adds background check consent tracking to Provider.
-- Run: wasp db migrate-dev (or prisma migrate dev) to apply.

-- AlterTable
ALTER TABLE "Provider" ADD COLUMN "backgroundCheckConsent" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Provider" ADD COLUMN "backgroundCheckConsentAt" TIMESTAMP(3);
