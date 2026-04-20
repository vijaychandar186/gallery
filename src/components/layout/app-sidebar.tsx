'use client';

import { IconHome } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { SchemeSelector } from '@/components/appearance/scheme-selector';
import { ThemeToggle } from '@/components/appearance/theme-toggle';
import { GALLERY_PROJECTS } from '@/config/gallery';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar';

export function AppSidebar() {
  const pathname = usePathname();
  const t = useTranslations('nav');

  return (
    <Sidebar collapsible='icon' className='border-r'>
      <SidebarHeader className='h-14 border-b p-0'>
        <div className='flex h-full items-center px-4 group-data-[collapsible=icon]:hidden'>
          <span className='font-semibold'>{t('gallery')}</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className='flex-1'>
          <SidebarGroup>
            <SidebarGroupLabel className='group-data-[collapsible=icon]:hidden'>
              {t('navigation')}
            </SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/'} tooltip={t('home')}>
                  <Link href='/'>
                    <IconHome className='h-4 w-4 shrink-0' />
                    <span>{t('home')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className='group-data-[collapsible=icon]:hidden'>
              {t('projects')}
            </SidebarGroupLabel>
            <SidebarMenu>
              {GALLERY_PROJECTS.map(({ slug, label, Icon }) => (
                <SidebarMenuItem key={slug}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.endsWith(`/${slug}`)}
                    tooltip={label}
                  >
                    <Link href={`/${slug}`}>
                      <Icon className='h-4 w-4 shrink-0' />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className='border-t p-3'>
        <div className='flex items-center justify-between group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-1'>
          <SchemeSelector />
          <ThemeToggle />
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
