'use client';

import { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

export function BrowserWindow() {
  const [inputVal, setInputVal] = useState('https://www.google.com');
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'home' | 'blocked' | 'iframe'>('home');
  const [iframeUrl, setIframeUrl] = useState('');
  const [iframeLoading, setIframeLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const navigate = useCallback((target: string) => {
    let finalUrl = target.trim();
    if (!finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl;
    setInputVal(finalUrl);

    const blocked = [
      'google.com',
      'youtube.com',
      'facebook.com',
      'twitter.com',
      'instagram.com',
      'reddit.com',
      'github.com'
    ];
    const isBlocked = blocked.some((b) => finalUrl.includes(b));

    if (isBlocked) {
      setView('blocked');
    } else {
      setIframeLoading(true);
      setView('iframe');
    }
    setIframeUrl(finalUrl);
  }, []);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!query.trim()) return;
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      window.open(searchUrl, '_blank', 'noopener,noreferrer');
    },
    [query]
  );

  const handleAddressBar = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      navigate(inputVal);
    },
    [inputVal, navigate]
  );

  return (
    <div className='flex h-full flex-col bg-white dark:bg-zinc-900'>
      {/* Toolbar */}
      <div className='flex items-center gap-2 border-b border-border bg-zinc-100 px-3 py-2 dark:bg-zinc-800'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => {
            setView('home');
            setInputVal('https://www.google.com');
          }}
          aria-label='Home'
        >
          <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor'>
            <path d='M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' />
          </svg>
        </Button>
        <form onSubmit={handleAddressBar} className='flex flex-1 items-center'>
          <div className='flex flex-1 items-center rounded-full bg-white px-3 py-1 shadow-sm dark:bg-zinc-700'>
            <svg
              width='12'
              height='12'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='mr-2 shrink-0 text-muted-foreground'
            >
              <path d='M12 1C6.48 1 2 5.48 2 11s4.48 10 10 10 10-4.48 10-10S17.52 1 12 1zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z' />
            </svg>
            <Input
              type='text'
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className='flex-1 bg-transparent text-xs outline-none border-none shadow-none focus-visible:ring-0 h-auto p-0'
              placeholder='Search or enter URL'
            />
          </div>
          <button type='submit' className='sr-only'>
            Go
          </button>
        </form>
      </div>

      {/* Content */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {view === 'home' && (
          <div className='flex flex-1 flex-col items-center justify-center gap-8 p-8'>
            <div className='flex items-center gap-0.5 text-5xl font-bold'>
              <span className='text-blue-500'>G</span>
              <span className='text-red-500'>o</span>
              <span className='text-yellow-400'>o</span>
              <span className='text-blue-500'>g</span>
              <span className='text-green-500'>l</span>
              <span className='text-red-500'>e</span>
            </div>

            <form onSubmit={handleSearch} className='w-full max-w-md'>
              <div className='flex items-center rounded-full border border-zinc-200 px-4 py-2.5 shadow-sm hover:shadow-md dark:border-zinc-600 dark:bg-zinc-800'>
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  className='mr-3 shrink-0 text-zinc-400'
                >
                  <circle cx='11' cy='11' r='8' />
                  <path d='m21 21-4.35-4.35' />
                </svg>
                <Input
                  type='text'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='Search Google or type a URL'
                  className='flex-1 bg-transparent text-sm outline-none border-none shadow-none focus-visible:ring-0 h-auto p-0'
                />
              </div>
              <div className='mt-6 flex justify-center gap-3'>
                <Button type='submit' variant='secondary' size='sm'>
                  Google Search
                </Button>
                <Button
                  type='button'
                  variant='secondary'
                  size='sm'
                  onClick={() =>
                    window.open('https://www.google.com', '_blank', 'noopener,noreferrer')
                  }
                >
                  Open Google ↗
                </Button>
              </div>
            </form>

            <p className='text-xs text-muted-foreground'>Searches open in a new tab</p>
          </div>
        )}

        {view === 'blocked' && (
          <div className='flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center'>
            <svg
              width='48'
              height='48'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.5'
              className='text-muted-foreground'
            >
              <circle cx='12' cy='12' r='10' />
              <path d='m4.93 4.93 14.14 14.14' />
            </svg>
            <div>
              <p className='font-semibold'>Can&apos;t display this page</p>
              <p className='mt-1 text-sm text-muted-foreground'>{iframeUrl} blocks embedding</p>
            </div>
            <Button
              onClick={() => window.open(iframeUrl, '_blank', 'noopener,noreferrer')}
              className='rounded-lg bg-blue-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600'
            >
              Open in new tab ↗
            </Button>
          </div>
        )}

        {view === 'iframe' && (
          <div className='relative flex-1'>
            {iframeLoading && <Skeleton className='absolute inset-0 rounded-none' />}
            <iframe
              ref={iframeRef}
              src={iframeUrl}
              className='h-full w-full border-none'
              title='Browser'
              sandbox='allow-scripts allow-forms allow-popups'
              onError={() => setView('blocked')}
              onLoad={() => setIframeLoading(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
