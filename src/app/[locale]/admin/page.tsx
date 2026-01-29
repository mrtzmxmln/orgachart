'use client';

import { useEffect } from 'react';
import { useRouter } from '@/navigation';
import { useAuth } from '@/hooks/use-auth';
import { UserTable } from '@/components/admin/user-table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'next-intl';

export default function AdminPage() {
  const t = useTranslations('Admin');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    } else if (user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') {
     return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-4 mb-8">
            <Skeleton className="h-9 w-1/4" />
            <Skeleton className="h-6 w-1/2" />
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ShieldCheck className="h-8 w-8 text-primary" />
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <UserTable />

      <Alert className="mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t('noteTitle')}</AlertTitle>
        <AlertDescription>{t('noteDescription')}</AlertDescription>
      </Alert>
    </div>
  );
}
