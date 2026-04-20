'use client';

import { useTranslations } from 'next-intl';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { DATASET } from '@/data/personality-dataset';
import { OCEAN_TRAITS, PERSONALITY_TYPES, RESULT_CHART_INDEX } from '../config';
import type { ChartConfig } from '@/components/ui/chart';

function buildDistribution(t: ReturnType<typeof useTranslations<'personaLab.results'>>) {
  const counts: Record<string, number> = {};
  for (const row of DATASET) counts[row.label] = (counts[row.label] ?? 0) + 1;
  return PERSONALITY_TYPES.map((type) => ({
    type,
    label: t(`${type}.label`),
    count: counts[type] ?? 0,
    fill: `var(--chart-${RESULT_CHART_INDEX[type]})`
  }));
}

export function TraitsView() {
  const t = useTranslations('personaLab.traits');
  const tResults = useTranslations('personaLab.results');

  const distribution = buildDistribution(tResults);

  const chartConfig: ChartConfig = Object.fromEntries(
    PERSONALITY_TYPES.map((type) => [
      type,
      { label: tResults(`${type}.label`), color: `var(--chart-${RESULT_CHART_INDEX[type]})` }
    ])
  );

  return (
    <div className='space-y-4'>
      <Card className='border-border'>
        <CardHeader>
          <CardTitle className='text-lg'>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
      </Card>

      {OCEAN_TRAITS.map((trait, i) => (
        <Card key={trait.key} className='border-border'>
          <CardHeader className='flex flex-row items-start gap-3 pb-2'>
            <span
              className='flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sm font-black text-white'
              style={{ backgroundColor: `var(--chart-${i + 1})` }}
            >
              {trait.short}
            </span>
            <CardTitle className='text-base'>{t(`ocean.${trait.key}.name`)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm leading-relaxed text-muted-foreground'>
              {t(`ocean.${trait.key}.description`)}
            </p>
          </CardContent>
        </Card>
      ))}

      <Card className='overflow-hidden border-border'>
        <CardHeader className='pb-2'>
          <CardTitle className='text-base'>{t('distribution')}</CardTitle>
          <CardDescription>{t('distributionDesc')}</CardDescription>
        </CardHeader>
        <CardContent className='overflow-x-hidden'>
          <ChartContainer config={chartConfig} className='h-52 w-full'>
            <BarChart data={distribution} layout='vertical' margin={{ left: 8, right: 16 }}>
              <CartesianGrid horizontal={false} />
              <XAxis type='number' hide />
              <YAxis
                type='category'
                dataKey='label'
                width={90}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip
                content={<ChartTooltipContent hideLabel indicator='line' />}
                cursor={false}
              />
              <Bar dataKey='count' radius={4} maxBarSize={28} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className='border-border bg-muted/30'>
        <CardContent className='pt-4'>
          <p className='text-xs leading-relaxed text-muted-foreground'>{t('disclaimer')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
