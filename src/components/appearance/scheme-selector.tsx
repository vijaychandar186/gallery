'use client';

import { useState } from 'react';
import { IconCheck, IconPalette, IconSelector } from '@tabler/icons-react';

import { useSchemeConfig } from '@/components/appearance/active-scheme';
import { SCHEMES } from '@/components/appearance/scheme.config';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

function SchemePopover({ trigger }: { trigger: React.ReactNode }) {
  const { activeScheme, setActiveScheme } = useSchemeConfig();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className='w-48 p-0' align='end'>
        <Command>
          <CommandInput placeholder='Search scheme...' className='h-8 text-xs' />
          <CommandList>
            <CommandEmpty>No scheme found.</CommandEmpty>
            <CommandGroup>
              {SCHEMES.map((scheme) => (
                <CommandItem
                  key={scheme.value}
                  value={scheme.value}
                  onSelect={(val) => {
                    setActiveScheme(val);
                    setOpen(false);
                  }}
                  className='text-xs'
                >
                  <IconCheck
                    className={cn(
                      'mr-2 h-3 w-3',
                      activeScheme === scheme.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {scheme.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function SchemeSelector() {
  const { activeScheme } = useSchemeConfig();
  const active = SCHEMES.find((s) => s.value === activeScheme);

  return (
    <>
      {/* expanded */}
      <SchemePopover
        trigger={
          <Button
            variant='outline'
            size='sm'
            className='h-8 w-36 justify-between text-xs group-data-[collapsible=icon]:hidden'
          >
            {active?.name ?? 'Select scheme'}
            <IconSelector className='ml-1 h-3 w-3 opacity-50' />
          </Button>
        }
      />

      {/* collapsed */}
      <SchemePopover
        trigger={
          <Button
            variant='ghost'
            size='icon'
            className='hidden h-8 w-8 group-data-[collapsible=icon]:flex'
            aria-label='Select color scheme'
          >
            <IconPalette className='h-4 w-4' />
          </Button>
        }
      />
    </>
  );
}
