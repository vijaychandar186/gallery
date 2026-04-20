'use client';

import { Fragment, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import {
  InfobarGroup,
  InfobarGroupContent,
  InfobarGroupLabel,
  InfobarSeparator
} from '@/components/ui/infobar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GALLERY_PROJECTS } from '@/config/gallery';

export function InfobarBody({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const project = GALLERY_PROJECTS.find((p) => pathname.includes(`/${p.slug}`));
  const sections = project?.infobarSections;

  if (sections && sections.length > 0) {
    return (
      <ScrollArea className='h-full'>
        {sections.map((section, i) => (
          <Fragment key={section.title}>
            {i > 0 && <InfobarSeparator />}
            <InfobarGroup>
              <InfobarGroupLabel>{section.title}</InfobarGroupLabel>
              <InfobarGroupContent>
                <p className='text-muted-foreground break-words px-2 text-xs leading-relaxed'>
                  {section.description}
                </p>
              </InfobarGroupContent>
            </InfobarGroup>
          </Fragment>
        ))}
      </ScrollArea>
    );
  }

  return <>{children}</>;
}
