'use client';

import { useEffect } from 'react';

export function LocaleHtml({
  locale,
  activeScheme,
  children
}: {
  locale: string;
  activeScheme: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.setAttribute('data-theme', activeScheme);
  }, [locale, activeScheme]);

  return <>{children}</>;
}
