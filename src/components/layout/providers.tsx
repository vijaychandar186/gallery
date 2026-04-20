'use client';

import { ThemeProvider } from './theme-provider';

export function Providers({
  children,
  initialTheme
}: {
  children: React.ReactNode;
  initialTheme: 'light' | 'dark';
}) {
  return <ThemeProvider initialTheme={initialTheme}>{children}</ThemeProvider>;
}
