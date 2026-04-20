import { DATASET } from '@/data/personality-dataset';

export type PersonalityType = 'extraverted' | 'serious' | 'responsible' | 'lively' | 'dependable';

export interface QuizInput {
  gender: 'Male' | 'Female';
  age: number;
  openness: number;
  neuroticism: number;
  conscientiousness: number;
  agreeableness: number;
  extraversion: number;
}

const FEATURE_MIN = [0, 17, 1, 1, 1, 1, 1];
const FEATURE_MAX = [1, 28, 8, 8, 8, 8, 8];
const K = 7;

function scale(features: number[]): number[] {
  return features.map((v, i) => (v - FEATURE_MIN[i]) / (FEATURE_MAX[i] - FEATURE_MIN[i]));
}

function dist(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((sum, v, i) => sum + (v - b[i]) ** 2, 0));
}

function vote(labels: PersonalityType[]): PersonalityType {
  const tally: Partial<Record<PersonalityType, number>> = {};
  for (const l of labels) tally[l] = (tally[l] ?? 0) + 1;
  return Object.entries(tally).reduce((a, b) => (a[1]! >= b[1]! ? a : b))[0] as PersonalityType;
}

function buildQuery(input: QuizInput): number[] {
  const age = Math.min(28, Math.max(17, input.age));
  return scale([
    input.gender === 'Male' ? 1 : 0,
    age,
    9 - input.openness,
    9 - input.neuroticism,
    9 - input.conscientiousness,
    9 - input.agreeableness,
    9 - input.extraversion
  ]);
}

export function classify(input: QuizInput): PersonalityType {
  const query = buildQuery(input);
  const neighbors = DATASET.map((row) => ({
    label: row.label,
    d: dist(query, scale([row.g, row.age, row.o, row.n, row.c, row.a, row.e]))
  }))
    .sort((a, b) => a.d - b.d)
    .slice(0, K)
    .map((n) => n.label);

  return vote(neighbors);
}

export interface ClassifyDetail {
  type: PersonalityType;
  votes: Record<PersonalityType, number>;
}

export function classifyDetailed(input: QuizInput): ClassifyDetail {
  const query = buildQuery(input);
  const neighbors = DATASET.map((row) => ({
    label: row.label,
    d: dist(query, scale([row.g, row.age, row.o, row.n, row.c, row.a, row.e]))
  }))
    .sort((a, b) => a.d - b.d)
    .slice(0, K)
    .map((n) => n.label);

  const tally: Partial<Record<PersonalityType, number>> = {};
  for (const l of neighbors) tally[l] = (tally[l] ?? 0) + 1;

  const votes: Record<PersonalityType, number> = {
    extraverted: tally.extraverted ?? 0,
    serious: tally.serious ?? 0,
    responsible: tally.responsible ?? 0,
    lively: tally.lively ?? 0,
    dependable: tally.dependable ?? 0
  };

  const type = Object.entries(votes).reduce((a, b) => (a[1] >= b[1] ? a : b))[0] as PersonalityType;

  return { type, votes };
}
