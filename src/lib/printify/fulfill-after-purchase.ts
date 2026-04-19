import prisma from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { generatePhysicalOrderPendingEmail } from "@/lib/email/physical-order-email";
import { resolvePrintifySku, getPrintifyInventoryLine } from "@/lib/printify/products";
import {
  submitPrintifyOrderForSku,
  type PrintifyShippingAddressInput,
} from "@/lib/printify/submit-order";

export async function recordPhysicalPurchaseAndFulfillPrintify(opts: {
  stripeSessionId: string;
  stripePaymentId: string | null;
  customerEmail: string;
  customerName?: string | null;
  productSlug: string;
  productTitle: string;
  amountPaid: number;
  shipping: PrintifyShippingAddressInput | null;
  paymentProvider: "square";
}): Promise<{ purchaseId: string; printifyOrderId: string | null }> {
  const sku = resolvePrintifySku(opts.productSlug);
  if (!sku) {
    throw new Error("recordPhysicalPurchase: slug did not resolve to a Printify SKU");
  }

  const purchase = await prisma.purchase.create({
    data: {
      stripeSessionId: opts.stripeSessionId,
      stripePaymentId: opts.stripePaymentId,
      customerEmail: opts.customerEmail,
      customerName: opts.customerName ?? null,
      productSlug: opts.productSlug,
      productTitle: opts.productTitle,
      amountPaid: opts.amountPaid,
      fulfillmentType: "physical",
      deliveryToken: null,
    },
  });

  let printifyOrderId: string | null = null;
  let printifySubmitted = false;

  if (opts.shipping) {
    const mergedShip = { ...opts.shipping, email: opts.customerEmail };
    const submitted = await submitPrintifyOrderForSku({
      sku,
      quantity: 1,
      shipping: mergedShip,
      externalId: purchase.id,
      label: opts.productTitle,
      customerName: opts.customerName,
    });
    if (submitted.ok) {
      printifyOrderId = submitted.printifyOrderId;
      printifySubmitted = true;
      await prisma.purchase.update({
        where: { id: purchase.id },
        data: { printifyOrderId },
      });
    } else {
      console.error(
        "[printify] Order submit failed:",
        submitted.message,
        "session",
        opts.stripeSessionId,
      );
      await prisma.analytics.create({
        data: {
          event: "printify_order_failed",
          metadata: {
            purchaseId: purchase.id,
            sku,
            message: submitted.message,
            status: submitted.status,
            provider: opts.paymentProvider,
          },
        },
      });
    }
  } else {
    console.warn(
      "[printify] No shipping address; purchase recorded without Printify submit:",
      opts.stripeSessionId,
    );
  }

  const priceDisplay = `$${(opts.amountPaid / 100).toFixed(opts.amountPaid % 100 === 0 ? 0 : 2)}`;
  const html = generatePhysicalOrderPendingEmail({
    customerName: opts.customerName,
    productTitle: opts.productTitle,
    price: priceDisplay,
    printifySubmitted,
  });

  const emailResult = await sendEmail({
    to: opts.customerEmail,
    subject: printifySubmitted
      ? `Order confirmed — ${opts.productTitle}`
      : `Order received — ${opts.productTitle}`,
    html,
  });

  if (emailResult.success) {
    await prisma.purchase.update({
      where: { id: purchase.id },
      data: { deliveryEmailSent: true, deliveryEmailAt: new Date() },
    });
  } else {
    console.error(
      "[printify] Physical confirmation email failed:",
      emailResult.message,
    );
  }

  await prisma.analytics.create({
    data: {
      event: "physical_product_purchased",
      metadata: {
        provider: opts.paymentProvider,
        productSlug: opts.productSlug,
        productTitle: opts.productTitle,
        customerEmail: opts.customerEmail,
        amountPaid: opts.amountPaid,
        printifyOrderId,
        printifySubmitted,
      },
    },
  });

  return { purchaseId: purchase.id, printifyOrderId };
}

/**
 * Records a physical kit bundle purchase and auto-submits to Printify as a
 * multi-line order when inventory is configured and a shipping address is present.
 * Falls back to pending-fulfillment flow when inventory/address is missing.
 */
export async function recordPhysicalKitPurchasePending(opts: {
  stripeSessionId: string;
  stripePaymentId: string | null;
  customerEmail: string;
  customerName?: string | null;
  productSlug: string;
  productTitle: string;
  amountPaid: number;
  shipping: PrintifyShippingAddressInput | null;
  paymentProvider: "square";
}): Promise<{ purchaseId: string; printifyOrderId: string | null }> {
  const purchase = await prisma.purchase.create({
    data: {
      stripeSessionId: opts.stripeSessionId,
      stripePaymentId: opts.stripePaymentId,
      customerEmail: opts.customerEmail,
      customerName: opts.customerName ?? null,
      productSlug: opts.productSlug,
      productTitle: opts.productTitle,
      amountPaid: opts.amountPaid,
      fulfillmentType: "physical",
      deliveryToken: null,
    },
  });

  let printifyOrderId: string | null = null;
  let printifySubmitted = false;

  const invLines = getPrintifyInventoryLine(opts.productSlug);

  if (invLines && opts.shipping) {
    const mergedShip = { ...opts.shipping, email: opts.customerEmail };
    const submitted = await submitPrintifyOrderForSku({
      sku: opts.productSlug,
      quantity: 1,
      shipping: mergedShip,
      externalId: purchase.id,
      label: opts.productTitle,
      customerName: opts.customerName,
    });
    if (submitted.ok) {
      printifyOrderId = submitted.printifyOrderId;
      printifySubmitted = true;
      await prisma.purchase.update({
        where: { id: purchase.id },
        data: { printifyOrderId },
      });
    } else {
      console.error("[printify] Kit order submit failed:", submitted.message);
      await prisma.analytics.create({
        data: {
          event: "printify_kit_order_failed",
          metadata: {
            purchaseId: purchase.id,
            productSlug: opts.productSlug,
            message: submitted.message,
            status: submitted.status,
          },
        },
      });
    }
  } else {
    if (!invLines) {
      console.warn(
        `[printify] No inventory configured for kit ${opts.productSlug} — purchase ${purchase.id} pending manual fulfillment.`,
      );
    }
    if (!opts.shipping) {
      console.warn(
        `[printify] No shipping address for kit ${opts.productSlug} — purchase ${purchase.id} pending fulfillment.`,
      );
    }
  }

  const priceDisplay = `$${(opts.amountPaid / 100).toFixed(opts.amountPaid % 100 === 0 ? 0 : 2)}`;
  const html = generatePhysicalOrderPendingEmail({
    customerName: opts.customerName,
    productTitle: opts.productTitle,
    price: priceDisplay,
    printifySubmitted,
  });

  const emailResult = await sendEmail({
    to: opts.customerEmail,
    subject: printifySubmitted
      ? `Order confirmed — ${opts.productTitle}`
      : `Order received — ${opts.productTitle}`,
    html,
  });

  if (emailResult.success) {
    await prisma.purchase.update({
      where: { id: purchase.id },
      data: { deliveryEmailSent: true, deliveryEmailAt: new Date() },
    });
  } else {
    console.error("[printify] Kit confirmation email failed:", emailResult.message);
  }

  await prisma.analytics.create({
    data: {
      event: printifySubmitted ? "physical_kit_purchased" : "physical_kit_purchase_pending",
      metadata: {
        provider: opts.paymentProvider,
        productSlug: opts.productSlug,
        productTitle: opts.productTitle,
        customerEmail: opts.customerEmail,
        amountPaid: opts.amountPaid,
        purchaseId: purchase.id,
        printifyOrderId,
        printifySubmitted,
        lineItemCount: invLines?.length ?? 0,
      },
    },
  });

  return { purchaseId: purchase.id, printifyOrderId };
}
