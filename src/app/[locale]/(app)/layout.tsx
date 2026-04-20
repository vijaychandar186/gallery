import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { IconX } from '@tabler/icons-react';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header';
import { InfobarProviderWithCookie } from '@/components/layout/infobar-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import {
  Infobar,
  InfobarContent,
  InfobarGroup,
  InfobarGroupContent,
  InfobarGroupLabel,
  InfobarHeader,
  InfobarSeparator,
  InfobarTrigger
} from '@/components/ui/infobar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { InfobarBody } from '@/components/layout/infobar-body';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const raw = cookieStore.get('sidebar_state')?.value;
  const defaultOpen = raw !== 'false';
  const infobarRaw = cookieStore.get('infobar_state')?.value;
  const infobarDefaultOpen = infobarRaw !== 'false';
  const t = await getTranslations('infobar');

  return (
    <InfobarProviderWithCookie defaultOpen={infobarDefaultOpen}>
      <SidebarProvider defaultOpen={defaultOpen} className='h-screen min-h-0 overflow-hidden'>
        <AppSidebar />
        <div className='bg-background text-foreground flex min-w-0 flex-1 flex-col overflow-hidden'>
          <Header />
          <main className='flex flex-1 flex-col overflow-hidden'>{children}</main>
        </div>
      </SidebarProvider>
      <Infobar side='right' collapsible='offcanvas'>
        <InfobarHeader className='h-14 justify-center border-b p-0'>
          <div className='flex h-full items-center justify-between px-3'>
            <span className='text-sidebar-foreground text-sm font-semibold'>{t('title')}</span>
            <InfobarTrigger>
              <IconX className='size-4' />
            </InfobarTrigger>
          </div>
        </InfobarHeader>
        <InfobarContent className='overflow-hidden'>
          <InfobarBody>
            <ScrollArea className='h-full'>
              <InfobarGroup>
                <InfobarGroupLabel>{t('about_label')}</InfobarGroupLabel>
                <InfobarGroupContent>
                  <p className='text-muted-foreground break-words px-2 text-xs leading-relaxed'>
                    {t('about_content')}
                  </p>
                </InfobarGroupContent>
              </InfobarGroup>
              <InfobarSeparator />
              <InfobarGroup>
                <InfobarGroupLabel>{t('navigate_label')}</InfobarGroupLabel>
                <InfobarGroupContent>
                  <p className='text-muted-foreground break-words px-2 text-xs leading-relaxed'>
                    {t('navigate_content')}
                  </p>
                </InfobarGroupContent>
              </InfobarGroup>
              <InfobarSeparator />
              <InfobarGroup>
                <InfobarGroupLabel>{t('shortcuts_label')}</InfobarGroupLabel>
                <InfobarGroupContent>
                  <div className='space-y-2 px-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground text-xs'>{t('toggle_infobar')}</span>
                      <div className='flex items-center gap-1'>
                        <kbd className='bg-muted rounded border px-1.5 py-0.5 font-mono text-xs'>
                          ⌘I
                        </kbd>
                      </div>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground text-xs'>{t('toggle_sidebar')}</span>
                      <div className='flex items-center gap-1'>
                        <kbd className='bg-muted rounded border px-1.5 py-0.5 font-mono text-xs'>
                          ⌘B
                        </kbd>
                      </div>
                    </div>
                  </div>
                </InfobarGroupContent>
              </InfobarGroup>
            </ScrollArea>
          </InfobarBody>
        </InfobarContent>
      </Infobar>
    </InfobarProviderWithCookie>
  );
}
