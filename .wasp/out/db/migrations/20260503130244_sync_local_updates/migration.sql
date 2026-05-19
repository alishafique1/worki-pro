-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'CONVERTED', 'LOST');

-- AlterTable
ALTER TABLE "Provider" ADD COLUMN     "servicesJson" TEXT DEFAULT '[]';

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "postalCode" TEXT,
    "serviceType" TEXT,
    "message" TEXT,
    "source" TEXT NOT NULL DEFAULT 'WEBSITE',
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "assignedTo" TEXT,
    "notes" TEXT,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");
