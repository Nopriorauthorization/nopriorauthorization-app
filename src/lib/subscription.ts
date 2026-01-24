import { SubscriptionTier } from '@prisma/client';

export type UserSubscriptionTier = SubscriptionTier;

/**
 * Check if user has access to a specific feature based on their subscription tier
 */
export function hasFeatureAccess(tier: SubscriptionTier, feature: string): boolean {
  switch (feature) {
    // FREE features
    case 'vault_access':
    case 'basic_lab_upload':
    case 'basic_family_tree':
      return true;

    // CORE features
    case 'unlimited_blueprint_insights':
    case 'full_lab_history':
    case 'family_tree_patterns':
    case 'historical_insights':
      return tier === 'CORE' || tier === 'PREMIUM';

    // PREMIUM features
    case 'blueprint_export':
    case 'blueprint_sharing':
    case 'longitudinal_trends':
      return tier === 'PREMIUM';

    default:
      return false;
  }
}

/**
 * Get the maximum number of insights allowed for a tier
 */
export function getMaxInsights(tier: SubscriptionTier): number {
  switch (tier) {
    case 'FREE':
      return 3;
    case 'CORE':
    case 'PREMIUM':
      return Infinity;
    default:
      return 3;
  }
}

/**
 * Check if user can access lab history
 */
export function canAccessLabHistory(tier: SubscriptionTier): boolean {
  return tier === 'CORE' || tier === 'PREMIUM';
}

/**
 * Get the maximum number of lab history results allowed for a tier
 */
export function getMaxLabHistory(tier: SubscriptionTier): number {
  switch (tier) {
    case 'FREE':
      return 3;
    case 'CORE':
    case 'PREMIUM':
      return Infinity;
    default:
      return 3;
  }
}

/**
 * Check if user can access family tree patterns
 */
export function canAccessFamilyPatterns(tier: SubscriptionTier): boolean {
  return tier === 'CORE' || tier === 'PREMIUM';
}

/**
 * Get upgrade prompt message for a specific feature
 */
export function getUpgradePrompt(feature: string): { title: string; message: string; cta: string } {
  switch (feature) {
    case 'blueprint_insights':
      return {
        title: 'Unlock Full Blueprint Intelligence',
        message: 'You\'re seeing your most important insights. Upgrade to view the complete picture and unlock deeper health patterns.',
        cta: 'Upgrade to Core'
      };

    case 'lab_history':
      return {
        title: 'Access Full Lab History',
        message: 'Your recent lab is included. Upgrade to access full lab history and see how your results change over time.',
        cta: 'Upgrade to Core'
      };

    case 'family_patterns':
      return {
        title: 'Discover Family Health Patterns',
        message: 'Deeper family pattern insights are available with Blueprint Intelligence. See connections across generations.',
        cta: 'Upgrade to Core'
      };

    case 'blueprint_export':
      return {
        title: 'Export Your Blueprint',
        message: 'Create PDF summaries of your health insights to share with providers or keep for your records.',
        cta: 'Upgrade to Premium'
      };

    default:
      return {
        title: 'Unlock More Features',
        message: 'Upgrade to access advanced health intelligence features.',
        cta: 'Upgrade Now'
      };
  }
}

/**
 * Check if user is on a paid tier
 */
export function isPaidUser(tier: SubscriptionTier): boolean {
  return tier === 'CORE' || tier === 'PREMIUM';
}

/**
 * Get tier display name
 */
export function getTierDisplayName(tier: SubscriptionTier): string {
  switch (tier) {
    case 'FREE':
      return 'Free';
    case 'CORE':
      return 'Blueprint Intelligence';
    case 'PREMIUM':
      return 'Advanced Intelligence';
    default:
      return 'Free';
  }
}