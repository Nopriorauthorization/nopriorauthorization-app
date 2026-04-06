-- Checkout abandonment tracking (Resend reminder 1h after Square link issued)
CREATE TABLE "CheckoutAttempt" (
    "id" TEXT NOT NULL,
    "productSlug" TEXT NOT NULL,
    "buyerEmail" TEXT NOT NULL,
    "paymentLinkId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'shop',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reminderSentAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "CheckoutAttempt_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CheckoutAttempt_buyerEmail_productSlug_idx" ON "CheckoutAttempt"("buyerEmail", "productSlug");
CREATE INDEX "CheckoutAttempt_createdAt_idx" ON "CheckoutAttempt"("createdAt");
CREATE INDEX "CheckoutAttempt_completedAt_reminderSentAt_idx" ON "CheckoutAttempt"("completedAt", "reminderSentAt");
