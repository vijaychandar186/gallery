import { MISS, MISPLACED, EXACT } from '../config';

export function getPattern(guess: string, answer: string): number[] {
  const result = new Array(5).fill(MISS);
  const answerUsed = new Array(5).fill(false);
  const guessUsed = new Array(5).fill(false);

  // Green pass
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) {
      result[i] = EXACT;
      answerUsed[i] = true;
      guessUsed[i] = true;
    }
  }

  // Yellow pass
  for (let i = 0; i < 5; i++) {
    if (guessUsed[i]) continue;
    for (let j = 0; j < 5; j++) {
      if (!answerUsed[j] && guess[i] === answer[j]) {
        result[i] = MISPLACED;
        answerUsed[j] = true;
        break;
      }
    }
  }

  return result;
}

export function encodePattern(pattern: number[]): number {
  let code = 0;
  for (let i = 0; i < 5; i++) code += pattern[i] * 3 ** i;
  return code;
}

export function decodePattern(code: number): number[] {
  const pattern: number[] = [];
  for (let i = 0; i < 5; i++) {
    pattern.push(code % 3);
    code = Math.floor(code / 3);
  }
  return pattern;
}

export function filterWords(words: string[], guess: string, pattern: number[]): string[] {
  return words.filter((word) => {
    const p = getPattern(guess, word);
    return p.every((v, i) => v === pattern[i]);
  });
}

export function isAllGreen(pattern: number[]): boolean {
  return pattern.every((v) => v === EXACT);
}

export function entropy(words: string[], guess: string): number {
  if (words.length === 0) return 0;
  const counts = new Map<number, number>();
  for (const w of words) {
    const code = encodePattern(getPattern(guess, w));
    counts.set(code, (counts.get(code) ?? 0) + 1);
  }
  const total = words.length;
  let h = 0;
  for (const c of counts.values()) {
    const p = c / total;
    h -= p * Math.log2(p);
  }
  return h;
}
