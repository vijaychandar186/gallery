'use client';

import { useState } from 'react';
import Image from 'next/image';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { FILE_MANAGER_FOLDERS, SIDEBAR_DEVICES, SIDEBAR_PLACES } from '../config';
import {
  DOC_FILES,
  DESKTOP_FILES,
  MUSIC_FILES,
  NETWORK_HOSTS,
  PICTURE_FILES,
  ROOT_DIRS,
  USB_FILES,
  VIDEO_FILES,
  getVideoUrl,
  type DocFile,
  type PictureFile,
  type MusicFile
} from '../data/file-manager-data';
import type { AppId } from '../types';

interface Props {
  onOpenApp?: (id: AppId) => void;
}

type View =
  | 'home'
  | 'music'
  | 'documents'
  | 'pictures'
  | 'videos'
  | 'trash'
  | 'network'
  | 'desktop'
  | 'filesystem'
  | 'usb';

const VIEW_FOR_PLACE: Record<string, View> = {
  Computer: 'home',
  Documents: 'documents',
  Downloads: 'home',
  Music: 'music',
  Videos: 'videos',
  Pictures: 'pictures',
  Trash: 'trash',
  'File System': 'filesystem',
  'USB Drive': 'usb',
  Network: 'network',
  Desktop: 'desktop'
};

const PATH_FOR_VIEW: Record<View, string> = {
  home: '/home/user/',
  music: '/home/user/Music/',
  documents: '/home/user/Documents/',
  pictures: '/home/user/Pictures/',
  videos: '/home/user/Videos/',
  trash: 'trash://',
  network: 'network://',
  desktop: '/home/user/Desktop/',
  filesystem: '/',
  usb: '/media/usb0/'
};

const FOLDER_VIEW_MAP: Record<string, View> = {
  Documents: 'documents',
  Pictures: 'pictures',
  Videos: 'videos',
  Network: 'network',
  Desktop: 'desktop'
};

const BackArrow = () => (
  <svg width='12' height='12' viewBox='0 0 24 24' fill='currentColor'>
    <path d='M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z' />
  </svg>
);

export function FileManagerWindow({ onOpenApp }: Props) {
  const [view, setView] = useState<View>('home');
  const [activeSidebar, setActiveSidebar] = useState('Computer');
  const [previewImage, setPreviewImage] = useState<PictureFile | null>(null);
  const [openDoc, setOpenDoc] = useState<DocFile | null>(null);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleMusicFile = (file: MusicFile) => {
    window.dispatchEvent(new CustomEvent('birdos:play-track', { detail: { index: file.index } }));
    onOpenApp?.('spotify');
  };

  const navigateTo = (name: string, targetView: View) => {
    setActiveSidebar(name);
    setView(targetView);
    setPreviewImage(null);
    setOpenDoc(null);
    setPdfLoaded(false);
    setImgLoaded(false);
  };

  const openPdf = (file: DocFile) => {
    setPdfLoaded(false);
    setOpenDoc(file);
  };

  const openImage = (file: PictureFile) => {
    setImgLoaded(false);
    setPreviewImage(file);
  };

  return (
    <div className='flex h-full'>
      {/* Sidebar */}
      <aside className='flex w-44 shrink-0 flex-col gap-3 border-r border-border bg-muted/20 py-3'>
        <div className='px-2'>
          <p className='mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground'>
            Places
          </p>
          {SIDEBAR_PLACES.map((name) => (
            <Button
              key={name}
              variant='ghost'
              className={`w-full justify-start text-xs ${activeSidebar === name ? 'bg-muted font-semibold' : ''}`}
              onClick={() => navigateTo(name, VIEW_FOR_PLACE[name] ?? 'home')}
            >
              {name}
            </Button>
          ))}
        </div>
        <Separator />
        <div className='px-2'>
          <p className='mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground'>
            Devices
          </p>
          {SIDEBAR_DEVICES.map((name) => (
            <Button
              key={name}
              variant='ghost'
              className={`w-full justify-start text-xs ${activeSidebar === name ? 'bg-muted font-semibold' : ''}`}
              onClick={() => navigateTo(name, VIEW_FOR_PLACE[name] ?? 'home')}
            >
              {name}
            </Button>
          ))}
        </div>
      </aside>

      {/* Main area */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* Path bar */}
        <div className='flex items-center gap-2 border-b border-border px-4 py-2'>
          {view !== 'home' && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigateTo('Computer', 'home')}
              className='h-6 gap-1.5 px-2 text-xs'
              aria-label='Back'
            >
              <BackArrow />
            </Button>
          )}
          <span className='font-mono text-xs text-muted-foreground'>{PATH_FOR_VIEW[view]}</span>
        </div>

        {/* Home grid */}
        {view === 'home' && (
          <>
            <ScrollArea className='flex-1'>
              <div className='grid grid-cols-3 gap-1 p-4 sm:grid-cols-4 lg:grid-cols-6'>
                {FILE_MANAGER_FOLDERS.map((folder) => {
                  const target = FOLDER_VIEW_MAP[folder.name];
                  return (
                    <Button
                      key={folder.name}
                      variant='ghost'
                      className='h-auto flex-col gap-2 rounded-lg p-3'
                      onDoubleClick={() => {
                        if (target) navigateTo(folder.name, target);
                      }}
                    >
                      <HugeiconsIcon icon={folder.icon} size={48} strokeWidth={1.5} />
                      <span className='text-center text-xs leading-tight'>{folder.name}</span>
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
            <Separator />
            <div className='px-4 py-2'>
              <span className='text-xs text-muted-foreground'>6 folders • 23 MB</span>
            </div>
          </>
        )}

        {/* Documents — file list */}
        {view === 'documents' && !openDoc && (
          <>
            <ScrollArea className='flex-1'>
              <div className='p-2'>
                {DOC_FILES.map((file) => (
                  <Button
                    key={file.name}
                    variant='ghost'
                    onDoubleClick={() => openPdf(file)}
                    className='h-auto w-full justify-start gap-3 rounded-lg px-3 py-2'
                  >
                    <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/40'>
                      <svg
                        width='18'
                        height='18'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                        className='text-red-600 dark:text-red-400'
                      >
                        <path d='M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z' />
                      </svg>
                    </div>
                    <div className='min-w-0 flex-1 text-left'>
                      <p className='truncate text-sm font-medium'>{file.name}</p>
                      <p className='text-xs text-muted-foreground'>PDF Document • {file.size}</p>
                    </div>
                    <span className='shrink-0 text-xs text-muted-foreground'>{file.size}</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <div className='px-4 py-2'>
              <span className='text-xs text-muted-foreground'>
                {DOC_FILES.length} files • Double-click to open
              </span>
            </div>
          </>
        )}

        {/* Documents — PDF viewer */}
        {view === 'documents' && openDoc && (
          <div className='flex flex-1 flex-col overflow-hidden'>
            <div className='flex items-center gap-2 border-b border-border bg-muted/20 px-3 py-1.5'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setOpenDoc(null)}
                className='h-6 gap-1.5 px-2 text-xs'
              >
                <BackArrow />
                Back
              </Button>
              <span className='flex-1 truncate text-center text-xs font-medium'>
                {openDoc.name}
              </span>
            </div>
            <div className='relative flex-1 overflow-hidden'>
              {!pdfLoaded && <Skeleton className='absolute inset-0 rounded-none' />}
              <iframe
                src={openDoc.url}
                className='h-full w-full border-none'
                title={openDoc.name}
                onLoad={() => setPdfLoaded(true)}
              />
            </div>
          </div>
        )}

        {/* Pictures — grid */}
        {view === 'pictures' && !previewImage && (
          <>
            <ScrollArea className='flex-1'>
              <div className='grid grid-cols-2 gap-3 p-4 sm:grid-cols-3'>
                {PICTURE_FILES.map((file) => (
                  <Button
                    key={file.name}
                    variant='ghost'
                    onDoubleClick={() => openImage(file)}
                    className='group h-auto flex-col gap-2 rounded-lg p-2'
                  >
                    <div className='relative aspect-square w-full overflow-hidden rounded-md bg-muted'>
                      <Skeleton className='absolute inset-0' />
                      <Image
                        src={file.thumb}
                        alt={file.name}
                        fill
                        sizes='200px'
                        className='object-cover transition-transform duration-200 group-hover:scale-105'
                      />
                    </div>
                    <span className='truncate text-center text-xs'>{file.name}</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <div className='px-4 py-2'>
              <span className='text-xs text-muted-foreground'>
                {PICTURE_FILES.length} files • Double-click to view
              </span>
            </div>
          </>
        )}

        {/* Pictures — image viewer */}
        {view === 'pictures' && previewImage && (
          <div className='flex flex-1 flex-col overflow-hidden'>
            <div className='flex items-center gap-2 border-b border-border bg-muted/20 px-3 py-1.5'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setPreviewImage(null)}
                className='h-6 gap-1.5 px-2 text-xs'
              >
                <BackArrow />
                Back
              </Button>
              <span className='flex-1 truncate text-center text-xs font-medium'>
                {previewImage.name}
              </span>
              <div className='flex gap-1'>
                {PICTURE_FILES.map((f) => (
                  <Button
                    key={f.name}
                    size='icon'
                    variant='ghost'
                    onClick={() => openImage(f)}
                    aria-label={f.name}
                    className={`h-3 w-5 rounded-full p-0 ${f.name === previewImage.name ? 'bg-foreground hover:bg-foreground' : 'bg-muted-foreground/40 hover:bg-muted-foreground'}`}
                  />
                ))}
              </div>
            </div>
            <div className='relative flex-1 overflow-hidden bg-black/5 dark:bg-black/30'>
              {!imgLoaded && <Skeleton className='absolute inset-0 rounded-none' />}
              <Image
                src={previewImage.full}
                alt={previewImage.name}
                fill
                sizes='100vw'
                className='object-contain p-4 shadow-lg'
                onLoad={() => setImgLoaded(true)}
              />
            </div>
          </div>
        )}

        {/* Videos */}
        {view === 'videos' && (
          <>
            <ScrollArea className='flex-1'>
              <div className='p-2'>
                {VIDEO_FILES.map((file) => (
                  <Button
                    key={file.name}
                    variant='ghost'
                    onDoubleClick={() =>
                      window.open(getVideoUrl(file), '_blank', 'noopener,noreferrer')
                    }
                    className='h-auto w-full justify-start gap-3 rounded-lg px-3 py-2'
                  >
                    <div className='relative h-12 w-20 shrink-0 overflow-hidden rounded bg-muted flex items-center justify-center'>
                      {file.youtubeId ? (
                        <Image
                          src={`https://img.youtube.com/vi/${file.youtubeId}/hqdefault.jpg`}
                          alt={file.name}
                          fill
                          sizes='80px'
                          className='object-cover'
                        />
                      ) : (
                        <svg
                          width='20'
                          height='20'
                          viewBox='0 0 24 24'
                          fill='currentColor'
                          className='text-muted-foreground'
                        >
                          <path d='M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z' />
                        </svg>
                      )}
                    </div>
                    <div className='min-w-0 flex-1 text-left'>
                      <p className='truncate text-sm font-medium'>{file.name}</p>
                      <p className='text-xs text-muted-foreground'>{file.desc}</p>
                    </div>
                    <span className='shrink-0 text-xs text-muted-foreground'>{file.size}</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <div className='px-4 py-2'>
              <span className='text-xs text-muted-foreground'>
                {VIDEO_FILES.length} files • Double-click to open on YouTube
              </span>
            </div>
          </>
        )}

        {/* Music */}
        {view === 'music' && (
          <>
            <ScrollArea className='flex-1'>
              <div className='p-2'>
                {MUSIC_FILES.map((file) => (
                  <Button
                    key={file.name}
                    variant='ghost'
                    onDoubleClick={() => handleMusicFile(file)}
                    className='h-auto w-full justify-start gap-3 rounded-lg px-3 py-2'
                  >
                    <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/40'>
                      <svg
                        width='18'
                        height='18'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                        className='text-violet-600 dark:text-violet-300'
                      >
                        <path d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' />
                      </svg>
                    </div>
                    <div className='min-w-0 flex-1 text-left'>
                      <p className='truncate text-sm font-medium'>{file.name}</p>
                      <p className='text-xs text-muted-foreground'>{file.artist} • OGG Audio</p>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <div className='px-4 py-2'>
              <span className='text-xs text-muted-foreground'>
                {MUSIC_FILES.length} files • Double-click to play in Music Player
              </span>
            </div>
          </>
        )}

        {/* Trash */}
        {view === 'trash' && (
          <div className='flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground'>
            <svg
              width='48'
              height='48'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.2'
            >
              <polyline points='3 6 5 6 21 6' />
              <path d='M19 6l-1 14H6L5 6' />
              <path d='M10 11v6M14 11v6' />
              <path d='M9 6V4h6v2' />
            </svg>
            <p className='text-sm font-medium'>Trash is empty</p>
            <p className='text-xs opacity-60'>Deleted files will appear here</p>
          </div>
        )}

        {/* Network */}
        {view === 'network' && (
          <>
            <ScrollArea className='flex-1'>
              <div className='p-2'>
                {NETWORK_HOSTS.map((host) => (
                  <div
                    key={host.name}
                    className='flex w-full items-center gap-3 rounded-lg px-3 py-2'
                  >
                    <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40'>
                      <svg
                        width='18'
                        height='18'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                        className='text-blue-600 dark:text-blue-400'
                      >
                        <path d='M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z' />
                      </svg>
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-sm font-medium'>{host.name}</p>
                      <p className='text-xs text-muted-foreground'>
                        {host.type} • {host.address}
                      </p>
                    </div>
                    <span className='shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900/40 dark:text-green-400'>
                      online
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <div className='px-4 py-2'>
              <span className='text-xs text-muted-foreground'>
                {NETWORK_HOSTS.length} hosts discovered
              </span>
            </div>
          </>
        )}

        {/* Desktop */}
        {view === 'desktop' && (
          <>
            <ScrollArea className='flex-1'>
              <div className='p-2'>
                {DESKTOP_FILES.map((file) => (
                  <div
                    key={file.name}
                    className='flex w-full items-center gap-3 rounded-lg px-3 py-2'
                  >
                    <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted'>
                      <svg
                        width='18'
                        height='18'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                        className='text-muted-foreground'
                      >
                        <path d='M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z' />
                      </svg>
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-sm font-medium'>{file.name}</p>
                      <p className='text-xs text-muted-foreground'>
                        {file.type} • {file.size}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <div className='px-4 py-2'>
              <span className='text-xs text-muted-foreground'>{DESKTOP_FILES.length} items</span>
            </div>
          </>
        )}

        {/* File System */}
        {view === 'filesystem' && (
          <>
            <ScrollArea className='flex-1'>
              <div className='grid grid-cols-3 gap-1 p-4 sm:grid-cols-4 lg:grid-cols-6'>
                {ROOT_DIRS.map((dir) => (
                  <div
                    key={dir}
                    className='flex flex-col items-center gap-2 rounded-lg p-3 opacity-70'
                    title='Read-only'
                  >
                    <svg
                      width='40'
                      height='40'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                      className='text-muted-foreground'
                    >
                      <path d='M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z' />
                    </svg>
                    <span className='font-mono text-center text-xs leading-tight'>{dir}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <div className='px-4 py-2'>
              <span className='text-xs text-muted-foreground'>
                {ROOT_DIRS.length} directories • read-only
              </span>
            </div>
          </>
        )}

        {/* USB Drive */}
        {view === 'usb' && (
          <>
            <ScrollArea className='flex-1'>
              <div className='p-2'>
                {USB_FILES.map((file) => (
                  <div
                    key={file.name}
                    className='flex w-full items-center gap-3 rounded-lg px-3 py-2'
                  >
                    <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/40'>
                      {file.isDir ? (
                        <svg
                          width='18'
                          height='18'
                          viewBox='0 0 24 24'
                          fill='currentColor'
                          className='text-orange-600 dark:text-orange-400'
                        >
                          <path d='M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z' />
                        </svg>
                      ) : (
                        <svg
                          width='18'
                          height='18'
                          viewBox='0 0 24 24'
                          fill='currentColor'
                          className='text-orange-600 dark:text-orange-400'
                        >
                          <path d='M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z' />
                        </svg>
                      )}
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-sm font-medium'>{file.name}</p>
                      <p className='text-xs text-muted-foreground'>
                        {file.type} • {file.size}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <div className='px-4 py-2'>
              <span className='text-xs text-muted-foreground'>
                {USB_FILES.length} items • USB Mass Storage
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
