-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'free-templates',
    "opted_in" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nurture_emails_sent" INTEGER NOT NULL DEFAULT 0,
    "next_nurture_at" TIMESTAMP(3),
    "unsubscribe_token" TEXT NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "leads_unsubscribe_token_key" ON "leads"("unsubscribe_token");

-- CreateIndex
CREATE INDEX "leads_source_next_nurture_at_idx" ON "leads"("source", "next_nurture_at");

-- CreateIndex
CREATE INDEX "leads_email_idx" ON "leads"("email");

-- CreateIndex
CREATE UNIQUE INDEX "leads_email_source_key" ON "leads"("email", "source");
