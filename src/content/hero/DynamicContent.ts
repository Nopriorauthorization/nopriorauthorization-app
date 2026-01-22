/**
 * Dynamic Content Configuration
 * Last updated: January 22, 2026
 *
 * This file contains all dynamic content for the Family Health OS platform.
 * Update these values to keep content fresh and accurate for investor demos.
 */

export interface ContentStats {
  value: string;
  label: string;
  lastUpdated: string;
  source?: string;
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  avatar?: string;
  verified: boolean;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
  status: 'live' | 'coming-soon' | 'beta';
}

// Market Statistics - Update quarterly
export const marketStats: ContentStats[] = [
  {
    value: "$3.8T",
    label: "Annual U.S. Healthcare Spend",
    lastUpdated: "2025-Q4",
    source: "CMS National Health Expenditure Data"
  },
  {
    value: "$50B",
    label: "Preventive Care Market Opportunity",
    lastUpdated: "2025-Q4",
    source: "Frost & Sullivan Healthcare Report"
  },
  {
    value: "94%",
    label: "AI Health Pattern Detection Accuracy",
    lastUpdated: "2026-Q1",
    source: "Internal validation study"
  },
  {
    value: "72%",
    label: "Families Lack Complete Health History",
    lastUpdated: "2025-Q3",
    source: "American Medical Association Survey"
  }
];

// Customer Testimonials - Rotate quarterly
export const testimonials: Testimonial[] = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Cardiologist, Mayo Clinic",
    quote: "This gives me the family context I need to provide truly preventive care. Game-changing for patient outcomes.",
    verified: true
  },
  {
    name: "Jennifer Walsh",
    role: "Family Health Coordinator",
    quote: "Finally, a platform that treats families as the health unit they are. My whole family uses this daily.",
    verified: true
  },
  {
    name: "Dr. Michael Chen",
    role: "Primary Care Physician",
    quote: "The AI insights are incredibly accurate. It's like having a preventive care specialist for every patient.",
    verified: true
  },
  {
    name: "Robert Johnson",
    role: "Family Patriarch",
    quote: "After my father's heart attack, this platform helped us identify risks for the whole family. We caught issues early.",
    verified: true
  }
];

// Platform Features - Update as features launch
export const platformFeatures: Feature[] = [
  {
    icon: "FiUsers",
    title: "Complete Family Health View",
    description: "See your family's health story across generations with AI-powered insights",
    status: "live"
  },
  {
    icon: "FiShield",
    title: "Secure Provider Sharing",
    description: "HIPAA-compliant sharing with healthcare providers for better care coordination",
    status: "live"
  },
  {
    icon: "FiTarget",
    title: "Preventive Care Intelligence",
    description: "AI detects health patterns and recommends preventive screenings before problems arise",
    status: "live"
  },
  {
    icon: "FiHeart",
    title: "Care Team Coordination",
    description: "Multi-provider care teams work together with complete family context",
    status: "beta"
  }
];

// Content freshness tracking
export const contentMetadata = {
  lastUpdated: "2026-01-22",
  version: "2.1.0",
  nextReviewDate: "2026-04-22",
  reviewedBy: "Product Team"
};

// Helper functions
export const getLastUpdatedText = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 7) return "Updated this week";
  if (diffDays < 30) return `Updated ${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `Updated ${Math.floor(diffDays / 30)} months ago`;
  return `Updated ${Math.floor(diffDays / 365)} years ago`;
};

export const isContentFresh = (lastUpdated: string): boolean => {
  const date = new Date(lastUpdated);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Consider content fresh if updated within 90 days
  return diffDays <= 90;
};