'use client';

import { useState } from 'react';
import { InfobarProvider } from '@/components/ui/infobar';

export function InfobarProviderWithCookie({
  defaultOpen,
  children
}: {
  defaultOpen: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <InfobarProvider
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        document.cookie = `infobar_state=${value}; path=/; max-age=31536000`;
      }}
    >
      {children}
    </InfobarProvider>
  );
}
