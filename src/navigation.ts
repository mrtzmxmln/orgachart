import {createLocalizedPathnamesNavigation} from 'next-intl/navigation';

export const locales = ['en', 'de'] as const;
export const localePrefix = 'as-needed';

export const pathnames = {
  '/': '/',
  '/login': '/login',
  '/signup': '/signup',
  '/dashboard': '/orgachart',
  '/admin': '/admin',
  '/profile': '/profile',
  '/complete-setup': '/complete-setup',
  '/imprint': '/imprint',
} satisfies Record<string, any>;

export const {Link, redirect, usePathname, useRouter} =
  createLocalizedPathnamesNavigation({locales, localePrefix, pathnames});
