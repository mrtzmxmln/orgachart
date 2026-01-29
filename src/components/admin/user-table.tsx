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
import type { User } from '@/lib/data';
import { Card } from '../ui/card';
import { useTranslations } from 'next-intl';

export function UserTable() {
  const t = useTranslations('UserTable');
  const { allUsers } = useAuth();

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('email')}</TableHead>
            <TableHead>{t('role')}</TableHead>
            <TableHead>{t('chartUrl')}</TableHead>
            <TableHead className="text-right">{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allUsers.map((user: User) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.email}</TableCell>
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
                <AssignIframeDialog user={user} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
