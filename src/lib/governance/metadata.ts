type GovernanceProfile = {
  allergies: string[];
  personalBio: string | null;
  bloodType: string | null;
  primaryHealthGoals: string | null;
  dataPortability: string | null;
};

export function getGovernanceProfile(
  metadata: unknown
): GovernanceProfile {
  const normalized = (metadata && typeof metadata === "object" && !Array.isArray(metadata))
    ? metadata as Record<string, unknown>
    : {};
  return {
    allergies: Array.isArray(normalized.allergies) ? (normalized.allergies as string[]) : [],
    personalBio: typeof normalized.personalBio === "string" ? normalized.personalBio : null,
    bloodType: typeof normalized.bloodType === "string" ? normalized.bloodType : null,
    primaryHealthGoals:
      typeof normalized.primaryHealthGoals === "string"
        ? normalized.primaryHealthGoals
        : null,
    dataPortability:
      typeof normalized.dataPortability === "string"
        ? normalized.dataPortability
        : null,
  };
}
