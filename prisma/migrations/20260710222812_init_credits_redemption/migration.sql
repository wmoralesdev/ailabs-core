-- CreateEnum
CREATE TYPE "Product" AS ENUM ('CURSOR', 'CODEX', 'OPENAI', 'CODEX_OPENAI');

-- CreateEnum
CREATE TYPE "Pool" AS ENUM ('CURSOR', 'CODEX', 'OPENAI');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "product" "Product" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EligibleEmail" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "EligibleEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Redemption" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Redemption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromoCode" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "pool" "Pool" NOT NULL,
    "code" TEXT NOT NULL,
    "redemptionId" TEXT,
    "claimedAt" TIMESTAMP(3),

    CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EligibleEmail_eventId_idx" ON "EligibleEmail"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "EligibleEmail_eventId_email_key" ON "EligibleEmail"("eventId", "email");

-- CreateIndex
CREATE INDEX "Redemption_eventId_idx" ON "Redemption"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Redemption_eventId_email_key" ON "Redemption"("eventId", "email");

-- CreateIndex
CREATE INDEX "PromoCode_eventId_pool_redemptionId_idx" ON "PromoCode"("eventId", "pool", "redemptionId");

-- CreateIndex
CREATE UNIQUE INDEX "PromoCode_eventId_code_key" ON "PromoCode"("eventId", "code");

-- AddForeignKey
ALTER TABLE "EligibleEmail" ADD CONSTRAINT "EligibleEmail_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Redemption" ADD CONSTRAINT "Redemption_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromoCode" ADD CONSTRAINT "PromoCode_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromoCode" ADD CONSTRAINT "PromoCode_redemptionId_fkey" FOREIGN KEY ("redemptionId") REFERENCES "Redemption"("id") ON DELETE SET NULL ON UPDATE CASCADE;
