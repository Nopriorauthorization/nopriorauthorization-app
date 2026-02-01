"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function useOnboarding() {
  const { data: session, status } = useSession();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          // Check if user has completed onboarding
          const response = await fetch('/api/user/onboarding-status');
          const data = await response.json();

          if (!data.onboardingCompleted) {
            setShowOnboarding(true);
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error);
        }
      }
      setIsLoading(false);
    };

    if (status !== 'loading') {
      checkOnboardingStatus();
    }
  }, [session, status]);

  const completeOnboarding = async () => {
    try {
      await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      setShowOnboarding(false);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const skipOnboarding = () => {
    setShowOnboarding(false);
  };

  return {
    showOnboarding,
    isLoading,
    completeOnboarding,
    skipOnboarding,
  };
}