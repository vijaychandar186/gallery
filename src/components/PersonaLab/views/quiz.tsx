'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Scatter,
  ScatterChart,
  ZAxis,
  type ScatterShapeProps
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart';
import {
  classifyDetailed,
  type PersonalityType,
  type ClassifyDetail
} from '@/lib/personality-classifier';
import { DATASET } from '@/data/personality-dataset';
import { quizSchema, type QuizFormValues } from '../schema';
import {
  OCEAN_TRAITS,
  QUIZ_FIELDS,
  RESULT_CHART_INDEX,
  PERSONALITY_TYPES,
  type OceanKey
} from '../config';
import type { View } from '../types';

interface QuizViewProps {
  onNavigate: (view: View) => void;
}

export function QuizView({ onNavigate }: QuizViewProps) {
  const t = useTranslations('personaLab.quiz');
  const tResults = useTranslations('personaLab.results');

  const [detail, setDetail] = useState<(ClassifyDetail & { input: QuizFormValues }) | null>(null);

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: { gender: 'Male' }
  });

  function onSubmit(values: QuizFormValues) {
    const result = classifyDetailed(values);
    setDetail({ ...result, input: values });
  }

  return (
    <div className='min-w-0 space-y-6 overflow-x-hidden'>
      <Card className='border-border'>
        <CardHeader>
          <CardTitle className='text-lg'>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='gender'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='uppercase tracking-wide text-muted-foreground'>
                    {t('gender')}
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className='h-9 w-full text-sm'>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='Male'>{t('male')}</SelectItem>
                      <SelectItem value='Female'>{t('female')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='age'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='uppercase tracking-wide text-muted-foreground'>
                    {t('age')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min={13}
                      max={100}
                      placeholder={t('agePlaceholder')}
                      className='h-9 text-sm'
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className='space-y-3'>
            {QUIZ_FIELDS.map((key) => (
              <FormField
                key={key}
                control={form.control}
                name={key}
                render={({ field }) => (
                  <FormItem className='flex items-start gap-3 space-y-0'>
                    <div className='min-w-0 flex-1'>
                      <FormLabel>{t(`fields.${key}.label`)}</FormLabel>
                      <p className='text-xs text-muted-foreground'>{t(`fields.${key}.hint`)}</p>
                      <FormMessage />
                    </div>
                    <div className='shrink-0' style={{ width: '4rem' }}>
                      <FormControl>
                        <Input
                          type='number'
                          min={1}
                          max={8}
                          placeholder='1–8'
                          className='h-9 w-full text-center text-sm'
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            ))}
          </div>

          <Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
            {t('submit')}
          </Button>
        </form>
      </Form>

      {detail && (
        <ResultSection
          detail={detail}
          tResult={tResults}
          tQuiz={t}
          onLearnMore={() => onNavigate('traits')}
        />
      )}
    </div>
  );
}

interface ResultSectionProps {
  detail: ClassifyDetail & { input: QuizFormValues };
  tResult: ReturnType<typeof useTranslations<'personaLab.results'>>;
  tQuiz: ReturnType<typeof useTranslations<'personaLab.quiz'>>;
  onLearnMore: () => void;
}

function ResultSection({ detail, tResult, tQuiz, onLearnMore }: ResultSectionProps) {
  const { type, votes, input } = detail;
  const chartIndex = RESULT_CHART_INDEX[type];

  return (
    <div className='min-w-0 space-y-4'>
      <ResultCard type={type} tResult={tResult} tQuiz={tQuiz} onLearnMore={onLearnMore} />
      <OceanRadar input={input} tQuiz={tQuiz} />
      <VoteBreakdown votes={votes} tResult={tResult} tQuiz={tQuiz} winnerIndex={chartIndex} />
      <DatasetScatter input={input} tQuiz={tQuiz} />
    </div>
  );
}

function ResultCard({
  type,
  tResult,
  tQuiz,
  onLearnMore
}: {
  type: PersonalityType;
  tResult: ResultSectionProps['tResult'];
  tQuiz: ResultSectionProps['tQuiz'];
  onLearnMore: () => void;
}) {
  const chartIndex = RESULT_CHART_INDEX[type];
  return (
    <Card
      className='overflow-hidden border-border'
      style={{ borderTopColor: `var(--chart-${chartIndex})`, borderTopWidth: 3 }}
    >
      <CardHeader className='pb-2'>
        <p className='text-xs font-medium uppercase tracking-widest text-muted-foreground'>
          {tQuiz('resultLabel')}
        </p>
        <CardTitle className='text-3xl font-black' style={{ color: `var(--chart-${chartIndex})` }}>
          {tResult(`${type}.label`)}
        </CardTitle>
        <CardDescription className='text-sm font-medium text-foreground/80'>
          {tResult(`${type}.tagline`)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className='text-sm leading-relaxed text-muted-foreground'>{tResult(`${type}.detail`)}</p>
        <Button variant='ghost' size='sm' className='mt-4 text-xs' onClick={onLearnMore}>
          {tQuiz('learnMore')}
        </Button>
      </CardContent>
    </Card>
  );
}

const RADAR_CHART_CONFIG: ChartConfig = {
  score: { label: 'Score', color: 'var(--chart-1)' }
};

function OceanRadar({
  input,
  tQuiz
}: {
  input: QuizFormValues;
  tQuiz: ResultSectionProps['tQuiz'];
}) {
  const data = OCEAN_TRAITS.map((t) => ({
    trait: t.short,
    score: input[t.key],
    fullMark: 8
  }));

  return (
    <Card className='overflow-hidden border-border'>
      <CardHeader className='pb-1'>
        <CardTitle className='text-sm font-semibold'>{tQuiz('yourProfile')}</CardTitle>
      </CardHeader>
      <CardContent className='px-2 pb-2'>
        <ChartContainer config={RADAR_CHART_CONFIG} className='h-56 w-full'>
          <RadarChart
            data={data}
            margin={{ top: 8, right: 24, bottom: 8, left: 24 }}
            outerRadius='65%'
          >
            <PolarGrid />
            <PolarAngleAxis
              dataKey='trait'
              tick={{ fontSize: 12, fontWeight: 700, fill: 'var(--foreground)' }}
            />
            <Radar
              dataKey='score'
              stroke='var(--chart-1)'
              fill='var(--chart-1)'
              fillOpacity={0.25}
              dot={{ r: 3, fill: 'var(--chart-1)' }}
            />
            <ChartTooltip
              content={<ChartTooltipContent hideLabel indicator='line' />}
              cursor={false}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function VoteBreakdown({
  votes,
  tResult,
  tQuiz,
  winnerIndex
}: {
  votes: Record<PersonalityType, number>;
  tResult: ResultSectionProps['tResult'];
  tQuiz: ResultSectionProps['tQuiz'];
  winnerIndex: number;
}) {
  const data = PERSONALITY_TYPES.map((type) => {
    const idx = RESULT_CHART_INDEX[type];
    return {
      type,
      label: tResult(`${type}.label`),
      votes: votes[type],
      fill: `var(--chart-${idx})`,
      fillOpacity: idx === winnerIndex ? 1 : 0.4
    };
  }).sort((a, b) => b.votes - a.votes);

  const voteConfig: ChartConfig = Object.fromEntries(
    PERSONALITY_TYPES.map((type) => [
      type,
      { label: tResult(`${type}.label`), color: `var(--chart-${RESULT_CHART_INDEX[type]})` }
    ])
  );

  return (
    <Card className='overflow-hidden border-border'>
      <CardHeader className='pb-1'>
        <CardTitle className='text-sm font-semibold'>{tQuiz('neighborVotes')}</CardTitle>
        <CardDescription className='text-xs'>{tQuiz('neighborVotesDesc')}</CardDescription>
      </CardHeader>
      <CardContent className='px-2 pb-2'>
        <ChartContainer config={voteConfig} className='h-36 w-full'>
          <BarChart data={data} layout='vertical' margin={{ left: 8, right: 8 }}>
            <CartesianGrid horizontal={false} />
            <XAxis type='number' domain={[0, 7]} ticks={[0, 1, 2, 3, 4, 5, 6, 7]} hide />
            <YAxis
              type='category'
              dataKey='label'
              width={82}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip
              content={<ChartTooltipContent hideLabel indicator='line' />}
              cursor={false}
            />
            <Bar dataKey='votes' radius={4} maxBarSize={22} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const AXIS_OPTIONS: { key: OceanKey; dataKey: 'o' | 'n' | 'c' | 'a' | 'e' }[] = [
  { key: 'openness', dataKey: 'o' },
  { key: 'conscientiousness', dataKey: 'c' },
  { key: 'extraversion', dataKey: 'e' },
  { key: 'agreeableness', dataKey: 'a' },
  { key: 'neuroticism', dataKey: 'n' }
];

function DatasetScatter({
  input,
  tQuiz
}: {
  input: QuizFormValues;
  tQuiz: ResultSectionProps['tQuiz'];
}) {
  const tResults = useTranslations('personaLab.results');
  const [xKey, setXKey] = useState<OceanKey>('extraversion');
  const [yKey, setYKey] = useState<OceanKey>('openness');

  const xDataKey = AXIS_OPTIONS.find((o) => o.key === xKey)!.dataKey;
  const yDataKey = AXIS_OPTIONS.find((o) => o.key === yKey)!.dataKey;

  const byType = PERSONALITY_TYPES.reduce(
    (acc, type) => {
      acc[type] = DATASET.filter((r) => r.label === type).map((r) => ({
        x: 9 - r[xDataKey],
        y: 9 - r[yDataKey]
      }));
      return acc;
    },
    {} as Record<PersonalityType, { x: number; y: number }[]>
  );

  const userPoint = [{ x: input[xKey], y: input[yKey] }];

  const scatterConfig: ChartConfig = {
    ...Object.fromEntries(
      PERSONALITY_TYPES.map((type) => [
        type,
        { label: tResults(`${type}.label`), color: `var(--chart-${RESULT_CHART_INDEX[type]})` }
      ])
    ),
    you: { label: tQuiz('youLabel'), color: 'var(--foreground)' }
  };

  const tFields = useTranslations('personaLab.quiz.fields');

  return (
    <Card className='overflow-hidden border-border'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-semibold'>{tQuiz('scatterTitle')}</CardTitle>
        <CardDescription className='text-xs'>{tQuiz('scatterDesc')}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-3 px-3 pb-3'>
        <div className='grid grid-cols-2 gap-2 text-xs'>
          {(
            [
              ['xAxis', xKey, setXKey],
              ['yAxis', yKey, setYKey]
            ] as const
          ).map(([labelKey, val, setter]) => (
            <label key={labelKey} className='flex min-w-0 flex-col gap-1 text-muted-foreground'>
              <span>{tQuiz(labelKey)}</span>
              <select
                value={val}
                onChange={(e) => setter(e.target.value as OceanKey)}
                className='w-full min-w-0 rounded border border-border bg-background px-1.5 py-0.5 text-foreground'
              >
                {AXIS_OPTIONS.map((o) => {
                  const short = OCEAN_TRAITS.find((t) => t.key === o.key)?.short ?? o.key;
                  return (
                    <option key={o.key} value={o.key}>
                      {short} — {tFields(`${o.key}.label`)}
                    </option>
                  );
                })}
              </select>
            </label>
          ))}
        </div>

        <ChartContainer config={scatterConfig} className='h-64 w-full'>
          <ScatterChart margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              type='number'
              dataKey='x'
              domain={[1, 8]}
              ticks={[1, 2, 3, 4, 5, 6, 7, 8]}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              type='number'
              dataKey='y'
              domain={[1, 8]}
              ticks={[1, 2, 3, 4, 5, 6, 7, 8]}
              tick={{ fontSize: 10 }}
              width={20}
            />
            <ZAxis range={[18, 18]} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name) => (
                    <span className='text-foreground'>
                      {name}: {String(value)}
                    </span>
                  )}
                />
              }
            />
            {PERSONALITY_TYPES.map((type) => (
              <Scatter
                key={type}
                name={type}
                data={byType[type]}
                fill={`var(--chart-${RESULT_CHART_INDEX[type]})`}
                fillOpacity={0.5}
              />
            ))}
            <Scatter
              name='you'
              data={userPoint}
              fill='var(--foreground)'
              fillOpacity={1}
              shape={(props: ScatterShapeProps) => {
                const cx = (props.cx ?? 0) as number;
                const cy = (props.cy ?? 0) as number;
                return (
                  <g>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={7}
                      fill='var(--background)'
                      stroke='var(--foreground)'
                      strokeWidth={2}
                    />
                    <circle cx={cx} cy={cy} r={3} fill='var(--foreground)' />
                  </g>
                );
              }}
            />
          </ScatterChart>
        </ChartContainer>

        <div className='flex flex-wrap gap-3'>
          {PERSONALITY_TYPES.map((type) => (
            <span key={type} className='flex items-center gap-1 text-xs text-muted-foreground'>
              <span
                className='inline-block h-2 w-2 rounded-sm'
                style={{ backgroundColor: `var(--chart-${RESULT_CHART_INDEX[type]})` }}
              />
              {tResults(`${type}.label`)}
            </span>
          ))}
          <span className='flex items-center gap-1 text-xs font-medium text-foreground'>
            <span className='inline-block h-2 w-2 rounded-full border border-foreground' />
            {tQuiz('youLabel')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
