import {createLocalizedPathnamesNavigation} from 'next-intl/navigation';

export const locales = ['en', 'de'] as const;
export const localePrefix = 'as-needed';

export const pathnames = {
  '/': '/',
  '/login': '/login',
  '/signup': '/signup',
  '/dashboard': '/dashboard',
  '/admin': '/admin',
  '/profile': '/profile',
  '/complete-setup': '/complete-setup',
} satisfies Record<string, any>;

export const {Link, redirect, usePathname, useRouter} =
  createLocalizedPathnamesNavigation({locales, localePrefix, pathnames});
