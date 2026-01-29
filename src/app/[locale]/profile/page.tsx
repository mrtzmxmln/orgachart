'use client';
import ProfileForm from '@/components/auth/profile-form';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from '@/navigation';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const t = useTranslations('ProfilePage');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.replace('/login');
    }
  }, [user, router]);

  if (!user) {
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
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>
      <ProfileForm />
    </div>
  );
}
