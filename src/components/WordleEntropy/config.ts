export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;
export const SUGGESTIONS_COUNT = 12;
export const FIRST_GUESS = 'salet';

export const MISS = 0;
export const MISPLACED = 1;
export const EXACT = 2;

export const TILE_COLORS: Record<number, string> = {
  [MISS]: 'var(--muted)',
  [MISPLACED]: 'var(--chart-4)',
  [EXACT]: 'var(--chart-3)'
};

export const TILE_TEXT: Record<number, string> = {
  [MISS]: 'text-muted-foreground',
  [MISPLACED]: 'text-white',
  [EXACT]: 'text-white'
};
