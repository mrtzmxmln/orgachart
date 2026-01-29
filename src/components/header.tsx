'use client';

import { Link, usePathname, useRouter, locales } from '@/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  ShieldCheck,
  UserPlus,
  Settings,
  Globe,
  Check,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Header() {
  const t = useTranslations('Header');
  const tLang = useTranslations('LanguageSwitcher');
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const isLinkActive = (href: string) => pathname === href;

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return '??';
  };

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const languageSwitcherItems = locales.map((loc) => (
    <DropdownMenuItem key={loc} onClick={() => handleLanguageChange(loc)}>
      <div className="flex items-center justify-between w-full">
        <span>{tLang(loc as 'en' | 'de')}</span>
        {locale === loc && <Check className="h-4 w-4" />}
      </div>
    </DropdownMenuItem>
  ));

  return (
    <header className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-primary">
            OrgaChart
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="hidden sm:flex items-center space-x-1">
              {user && user.hasCompletedSetup && (
                <>
                  <Button
                    asChild
                    variant={isLinkActive('/dashboard') ? 'default' : 'ghost'}
                    size="sm"
                  >
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      {t('dashboard')}
                    </Link>
                  </Button>
                  {user.role === 'admin' && (
                    <Button
                      asChild
                      variant={isLinkActive('/admin') ? 'default' : 'ghost'}
                      size="sm"
                    >
                      <Link href="/admin">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        {t('admin')}
                      </Link>
                    </Button>
                  )}
                </>
              )}
            </nav>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.hasCompletedSetup && (
                    <div className="sm:hidden">
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          {t('dashboard')}
                        </Link>
                      </DropdownMenuItem>
                      {user.role === 'admin' && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin">
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            {t('admin')}
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                    </div>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <Settings className="mr-2 h-4 w-4" />
                      {t('profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Globe className="mr-2 h-4 w-4" />
                      <span>{tLang('placeholder')}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {languageSwitcherItems}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">
                    <LogIn className="md:mr-2" />
                    <span className="hidden md:inline">{t('login')}</span>
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/signup">
                    <UserPlus className="md:mr-2" />
                    <span className="hidden md:inline">{t('signUp')}</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
