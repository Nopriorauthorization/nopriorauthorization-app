-- Post-purchase one-click upsell: link redirect token to Square card-on-file context
ALTER TABLE "CheckoutAttempt" ADD COLUMN "postCheckoutToken" TEXT;
ALTER TABLE "CheckoutAttempt" ADD COLUMN "squarePaymentId" TEXT;
ALTER TABLE "CheckoutAttempt" ADD COLUMN "squareCustomerIdForUpsell" TEXT;
ALTER TABLE "CheckoutAttempt" ADD COLUMN "squareCardIdForUpsell" TEXT;
ALTER TABLE "CheckoutAttempt" ADD COLUMN "upsellOneClickSlugs" TEXT[] DEFAULT ARRAY[]::TEXT[];

CREATE UNIQUE INDEX "CheckoutAttempt_postCheckoutToken_key" ON "CheckoutAttempt"("postCheckoutToken");
