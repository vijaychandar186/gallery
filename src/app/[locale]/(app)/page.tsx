import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { GALLERY_PROJECTS } from '@/config/gallery';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const t = await getTranslations('home');
  const tp = await getTranslations('projects');
  return (
    <div className='flex flex-1 flex-col gap-8 p-8'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>{t('title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('subtitle')}</p>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {GALLERY_PROJECTS.map(({ slug, label, Icon }) => (
          <Card key={slug} className='group transition-shadow hover:shadow-md'>
            <CardHeader className='pb-3'>
              <div className='mb-2 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted'>
                <Icon className='h-5 w-5 text-muted-foreground' />
              </div>
              <CardTitle className='text-base'>{label}</CardTitle>
              <CardDescription className='text-xs'>
                {tp(slug as Parameters<typeof tp>[0])}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size='sm' variant='outline' className='w-full'>
                <Link href={`/${slug}`}>{t('open')}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
