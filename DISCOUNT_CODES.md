# Discount Codes for Testing

## Available Test Discount Codes

| Code | Discount | Description | Valid Until |
|------|----------|-------------|------------|
| `WELCOME20` | $20 off | Welcome discount for new users | - |
| `HEALTH50` | $50 off | Health awareness promotion | Dec 31, 2026 |
| `FAMILY30` | $30 off | Family plan discount (Family plans only) | - |
| `EARLYBIRD` | $10 off monthly / $100 off annual | Early adopter discount | June 30, 2026 |
| `SAVE20` | 20% off | General 20% discount | March 31, 2026 |

## How to Test

1. Visit `/subscribe` page
2. Toggle between Monthly/Annual billing
3. Enter a discount code in the input field
4. Click "Apply" to validate
5. See the discounted price reflected in the pricing cards

## Features Implemented

- ✅ Annual plans with 20% savings
- ✅ Monthly/Annual billing toggle
- ✅ Discount code validation
- ✅ Real-time price calculations
- ✅ Savings indicators
- ✅ Tier-specific discounts (e.g., FAMILY30 only works on Family plan)
- ✅ Expiration date checking
- ✅ Usage limit tracking (for future implementation)

## Next Steps

- Integrate with Stripe for actual checkout
- Add discount code management in admin panel
- Implement usage tracking in database
- Add referral discount system
- Create promotional landing pages