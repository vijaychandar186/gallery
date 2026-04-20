'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function AboutView() {
  const t = useTranslations('personaLab.about');

  const sections = ['dataset', 'knn', 'features', 'limitations'] as const;

  return (
    <div className='space-y-4'>
      <Card className='border-border'>
        <CardHeader>
          <CardTitle className='text-lg'>{t('title')}</CardTitle>
          <CardDescription>{t('subtitle')}</CardDescription>
        </CardHeader>
      </Card>

      {sections.map((key) => (
        <Card key={key} className='border-border'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base'>{t(`${key}.title`)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm leading-relaxed text-muted-foreground'>{t(`${key}.body`)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
