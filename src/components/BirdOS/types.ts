export type AppId = 'fileManager' | 'chrome' | 'spotify' | 'mail' | 'vscode' | 'about';

export interface Position {
  x: number;
  y: number;
}

export interface WindowState {
  id: AppId;
  isOpen: boolean;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
}
