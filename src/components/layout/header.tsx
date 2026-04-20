import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { InfobarTrigger } from '@/components/ui/infobar';

export function Header() {
  return (
    <header className='bg-background border-border flex h-14 shrink-0 items-center gap-2 border-b px-4'>
      <SidebarTrigger className='-ml-1' />
      <Separator orientation='vertical' className='h-4' />
      <div className='ml-auto'>
        <InfobarTrigger />
      </div>
    </header>
  );
}
