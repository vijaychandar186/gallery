'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Song {
  id: number;
  title: string;
  artist: string;
  src: string;
  gradient: string;
}

const SONGS: Song[] = [
  {
    id: 1,
    title: 'Gymnopédie No. 1',
    artist: 'Erik Satie',
    src: '/BirdOS/audio/gymnopedie.ogg',
    gradient: 'from-violet-900 to-indigo-800'
  },
  {
    id: 2,
    title: 'Für Elise',
    artist: 'Ludwig van Beethoven',
    src: '/BirdOS/audio/fur-elise.ogg',
    gradient: 'from-rose-900 to-pink-800'
  },
  {
    id: 3,
    title: 'Cello Suite No. 1',
    artist: 'J.S. Bach',
    src: '/BirdOS/audio/bach-cello.ogg',
    gradient: 'from-amber-900 to-yellow-800'
  },
  {
    id: 4,
    title: 'C Major Prelude',
    artist: 'J.S. Bach',
    src: '/BirdOS/audio/bach-prelude.ogg',
    gradient: 'from-teal-900 to-emerald-800'
  },
  {
    id: 5,
    title: 'La Plus Que Lente',
    artist: 'Claude Debussy',
    src: '/BirdOS/audio/debussy-lente.ogg',
    gradient: 'from-blue-900 to-cyan-800'
  },
  {
    id: 6,
    title: 'Moonlight Sonata Mvt. 2',
    artist: 'Ludwig van Beethoven',
    src: '/BirdOS/audio/moonlight.ogg',
    gradient: 'from-slate-900 to-blue-900'
  },
  {
    id: 7,
    title: 'Rondo in F Major',
    artist: 'Wolfgang Mozart',
    src: '/BirdOS/audio/mozart.ogg',
    gradient: 'from-green-900 to-teal-800'
  }
];

function formatTime(s: number) {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export function MusicPlayerWindow() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const isPlayingRef = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isSeeking, setIsSeeking] = useState(false);

  const song = SONGS[currentIndex];

  useEffect(() => {
    const handler = (e: Event) => {
      const idx = (e as CustomEvent<{ index: number }>).detail?.index;
      if (typeof idx === 'number') {
        setCurrentIndex(idx);
        isPlayingRef.current = true;
        setIsPlaying(true);
        setTimeout(
          () =>
            audioRef.current?.play().catch(() => {
              isPlayingRef.current = false;
              setIsPlaying(false);
            }),
          100
        );
      }
    };
    window.addEventListener('birdos:play-track', handler);
    return () => window.removeEventListener('birdos:play-track', handler);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.src = song.src;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
    if (isPlayingRef.current) {
      audio.play().catch(() => {
        isPlayingRef.current = false;
        setIsPlaying(false);
      });
    }
  }, [currentIndex, song.src]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      if (!isSeeking) setCurrentTime(audio.currentTime);
    };
    const onDuration = () => setDuration(audio.duration);
    const onEnded = () => {
      setCurrentIndex((i) => (i + 1) % SONGS.length);
    };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('durationchange', onDuration);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('durationchange', onDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, [isSeeking]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlayingRef.current) {
      audio.pause();
      isPlayingRef.current = false;
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          isPlayingRef.current = true;
          setIsPlaying(true);
        })
        .catch(() => {
          isPlayingRef.current = false;
          setIsPlaying(false);
        });
    }
  }, []);

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + SONGS.length) % SONGS.length);
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % SONGS.length);
  }, []);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSeeking(true);
    setCurrentTime(Number(e.target.value));
  };

  const handleSeekCommit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    setIsSeeking(false);
    if (audioRef.current) audioRef.current.currentTime = val;
  };

  const playSong = useCallback((index: number) => {
    setCurrentIndex(index);
    isPlayingRef.current = true;
    setIsPlaying(true);
    setTimeout(() => {
      audioRef.current?.play().catch(() => {
        isPlayingRef.current = false;
        setIsPlaying(false);
      });
    }, 50);
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className='flex h-full bg-zinc-950 text-white'>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} preload='metadata' />

      {/* Left: Player */}
      <div className='flex flex-1 flex-col items-center justify-center gap-5 p-6'>
        {/* Album art */}
        <div
          className={`h-44 w-44 rounded-2xl bg-gradient-to-br ${song.gradient} flex items-center justify-center shadow-2xl`}
        >
          <svg width='64' height='64' viewBox='0 0 24 24' fill='none'>
            <circle cx='12' cy='12' r='3' fill='rgba(255,255,255,0.6)' />
            <circle
              cx='12'
              cy='12'
              r='8'
              stroke='rgba(255,255,255,0.3)'
              strokeWidth='1.5'
              fill='none'
            />
            <circle
              cx='12'
              cy='12'
              r='11'
              stroke='rgba(255,255,255,0.15)'
              strokeWidth='1'
              fill='none'
            />
          </svg>
        </div>

        {/* Track info */}
        <div className='text-center'>
          <p className='text-base font-bold text-white'>{song.title}</p>
          <p className='text-sm text-zinc-400'>{song.artist}</p>
        </div>

        {/* Progress */}
        <div className='w-full max-w-xs'>
          <input
            type='range'
            min={0}
            max={duration || 100}
            value={currentTime}
            step={0.1}
            onChange={handleSeekChange}
            onMouseUp={handleSeekCommit as unknown as React.MouseEventHandler}
            onTouchEnd={handleSeekCommit as unknown as React.TouchEventHandler}
            aria-label='Seek'
            className='w-full cursor-pointer'
            style={{
              appearance: 'none',
              height: '4px',
              borderRadius: '2px',
              background: `linear-gradient(to right, #22c55e ${progress}%, #3f3f46 ${progress}%)`
            }}
          />
          <div className='mt-1 flex justify-between text-[10px] text-zinc-500'>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className='flex items-center gap-4'>
          <button
            onClick={prev}
            className='text-zinc-400 transition-colors hover:text-white'
            aria-label='Previous'
          >
            <svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor'>
              <path d='M6 6h2v12H6zm3.5 6 8.5 6V6z' />
            </svg>
          </button>

          <button
            onClick={togglePlay}
            className='flex h-12 w-12 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105 active:scale-95'
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M6 19h4V5H6v14zm8-14v14h4V5h-4z' />
              </svg>
            ) : (
              <svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M8 5v14l11-7z' />
              </svg>
            )}
          </button>

          <button
            onClick={next}
            className='text-zinc-400 transition-colors hover:text-white'
            aria-label='Next'
          >
            <svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor'>
              <path d='M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z' />
            </svg>
          </button>
        </div>

        {/* Volume */}
        <div className='flex w-full max-w-xs items-center gap-2'>
          <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='shrink-0 text-zinc-400'
          >
            <path d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z' />
          </svg>
          <input
            type='range'
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label='Volume'
            className='w-full cursor-pointer'
            style={{
              appearance: 'none',
              height: '3px',
              borderRadius: '2px',
              background: `linear-gradient(to right, #a1a1aa ${volume * 100}%, #3f3f46 ${volume * 100}%)`
            }}
          />
          <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='shrink-0 text-zinc-400'
          >
            <path d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z' />
          </svg>
        </div>
      </div>

      {/* Right: Playlist */}
      <div className='flex w-52 shrink-0 flex-col border-l border-zinc-800'>
        <div className='border-b border-zinc-800 px-4 py-3'>
          <p className='text-xs font-semibold uppercase tracking-widest text-zinc-400'>Queue</p>
        </div>
        <ScrollArea className='flex-1'>
          <div className='py-1'>
            {SONGS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => playSong(i)}
                className={`w-full px-4 py-2.5 text-left transition-colors hover:bg-zinc-800 ${
                  i === currentIndex ? 'bg-zinc-800' : ''
                }`}
              >
                <p
                  className={`truncate text-sm font-medium ${i === currentIndex ? 'text-green-400' : 'text-zinc-200'}`}
                >
                  {s.title}
                </p>
                <p className='truncate text-xs text-zinc-500'>{s.artist}</p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
