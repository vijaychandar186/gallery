'use client';

import { useCallback, useRef, useState } from 'react';
import type { AppId, WindowState } from '../types';

const ALL_IDS: AppId[] = ['fileManager', 'chrome', 'spotify', 'mail', 'vscode', 'about'];

function buildInitialState(): Record<AppId, WindowState> {
  return Object.fromEntries(
    ALL_IDS.map((id) => [
      id,
      { id, isOpen: false, zIndex: 10, isMinimized: false, isMaximized: false }
    ])
  ) as Record<AppId, WindowState>;
}

export function useWindowManager() {
  const [windows, setWindows] = useState<Record<AppId, WindowState>>(buildInitialState);
  const zCounter = useRef(10);

  const openWindow = useCallback((id: AppId) => {
    zCounter.current += 1;
    const z = zCounter.current;
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: true, isMinimized: false, isMaximized: false, zIndex: z }
    }));
  }, []);

  const closeWindow = useCallback((id: AppId) => {
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], isOpen: false } }));
  }, []);

  const focusWindow = useCallback((id: AppId) => {
    zCounter.current += 1;
    const z = zCounter.current;
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], zIndex: z } }));
  }, []);

  const minimizeWindow = useCallback((id: AppId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true, isMaximized: false }
    }));
  }, []);

  const maximizeWindow = useCallback((id: AppId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMaximized: !prev[id].isMaximized, isMinimized: false }
    }));
  }, []);

  return { windows, openWindow, closeWindow, focusWindow, minimizeWindow, maximizeWindow };
}
