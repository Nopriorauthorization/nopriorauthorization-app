export type TierType = "starter" | "blueprint" | "family";

export interface TierCapabilities {
  canEditBlueprint: boolean;
  canExportBlueprint: boolean;
  canUseProviderPacket: boolean;
  canUseDocumentsVault: boolean;
  canUseTreatments: boolean;
  canUseDiary: boolean;
  canUseResources: boolean;
  seatLimit: number;
}

export interface TierDefinition {
  id: TierType;
  name: string;
  displayName: string;
  price: number; // Monthly price in dollars
  annualPrice?: number; // Annual price in dollars (optional)
  description: string;
  features: string[];
  capabilities: TierCapabilities;
  cta: string;
  familyPricing?: {
    includedSeats: number;
    additionalSeatPrice: number;
  };
}

export const TIERS: Record<TierType, TierDefinition> = {
  starter: {
    id: "starter",
    name: "Starter",
    displayName: "Starter (Free)",
    price: 0,
    description: "Get started with basic health tracking and expert chat",
    cta: "Start Free",
    features: [
      "Limited mascot chat",
      "Limited Blueprint preview (read-only)",
      "Treatment comparisons",
      "Resource library access",
    ],
    capabilities: {
      canEditBlueprint: false,
      canExportBlueprint: false,
      canUseProviderPacket: false,
      canUseDocumentsVault: false,
      canUseTreatments: false,
      canUseDiary: false,
      canUseResources: true,
      seatLimit: 1,
    },
  },
  blueprint: {
    id: "blueprint",
    name: "Blueprint",
    displayName: "Blueprint",
    price: 29,
    annualPrice: 278, // 29 * 12 * 0.8 = 278.4, rounded down
    description: "Full health authority with Blueprint, documents, and exports",
    cta: "Build My Blueprint",
    features: [
      "Full Blueprint (create & edit)",
      "Export: PDF + copyable text",
      "Provider Packet mode",
      "Documents Vault (upload + share)",
      "Treatments library",
      "Health diary",
      "Resource saving",
      "Expiring/revocable secure links",
    ],
    capabilities: {
      canEditBlueprint: true,
      canExportBlueprint: true,
      canUseProviderPacket: true,
      canUseDocumentsVault: true,
      canUseTreatments: true,
      canUseDiary: true,
      canUseResources: true,
      seatLimit: 1,
    },
  },
  family: {
    id: "family",
    name: "Family Blueprint",
    displayName: "Family Blueprint",
    price: 49,
    annualPrice: 470, // 49 * 12 * 0.8 = 470.4, rounded down
    description: "Manage health for your whole family in one place",
    cta: "Cover My Family",
    features: [
      "Everything in Blueprint",
      "Up to 4 family members included",
      "$10/month per additional member",
      "Family health dashboard",
      "Shared provider packets",
      "Family admin controls",
      "Coordinated care tools",
    ],
    capabilities: {
      canEditBlueprint: true,
      canExportBlueprint: true,
      canUseProviderPacket: true,
      canUseDocumentsVault: true,
      canUseTreatments: true,
      canUseDiary: true,
      canUseResources: true,
      seatLimit: 4,
    },
    familyPricing: {
      includedSeats: 4,
      additionalSeatPrice: 10,
    },
  },
};

export function getTier(tierType: TierType): TierDefinition {
  return TIERS[tierType];
}

export function getTierCapabilities(tierType: TierType): TierCapabilities {
  return TIERS[tierType].capabilities;
}

export function calculateFamilyPrice(memberCount: number): number {
  const familyTier = TIERS.family;
  if (!familyTier.familyPricing) return familyTier.price;

  const { includedSeats, additionalSeatPrice } = familyTier.familyPricing;
  const additionalMembers = Math.max(0, memberCount - includedSeats);
  
  return familyTier.price + (additionalMembers * additionalSeatPrice);
}

export function calculateAnnualSavings(tier: TierDefinition): { annualPrice: number; monthlyEquivalent: number; savings: number; savingsPercent: number } {
  if (!tier.annualPrice) {
    return {
      annualPrice: tier.price * 12,
      monthlyEquivalent: tier.price,
      savings: 0,
      savingsPercent: 0
    };
  }

  const monthlyEquivalent = tier.annualPrice / 12;
  const savings = (tier.price * 12) - tier.annualPrice;
  const savingsPercent = Math.round((savings / (tier.price * 12)) * 100);

  return {
    annualPrice: tier.annualPrice,
    monthlyEquivalent: Math.round(monthlyEquivalent * 100) / 100,
    savings,
    savingsPercent
  };
}

export function isTierUpgrade(currentTier: TierType, targetTier: TierType): boolean {
  const tierOrder: TierType[] = ["starter", "blueprint", "family"];
  return tierOrder.indexOf(targetTier) > tierOrder.indexOf(currentTier);
}
