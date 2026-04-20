import { entropy, encodePattern, getPattern } from './pattern';
import { SUGGESTIONS_COUNT } from '../config';
import type { Suggestion } from '../types';

export function getSuggestions(possibles: string[], allowed: string[]): Suggestion[] {
  const possibleSet = new Set(possibles);

  // For large remaining sets, score possible-answer words only
  // For small sets (≤ 50), score all allowed words to find optimal non-answer guesses
  const candidates = possibles.length <= 50 ? allowed : possibles;

  const scored = candidates.map((word) => ({
    word,
    entropy: entropy(possibles, word),
    isAnswer: possibleSet.has(word)
  }));

  scored.sort((a, b) => {
    if (Math.abs(b.entropy - a.entropy) > 0.001) return b.entropy - a.entropy;
    // Prefer answer words as tiebreaker
    return (b.isAnswer ? 1 : 0) - (a.isAnswer ? 1 : 0);
  });

  return scored.slice(0, SUGGESTIONS_COUNT);
}

export function bitsOf(possibles: string[]): number {
  if (possibles.length <= 1) return 0;
  return Math.log2(possibles.length);
}

export function getSecondGuess(
  firstGuess: string,
  pattern: number[],
  secondGuessMap: Record<string, string[]>
): string | null {
  const map = secondGuessMap[firstGuess];
  if (!map) return null;
  const code = encodePattern(pattern);
  return map[code] ?? null;
}

export function avgRemainingAfterGuess(guess: string, possibles: string[]): number {
  const counts = new Map<number, number>();
  for (const w of possibles) {
    const code = encodePattern(getPattern(guess, w));
    counts.set(code, (counts.get(code) ?? 0) + 1);
  }
  let total = 0;
  for (const c of counts.values()) total += c * c;
  return total / possibles.length;
}
