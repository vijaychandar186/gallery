'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SECTION_KEYS = [
  'entropy',
  'patterns',
  'infoGain',
  'salet',
  'secondGuess',
  'hardMode'
] as const;
type SectionKey = (typeof SECTION_KEYS)[number];

export function AboutView() {
  const t = useTranslations('wordleEntropy.about');

  const sections: { key: SectionKey; title: string; body: string }[] = [
    { key: 'entropy', title: t('sections.entropy.title'), body: t('sections.entropy.body') },
    { key: 'patterns', title: t('sections.patterns.title'), body: t('sections.patterns.body') },
    { key: 'infoGain', title: t('sections.infoGain.title'), body: t('sections.infoGain.body') },
    { key: 'salet', title: t('sections.salet.title'), body: t('sections.salet.body') },
    {
      key: 'secondGuess',
      title: t('sections.secondGuess.title'),
      body: t('sections.secondGuess.body')
    },
    { key: 'hardMode', title: t('sections.hardMode.title'), body: t('sections.hardMode.body') }
  ];

  return (
    <div className='space-y-4'>
      <Card className='border-border'>
        <CardHeader>
          <CardTitle className='text-lg'>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
      </Card>

      {sections.map((s) => (
        <Card key={s.key} className='border-border'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base'>{s.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm leading-relaxed text-muted-foreground'>{s.body}</p>
          </CardContent>
        </Card>
      ))}

      <Card className='border-border bg-muted/30'>
        <CardContent className='pt-4'>
          <p className='text-xs leading-relaxed text-muted-foreground'>{t('credit')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
