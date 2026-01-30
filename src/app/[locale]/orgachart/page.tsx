'use client';

import { useEffect } from 'react';
import { useRouter } from '@/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'next-intl';

export default function OrgaChartPage() {
  const t = useTranslations('OrgaChart');
  const { user, isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading) {
      if (user === null) {
        router.push('/login');
      } else if (user && !user.hasCompletedSetup) {
        router.push('/complete-setup');
      }
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || !user || !user.hasCompletedSetup) {
    return <Skeleton className="h-full w-full" />;
  }

  return (
    <div className="h-full w-full bg-background">
      {user.iframeUrl ? (
        <iframe
          src={user.iframeUrl}
          title={t('chartTitle')}
          className="w-full h-full border-0"
          allowFullScreen
        />
      ) : (
        <div className="container mx-auto flex h-full items-center justify-center p-4 sm:p-6 lg:p-8">
          <Alert className="max-w-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('noChartTitle')}</AlertTitle>
            <AlertDescription>
            {t('noChartDescription')}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
