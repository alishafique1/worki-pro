-- AlterTable: add onboarding completion flag
ALTER TABLE "User" ADD COLUMN "onboardingCompletedAt" TIMESTAMP(3);

-- Backfill: existing users (and all providers) have already completed onboarding,
-- so they must NOT be forced back through it on deploy.
UPDATE "User"
SET "onboardingCompletedAt" = COALESCE("updatedAt", "createdAt")
WHERE "firstName" IS NOT NULL OR "role" = 'PROVIDER';
