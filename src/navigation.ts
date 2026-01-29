import {createLocalizedPathnamesNavigation} from 'next-intl/navigation';

export const locales = ['en', 'de'] as const;
export const localePrefix = 'as-needed';

export const pathnames = {
  '/': '/',
  '/login': '/login',
  '/signup': '/signup',
  '/dashboard': '/dashboard',
  '/admin': '/admin'
} satisfies Record<string, any>;

export const {Link, redirect, usePathname, useRouter} =
  createLocalizedPathnamesNavigation({locales, localePrefix, pathnames});