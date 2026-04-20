export interface MusicFile {
  name: string;
  src: string;
  artist: string;
  index: number;
}

export const MUSIC_FILES: MusicFile[] = [
  {
    index: 0,
    name: 'Gymnopedie No. 1.ogg',
    artist: 'Erik Satie',
    src: '/BirdOS/audio/gymnopedie.ogg'
  },
  { index: 1, name: 'Fur Elise.ogg', artist: 'Beethoven', src: '/BirdOS/audio/fur-elise.ogg' },
  {
    index: 2,
    name: 'Cello Suite No. 1.ogg',
    artist: 'J.S. Bach',
    src: '/BirdOS/audio/bach-cello.ogg'
  },
  {
    index: 3,
    name: 'C Major Prelude.ogg',
    artist: 'J.S. Bach',
    src: '/BirdOS/audio/bach-prelude.ogg'
  },
  {
    index: 4,
    name: 'La Plus Que Lente.ogg',
    artist: 'Debussy',
    src: '/BirdOS/audio/debussy-lente.ogg'
  },
  {
    index: 5,
    name: 'Moonlight Sonata Mvt2.ogg',
    artist: 'Beethoven',
    src: '/BirdOS/audio/moonlight.ogg'
  },
  { index: 6, name: 'Rondo in F Major.ogg', artist: 'Mozart', src: '/BirdOS/audio/mozart.ogg' }
];

export interface DocFile {
  name: string;
  url: string;
  size: string;
}

export const DOC_FILES: DocFile[] = [
  {
    name: 'Attention Is All You Need.pdf',
    url: '/BirdOS/documents/attention-is-all-you-need.pdf',
    size: '2.2 MB'
  },
  {
    name: 'Emergent Abilities of LLMs.pdf',
    url: '/BirdOS/documents/emergent-abilities-llm.pdf',
    size: '2.6 MB'
  },
  { name: 'arxiv-0903.1476.pdf', url: '/BirdOS/documents/arxiv-0903.1476.pdf', size: '761 KB' },
  {
    name: 'Playing Atari with Deep RL.pdf',
    url: '/BirdOS/documents/playing-atari-deep-rl.pdf',
    size: '473 KB'
  }
];

export interface PictureFile {
  name: string;
  thumb: string;
  full: string;
}

export const PICTURE_FILES: PictureFile[] = [
  {
    name: 'Moon Landing.jpg',
    thumb: '/BirdOS/pictures/moon-landing.jpg',
    full: '/BirdOS/pictures/moon-landing.jpg'
  },
  {
    name: 'Mona Lisa.jpg',
    thumb: '/BirdOS/pictures/mona-lisa.jpg',
    full: '/BirdOS/pictures/mona-lisa.jpg'
  }
];

export interface VideoFile {
  name: string;
  desc: string;
  youtubeId: string | null;
  searchQuery?: string;
  size: string;
}

export const VIDEO_FILES: VideoFile[] = [
  {
    name: 'Me at the zoo.mp4',
    desc: 'First YouTube video ever • jawed • 2005',
    youtubeId: 'jNQXAC9IVRw',
    size: '18.4 MB'
  },
  {
    name: 'The Essence of Calculus.mp4',
    desc: '3Blue1Brown • 2017',
    youtubeId: 'WUvTyaaNkzM',
    size: '156.3 MB'
  },
  {
    name: 'Gangnam Style.mp4',
    desc: 'PSY • 2012 • First video to 1B views',
    youtubeId: '9bZkp7q19f0',
    size: '124.8 MB'
  },
  {
    name: 'Never Gonna Give You Up.mp4',
    desc: 'Rick Astley • 1987 • The original rickroll',
    youtubeId: 'dQw4w9WgXcQ',
    size: '35.2 MB'
  },
  {
    name: 'Charlie Bit My Finger.mp4',
    desc: 'Charlie Davies-Carr • 2007',
    youtubeId: '_OBlgSz8sSM',
    size: '4.8 MB'
  }
];

export function getVideoUrl(file: VideoFile) {
  return file.youtubeId
    ? `https://www.youtube.com/watch?v=${file.youtubeId}`
    : `https://www.youtube.com/results?search_query=${file.searchQuery ?? ''}`;
}

export interface FsEntry {
  name: string;
  type: string;
  size: string;
  isDir: boolean;
}

export const ROOT_DIRS = [
  'bin',
  'boot',
  'dev',
  'etc',
  'home',
  'lib',
  'lib64',
  'media',
  'mnt',
  'opt',
  'proc',
  'root',
  'run',
  'srv',
  'sys',
  'tmp',
  'usr',
  'var'
];

export const USB_FILES: FsEntry[] = [
  { name: 'vacation_photos', type: 'Folder', size: '—', isDir: true },
  { name: 'backup_2024-03-15.tar.gz', type: 'Archive', size: '1.2 GB', isDir: false },
  { name: 'notes.txt', type: 'Text Document', size: '3.4 KB', isDir: false },
  { name: 'project_export.zip', type: 'Archive', size: '48.2 MB', isDir: false }
];

export const DESKTOP_FILES: FsEntry[] = [
  { name: 'wallpaper.svg', type: 'Image', size: '4.2 KB', isDir: false },
  { name: 'README.md', type: 'Markdown', size: '1.1 KB', isDir: false },
  { name: 'BirdOS.desktop', type: 'App Shortcut', size: '0.2 KB', isDir: false }
];

export interface NetworkHost {
  name: string;
  address: string;
  type: string;
}

export const NETWORK_HOSTS: NetworkHost[] = [
  { name: 'Router', address: '192.168.1.1', type: 'Gateway' },
  { name: 'NAS-Storage', address: '192.168.1.100', type: 'Network Storage' },
  { name: 'WORKGROUP\\DESKTOP-PC', address: '192.168.1.105', type: 'Windows Share' }
];
