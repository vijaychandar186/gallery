import { z } from 'zod';

const traitScore = z.number({ error: 'Required' }).int().min(1, 'Min 1').max(8, 'Max 8');

export const quizSchema = z.object({
  gender: z.enum(['Male', 'Female']),
  age: z.number({ error: 'Required' }).int().min(13, 'Min age 13').max(100, 'Max age 100'),
  openness: traitScore,
  neuroticism: traitScore,
  conscientiousness: traitScore,
  agreeableness: traitScore,
  extraversion: traitScore
});

export type QuizFormValues = z.infer<typeof quizSchema>;
