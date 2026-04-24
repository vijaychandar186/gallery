# Gallery

Interactive project gallery built with Next.js 15. Each project lives at its own route under `/[locale]/[slug]`.

## Stack

| Layer           | Tech                                     |
| --------------- | ---------------------------------------- |
| Framework       | Next.js 15 (App Router, Turbopack)       |
| Language        | TypeScript 5 (strict)                    |
| Styling         | Tailwind CSS v4                          |
| UI              | shadcn/ui                                |
| Icons           | Tabler Icons, HugeIcons                  |
| i18n            | next-intl (en, hi, ta)                   |
| Themes          | next-themes + 10 built-in colour schemes |
| Package manager | Bun                                      |
| Linting         | OxLint + ESLint                          |
| Formatting      | Oxfmt + Prettier                         |
| Git hooks       | Husky + lint-staged                      |

## Getting Started

```bash
bun install
bun dev          # http://localhost:3000
bun build
bun start
```

## Project Structure

```
src/
├── app/
│   ├── globals.css                 # Tailwind + scheme imports
│   └── [locale]/
│       ├── layout.tsx              # ThemeProvider, NextIntl, scheme
│       └── (app)/
│           ├── layout.tsx          # Sidebar + header + infobar shell
│           ├── page.tsx            # Gallery home — project cards grid
│           └── [slug]/
│               └── page.tsx        # Dynamic project page
├── config/
│   └── gallery.tsx                 # Project registry — add projects here
├── components/
│   ├── layout/                     # AppSidebar, Header, InfobarBody, Providers
│   ├── appearance/                 # ThemeToggle, SchemeSelector
│   ├── BirdOS/                     # BirdOS desktop OS simulation (see below)
│   ├── PersonaLab/                 # OCEAN personality classifier (see below)
│   ├── WordleEntropy/              # Entropy-based Wordle solver (see below)
│   └── ui/                         # shadcn/ui primitives
├── styles/
│   ├── scheme.css                  # Imports all colour schemes
│   └── schemes/                    # 10 complete CSS variable palettes
├── i18n/                           # next-intl routing + request config
├── hooks/                          # use-mobile
└── lib/                            # font config, cn() utility
messages/
├── en.json                         # English
├── hi.json                         # Hindi
└── ta.json                         # Tamil
```

## Adding a Project

1. Open `src/config/gallery.tsx`
2. Add an entry to `GALLERY_PROJECTS`:

```tsx
{
  slug: 'my-project',           // URL: /my-project
  label: 'My Project',
  description: 'Short description shown on the gallery home card.',
  Icon: IconSomething,          // Tabler icon for sidebar + card
  Page: MyProjectPage,          // React component rendered at the route
  infobarSections: [            // Optional — shown in the right info panel
    { title: 'About', description: '...' },
  ]
}
```

Route, sidebar nav, gallery card, and infobar content are all auto-generated.

## Colour Schemes

10 switchable palettes via CSS variables. Switch with `SchemeSelector` or set `active_scheme` cookie.

| Scheme          | Vibe                                           |
| --------------- | ---------------------------------------------- |
| `vercel`        | Monochrome black & white                       |
| `claude`        | Warm neutral with muted orange                 |
| `supabase`      | Teal/cyan with mint accents                    |
| `mono`          | Pure greyscale, Geist Mono everywhere          |
| `neobrutualism` | Bold red/purple, sharp corners, offset shadows |
| `notebook`      | Cream/brown, handwritten font                  |
| `light-green`   | Soft mint, modern sans                         |
| `zen`           | Warm beige with serif headings                 |
| `astro-vista`   | Orange/brown indie aesthetic                   |
| `whatsapp`      | Teal + mint, iOS-rounded                       |

All schemes support light and dark mode. Persisted via cookie.

## BirdOS (`/BirdOS`)

macOS-inspired desktop OS simulation running entirely in the browser.

### Apps

| App          | Description                                                                                                                        |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| File Manager | Multi-view file browser — Documents (PDF viewer), Pictures (image viewer), Videos, Music, Network, Desktop, Filesystem, USB, Trash |
| Browser      | In-app browser with address bar, Google home, skeleton loading                                                                     |
| Music Player | Audio player with seek/volume controls, queue, 7 classical tracks                                                                  |
| Mail         | Inbox + compose form (EmailJS integration or mailto fallback)                                                                      |
| JS Console   | Monaco editor + sandboxed iframe JS execution with console output                                                                  |

### File Manager Content

| Folder     | Content                                                             |
| ---------- | ------------------------------------------------------------------- |
| Documents  | 4 arxiv PDFs — opens in-app iframe viewer                           |
| Pictures   | Moon Landing, Mona Lisa — inline image viewer with skeleton loading |
| Videos     | 5 YouTube entries — double-click opens in new tab                   |
| Music      | 7 OGG audio files — double-click plays in Music Player              |
| Network    | 3 discovered LAN hosts                                              |
| Desktop    | 3 static desktop files                                              |
| Filesystem | Read-only root dir listing (`/bin`, `/etc`, `/home` …)              |
| USB Drive  | 4 fake USB files                                                    |
| Trash      | Empty state                                                         |

### Control Centre

Opened via chevron or battery icon in dock. Shows live clock, WiFi/Bluetooth/Battery Saver/Airplane toggles, and app search with instant results.

### Structure

```
src/components/BirdOS/
├── types.ts                        # AppId, Position, WindowState
├── config.ts                       # App configs, folder icons, sidebar lists
├── desktop.tsx                     # Root OS compositor
├── data/
│   └── file-manager-data.ts        # All file manager content (music, docs, pictures, videos, etc.)
├── hooks/
│   ├── use-clock.ts                # Real-time clock
│   ├── use-weather.ts              # Weather display
│   ├── use-window-manager.ts       # Open/close/focus/minimize/maximize
│   ├── use-draggable.ts            # Zero-rerender drag via direct DOM
│   └── use-resizable.ts            # 8-handle resize via direct DOM
├── windows/
│   ├── frame.tsx                   # Window chrome + traffic-light buttons + resize handles
│   ├── file-manager.tsx            # File manager (10 views)
│   ├── browser.tsx                 # In-app browser with skeleton loading
│   ├── music-player.tsx            # Audio player
│   ├── mail-client.tsx             # Inbox + compose with EmailJS
│   ├── js-console.tsx              # Monaco editor + sandboxed JS runner
│   ├── app-preview.tsx             # Full-bleed image preview
│   └── about.tsx                   # About dialog
├── layout/
│   ├── boot-screen.tsx             # Animated boot with penguin + progress bar
│   ├── status-bar.tsx              # Date / time / weather tiles
│   └── dock.tsx                    # Glassmorphism 3-section dock
└── panels/
    ├── notification-panel.tsx      # Control centre with clock, toggles, app search
    └── power-menu.tsx              # About / Restart / Power Off popover
```

### Assets

```
public/BirdOS/
├── audio/                          # 7 OGG classical music files
├── documents/                      # 4 arxiv PDFs (downloaded locally)
├── pictures/                       # Moon Landing + Mona Lisa JPEGs
├── penguin-dance.webp              # Boot screen animation
├── wallpaper.svg                   # Default wallpaper
└── wallpaper-negative.svg          # Dark variant
```

## PersonaLab (`/PersonaLab`)

OCEAN Big Five personality classifier running entirely in the browser via k-Nearest Neighbours (k=7) over a ~700-row labelled dataset.

### Features

| Feature          | Description                                                                            |
| ---------------- | -------------------------------------------------------------------------------------- |
| Quiz             | Rate all five OCEAN dimensions (1–8) + gender + age; instant in-browser prediction     |
| Result card      | Predicted personality type with tagline and detail copy                                |
| OCEAN radar      | Radar chart of your raw trait scores                                                   |
| Neighbour votes  | Horizontal bar chart showing vote distribution across the 7 nearest neighbours         |
| Dataset explorer | Scatter plot of all ~700 labelled examples with axis selectors; your position overlaid |
| Traits view      | Per-trait explanations + type distribution chart across the full dataset               |
| About view       | How the KNN works, feature engineering, dataset notes, limitations                     |
| i18n             | Full translations in English, Hindi, Tamil                                             |

### Structure

```
src/
├── components/PersonaLab/
│   ├── index.tsx                   # Root shell — ScrollArea + NavBar
│   ├── types.ts                    # View union type
│   ├── config.ts                   # OCEAN_TRAITS, PERSONALITY_TYPES, QUIZ_FIELDS, RESULT_CHART_INDEX
│   ├── schema.ts                   # Zod schema for quiz form
│   ├── layout/
│   │   └── nav-bar.tsx             # Quiz / Traits / About tab bar
│   └── views/
│       ├── quiz.tsx                # Form + result visualisations (radar, votes, scatter)
│       ├── traits.tsx              # OCEAN trait cards + dataset distribution chart
│       └── about.tsx               # How-it-works cards
├── data/
│   └── personality-dataset.ts      # ~700 labelled OCEAN rows
└── lib/
    └── personality-classifier.ts   # KNN classify() + classifyDetailed()
```

## WordleEntropy (`/WordleEntropy`)

Entropy-based Wordle solver running entirely in the browser, using an information-theory approach inspired by 3Blue1Brown’s analysis.

### Features

| Feature            | Description                                                                               |
| ------------------ | ----------------------------------------------------------------------------------------- |
| Solver             | Enter guesses and click tiles to set grey/yellow/green pattern; solver ranks next moves   |
| Entropy scoring    | Every candidate word scored by H(G) = −Σ p(pattern) × log₂ p(pattern)                     |
| Stats bar          | Live words remaining, bits of uncertainty remaining, guess count                          |
| Guess history      | Each past guess shown with tiles, bits gained, and words eliminated                       |
| Pre-computed table | SALET second-guess map (243 patterns) eliminates computation for the first two moves      |
| Suggestion list    | Top candidates with entropy scores and progress bars; click to auto-fill                  |
| About view         | Six explainer cards covering entropy, pattern encoding, expected info gain, and hard mode |
| i18n               | Full translations in English, Hindi, Tamil                                                |

### How It Works

1. Word lists loaded once from `public/WordleEntropy/` (2,309 possible answers + 12,953 allowed guesses)
2. After each guess, `filterWords` narrows the remaining set using two-pass pattern matching (green first, then yellow)
3. `getSuggestions` scores every candidate: if remaining > 50, only possibles are scored; otherwise full allowed list
4. After SALET as the first guess, the optimal second guess is looked up from `second_guess_map.json` without computation
5. `bitsOf(remaining)` = log₂(remaining.length) tracks how much uncertainty is left

### Structure

```
src/components/WordleEntropy/
├── index.tsx                       # Root shell — NavBar + ScrollArea, view state
├── types.ts                        # View, GuessEntry, Suggestion, WordleState
├── config.ts                       # WORD_LENGTH, MAX_GUESSES, FIRST_GUESS, TILE_COLORS, TILE_TEXT
├── layout/
│   └── nav-bar.tsx                 # Solver / How It Works tab bar
├── views/
│   ├── solver.tsx                  # Interactive solver UI — stats, history, input, suggestions
│   └── about.tsx                   # Information theory explainer cards
└── lib/
    ├── pattern.ts                  # getPattern(), encodePattern(), filterWords(), entropy()
    ├── solver.ts                   # getSuggestions(), getSecondGuess(), bitsOf()
    └── words.ts                    # Lazy-cached fetch for possible_words, allowed_words, second_guess_map

public/WordleEntropy/
├── possible_words.txt              # 2,309 valid Wordle answers
├── allowed_words.txt               # 12,953 valid guesses
└── second_guess_map.json           # Pre-computed optimal second guess for every SALET first-guess pattern
```

## i18n

Three locales: `en`, `hi`, `ta`. Messages in `messages/*.json`, split by namespace:

| Namespace       | Content                                   |
| --------------- | ----------------------------------------- |
| `nav`           | Sidebar labels                            |
| `home`          | Gallery home page                         |
| `infobar`       | Default info panel content                |
| `os`            | BirdOS title + description                |
| `personaLab`    | PersonaLab — quiz, traits, about, results |
| `wordleEntropy` | WordleEntropy — solver UI, about section  |

## Code Style

- Single quotes, 2-space indent, no trailing comma (Prettier + Oxfmt)
- `@/*` alias maps to `src/*`
- Server components by default — `'use client'` only for hooks or browser APIs
- No `any` — strict TypeScript throughout
- All interactive elements use shadcn/ui components — no raw `<button>` or `<input>`
- Loading states use shadcn `Skeleton`

## Scripts

```bash
bun lint            # OxLint + Next.js ESLint
bun lint:fix        # Fix + format
bun format          # Oxfmt + Prettier
bun format:check    # Check only
```
