export interface SmartDefaults {
  documentTypes: string[];
  timelineCategories: string[];
  familyRelationships: string[];
  providerSpecialties: string[];
  labTestCategories: string[];
}

export const DEFAULT_DOCUMENT_TYPES = [
  'Insurance Card',
  'Driver License',
  'Medical Records',
  'Prescription',
  'Lab Results',
  'Imaging Reports',
  'Discharge Summary',
  'Vaccination Record'
];

export const DEFAULT_TIMELINE_CATEGORIES = [
  'Medical Visit',
  'Lab Test',
  'Medication',
  'Symptom',
  'Lifestyle Change',
  'Milestone',
  'Emergency',
  'Surgery'
];

export const DEFAULT_FAMILY_RELATIONSHIPS = [
  'Parent',
  'Child',
  'Sibling',
  'Spouse',
  'Grandparent',
  'Grandchild',
  'Aunt/Uncle',
  'Niece/Nephew',
  'Cousin'
];

export const DEFAULT_PROVIDER_SPECIALTIES = [
  'Primary Care',
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Neurology',
  'Obstetrics/Gynecology',
  'Oncology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Radiology'
];

export const DEFAULT_LAB_CATEGORIES = [
  'Blood Work',
  'Urine Analysis',
  'Imaging',
  'Cardiac Tests',
  'Hormone Panels',
  'Allergy Testing',
  'Genetic Testing',
  'Microbiology'
];

export function getSmartDefaults(userContext?: {
  age?: number;
  gender?: string;
  hasChildren?: boolean;
  hasChronicConditions?: boolean;
}): SmartDefaults {
  const defaults: SmartDefaults = {
    documentTypes: [...DEFAULT_DOCUMENT_TYPES],
    timelineCategories: [...DEFAULT_TIMELINE_CATEGORIES],
    familyRelationships: [...DEFAULT_FAMILY_RELATIONSHIPS],
    providerSpecialties: [...DEFAULT_PROVIDER_SPECIALTIES],
    labTestCategories: [...DEFAULT_LAB_CATEGORIES],
  };

  // Customize based on user context
  if (userContext) {
    // Age-based customizations
    if (userContext.age) {
      if (userContext.age < 18) {
        // Teen/young adult priorities
        defaults.documentTypes.unshift('School Health Records', 'Immunization Records');
        defaults.providerSpecialties.unshift('Pediatrics', 'Adolescent Medicine');
        defaults.labTestCategories.unshift('Growth Hormones', 'Vitamin D');
      } else if (userContext.age > 65) {
        // Senior priorities
        defaults.documentTypes.unshift('Medicare Card', 'Power of Attorney');
        defaults.providerSpecialties.unshift('Geriatrics', 'Cardiology');
        defaults.labTestCategories.unshift('Bone Density', 'Cholesterol Panel');
      }
    }

    // Gender-based customizations
    if (userContext.gender === 'female') {
      defaults.providerSpecialties.unshift('Obstetrics/Gynecology', 'Mammography');
      defaults.labTestCategories.unshift('Pap Smear', 'Mammogram');
      defaults.timelineCategories.unshift('Menstrual Cycle', 'Pregnancy');
    }

    // Family-based customizations
    if (userContext.hasChildren) {
      defaults.familyRelationships.unshift('Child', 'Spouse');
      defaults.providerSpecialties.unshift('Pediatrics', 'Family Medicine');
    }

    // Health condition customizations
    if (userContext.hasChronicConditions) {
      defaults.providerSpecialties.unshift('Internal Medicine', 'Specialty Care');
      defaults.labTestCategories.unshift('Chronic Disease Monitoring', 'Medication Levels');
    }
  }

  // Remove duplicates and limit to top recommendations
  Object.keys(defaults).forEach(key => {
    const arrayKey = key as keyof SmartDefaults;
    defaults[arrayKey] = [...new Set(defaults[arrayKey])].slice(0, 8);
  });

  return defaults;
}

export function getRecommendedNextSteps(userProgress: {
  hasDocuments: boolean;
  hasTimelineEntries: boolean;
  hasFamilyData: boolean;
  hasSharedWithProviders: boolean;
}): Array<{
  id: string;
  title: string;
  description: string;
  action: string;
  priority: number;
}> {
  const steps = [];

  if (!userProgress.hasDocuments) {
    steps.push({
      id: 'upload-documents',
      title: 'Upload Your First Documents',
      description: 'Start building your health foundation with insurance cards and medical records',
      action: '/vault/personal-documents',
      priority: 1,
    });
  }

  if (!userProgress.hasTimelineEntries && userProgress.hasDocuments) {
    steps.push({
      id: 'create-timeline',
      title: 'Build Your Health Timeline',
      description: 'Add your medical history, symptoms, and important health events',
      action: '/rich-health-timeline',
      priority: 2,
    });
  }

  if (!userProgress.hasFamilyData && userProgress.hasTimelineEntries) {
    steps.push({
      id: 'connect-family',
      title: 'Connect with Family',
      description: 'Link your health data with family members for better insights',
      action: '/vault/family-tree',
      priority: 3,
    });
  }

  if (!userProgress.hasSharedWithProviders && userProgress.hasDocuments) {
    steps.push({
      id: 'share-with-providers',
      title: 'Share with Healthcare Providers',
      description: 'Securely share relevant information with your care team',
      action: '/vault/provider-portal',
      priority: 4,
    });
  }

  return steps.sort((a, b) => a.priority - b.priority);
}