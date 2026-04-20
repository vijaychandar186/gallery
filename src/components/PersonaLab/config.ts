import type { PersonalityType } from '@/lib/personality-classifier';

export type OceanKey =
  | 'openness'
  | 'conscientiousness'
  | 'extraversion'
  | 'agreeableness'
  | 'neuroticism';

export const RESULT_CHART_INDEX: Record<PersonalityType, number> = {
  extraverted: 1,
  serious: 2,
  responsible: 3,
  lively: 4,
  dependable: 5
};

export const OCEAN_TRAITS: Array<{ key: OceanKey; short: string; chartIndex: number }> = [
  { key: 'openness', short: 'O', chartIndex: 1 },
  { key: 'conscientiousness', short: 'C', chartIndex: 2 },
  { key: 'extraversion', short: 'E', chartIndex: 3 },
  { key: 'agreeableness', short: 'A', chartIndex: 4 },
  { key: 'neuroticism', short: 'N', chartIndex: 5 }
];

export const QUIZ_FIELDS: OceanKey[] = [
  'openness',
  'neuroticism',
  'conscientiousness',
  'agreeableness',
  'extraversion'
];

export const PERSONALITY_TYPES: PersonalityType[] = [
  'extraverted',
  'serious',
  'responsible',
  'lively',
  'dependable'
];
