'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import type { Position } from '../types';

export function useDraggable(initialPosition: Position) {
  const elRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastMouse = useRef<Position>({ x: 0, y: 0 });
  const pos = useRef<Position>(initialPosition);

  const onTitleMouseDown = useCallback((e: ReactMouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    if (elRef.current) {
      elRef.current.style.left = `${initialPosition.x}px`;
      elRef.current.style.top = `${initialPosition.y}px`;
    }

    function onMouseMove(e: globalThis.MouseEvent) {
      if (!isDragging.current || !elRef.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      pos.current = { x: pos.current.x + dx, y: pos.current.y + dy };
      elRef.current.style.left = `${pos.current.x}px`;
      elRef.current.style.top = `${pos.current.y}px`;
    }

    function onMouseUp() {
      isDragging.current = false;
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [initialPosition]);

  return { elRef, onTitleMouseDown };
}
