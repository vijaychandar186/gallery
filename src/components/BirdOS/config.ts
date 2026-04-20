import {
  ChromeIcon,
  CodeIcon,
  FolderDownloadIcon,
  FolderLibraryIcon,
  FolderOpenIcon,
  FolderVideoIcon,
  ImageIcon,
  Mail01Icon,
  SpotifyIcon,
  UserCircleIcon,
  Wifi01Icon
} from '@hugeicons/core-free-icons';
import type { IconSvgElement } from '@hugeicons/react';
import type { AppId, Position } from './types';

export interface AppConfig {
  id: AppId;
  label: string;
  icon: IconSvgElement;
  windowWidth: number;
  windowHeight: number;
}

export interface FolderConfig {
  name: string;
  icon: IconSvgElement;
}

export const DOCK_APPS: AppConfig[] = [
  {
    id: 'fileManager',
    label: 'Files',
    icon: FolderOpenIcon,
    windowWidth: 800,
    windowHeight: 550
  },
  {
    id: 'chrome',
    label: 'Chrome',
    icon: ChromeIcon,
    windowWidth: 860,
    windowHeight: 580
  },
  {
    id: 'spotify',
    label: 'Music',
    icon: SpotifyIcon,
    windowWidth: 780,
    windowHeight: 520
  },
  {
    id: 'mail',
    label: 'Mail',
    icon: Mail01Icon,
    windowWidth: 740,
    windowHeight: 520
  },
  {
    id: 'vscode',
    label: 'IDE',
    icon: CodeIcon,
    windowWidth: 860,
    windowHeight: 560
  }
];

export const ABOUT_CONFIG: AppConfig = {
  id: 'about',
  label: 'About',
  icon: UserCircleIcon,
  windowWidth: 380,
  windowHeight: 300
};

export const WINDOW_STAGGER: Record<AppId, Position> = {
  fileManager: { x: 80, y: 60 },
  chrome: { x: 120, y: 80 },
  spotify: { x: 160, y: 100 },
  mail: { x: 100, y: 70 },
  vscode: { x: 140, y: 90 },
  about: { x: 300, y: 150 }
};

export const FILE_MANAGER_FOLDERS: FolderConfig[] = [
  { name: 'Documents', icon: FolderLibraryIcon },
  { name: 'Downloads', icon: FolderDownloadIcon },
  { name: 'Pictures', icon: ImageIcon },
  { name: 'Videos', icon: FolderVideoIcon },
  { name: 'Network', icon: Wifi01Icon },
  { name: 'Desktop', icon: FolderOpenIcon }
];

export const SIDEBAR_PLACES = [
  'Computer',
  'Documents',
  'Downloads',
  'Music',
  'Videos',
  'Pictures',
  'Trash'
];
export const SIDEBAR_DEVICES = ['File System', 'USB Drive'];
