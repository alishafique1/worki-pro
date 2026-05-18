-- AlterTable: add icon, imageUrl, sortOrder to ServiceCategory
ALTER TABLE "ServiceCategory" ADD COLUMN "icon" TEXT;
ALTER TABLE "ServiceCategory" ADD COLUMN "imageUrl" TEXT;
ALTER TABLE "ServiceCategory" ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;
