'use client';

import { useLayoutEffect } from 'react';
import { useInfobar } from '@/components/ui/infobar';

export function OsInfobarSetter() {
  const { setContent } = useInfobar();

  useLayoutEffect(() => {
    setContent({
      title: 'BirdOS',
      sections: [
        {
          title: 'About BirdOS',
          description:
            'A desktop OS simulation built with Next.js & TypeScript. Features window management, a dock, boot screen, and multiple color schemes.'
        },
        {
          title: 'Controls',
          description:
            'Click app icons in the dock to open apps. Drag windows by the title bar. Use the bird icon for power options and restart.'
        },
        {
          title: 'Themes',
          description:
            'Switch color schemes and dark/light mode using the controls in the bottom-left of the sidebar.'
        }
      ]
    });
  }, [setContent]);

  return null;
}
