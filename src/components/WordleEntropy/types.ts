export type View = 'solver' | 'about';

export interface GuessEntry {
  word: string;
  pattern: number[];
  bitsGained: number;
  remainingAfter: number;
}

export interface Suggestion {
  word: string;
  entropy: number;
  isAnswer: boolean;
}

export interface WordleState {
  possibles: string[];
  guesses: GuessEntry[];
  solved: boolean;
}
