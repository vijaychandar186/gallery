'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { filterWords, isAllGreen, entropy } from '../lib/pattern';
import { getSuggestions, bitsOf, getSecondGuess } from '../lib/solver';
import { loadPossibles, loadAllowed, loadSecondGuessMap } from '../lib/words';
import { WORD_LENGTH, MAX_GUESSES, FIRST_GUESS, TILE_COLORS, TILE_TEXT } from '../config';
import type { GuessEntry, Suggestion } from '../types';

export function SolverView() {
  const [possibles, setPossibles] = useState<string[]>([]);
  const [allowed, setAllowed] = useState<string[]>([]);
  const [secondGuessMap, setSecondGuessMap] = useState<Record<string, string[]>>({});
  const [guesses, setGuesses] = useState<GuessEntry[]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [currentPattern, setCurrentPattern] = useState<number[]>([0, 0, 0, 0, 0]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [computing, setComputing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [solved, setSolved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load word lists
  useEffect(() => {
    Promise.all([loadPossibles(), loadAllowed(), loadSecondGuessMap()]).then(([p, a, sg]) => {
      setPossibles(p);
      setAllowed(a);
      setSecondGuessMap(sg);
      setLoaded(true);
      computeSuggestions(p, a, []);
    });
  }, []);

  const computeSuggestions = useCallback(
    (remaining: string[], allowedWords: string[], currentGuesses: GuessEntry[]) => {
      setComputing(true);
      setTimeout(() => {
        if (remaining.length === 0) {
          setComputing(false);
          return;
        }
        const s = getSuggestions(remaining, allowedWords);
        setSuggestions(s);
        setComputing(false);
      }, 0);
    },
    []
  );

  const cyclePattern = (i: number) => {
    setCurrentPattern((prev) => {
      const next = [...prev];
      next[i] = (next[i] + 1) % 3;
      return next;
    });
  };

  const addGuess = () => {
    const word = currentWord.toLowerCase().trim();
    if (word.length !== WORD_LENGTH) return;
    if (!allowed.includes(word) && !possibles.includes(word)) return;

    const bitsGained = entropy(possibles, word);
    const newPossibles = filterWords(possibles, word, currentPattern);
    const entry: GuessEntry = {
      word,
      pattern: [...currentPattern],
      bitsGained,
      remainingAfter: newPossibles.length
    };

    const newGuesses = [...guesses, entry];
    setGuesses(newGuesses);
    setPossibles(newPossibles);
    setCurrentWord('');
    setCurrentPattern([0, 0, 0, 0, 0]);
    inputRef.current?.focus();

    if (isAllGreen(currentPattern) || newPossibles.length === 0) {
      setSolved(true);
      setSuggestions([]);
    } else {
      // Check if we can use second_guess_map
      if (newGuesses.length === 1 && secondGuessMap) {
        const sg = getSecondGuess(word, currentPattern, secondGuessMap);
        if (sg) {
          setSuggestions([
            {
              word: sg,
              entropy: entropy(newPossibles, sg),
              isAnswer: newPossibles.includes(sg)
            }
          ]);
          setComputing(false);
          return;
        }
      }
      computeSuggestions(newPossibles, allowed, newGuesses);
    }
  };

  const reset = () => {
    loadPossibles().then((p) => {
      setPossibles(p);
      setGuesses([]);
      setCurrentWord('');
      setCurrentPattern([0, 0, 0, 0, 0]);
      setSolved(false);
      computeSuggestions(p, allowed, []);
    });
  };

  const handleWordInput = (val: string) => {
    setCurrentWord(
      val
        .toLowerCase()
        .replace(/[^a-z]/g, '')
        .slice(0, 5)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentWord.length === WORD_LENGTH) addGuess();
  };

  const t = useTranslations('wordleEntropy.solver');
  const bits = bitsOf(possibles);
  const gameOver = solved || guesses.length >= MAX_GUESSES;

  return (
    <div className='space-y-4'>
      {/* Stats bar */}
      <div className='grid grid-cols-3 gap-3'>
        <Card className='border-border'>
          <CardContent className='pt-3 pb-3 text-center'>
            <p className='text-2xl font-black tabular-nums text-foreground'>{possibles.length}</p>
            <p className='text-xs text-muted-foreground'>{t('wordsLeft')}</p>
          </CardContent>
        </Card>
        <Card className='border-border'>
          <CardContent className='pt-3 pb-3 text-center'>
            <p className='text-2xl font-black tabular-nums text-foreground'>{bits.toFixed(1)}</p>
            <p className='text-xs text-muted-foreground'>{t('bitsLeft')}</p>
          </CardContent>
        </Card>
        <Card className='border-border'>
          <CardContent className='pt-3 pb-3 text-center'>
            <p className='text-2xl font-black tabular-nums text-foreground'>
              {guesses.length}/{MAX_GUESSES}
            </p>
            <p className='text-xs text-muted-foreground'>{t('guesses')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Guess history */}
      {guesses.length > 0 && (
        <Card className='border-border'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base'>{t('guessHistory')}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            {guesses.map((g, i) => (
              <div key={i} className='flex items-center gap-3'>
                <span className='w-4 text-xs text-muted-foreground'>{i + 1}.</span>
                <div className='flex gap-1'>
                  {g.word.split('').map((letter, j) => (
                    <Tile key={j} letter={letter} state={g.pattern[j]} />
                  ))}
                </div>
                <div className='ml-auto text-right'>
                  <p className='text-xs font-medium text-foreground'>
                    {t('bitsGained', { bits: g.bitsGained.toFixed(2) })}
                  </p>
                  <p className='text-[10px] text-muted-foreground'>
                    {t('remaining', { n: g.remainingAfter })}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Solved state */}
      {solved && (
        <Card
          className='border-border'
          style={{ borderTopColor: 'var(--chart-3)', borderTopWidth: 3 }}
        >
          <CardContent className='pt-4 text-center'>
            <p className='text-lg font-black text-foreground'>
              {t('solvedIn', { n: guesses.length })}
            </p>
            <p className='text-sm text-muted-foreground'>
              {guesses.length <= 3
                ? t('exceptional')
                : guesses.length <= 4
                  ? t('great')
                  : t('wellPlayed')}
            </p>
            <Button variant='ghost' size='sm' className='mt-2 text-xs' onClick={reset}>
              {t('newGame')}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Input */}
      {!gameOver && loaded && (
        <Card className='border-border'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-base'>
              {guesses.length === 0 ? t('firstGuessTitle') : t('nextGuessTitle')}
            </CardTitle>
            {guesses.length === 0 && (
              <CardDescription>
                {t('recommendedFirst')}{' '}
                <button
                  className='font-bold uppercase text-foreground hover:underline'
                  onClick={() => setCurrentWord(FIRST_GUESS)}
                >
                  {FIRST_GUESS}
                </button>
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className='space-y-4'>
            <Input
              ref={inputRef}
              value={currentWord.toUpperCase()}
              onChange={(e) => handleWordInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('placeholder')}
              className='font-mono text-sm tracking-widest uppercase'
              maxLength={5}
            />

            {currentWord.length === WORD_LENGTH && (
              <>
                <div>
                  <p className='mb-2 text-xs text-muted-foreground'>{t('clickPattern')}</p>
                  <div className='flex gap-2'>
                    {currentWord.split('').map((letter, i) => (
                      <button
                        key={i}
                        onClick={() => cyclePattern(i)}
                        className='transition-transform hover:scale-105 active:scale-95'
                      >
                        <Tile letter={letter} state={currentPattern[i]} size='lg' />
                      </button>
                    ))}
                  </div>
                  <div className='mt-1 flex gap-2'>
                    {currentPattern.map((state, i) => (
                      <p key={i} className='w-10 text-center text-[9px] text-muted-foreground'>
                        {state === 0 ? t('miss') : state === 1 ? t('yellow') : t('green')}
                      </p>
                    ))}
                  </div>
                </div>

                <div className='flex gap-2'>
                  <Button className='flex-1' onClick={addGuess}>
                    {t('addGuess')}
                  </Button>
                  <Button variant='ghost' size='sm' onClick={reset}>
                    {t('reset')}
                  </Button>
                </div>
              </>
            )}

            {currentWord.length === 0 && guesses.length > 0 && (
              <Button variant='ghost' size='sm' className='text-xs' onClick={reset}>
                {t('resetGame')}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {!loaded && (
        <Card className='border-border'>
          <CardContent className='pt-4 space-y-2'>
            <Skeleton className='h-4 w-1/2' />
            <Skeleton className='h-4 w-3/4' />
          </CardContent>
        </Card>
      )}

      {/* Suggestions */}
      {!solved && loaded && suggestions.length > 0 && (
        <Card className='border-border'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base'>
              {guesses.length === 0 ? t('topStarting') : t('suggestedNext')}
            </CardTitle>
            <CardDescription>
              {guesses.length === 0
                ? t('rankedBy')
                : possibles.length !== 1
                  ? t('fromRemainingPlural', { n: possibles.length })
                  : t('fromRemaining', { n: possibles.length })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {computing ? (
              <div className='space-y-2'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className='h-8 w-full' />
                ))}
              </div>
            ) : (
              <div className='space-y-1.5'>
                {suggestions.map((s, i) => (
                  <SuggestionRow
                    key={s.word}
                    rank={i + 1}
                    suggestion={s}
                    maxEntropy={suggestions[0]?.entropy ?? 1}
                    onSelect={() => setCurrentWord(s.word)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card className='border-border bg-muted/20'>
        <CardContent className='pt-3 pb-3'>
          <div className='flex flex-wrap gap-4 text-xs text-muted-foreground'>
            <span className='flex items-center gap-1.5'>
              <span
                className='inline-block h-3 w-3 rounded-sm'
                style={{ backgroundColor: TILE_COLORS[2] }}
              />
              {t('legendGreen')}
            </span>
            <span className='flex items-center gap-1.5'>
              <span
                className='inline-block h-3 w-3 rounded-sm'
                style={{ backgroundColor: TILE_COLORS[1] }}
              />
              {t('legendYellow')}
            </span>
            <span className='flex items-center gap-1.5'>
              <span
                className='inline-block h-3 w-3 rounded-sm border border-border'
                style={{ backgroundColor: TILE_COLORS[0] }}
              />
              {t('legendGrey')}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Tile({
  letter,
  state,
  size = 'sm'
}: {
  letter: string;
  state: number;
  size?: 'sm' | 'lg';
}) {
  const dim = size === 'lg' ? 'h-10 w-10 text-base' : 'h-8 w-8 text-sm';
  return (
    <div
      className={`flex items-center justify-center rounded-md border border-border font-black uppercase ${dim} ${TILE_TEXT[state]}`}
      style={{ backgroundColor: TILE_COLORS[state] }}
    >
      {letter}
    </div>
  );
}

function SuggestionRow({
  rank,
  suggestion,
  maxEntropy,
  onSelect
}: {
  rank: number;
  suggestion: Suggestion;
  maxEntropy: number;
  onSelect: () => void;
}) {
  const pct = maxEntropy > 0 ? (suggestion.entropy / maxEntropy) * 100 : 0;
  return (
    <button
      className='flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left hover:bg-muted/50 transition-colors'
      onClick={onSelect}
    >
      <span className='w-4 shrink-0 text-xs text-muted-foreground'>{rank}</span>
      <span className='w-16 shrink-0 font-mono text-sm font-bold uppercase tracking-wider text-foreground'>
        {suggestion.word}
      </span>
      {suggestion.isAnswer && (
        <span
          className='shrink-0 rounded px-1 py-0.5 text-[9px] font-bold uppercase text-white'
          style={{ backgroundColor: 'var(--chart-3)' }}
        >
          ans
        </span>
      )}
      <div className='min-w-0 flex-1'>
        <Progress value={pct} className='h-1.5' />
      </div>
      <span className='shrink-0 text-xs tabular-nums text-muted-foreground'>
        {suggestion.entropy.toFixed(2)}b
      </span>
    </button>
  );
}
