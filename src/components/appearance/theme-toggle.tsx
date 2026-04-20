'use client';

import { IconMoon, IconSun } from '@tabler/icons-react';
import { useTheme } from '@/components/layout/theme-provider';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  function handleClick(e: React.MouseEvent) {
    const root = document.documentElement;
    root.style.setProperty('--x', `${e.clientX}px`);
    root.style.setProperty('--y', `${e.clientY}px`);

    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    if (!document.startViewTransition) {
      setTheme(next);
      return;
    }
    document.startViewTransition(() => setTheme(next));
  }

  return (
    <Button variant='ghost' size='icon' onClick={handleClick} aria-label='Toggle theme'>
      <IconSun className='h-4 w-4 scale-100 dark:scale-0' />
      <IconMoon className='absolute h-4 w-4 scale-0 dark:scale-100' />
    </Button>
  );
}
