-- Add scheduling/contact preference fields for service request qualification
ALTER TABLE "ServiceRequest"
ADD COLUMN "estimatedSchedule" TEXT;
