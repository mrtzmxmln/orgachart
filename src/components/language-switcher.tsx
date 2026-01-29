'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname, locales } from '@/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleChange = (value: string) => {
    router.replace(pathname, { locale: value });
  };

  return (
    <Select onValueChange={handleChange} defaultValue={locale}>
      <SelectTrigger className="w-auto gap-2 border-none !bg-transparent shadow-none">
        <Globe />
        <SelectValue placeholder={t('placeholder')} />
      </SelectTrigger>
      <SelectContent>
        {locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {t(loc as 'en' | 'de')}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
