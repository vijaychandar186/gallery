'use client';

import { useCallback, useState } from 'react';
import { BootScreen } from './layout/boot-screen';
import { StatusBar } from './layout/status-bar';
import { Dock } from './layout/dock';
import { NotificationPanel } from './panels/notification-panel';
import { WindowFrame } from './windows/frame';
import { FileManagerWindow } from './windows/file-manager';
import { AboutWindow } from './windows/about';
import { MusicPlayerWindow } from './windows/music-player';
import { BrowserWindow } from './windows/browser';
import { MailClientWindow } from './windows/mail-client';
import { JsConsoleWindow } from './windows/js-console';
import { useWindowManager } from './hooks/use-window-manager';
import { ABOUT_CONFIG, DOCK_APPS, WINDOW_STAGGER } from './config';
import type { AppId } from './types';

function renderAppContent(id: AppId, onOpenApp: (id: AppId) => void) {
  switch (id) {
    case 'fileManager':
      return <FileManagerWindow onOpenApp={onOpenApp} />;
    case 'chrome':
      return <BrowserWindow />;
    case 'spotify':
      return <MusicPlayerWindow />;
    case 'mail':
      return <MailClientWindow />;
    case 'vscode':
      return <JsConsoleWindow />;
    default:
      return null;
  }
}

export function OsDesktop() {
  const [booted, setBooted] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { windows, openWindow, closeWindow, focusWindow, minimizeWindow, maximizeWindow } =
    useWindowManager();

  const closeAllPanels = useCallback(() => {
    setNotificationOpen(false);
  }, []);

  const handleOpenApp = useCallback(
    (id: AppId) => {
      const win = windows[id];
      if (win.isMinimized) {
        // Restore minimized window and focus it
        openWindow(id);
      } else if (win.isOpen) {
        // Clicking an open app in dock minimizes it (like macOS)
        minimizeWindow(id);
      } else {
        openWindow(id);
      }
      closeAllPanels();
    },
    [windows, openWindow, minimizeWindow, closeAllPanels]
  );

  const handleAbout = useCallback(() => {
    openWindow('about');
  }, [openWindow]);

  const handleRestart = useCallback(() => {
    setBooted(false);
  }, []);

  return (
    <>
      {!booted && <BootScreen onComplete={() => setBooted(true)} />}

      <div
        role='presentation'
        className='os-wallpaper relative h-full w-full select-none overflow-hidden'
        onClick={closeAllPanels}
        onKeyDown={(e) => {
          if (e.key === 'Escape') closeAllPanels();
        }}
      >
        <div className='pointer-events-none absolute inset-0 bg-black/40' />

        <StatusBar />

        {DOCK_APPS.map((app) => {
          const win = windows[app.id];
          if (!win.isOpen) return null;
          return (
            <WindowFrame
              key={`${app.id}-open`}
              id={app.id}
              title={app.label}
              initialPosition={WINDOW_STAGGER[app.id]}
              zIndex={win.zIndex}
              width={app.windowWidth}
              height={app.windowHeight}
              isMinimized={win.isMinimized}
              isMaximized={win.isMaximized}
              onClose={closeWindow}
              onFocus={focusWindow}
              onMinimize={minimizeWindow}
              onMaximize={maximizeWindow}
            >
              {renderAppContent(app.id, handleOpenApp)}
            </WindowFrame>
          );
        })}

        {windows.about.isOpen && (
          <WindowFrame
            key='about-open'
            id='about'
            title={ABOUT_CONFIG.label}
            initialPosition={WINDOW_STAGGER.about}
            zIndex={windows.about.zIndex}
            width={ABOUT_CONFIG.windowWidth}
            height={ABOUT_CONFIG.windowHeight}
            isMinimized={windows.about.isMinimized}
            isMaximized={windows.about.isMaximized}
            onClose={closeWindow}
            onFocus={focusWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
          >
            <AboutWindow />
          </WindowFrame>
        )}

        <NotificationPanel isOpen={notificationOpen} onOpenApp={handleOpenApp} />

        <Dock
          windows={windows}
          onOpenApp={handleOpenApp}
          onAbout={handleAbout}
          onRestart={handleRestart}
          onToggleNotification={() => setNotificationOpen((v) => !v)}
          notificationOpen={notificationOpen}
        />
      </div>
    </>
  );
}
