'use client';

import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NavBar } from './layout/nav-bar';
import { SolverView } from './views/solver';
import { AboutView } from './views/about';
import type { View } from './types';

export function WordleEntropy() {
  const [view, setView] = useState<View>('solver');

  return (
    <div className='flex h-full flex-col bg-background text-foreground'>
      <NavBar active={view} onNavigate={setView} />
      <ScrollArea className='min-h-0 flex-1'>
        <div className='mx-auto max-w-xl px-6 py-6'>
          {view === 'solver' && <SolverView />}
          {view === 'about' && <AboutView />}
        </div>
      </ScrollArea>
    </div>
  );
}
