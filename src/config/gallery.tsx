import type { ComponentType } from 'react';
import { IconDeviceDesktop, IconBrain, IconLetterCase } from '@tabler/icons-react';
import { OsDesktop } from '@/components/BirdOS/desktop';
import { PersonaLab } from '@/components/PersonaLab';
import { WordleEntropy } from '@/components/WordleEntropy';

export interface InfobarSection {
  title: string;
  description: string;
}

export interface GalleryProject {
  slug: string;
  label: string;
  description: string;
  Icon: ComponentType<{ className?: string }>;
  Page: ComponentType;
  infobarSections?: InfobarSection[];
}

function OsPage() {
  return (
    <div className='flex flex-1 items-center justify-center bg-background p-6'>
      <div className='-m-2 w-full max-w-7xl rounded-2xl bg-card/5 p-2 ring-1 ring-inset ring-border shadow-2xl lg:-m-4 lg:rounded-3xl lg:p-4'>
        <div className='relative overflow-hidden rounded-xl' style={{ height: '80vh' }}>
          <OsDesktop />
        </div>
      </div>
    </div>
  );
}

function PersonaLabPage() {
  return (
    <div className='flex flex-1 items-center justify-center bg-background p-6'>
      <div className='-m-2 w-full max-w-2xl rounded-2xl bg-card/5 p-2 ring-1 ring-inset ring-border shadow-2xl lg:-m-4 lg:rounded-3xl lg:p-4'>
        <div className='relative overflow-hidden rounded-xl' style={{ height: '80vh' }}>
          <PersonaLab />
        </div>
      </div>
    </div>
  );
}

function WordleEntropyPage() {
  return (
    <div className='flex flex-1 items-center justify-center bg-background p-6'>
      <div className='-m-2 w-full max-w-2xl rounded-2xl bg-card/5 p-2 ring-1 ring-inset ring-border shadow-2xl lg:-m-4 lg:rounded-3xl lg:p-4'>
        <div className='relative overflow-hidden rounded-xl' style={{ height: '80vh' }}>
          <WordleEntropy />
        </div>
      </div>
    </div>
  );
}

export const GALLERY_PROJECTS: GalleryProject[] = [
  {
    slug: 'BirdOS',
    label: 'BirdOS',
    description: 'A desktop OS simulation built with Next.js & TypeScript',
    Icon: IconDeviceDesktop,
    Page: OsPage,
    infobarSections: [
      {
        title: 'About BirdOS',
        description:
          'A desktop OS simulation built with Next.js & TypeScript. Features window management, a dock, boot screen, and multiple color schemes.'
      },
      {
        title: 'Controls',
        description:
          'Click app icons in the dock to open apps. Drag windows by the title bar. Use the bird icon for power options and restart.'
      },
      {
        title: 'Themes',
        description:
          'Switch color schemes and dark/light mode using the controls in the bottom-left of the sidebar.'
      }
    ]
  },
  {
    slug: 'PersonaLab',
    label: 'PersonaLab',
    description: 'OCEAN personality prediction using k-Nearest Neighbours',
    Icon: IconBrain,
    Page: PersonaLabPage,
    infobarSections: [
      {
        title: 'About PersonaLab',
        description:
          'A browser-side personality classifier built with TypeScript. Rates you across the Big Five (OCEAN) dimensions and predicts one of five personality types using k-Nearest Neighbours.'
      },
      {
        title: 'How to use',
        description:
          'Fill in the Quiz tab — gender, age, and a 1–8 self-rating for each trait — then hit Predict. Results appear instantly below the form.'
      },
      {
        title: 'Privacy',
        description:
          'No data leaves your device. The dataset is loaded once from a static CSV file and all inference runs locally in the browser.'
      }
    ]
  },
  {
    slug: 'WordleEntropy',
    label: 'WordleEntropy',
    description: 'Entropy-based Wordle solver — information theory in action',
    Icon: IconLetterCase,
    Page: WordleEntropyPage,
    infobarSections: [
      {
        title: 'About WordleEntropy',
        description:
          "An interactive Wordle solver powered by Shannon entropy — a TypeScript port of 3Blue1Brown's information-theory analysis. Enter your guesses and observed patterns; the solver ranks every possible next word by expected bits gained."
      },
      {
        title: 'How to use',
        description:
          'Type a 5-letter word in the Solver tab, then click each tile to set the pattern you received (grey/yellow/green). Hit Add Guess to filter remaining words and see optimal next moves.'
      },
      {
        title: 'Why SALET?',
        description:
          'SALET scores ~5.87 bits on the first guess — more than any other English word. The solver also uses a pre-computed second-guess table so the first two moves are always near-optimal.'
      }
    ]
  }
];

export const GALLERY_MAP = Object.fromEntries(GALLERY_PROJECTS.map((p) => [p.slug, p]));
