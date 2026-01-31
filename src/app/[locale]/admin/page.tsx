'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { UserTable } from '@/components/admin/user-table';
import { ShieldCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPage() {
  const { user, isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading) {
      if (user === null) {
        router.push('/login');
      } else if (user.role !== 'admin') {
        router.push('/orgachart');
      }
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || !user || user.role !== 'admin') {
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
          Admin-Bereich
        </h1>
        <p className="text-muted-foreground">Verwalten Sie Benutzer und deren Diagrammzuweisungen.</p>
      </div>

      <UserTable />
    </div>
  );
}
