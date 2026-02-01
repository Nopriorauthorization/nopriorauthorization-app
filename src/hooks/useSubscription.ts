"use client";
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { SubscriptionTier } from '@prisma/client';

export function useSubscription() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const status = sessionResult?.status || 'loading';
  const [tier, setTier] = useState<SubscriptionTier>('FREE');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptionTier = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          const response = await fetch('/api/user/subscription-tier');
          if (response.ok) {
            const data = await response.json();
            setTier(data.tier);
          }
        } catch (error) {
          console.error('Error fetching subscription tier:', error);
        }
      }
      setIsLoading(false);
    };

    fetchSubscriptionTier();
  }, [session, status]);

  return {
    tier,
    isLoading,
    isPaidUser: tier === 'CORE' || tier === 'PREMIUM',
  };
}