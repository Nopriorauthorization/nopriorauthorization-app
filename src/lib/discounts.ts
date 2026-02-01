// Discount codes configuration
export interface DiscountCode {
  code: string;
  type: 'fixed' | 'percentage';
  amount: number;
  description: string;
  validUntil?: Date;
  maxUses?: number;
  currentUses?: number;
  applicableTiers?: string[]; // If empty, applies to all tiers
}

// Active discount codes
export const DISCOUNT_CODES: Record<string, DiscountCode> = {
  'WELCOME20': {
    code: 'WELCOME20',
    type: 'fixed',
    amount: 20,
    description: 'Welcome discount for new users',
    maxUses: 1000,
    currentUses: 0
  },
  'HEALTH50': {
    code: 'HEALTH50',
    type: 'fixed',
    amount: 50,
    description: 'Health awareness promotion',
    validUntil: new Date('2026-12-31'),
    maxUses: 500,
    currentUses: 0
  },
  'FAMILY30': {
    code: 'FAMILY30',
    type: 'fixed',
    amount: 30,
    description: 'Family plan discount',
    applicableTiers: ['family'],
    maxUses: 200,
    currentUses: 0
  },
  'EARLYBIRD': {
    code: 'EARLYBIRD',
    type: 'fixed',
    amount: 10, // $10 off monthly, $100 off annual
    description: 'Early adopter discount',
    validUntil: new Date('2026-06-30'),
    maxUses: 1000,
    currentUses: 0
  },
  'SAVE20': {
    code: 'SAVE20',
    type: 'percentage',
    amount: 20,
    description: '20% off any plan',
    validUntil: new Date('2026-03-31'),
    maxUses: 500,
    currentUses: 0
  }
};

export function validateDiscountCode(code: string): {
  isValid: boolean;
  discount?: DiscountCode;
  error?: string;
} {
  const discount = DISCOUNT_CODES[code.toUpperCase()];

  if (!discount) {
    return { isValid: false, error: 'Invalid discount code' };
  }

  // Check expiration
  if (discount.validUntil && new Date() > discount.validUntil) {
    return { isValid: false, error: 'Discount code has expired' };
  }

  // Check usage limits
  if (discount.maxUses && (discount.currentUses || 0) >= discount.maxUses) {
    return { isValid: false, error: 'Discount code usage limit reached' };
  }

  return { isValid: true, discount };
}

export function calculateDiscountedPrice(
  basePrice: number,
  discount: DiscountCode,
  isAnnual: boolean = false
): number {
  let discountAmount = 0;

  if (discount.type === 'fixed') {
    // For annual plans, apply larger discount for EARLYBIRD
    if (discount.code === 'EARLYBIRD' && isAnnual) {
      discountAmount = 100; // $100 off annual instead of $10
    } else {
      discountAmount = discount.amount;
    }
  } else if (discount.type === 'percentage') {
    discountAmount = (basePrice * discount.amount) / 100;
  }

  return Math.max(0, basePrice - discountAmount);
}