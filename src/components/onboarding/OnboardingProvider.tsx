"use client";
import { useOnboarding } from '@/hooks/useOnboarding';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const { showOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();

  return (
    <>
      {children}
      <OnboardingFlow
        isOpen={showOnboarding}
        onComplete={completeOnboarding}
        onSkip={skipOnboarding}
      />
    </>
  );
}