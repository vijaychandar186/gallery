let possibles: string[] | null = null;
let allowed: string[] | null = null;
let secondGuessMap: Record<string, string[]> | null = null;

async function fetchLines(path: string): Promise<string[]> {
  const res = await fetch(path);
  const text = await res.text();
  return text
    .trim()
    .split('\n')
    .map((w) => w.trim().toLowerCase())
    .filter(Boolean);
}

export async function loadPossibles(): Promise<string[]> {
  if (!possibles) possibles = await fetchLines('/WordleEntropy/possible_words.txt');
  return possibles;
}

export async function loadAllowed(): Promise<string[]> {
  if (!allowed) allowed = await fetchLines('/WordleEntropy/allowed_words.txt');
  return allowed;
}

export async function loadSecondGuessMap(): Promise<Record<string, string[]>> {
  if (!secondGuessMap) {
    const res = await fetch('/WordleEntropy/second_guess_map.json');
    secondGuessMap = await res.json();
  }
  return secondGuessMap!;
}
