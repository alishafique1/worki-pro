-- AlterTable
ALTER TABLE "ProviderFee" ADD COLUMN     "adminNote" TEXT,
ADD COLUMN     "disputeNote" TEXT,
ADD COLUMN     "disputeReason" TEXT,
ADD COLUMN     "disputedAt" TIMESTAMP(3);
