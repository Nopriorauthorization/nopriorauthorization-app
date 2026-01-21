// HIPAA Compliance Types and Interfaces
export type ConsentStatus = 'pending' | 'granted' | 'revoked';
export type DataSharingScope = 'none' | 'analytics' | 'providers' | 'research';

export interface HIPAAConsent {
  id: string;
  userId: string;
  consentGiven: boolean;
  consentDate: Date;
  dataSharingScope: DataSharingScope;
  purpose: string;
  retentionPeriod: number; // days
  lastUpdated: Date;
  auditLog: AuditEntry[];
}

export interface AuditEntry {
  id: string;
  timestamp: Date;
  action: 'create' | 'read' | 'update' | 'delete' | 'export';
  userId: string;
  resourceType: string;
  resourceId: string;
  ipAddress?: string;
  userAgent?: string;
}

// Cycle Data Types
export interface CycleEntry {
  id: string;
  userId: string;
  date: Date;
  flowLevel: 1 | 2 | 3 | 4 | 5; // 1=spotting, 5=heavy
  symptoms: Symptom[];
  mood: number; // 1-10 scale
  energy: number; // 1-10 scale
  notes?: string;
  temperature?: number;
  medications: string[];
  activities: string[];
  encryptedData: string; // HIPAA encrypted payload
  createdAt: Date;
  updatedAt: Date;
}

export interface Symptom {
  id: string;
  name: string;
  severity: 1 | 2 | 3 | 4 | 5;
  category: 'physical' | 'emotional' | 'other';
  timestamp: Date;
}

export interface CyclePrediction {
  id: string;
  userId: string;
  nextPeriodStart: Date;
  nextPeriodEnd: Date;
  ovulationDate: Date;
  fertileWindow: { start: Date; end: Date };
  confidence: number; // 0-100
  factors: string[];
  generatedAt: Date;
  modelVersion: string;
}

export interface TreatmentCorrelation {
  id: string;
  userId: string;
  treatmentId: string;
  treatmentDate: Date;
  cyclePhase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  cycleDay: number;
  outcome: string;
  sideEffects: string[];
  notes: string;
  createdAt: Date;
}

export interface GeneticInsight {
  id: string;
  userId: string;
  trait: string;
  riskLevel: 'low' | 'moderate' | 'high';
  recommendation: string;
  source: 'family_history' | 'genetic_markers';
  confidence: number;
  relatedConditions: string[];
  createdAt: Date;
}

// Wearable Integration Types
export interface WearableData {
  id: string;
  userId: string;
  deviceType: 'oura' | 'fitbit' | 'apple_watch' | 'garmin';
  date: Date;
  heartRate?: number;
  sleepHours?: number;
  bodyTemperature?: number;
  activityLevel?: number;
  stressLevel?: number;
  rawData: any; // Encrypted device data
}

// Provider Sharing Types
export interface ProviderShare {
  id: string;
  userId: string;
  providerId: string;
  providerName: string;
  sharedDataTypes: ('cycles' | 'symptoms' | 'predictions' | 'genetics')[];
  shareStartDate: Date;
  shareEndDate?: Date;
  isActive: boolean;
  consentGiven: boolean;
  createdAt: Date;
}

// Emergency Access Types
export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface EmergencyAccess {
  id: string;
  userId: string;
  emergencyContactId: string;
  accessGranted: boolean;
  accessReason: string;
  grantedBy: string;
  grantedAt: Date;
  expiresAt?: Date;
}

// Analytics and Insights Types
export interface CycleAnalytics {
  userId: string;
  averageCycleLength: number;
  cycleRegularity: number; // 0-100
  averagePeriodLength: number;
  commonSymptoms: Symptom[];
  moodPatterns: { phase: string; averageMood: number }[];
  energyPatterns: { phase: string; averageEnergy: number }[];
  treatmentImpacts: TreatmentCorrelation[];
  lastCalculated: Date;
}

export interface FertilityInsights {
  userId: string;
  currentFertilityStatus: 'low' | 'moderate' | 'high' | 'peak';
  nextFertileWindow: { start: Date; end: Date };
  ovulationLikelihood: number;
  factors: string[];
  recommendations: string[];
  generatedAt: Date;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  auditId: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface DataValidation {
  field: string;
  rule: string;
  value: any;
  isValid: boolean;
  message?: string;
}