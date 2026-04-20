'use client';

import { Card, CardContent } from '@/components/ui/card';
import { OsLogoIcon } from '../icons';

export function AboutWindow() {
  return (
    <div className='flex h-full flex-col items-center justify-center gap-6 p-8'>
      <OsLogoIcon size={56} strokeWidth={1} />
      <Card className='border-border/50 bg-card/60 backdrop-blur-sm'>
        <CardContent className='pt-6 text-center'>
          <p className='text-sm font-semibold text-foreground'>BirdOS</p>
          <p className='mt-1 text-xs text-muted-foreground'>
            A desktop simulation built with Next.js & TypeScript
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
