'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import type { View } from '../types';

interface NavBarProps {
  active: View;
  onNavigate: (v: View) => void;
}

export function NavBar({ active, onNavigate }: NavBarProps) {
  const t = useTranslations('wordleEntropy.nav');

  const NAV: { id: View; label: string }[] = [
    { id: 'solver', label: t('solver') },
    { id: 'about', label: t('howItWorks') }
  ];

  return (
    <div className='flex shrink-0 items-center gap-1 border-b border-border px-4 py-2'>
      <span className='mr-4 text-sm font-bold tracking-tight text-foreground'>WordleEntropy</span>
      {NAV.map((n) => (
        <Button
          key={n.id}
          variant={active === n.id ? 'secondary' : 'ghost'}
          size='sm'
          className='text-xs'
          onClick={() => onNavigate(n.id)}
        >
          {n.label}
        </Button>
      ))}
    </div>
  );
}
