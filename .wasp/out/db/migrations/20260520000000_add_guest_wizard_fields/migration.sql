-- AlterTable: add qualifier questions to ServiceCategory
ALTER TABLE "ServiceCategory" ADD COLUMN IF NOT EXISTS "questions" JSONB;

-- AlterTable: add guest fields to ServiceRequest
ALTER TABLE "ServiceRequest" ADD COLUMN IF NOT EXISTS "guestEmail" TEXT;
ALTER TABLE "ServiceRequest" ADD COLUMN IF NOT EXISTS "guestPhone" TEXT;
ALTER TABLE "ServiceRequest" ADD COLUMN IF NOT EXISTS "qualifierAnswers" JSONB;
