export type ProviderPacketTemplate = "primary" | "specialist" | "urgent";

export type ProviderPacketTreatment = {
  name: string;
  status?: string;
  notes?: string;
};

export type ProviderPacketPayload = {
  visitReason: string;
  topConcerns: string[];
  questions?: string;
  allergies?: string;
  conditions?: string;
  medications?: string;
  supplements?: string;
  treatments?: ProviderPacketTreatment[];
  labs?: string;
  vitals?: string;
};
