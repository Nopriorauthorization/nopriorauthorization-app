"use client";
import { useState } from "react";
import { TIERS, calculateAnnualSavings } from "@/lib/tiers";
import { validateDiscountCode, calculateDiscountedPrice, type DiscountCode } from "@/lib/discounts";
import Button from "@/components/ui/button";

interface PricingCardProps {
  tier: typeof TIERS.blueprint | typeof TIERS.family;
  isAnnual: boolean;
  discountCode?: DiscountCode;
}

function PricingCard({ tier, isAnnual, discountCode }: PricingCardProps) {
  const annualSavings = calculateAnnualSavings(tier);
  const basePrice = isAnnual ? annualSavings.annualPrice : tier.price;
  const finalPrice = discountCode ? calculateDiscountedPrice(basePrice, discountCode, isAnnual) : basePrice;
  const discountAmount = discountCode ? basePrice - finalPrice : 0;
  const savingsText = isAnnual ? `Save ${annualSavings.savingsPercent}%` : null;

  return (
    <div className="rounded-2xl border border-white/20 bg-white/5 p-8 hover:border-hot-pink/50 transition-colors">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">{tier.displayName}</h2>
          {savingsText && (
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
              {savingsText}
            </span>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">${finalPrice}</span>
            <span className="text-gray-400">/{isAnnual ? 'year' : 'month'}</span>
          </div>
          {isAnnual && (
            <p className="text-sm text-gray-400 mt-1">
              ${annualSavings.monthlyEquivalent}/month equivalent
            </p>
          )}
          {discountAmount > 0 && (
            <p className="text-sm text-green-400 mt-1">
              ${discountAmount} discount applied ({discountCode?.description})
            </p>
          )}
        </div>

        <p className="text-sm text-gray-300">{tier.description}</p>
      </div>

      <ul className="mb-8 space-y-3">
        {tier.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm">
            <span className="mt-0.5 text-hot-pink">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={tier.id === "blueprint" ? "primary" : "secondary"}
        size="lg"
        className="w-full"
        onClick={() => {
          // TODO: Stripe checkout integration
          alert(`Stripe checkout for ${tier.id} (${isAnnual ? 'annual' : 'monthly'}) coming soon!`);
        }}
      >
        {tier.cta}
      </Button>
    </div>
  );
}

interface DiscountInputProps {
  discountCode: string;
  setDiscountCode: (code: string) => void;
  appliedDiscount: DiscountCode | null;
  setAppliedDiscount: (discount: DiscountCode | null) => void;
  isValidating: boolean;
  validateDiscount: () => void;
  error?: string;
}

function DiscountInput({
  discountCode,
  setDiscountCode,
  appliedDiscount,
  setAppliedDiscount,
  isValidating,
  validateDiscount,
  error
}: DiscountInputProps) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-white mb-4">Have a discount code?</h3>
      <div className="flex gap-2 max-w-md">
        <input
          type="text"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
          placeholder="Enter code"
          className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-hot-pink focus:outline-none"
        />
        <Button
          onClick={validateDiscount}
          disabled={isValidating || !discountCode}
          variant="secondary"
          size="sm"
        >
          {isValidating ? 'Checking...' : 'Apply'}
        </Button>
      </div>
      {appliedDiscount && (
        <p className="text-green-400 text-sm mt-2">
          ✅ {appliedDiscount.description} applied!
        </p>
      )}
      {error && (
        <p className="text-red-400 text-sm mt-2">
          ❌ {error}
        </p>
      )}
    </div>
  );
}

export default function EnhancedPricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [discountError, setDiscountError] = useState<string | undefined>();

  const validateDiscount = async () => {
    setIsValidating(true);
    setDiscountError(undefined);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = validateDiscountCode(discountCode);

    if (result.isValid && result.discount) {
      setAppliedDiscount(result.discount);
    } else {
      setAppliedDiscount(null);
      setDiscountError(result.error);
    }

    setIsValidating(false);
  };

  return (
    <div className="py-16">
      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              !isAnnual
                ? 'bg-hot-pink text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors relative ${
              isAnnual
                ? 'bg-hot-pink text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Annual
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Discount Input */}
      <div className="text-center mb-12">
        <DiscountInput
          discountCode={discountCode}
          setDiscountCode={setDiscountCode}
          appliedDiscount={appliedDiscount}
          setAppliedDiscount={setAppliedDiscount}
          isValidating={isValidating}
          validateDiscount={validateDiscount}
          error={discountError}
        />
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
        <PricingCard
          tier={TIERS.blueprint}
          isAnnual={isAnnual}
          discountCode={appliedDiscount || undefined}
        />
        <PricingCard
          tier={TIERS.family}
          isAnnual={isAnnual}
          discountCode={appliedDiscount || undefined}
        />
      </div>

      {/* Savings Summary */}
      {isAnnual && (
        <div className="text-center mt-8">
          <p className="text-green-400 font-semibold">
            🎉 Annual plans save you ${calculateAnnualSavings(TIERS.blueprint).savings} on Blueprint and ${calculateAnnualSavings(TIERS.family).savings} on Family!
          </p>
        </div>
      )}
    </div>
  );
}