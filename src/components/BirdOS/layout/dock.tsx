'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { IconBattery3, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { PowerMenu } from '../panels/power-menu';
import { DOCK_APPS } from '../config';
import type { AppId, WindowState } from '../types';

interface DockProps {
  windows: Record<AppId, WindowState>;
  onOpenApp: (id: AppId) => void;
  onToggleNotification: () => void;
  onAbout: () => void;
  onRestart: () => void;
  notificationOpen: boolean;
}

export function Dock({
  windows,
  onOpenApp,
  onToggleNotification,
  onAbout,
  onRestart,
  notificationOpen
}: DockProps) {
  const isMobile = useIsMobile();
  const iconSize = isMobile ? 28 : 42;

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className='absolute bottom-3 left-1/2 z-40 flex -translate-x-1/2 items-end gap-1.5 sm:bottom-4 sm:gap-2'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left — controls */}
        <div className='flex items-center gap-0.5 rounded-3xl border border-border/40 bg-card/75 px-1.5 py-1.5 shadow-xl backdrop-blur-xl sm:px-2 sm:py-2'>
          <Button
            variant='ghost'
            size='icon'
            onClick={onToggleNotification}
            className={`rounded-full ${notificationOpen ? 'bg-primary/20 text-primary hover:bg-primary/30' : ''}`}
            aria-label='Control centre'
          >
            {notificationOpen ? (
              <IconChevronDown className='h-4 w-4' />
            ) : (
              <IconChevronUp className='h-4 w-4' />
            )}
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='rounded-full'
            aria-label='Battery'
            onClick={onToggleNotification}
          >
            <IconBattery3 className='h-4 w-4' />
          </Button>
        </div>

        {/* Centre — app launcher */}
        <div className='flex items-center gap-0.5 rounded-3xl border border-border/40 bg-card/75 px-2 py-1.5 shadow-xl backdrop-blur-xl sm:gap-1 sm:px-3 sm:py-2'>
          {DOCK_APPS.map((app) => {
            const win = windows[app.id];
            const isOpen = win?.isOpen;
            const isMinimized = win?.isMinimized;

            return (
              <Tooltip key={app.id}>
                <TooltipTrigger asChild>
                  <div className='flex flex-col items-center gap-0.5'>
                    <Button
                      variant='ghost'
                      onClick={() => onOpenApp(app.id)}
                      className={`h-auto rounded-xl p-1 transition-transform duration-150 hover:scale-110 active:scale-95 ${
                        isOpen && !isMinimized ? 'bg-primary/10' : ''
                      }`}
                      aria-label={`Open ${app.label}`}
                    >
                      <HugeiconsIcon icon={app.icon} size={iconSize} strokeWidth={1.5} />
                    </Button>
                    {/* Open indicator dot */}
                    <div
                      className={`h-1 w-1 rounded-full transition-all duration-200 ${
                        isOpen
                          ? isMinimized
                            ? 'bg-muted-foreground/50 scale-75'
                            : 'bg-foreground'
                          : 'bg-transparent'
                      }`}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side='top'>
                  {app.label}
                  {isMinimized ? ' (minimized)' : ''}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Right — power */}
        <div className='flex items-center rounded-3xl border border-border/40 bg-card/75 px-1.5 py-1.5 shadow-xl backdrop-blur-xl sm:px-2 sm:py-2'>
          <PowerMenu onAbout={onAbout} onRestart={onRestart} />
        </div>
      </div>
    </TooltipProvider>
  );
}
