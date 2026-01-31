'use client';

import CompleteSetupForm from '@/components/auth/complete-setup-form';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function CompleteSetupPage() {
  const { user, isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading) {
      if (user === null) {
        router.replace('/login');
      } else if (user && user.hasCompletedSetup) {
        router.replace('/orgachart');
      }
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || !user || user.hasCompletedSetup) {
    return (
        <div className="flex items-center justify-center min-h-full py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <CompleteSetupForm />
      </div>
    </div>
  );
}
