-- CreateTable
CREATE TABLE "ApplicationQuestion" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "placeholder" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL,
    "options" JSONB,
    "metadata" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialMediaLink" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialMediaLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ApplicationQuestion_order_idx" ON "ApplicationQuestion"("order");

-- CreateIndex
CREATE INDEX "ApplicationQuestion_isActive_idx" ON "ApplicationQuestion"("isActive");

-- CreateIndex
CREATE INDEX "SocialMediaLink_order_idx" ON "SocialMediaLink"("order");

-- CreateIndex
CREATE INDEX "SocialMediaLink_isActive_idx" ON "SocialMediaLink"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "SocialMediaLink_platform_key" ON "SocialMediaLink"("platform");
