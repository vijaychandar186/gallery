'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';

type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const MIN_W = 280;
const MIN_H = 180;

export function useResizable(elRef: RefObject<HTMLDivElement | null>) {
  const active = useRef(false);
  const dir = useRef<ResizeDir>('se');
  const startMouse = useRef({ x: 0, y: 0 });
  const startRect = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const onHandleMouseDown = useCallback(
    (e: ReactMouseEvent, d: ResizeDir) => {
      e.preventDefault();
      e.stopPropagation();
      if (!elRef.current) return;
      const el = elRef.current;
      const parent = el.offsetParent?.getBoundingClientRect() ?? { left: 0, top: 0 };
      const rect = el.getBoundingClientRect();
      active.current = true;
      dir.current = d;
      startMouse.current = { x: e.clientX, y: e.clientY };
      startRect.current = {
        x: rect.left - parent.left,
        y: rect.top - parent.top,
        w: rect.width,
        h: rect.height
      };
    },
    [elRef]
  );

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!active.current || !elRef.current) return;
      const dx = e.clientX - startMouse.current.x;
      const dy = e.clientY - startMouse.current.y;
      const { x, y, w, h } = startRect.current;
      const d = dir.current;

      let nx = x,
        ny = y,
        nw = w,
        nh = h;

      if (d.includes('e')) nw = Math.max(MIN_W, w + dx);
      if (d.includes('s')) nh = Math.max(MIN_H, h + dy);
      if (d.includes('w')) {
        nw = Math.max(MIN_W, w - dx);
        nx = x + w - nw;
      }
      if (d.includes('n')) {
        nh = Math.max(MIN_H, h - dy);
        ny = y + h - nh;
      }

      const el = elRef.current;
      el.style.left = `${nx}px`;
      el.style.top = `${ny}px`;
      el.style.width = `${nw}px`;
      el.style.height = `${nh}px`;
    }

    function onUp() {
      active.current = false;
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [elRef]);

  return { onHandleMouseDown };
}
