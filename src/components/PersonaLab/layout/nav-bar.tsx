'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import type { View } from '../types';

interface NavBarProps {
  active: View;
  onNavigate: (view: View) => void;
}

export function NavBar({ active, onNavigate }: NavBarProps) {
  const t = useTranslations('personaLab.nav');
  const views: { id: View; label: string }[] = [
    { id: 'quiz', label: t('quiz') },
    { id: 'traits', label: t('traits') },
    { id: 'about', label: t('about') }
  ];

  return (
    <div className='flex shrink-0 items-center gap-1 border-b border-border px-4 py-2'>
      <span className='mr-4 text-sm font-bold tracking-tight text-foreground'>PersonaLab</span>
      {views.map((n) => (
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
