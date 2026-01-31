'use client';

import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (pathname === '/orgachart') {
    return null;
  }

  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} OrgaChart by Organic Concepts</p>
          <nav className="flex items-center gap-4">
            <Link href="/imprint" className="hover:text-primary">
              Impressum
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
