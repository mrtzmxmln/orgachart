'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { AssignIframeDialog } from './assign-iframe-dialog';
import { Card } from '../ui/card';
import { useTranslations } from 'next-intl';
import { EditUserDialog } from './edit-user-dialog';
import { Skeleton } from '../ui/skeleton';

export function UserTable() {
  const t = useTranslations('UserTable');
  const { allUsers, isUsersLoading } = useAuth();

  if (isUsersLoading) {
    return (
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('user')}</TableHead>
              <TableHead>{t('role')}</TableHead>
              <TableHead>{t('chartUrl')}</TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(3)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    )
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('user')}</TableHead>
            <TableHead>{t('role')}</TableHead>
            <TableHead>{t('chartUrl')}</TableHead>
            <TableHead className="text-right">{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                 <div className="font-medium">{user.firstName} {user.lastName}</div>
                 <div className="text-sm text-muted-foreground">{user.email}</div>
              </TableCell>
              <TableCell>
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                {user.iframeUrl ? (
                  <a
                    href={user.iframeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate block max-w-xs"
                  >
                    {user.iframeUrl}
                  </a>
                ) : (
                  <span className="text-muted-foreground">{t('notSet')}</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end items-center gap-2">
                  <AssignIframeDialog user={user} />
                  <EditUserDialog user={user} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
