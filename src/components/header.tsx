'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isLinkActive = (href: string) => pathname === href;

  return (
    <header className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-2xl font-bold text-primary"
          >
            iFrame Manager
          </Link>
          <nav className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <>
                <Button
                  asChild
                  variant={isLinkActive('/dashboard') ? 'default' : 'ghost'}
                  size="sm"
                >
                  <Link href="/dashboard">
                    <LayoutDashboard className="md:mr-2" />
                    <span className="hidden md:inline">Dashboard</span>
                  </Link>
                </Button>
                {user.role === 'admin' && (
                  <Button
                    asChild
                    variant={isLinkActive('/admin') ? 'default' : 'ghost'}
                    size="sm"
                  >
                    <Link href="/admin">
                      <ShieldCheck className="md:mr-2" />
                      <span className="hidden md:inline">Admin</span>
                    </Link>
                  </Button>
                )}
                <Button onClick={logout} variant="outline" size="sm">
                  <LogOut className="md:mr-2" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">
                    <LogIn className="md:mr-2" />
                    <span className="hidden md:inline">Login</span>
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/signup">
                    <UserPlus className="md:mr-2" />
                    <span className="hidden md:inline">Sign Up</span>
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
