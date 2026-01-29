'use client';

import { useEffect } from 'react';
import { useRouter } from '@/navigation';
import { useAuth } from '@/hooks/use-auth';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const t = useTranslations('Dashboard');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-4 mb-8">
            <Skeleton className="h-9 w-1/4" />
            <Skeleton className="h-6 w-1/2" />
        </div>
        <Skeleton className="aspect-video w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('welcome', {email: user.email})}
        </p>
      </div>

      {user.iframeUrl ? (
        <Card className="overflow-hidden shadow-lg">
          <CardContent className="p-0 aspect-video">
            <iframe
              src={user.iframeUrl}
              title={t('chartTitle')}
              className="w-full h-full border-0"
              allowFullScreen
            />
          </CardContent>
        </Card>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('noChartTitle')}</AlertTitle>
          <AlertDescription>
           {t('noChartDescription')}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
