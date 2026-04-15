-- CreateEnum
CREATE TYPE "AffiliateStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN');

-- CreateTable
CREATE TABLE "Affiliate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT,
    "socialLinks" JSONB,
    "contentType" TEXT,
    "experience" TEXT,
    "motivation" TEXT,
    "affiliateCode" TEXT NOT NULL,
    "status" "AffiliateStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "totalClicks" INTEGER NOT NULL DEFAULT 0,
    "totalSales" INTEGER NOT NULL DEFAULT 0,
    "totalEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "Affiliate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Click" (
    "id" TEXT NOT NULL,
    "affiliateId" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Click_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL,
    "affiliateId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'SUPER_ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "adminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliateCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT,
    "changes" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "adminId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteContent" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Affiliate_email_key" ON "Affiliate"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Affiliate_affiliateCode_key" ON "Affiliate"("affiliateCode");

-- CreateIndex
CREATE INDEX "Affiliate_email_idx" ON "Affiliate"("email");

-- CreateIndex
CREATE INDEX "Affiliate_status_idx" ON "Affiliate"("status");

-- CreateIndex
CREATE INDEX "Affiliate_affiliateCode_idx" ON "Affiliate"("affiliateCode");

-- CreateIndex
CREATE INDEX "Affiliate_createdAt_idx" ON "Affiliate"("createdAt");

-- CreateIndex
CREATE INDEX "Click_affiliateId_idx" ON "Click"("affiliateId");

-- CreateIndex
CREATE INDEX "Click_createdAt_idx" ON "Click"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Sale_orderId_key" ON "Sale"("orderId");

-- CreateIndex
CREATE INDEX "Sale_affiliateId_idx" ON "Sale"("affiliateId");

-- CreateIndex
CREATE INDEX "Sale_orderId_idx" ON "Sale"("orderId");

-- CreateIndex
CREATE INDEX "Sale_createdAt_idx" ON "Sale"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE INDEX "Admin_username_idx" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "AffiliateCode_code_key" ON "AffiliateCode"("code");

-- CreateIndex
CREATE INDEX "AffiliateCode_adminId_idx" ON "AffiliateCode"("adminId");

-- CreateIndex
CREATE INDEX "AffiliateCode_code_idx" ON "AffiliateCode"("code");

-- CreateIndex
CREATE INDEX "AffiliateCode_createdAt_idx" ON "AffiliateCode"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_adminId_idx" ON "AuditLog"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "SiteContent_key_key" ON "SiteContent"("key");

-- CreateIndex
CREATE INDEX "SiteContent_updatedAt_idx" ON "SiteContent"("updatedAt");

-- AddForeignKey
ALTER TABLE "Click" ADD CONSTRAINT "Click_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateCode" ADD CONSTRAINT "AffiliateCode_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
