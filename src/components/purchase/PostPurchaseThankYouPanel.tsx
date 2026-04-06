import {
  RETURN_CUSTOMER_DISCOUNT_PERCENT,
  getPostPurchaseContact,
  getReturnCustomerCouponCode,
} from "@/config/post-purchase.config";

/**
 * Thank-you, contact, and return-customer discount — shown on post-checkout pages for every purchase.
 */
export function PostPurchaseThankYouPanel() {
  const contact = getPostPurchaseContact();
  const code = getReturnCustomerCouponCode();

  return (
    <div className="space-y-6 text-left">
      <div className="rounded-xl border border-[#D4537E]/35 bg-[#D4537E]/[0.08] p-6">
        <h2 className="text-lg font-semibold text-white md:text-xl">
          Thank you for supporting my page
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-300">
          Every purchase helps me keep building honest, practice-tested templates and guides. I&apos;m
          grateful you&apos;re here.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4537E]">
          {RETURN_CUSTOMER_DISCOUNT_PERCENT}% off your next purchase
        </h3>
        <p className="mt-2 text-sm text-gray-300">
          Use this code on your <strong className="text-white">next</strong> order:
        </p>
        <p
          className="mt-3 inline-block rounded-lg border border-white/20 bg-[#1A1A1A] px-4 py-2 font-mono text-lg font-bold tracking-wide text-white"
          data-testid="return-customer-coupon"
        >
          {code}
        </p>
        <p className="mt-3 text-xs text-gray-500">
          On your next purchase, enter this code when checkout prompts for a discount or coupon.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Reach me directly</h3>
        <ul className="mt-3 space-y-2 text-sm text-gray-300">
          <li>
            <a href={`mailto:${contact.supportEmail}`} className="text-[#D4537E] underline">
              {contact.supportEmail}
            </a>
          </li>
          <li>
            <a href={contact.supportPhoneTel} className="text-[#D4537E] underline">
              {contact.supportPhone}
            </a>
          </li>
          <li className="text-gray-400">{contact.businessAddress}</li>
          <li className="text-xs text-gray-500">{contact.founderLine}</li>
        </ul>
      </div>
    </div>
  );
}
