/*
  Warnings:

  - A unique constraint covering the columns `[applicationId]` on the table `AffiliateCode` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "AffiliateCode" ADD COLUMN     "applicationId" TEXT;

-- CreateTable
CREATE TABLE "AffiliateApplication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT,
    "socialLinks" JSONB,
    "contentType" TEXT,
    "experience" TEXT,
    "motivation" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "affiliateId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "AffiliateApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AffiliateApplication_email_key" ON "AffiliateApplication"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AffiliateApplication_affiliateId_key" ON "AffiliateApplication"("affiliateId");

-- CreateIndex
CREATE INDEX "AffiliateApplication_status_idx" ON "AffiliateApplication"("status");

-- CreateIndex
CREATE INDEX "AffiliateApplication_createdAt_idx" ON "AffiliateApplication"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AffiliateCode_applicationId_key" ON "AffiliateCode"("applicationId");

-- AddForeignKey
ALTER TABLE "AffiliateCode" ADD CONSTRAINT "AffiliateCode_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "AffiliateApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateApplication" ADD CONSTRAINT "AffiliateApplication_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
