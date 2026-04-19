-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN "printifyOrderId" TEXT;
ALTER TABLE "Purchase" ADD COLUMN "fulfillmentType" TEXT;
ALTER TABLE "Purchase" ADD COLUMN "trackingNumber" TEXT;
ALTER TABLE "Purchase" ADD COLUMN "shippedAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "Purchase_printifyOrderId_key" ON "Purchase"("printifyOrderId");
