'use client';

import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

import { DEFAULT_SCHEME } from './scheme.config';

const COOKIE_NAME = 'active_scheme';

function setSchemeCookie(scheme: string) {
  if (typeof window === 'undefined') return;
  document.cookie = `${COOKIE_NAME}=${scheme}; path=/; max-age=31536000; SameSite=Lax; ${window.location.protocol === 'https:' ? 'Secure;' : ''}`;
}

type SchemeContextType = {
  activeScheme: string;
  setActiveScheme: (scheme: string) => void;
};

const SchemeContext = createContext<SchemeContextType | undefined>(undefined);

export function ActiveSchemeProvider({
  children,
  initialScheme
}: {
  children: ReactNode;
  initialScheme?: string;
}) {
  const schemeToUse = initialScheme || DEFAULT_SCHEME;
  const [activeScheme, setActiveScheme] = useState<string>(schemeToUse);

  useEffect(() => {
    const currentScheme = document.documentElement.getAttribute('data-theme');
    if (currentScheme !== activeScheme) {
      setSchemeCookie(activeScheme);
      document.documentElement.removeAttribute('data-theme');
      if (activeScheme) {
        document.documentElement.setAttribute('data-theme', activeScheme);
      }
    } else {
      setSchemeCookie(activeScheme);
    }
  }, [activeScheme]);

  return (
    <SchemeContext.Provider value={{ activeScheme, setActiveScheme }}>
      {children}
    </SchemeContext.Provider>
  );
}

export function useSchemeConfig() {
  const context = useContext(SchemeContext);
  if (context === undefined) {
    throw new Error('useSchemeConfig must be used within an ActiveSchemeProvider');
  }
  return context;
}
