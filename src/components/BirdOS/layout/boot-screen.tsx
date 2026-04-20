'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';

interface BootScreenProps {
  onComplete: () => void;
}

export function BootScreen({ onComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const duration = 5000;
    const start = Date.now();

    const id = setInterval(() => {
      const p = Math.min(((Date.now() - start) / duration) * 100, 100);
      setProgress(p);
      if (p >= 100) {
        clearInterval(id);
        setTimeout(() => {
          setFading(true);
          setTimeout(onComplete, 500);
        }, 400);
      }
    }, 40);

    return () => clearInterval(id);
  }, [onComplete]);

  return (
    <div
      className={`absolute inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-background transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}
    >
      <Image
        src='/BirdOS/penguin-dance.webp'
        alt='Penguins'
        width={320}
        height={320}
        className='h-64 w-auto object-contain'
        priority
      />
      <div className='w-60 space-y-3'>
        <p className='text-center text-xs text-muted-foreground'>Getting things ready for you...</p>
        <Progress value={progress} className='h-1' />
      </div>
    </div>
  );
}
