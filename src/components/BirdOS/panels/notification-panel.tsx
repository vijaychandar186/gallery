'use client';

import { useState } from 'react';
import { IconBattery, IconBluetooth, IconPlane, IconWifi } from '@tabler/icons-react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useClock } from '../hooks/use-clock';
import { DOCK_APPS } from '../config';
import type { AppId } from '../types';

const TOGGLES = [
  { id: 'wifi', label: 'WiFi', Icon: IconWifi },
  { id: 'bluetooth', label: 'Bluetooth', Icon: IconBluetooth },
  { id: 'battery', label: 'Battery Saver', Icon: IconBattery },
  { id: 'airplane', label: 'Airplane', Icon: IconPlane }
];

interface NotificationPanelProps {
  isOpen: boolean;
  onOpenApp?: (id: AppId) => void;
}

export function NotificationPanel({ isOpen, onOpenApp }: NotificationPanelProps) {
  const { time, ampm, weekday } = useClock();
  const [active, setActive] = useState<Set<string>>(new Set(['wifi', 'bluetooth']));
  const [search, setSearch] = useState('');

  function toggle(id: string) {
    setActive((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const query = search.trim().toLowerCase();
  const results = query ? DOCK_APPS.filter((app) => app.label.toLowerCase().includes(query)) : [];

  return (
    <Card
      className='absolute bottom-20 left-4 z-50 w-72 origin-bottom-left overflow-hidden rounded-2xl border-border/50 bg-card/85 shadow-2xl backdrop-blur-xl transition-all duration-300'
      style={{
        transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.88) translateY(12px)',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <CardContent className='p-5'>
        {/* Clock */}
        <div className='mb-4'>
          <div className='flex items-baseline gap-2'>
            <span className='text-5xl font-bold tabular-nums text-foreground'>{time}</span>
            <span className='text-xl text-muted-foreground'>{ampm}</span>
          </div>
          <p className='mt-0.5 text-sm text-muted-foreground'>{weekday}</p>
        </div>

        <Separator className='mb-4' />

        {/* Toggles */}
        <div className='mb-4 grid grid-cols-2 gap-2'>
          {TOGGLES.map(({ id, label, Icon }) => (
            <Button
              key={id}
              variant={active.has(id) ? 'default' : 'secondary'}
              onClick={() => toggle(id)}
              className='h-auto flex-col items-start gap-1.5 rounded-xl px-3 py-2.5 text-xs font-medium'
            >
              <Icon className='h-4 w-4' />
              {label}
            </Button>
          ))}
        </div>

        {/* Search */}
        <Input
          placeholder='Search...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='h-8 text-xs'
        />

        {/* Search results */}
        {results.length > 0 && (
          <div className='mt-2 overflow-hidden rounded-xl border border-border/50 bg-background/60'>
            {results.map((app) => (
              <button
                key={app.id}
                onClick={() => {
                  onOpenApp?.(app.id);
                  setSearch('');
                }}
                className='flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs transition-colors hover:bg-muted/60'
              >
                <HugeiconsIcon
                  icon={app.icon}
                  size={16}
                  strokeWidth={1.5}
                  className='shrink-0 text-muted-foreground'
                />
                <span className='font-medium'>{app.label}</span>
              </button>
            ))}
          </div>
        )}

        {query && results.length === 0 && (
          <p className='mt-2 text-center text-[11px] text-muted-foreground'>
            No results for &ldquo;{search}&rdquo;
          </p>
        )}
      </CardContent>
    </Card>
  );
}
