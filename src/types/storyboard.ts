export type TreatmentStatus = "current" | "past" | "considering";
export type TreatmentCategory = "treatment" | "medication" | "supplement" | "peptide";

export type TreatmentItem = {
  id: string;
  name: string;
  category: TreatmentCategory;
  status: TreatmentStatus;
  addedAt: string;
  insights: Array<{ expert: string; text: string }>;
  notes: string;
};

export type StoryboardSnapshot = {
  ageRange: string;
  goals: string;
  allergies: string;
  meds: string;
  conditions: string;
  preferences: string;
};
