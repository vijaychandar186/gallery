'use client';

import { useClock } from '../hooks/use-clock';
import { useWeather } from '../hooks/use-weather';

export function StatusBar() {
  const { date, time, ampm } = useClock();
  const { label, emoji, temp } = useWeather();

  return (
    <div className='absolute left-0 right-0 top-0 z-40 flex items-center justify-between px-3 py-2 sm:px-6 sm:py-3'>
      <div className='hidden rounded-lg border border-white/10 bg-white/10 px-3 py-1 backdrop-blur-md sm:block'>
        <span className='text-sm font-medium text-white'>{date}</span>
      </div>
      <div className='rounded-lg border border-white/10 bg-white/10 px-3 py-1 backdrop-blur-md'>
        <span className='font-mono text-xs font-medium tabular-nums text-white sm:text-sm'>
          {time} {ampm}
        </span>
      </div>
      <div className='rounded-lg border border-white/10 bg-white/10 px-3 py-1 backdrop-blur-md'>
        <span className='text-xs font-medium text-white sm:text-sm'>
          {emoji}{' '}
          <span className='hidden sm:inline'>
            {label}
            {temp && ` · ${temp}`}
          </span>
          <span className='sm:hidden'>{temp ?? label}</span>
        </span>
      </div>
    </div>
  );
}
