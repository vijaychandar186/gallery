'use client';

import { useState } from 'react';
import { IconInfoCircle, IconPower, IconRefresh } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { OsLogoIcon } from '../icons';
import { useIsMobile } from '@/hooks/use-mobile';

interface PowerMenuProps {
  onAbout: () => void;
  onRestart: () => void;
}

export function PowerMenu({ onAbout, onRestart }: PowerMenuProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const items = [
    {
      label: 'About',
      Icon: IconInfoCircle,
      onClick: () => {
        setOpen(false);
        onAbout();
      },
      danger: false
    },
    {
      label: 'Restart',
      Icon: IconRefresh,
      onClick: () => {
        setOpen(false);
        onRestart();
      },
      danger: false
    },
    {
      label: 'Power Off',
      Icon: IconPower,
      onClick: () => router.push('/'),
      danger: true
    }
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='ghost' size='icon' className='rounded-full' aria-label='Power menu'>
          <OsLogoIcon size={isMobile ? 20 : 28} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side='top'
        align='end'
        className='w-44 rounded-2xl border-border/50 bg-card/85 p-1.5 shadow-2xl backdrop-blur-xl'
        onClick={(e) => e.stopPropagation()}
      >
        {items.map(({ label, Icon, onClick, danger }, i) => (
          <div key={label}>
            {i === items.length - 1 && <Separator className='my-1' />}
            <Button
              variant='ghost'
              onClick={onClick}
              className={`w-full justify-start gap-3 rounded-xl ${danger ? 'text-destructive hover:text-destructive' : ''}`}
            >
              <Icon className='h-4 w-4 shrink-0' />
              {label}
            </Button>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
