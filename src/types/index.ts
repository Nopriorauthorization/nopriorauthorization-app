export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface UserSession {
  id: string;
  email: string;
  name?: string | null;
  subscriptionStatus: string;
}

export interface SubscriptionStatus {
  isActive: boolean;
  status: string;
  currentPeriodEnd?: Date | null;
}
