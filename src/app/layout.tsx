import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import './globals.css';

import { fontVariables } from '@/lib/font.config';
import { DEFAULT_SCHEME } from '@/components/appearance/scheme.config';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'A collection of interactive projects including BirdOS, PersonaLab, and WordleEntropy'
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const activeScheme = cookieStore.get('active_scheme')?.value;
  const themeCookie = cookieStore.get('theme')?.value;
  const isDark = themeCookie === 'dark';

  return (
    <html
      lang='en'
      suppressHydrationWarning
      data-theme={activeScheme ?? DEFAULT_SCHEME}
      className={`${fontVariables}${isDark ? ' dark' : ''}`}
    >
      <body className='antialiased'>{children}</body>
    </html>
  );
}
