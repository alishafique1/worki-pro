/*
  Warnings:

  - You are about to drop the `Auth` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuthIdentity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "WebhookDirection" AS ENUM ('OUTBOUND', 'INBOUND');

-- DropForeignKey
ALTER TABLE "Auth" DROP CONSTRAINT "Auth_userId_fkey";

-- DropForeignKey
ALTER TABLE "AuthIdentity" DROP CONSTRAINT "AuthIdentity_authId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropTable
DROP TABLE "Auth";

-- DropTable
DROP TABLE "AuthIdentity";

-- DropTable
DROP TABLE "Session";

-- CreateTable
CREATE TABLE "WebhookLog" (
    "id" TEXT NOT NULL,
    "direction" "WebhookDirection" NOT NULL,
    "source" TEXT NOT NULL,
    "event" TEXT,
    "serviceRequestId" TEXT,
    "payload" JSONB NOT NULL,
    "statusCode" INTEGER,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WebhookLog" ADD CONSTRAINT "WebhookLog_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "ServiceRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
