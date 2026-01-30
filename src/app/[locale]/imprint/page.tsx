'use client';

import { useTranslations } from 'next-intl';

export default function ImprintPage() {
  const t = useTranslations('ImprintPage');

  return (
    <div className="container mx-auto max-w-3xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <div className="prose prose-lg text-muted-foreground max-w-none">
          <h2 className="text-xl font-semibold text-foreground">{t('responsibleTitle')}</h2>
          <p>
            Organic Concepts GmbH
            <br />
            Kufsteiner Straße 1<br />
            83088 Kiefersfelden
            <br />
            Deutschland
          </p>

          <h2 className="text-xl font-semibold text-foreground">{t('contactTitle')}</h2>
          <p>
            {t('phone')}: +49 (0) 80 33 / 30 89 8 - 0<br />
            E-Mail: info@organicconcepts.de
          </p>

          <h2 className="text-xl font-semibold text-foreground">{t('representationTitle')}</h2>
          <p>
            {t('representedBy')}: Moritz Bauer
          </p>

          <h2 className="text-xl font-semibold text-foreground">{t('registerTitle')}</h2>
          <p>
            {t('registerCourt')}: Amtsgericht Traunstein
            <br />
            {t('registrationNumber')}: HRB 24850
          </p>

          <h2 className="text-xl font-semibold text-foreground">{t('vatTitle')}</h2>
          <p>
            {t('vatId')}: DE305331654
          </p>
        </div>
      </div>
    </div>
  );
}
