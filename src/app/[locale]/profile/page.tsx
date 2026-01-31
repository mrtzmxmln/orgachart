'use client';
import ProfileForm from '@/components/auth/profile-form';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { user, isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && user === null) {
      router.replace('/login');
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || !user) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-3xl">
        <div className="space-y-4 mb-8">
            <Skeleton className="h-9 w-1/4" />
            <Skeleton className="h-6 w-1/2" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-3xl">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profileinstellungen</h1>
        <p className="text-muted-foreground">Verwalten Sie Ihre Kontoeinstellungen und persönlichen Informationen.</p>
      </div>
      <ProfileForm />
    </div>
  );
}
