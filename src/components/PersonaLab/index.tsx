'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NavBar } from './layout/nav-bar';
import { QuizView } from './views/quiz';
import { TraitsView } from './views/traits';
import { AboutView } from './views/about';
import type { View } from './types';

export function PersonaLab() {
  const [view, setView] = useState<View>('quiz');

  return (
    <div className='flex h-full flex-col bg-background text-foreground'>
      <NavBar active={view} onNavigate={setView} />
      <ScrollArea className='min-h-0 flex-1' viewportClassName='!overflow-x-hidden'>
        <Image
          src='/PersonaLab/header.png'
          alt=''
          width={1200}
          height={200}
          className='w-full object-cover'
          priority
        />
        <div className='mx-auto max-w-xl min-w-0 overflow-x-hidden px-6 py-8'>
          {view === 'quiz' && <QuizView onNavigate={setView} />}
          {view === 'traits' && <TraitsView />}
          {view === 'about' && <AboutView />}
        </div>
        <Image
          src='/PersonaLab/footer.png'
          alt=''
          width={1200}
          height={200}
          className='w-full object-cover'
        />
      </ScrollArea>
    </div>
  );
}
