/**
 * Copy and contact shown after every digital purchase (thank-you pages + delivery email).
 * Create a matching coupon in Square for `NEXT_PUBLIC_RETURN_CUSTOMER_COUPON_CODE`.
 */
export const RETURN_CUSTOMER_DISCOUNT_PERCENT = 20;

const DEFAULT_COUPON = "NPA-THANKS20";

export function getReturnCustomerCouponCode(): string {
  const fromEnv = process.env.NEXT_PUBLIC_RETURN_CUSTOMER_COUPON_CODE?.trim();
  return fromEnv || DEFAULT_COUPON;
}

export type PostPurchaseContact = {
  supportEmail: string;
  supportPhone: string;
  supportPhoneTel: string;
  businessAddress: string;
  founderLine: string;
};

export function getPostPurchaseContact(): PostPurchaseContact {
  const supportEmail =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || "support@nopriorauthorization.com";
  const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE?.trim() || "630-636-6193";
  const digits = supportPhone.replace(/\D/g, "");
  const supportPhoneTel = digits ? `tel:+1${digits}` : "";

  return {
    supportEmail,
    supportPhone,
    supportPhoneTel: supportPhoneTel || `tel:${supportPhone}`,
    businessAddress: "Hello Gorgeous Med Spa · 74 W Washington St, Oswego, IL",
    founderLine: "Danielle Alcala-Glazier — built from real practice at Hello Gorgeous",
  };
}
