/*
  Warnings:

  - You are about to drop the column `sortOrder` on the `ServiceCategory` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "OtpCode_email_idx";

-- AlterTable
ALTER TABLE "ServiceCategory" DROP COLUMN "sortOrder";

-- CreateIndex
CREATE INDEX "OtpCode_email_used_idx" ON "OtpCode"("email", "used");
