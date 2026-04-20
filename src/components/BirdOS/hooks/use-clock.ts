'use client';

import { useEffect, useState } from 'react';

interface ClockState {
  time: string;
  ampm: string;
  date: string;
  weekday: string;
}

export function useClock(): ClockState {
  const [state, setState] = useState<ClockState>({
    time: '12:00:00',
    ampm: 'PM',
    date: '',
    weekday: ''
  });

  useEffect(() => {
    function tick() {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      const s = now.getSeconds();
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      setState({
        time: `${h12}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
        ampm,
        weekday: now.toLocaleDateString('en-US', { weekday: 'long' }),
        date: now.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return state;
}
