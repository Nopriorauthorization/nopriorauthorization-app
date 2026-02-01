import { VaultFeature } from '@/app/vault/page';

export type FeatureState = 'available' | 'coming-soon' | 'locked';

export interface ProgressiveFeature extends VaultFeature {
  state: FeatureState;
  unlockCondition?: string;
  priority: number; // Higher priority features unlock first
}

export function getProgressiveFeatures(userData?: {
  hasDocuments?: boolean;
  hasTimelineEntries?: boolean;
  hasFamilyData?: boolean;
  hasSharedWithProviders?: boolean;
  hasAIInsights?: boolean;
}): ProgressiveFeature[] {
  const baseFeatures: Omit<ProgressiveFeature, 'state'>[] = [
    {
      id: 'personal-documents',
      name: 'Personal Documents Vault',
      description: 'Securely store and share insurance cards, IDs, medical records, and important personal documents',
      icon: null, // Will be set by component
      path: '/vault/personal-documents',
      color: 'from-red-500 to-pink-500',
      isLive: true,
      category: 'documents',
      priority: 1,
    },
    {
      id: 'rich-health-timeline',
      name: 'Rich Health Timeline',
      description: 'Upload photos, record voice notes, and attach documents to your health journey',
      icon: null,
      path: '/rich-health-timeline',
      color: 'from-blue-500 to-cyan-500',
      isLive: true,
      category: 'health',
      priority: 2,
    },
    {
      id: 'lab-decoder',
      name: 'Interactive Lab Decoder',
      description: 'AI-powered analysis of medical documents with expert chat assistance',
      icon: null,
      path: '/vault/lab-decoder',
      color: 'from-purple-500 to-indigo-500',
      isLive: true,
      category: 'health',
      priority: 3,
    },
    {
      id: 'family-tree',
      name: 'Family Health Tree',
      description: 'Connect your health data with family medical history and insights',
      icon: null,
      path: '/vault/family-tree',
      color: 'from-green-500 to-emerald-500',
      isLive: true,
      category: 'health',
      priority: 4,
    },
    {
      id: 'provider-portal',
      name: 'Provider Data Sharing',
      description: 'Securely share documents and health data with healthcare providers',
      icon: null,
      path: '/vault/provider-portal',
      color: 'from-orange-500 to-yellow-500',
      isLive: true,
      category: 'collaboration',
      priority: 5,
    },
    {
      id: 'ai-insights',
      name: 'AI Health Insights',
      description: 'Predictive analytics and personalized health recommendations',
      icon: null,
      path: '/vault/ai-insights',
      color: 'from-pink-500 to-rose-500',
      isLive: true,
      category: 'analytics',
      priority: 6,
    }
  ];

  return baseFeatures.map(feature => {
    let state: FeatureState = 'available';
    let unlockCondition = '';

    // More permissive unlock logic - most features are available by default
    if (feature.priority === 1) {
      // Personal Documents is always available as the entry point
      state = 'available';
    } else if (feature.priority === 2) {
      // Timeline is available but benefits from having documents
      state = 'available';
    } else if (feature.priority === 3) {
      // Lab Decoder requires some documents to be useful
      if (!userData?.hasDocuments) {
        state = 'coming-soon';
        unlockCondition = 'Upload some medical documents to analyze';
      }
    } else if (feature.priority === 4) {
      // Family Tree is available by default
      state = 'available';
    } else if (feature.priority === 5) {
      // Provider Portal is available by default
      state = 'available';
    } else if (feature.priority === 6) {
      // AI Insights requires some data to analyze
      if (!userData?.hasDocuments && !userData?.hasTimelineEntries) {
        state = 'coming-soon';
        unlockCondition = 'Add some health data for AI analysis';
      }
    }

    return {
      ...feature,
      state,
      unlockCondition,
    };
  });
}

export function getNextRecommendedFeature(features: ProgressiveFeature[]): ProgressiveFeature | null {
  const availableFeatures = features.filter(f => f.state === 'available');
  const comingSoonFeatures = features.filter(f => f.state === 'coming-soon');

  // Return the highest priority available feature
  if (availableFeatures.length > 0) {
    return availableFeatures.sort((a, b) => a.priority - b.priority)[0];
  }

  // Or the next feature that will unlock
  if (comingSoonFeatures.length > 0) {
    return comingSoonFeatures.sort((a, b) => a.priority - b.priority)[0];
  }

  return null;
}