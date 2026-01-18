import { getTierCapabilities, type TierType } from "./tiers";

export type CapabilityKey = 
  | "canEditBlueprint"
  | "canExportBlueprint"
  | "canUseProviderPacket"
  | "canUseDocumentsVault"
  | "canUseTreatments"
  | "canUseDiary"
  | "canUseResources";

/**
 * Check if a user's tier has a specific capability
 */
export function hasCapability(
  userTier: TierType | undefined,
  capability: CapabilityKey
): boolean {
  // Default to starter (free) tier if no tier is set
  const tier = userTier || "starter";
  const capabilities = getTierCapabilities(tier);
  return capabilities[capability];
}

/**
 * Get the upgrade message for a locked feature
 */
export function getUpgradeMessage(capability: CapabilityKey): string {
  const messages: Record<CapabilityKey, string> = {
    canEditBlueprint: "Upgrade to Blueprint to create and edit your personal health Blueprint.",
    canExportBlueprint: "Upgrade to Blueprint to unlock exports, PDFs, and provider-ready sharing.",
    canUseProviderPacket: "Upgrade to Blueprint to generate and share provider packets.",
    canUseDocumentsVault: "Upgrade to Blueprint to upload, store, and share documents securely.",
    canUseTreatments: "Upgrade to Blueprint to track treatments and build your health history.",
    canUseDiary: "Upgrade to Blueprint to keep a private health diary.",
    canUseResources: "This feature requires an active subscription.",
  };
  
  return messages[capability];
}

/**
 * Get the minimum required tier for a capability
 */
export function getRequiredTier(capability: CapabilityKey): TierType {
  // Most features require blueprint tier
  if (capability === "canUseResources") {
    return "starter";
  }
  return "blueprint";
}

/**
 * Check if user has reached their seat limit (for family plans)
 */
export function hasReachedSeatLimit(
  userTier: TierType | undefined,
  currentSeats: number
): boolean {
  const tier = userTier || "starter";
  const capabilities = getTierCapabilities(tier);
  return currentSeats >= capabilities.seatLimit;
}
