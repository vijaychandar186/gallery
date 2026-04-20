'use client';

import { type ReactNode, useCallback } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { useDraggable } from '../hooks/use-draggable';
import { useResizable } from '../hooks/use-resizable';
import type { AppId, Position } from '../types';

interface WindowFrameProps {
  id: AppId;
  title: string;
  initialPosition: Position;
  zIndex: number;
  width?: number;
  height?: number;
  isMinimized: boolean;
  isMaximized: boolean;
  onClose: (id: AppId) => void;
  onFocus: (id: AppId) => void;
  onMinimize: (id: AppId) => void;
  onMaximize: (id: AppId) => void;
  children: ReactNode;
}

export function WindowFrame({
  id,
  title,
  initialPosition,
  zIndex,
  width = 800,
  height = 550,
  isMinimized,
  isMaximized,
  onClose,
  onFocus,
  onMinimize,
  onMaximize,
  children
}: WindowFrameProps) {
  const { elRef, onTitleMouseDown } = useDraggable(initialPosition);
  const { onHandleMouseDown } = useResizable(elRef);

  const handleFocus = useCallback(() => onFocus(id), [id, onFocus]);

  const handleClose = useCallback(
    (e: ReactMouseEvent) => {
      e.stopPropagation();
      onClose(id);
    },
    [id, onClose]
  );

  const handleMinimize = useCallback(
    (e: ReactMouseEvent) => {
      e.stopPropagation();
      onMinimize(id);
    },
    [id, onMinimize]
  );

  const handleMaximize = useCallback(
    (e: ReactMouseEvent) => {
      e.stopPropagation();
      onMaximize(id);
    },
    [id, onMaximize]
  );

  return (
    <div
      ref={elRef}
      className='animate-in fade-in zoom-in-90 absolute flex flex-col rounded-xl border border-border bg-card shadow-2xl duration-200'
      style={
        isMaximized
          ? {
              top: '3rem',
              left: 0,
              right: 0,
              bottom: '5rem',
              width: 'auto',
              height: 'auto',
              zIndex
            }
          : isMinimized
            ? { left: initialPosition.x, top: initialPosition.y, width, height: 40, zIndex }
            : { left: initialPosition.x, top: initialPosition.y, width, height, zIndex }
      }
      onMouseDown={handleFocus}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {/* Title bar */}
      <div
        className='flex h-10 shrink-0 cursor-grab select-none items-center gap-3 border-b border-border bg-card px-4 active:cursor-grabbing'
        onMouseDown={onTitleMouseDown}
      >
        <div className='flex items-center gap-1.5'>
          <Button
            variant='ghost'
            className='h-3 w-3 rounded-full bg-red-400 p-0 hover:bg-red-500'
            onMouseDown={(e) => e.stopPropagation()}
            onClick={handleClose}
            aria-label='Close'
          />
          <Button
            variant='ghost'
            className='h-3 w-3 rounded-full bg-yellow-400 p-0 hover:bg-yellow-500'
            onMouseDown={(e) => e.stopPropagation()}
            onClick={handleMinimize}
            aria-label='Minimize'
          />
          <Button
            variant='ghost'
            className='h-3 w-3 rounded-full bg-neutral-400 p-0 hover:bg-neutral-500'
            onMouseDown={(e) => e.stopPropagation()}
            onClick={handleMaximize}
            aria-label='Maximize'
          />
        </div>
        <span className='flex-1 text-center text-sm font-medium text-card-foreground'>{title}</span>
        <div className='w-14' aria-hidden='true' />
      </div>

      {/* Content — always mounted so audio/state persists when minimized */}
      <div className={`flex-1 overflow-hidden rounded-b-xl${isMinimized ? ' hidden' : ''}`}>
        {children}
      </div>

      {/* Resize handles */}
      {!isMaximized && !isMinimized && (
        <>
          <div
            className='absolute inset-x-2 top-0 h-1 cursor-n-resize'
            onMouseDown={(e) => onHandleMouseDown(e, 'n')}
          />
          <div
            className='absolute inset-x-2 bottom-0 h-1 cursor-s-resize'
            onMouseDown={(e) => onHandleMouseDown(e, 's')}
          />
          <div
            className='absolute inset-y-2 left-0 w-1 cursor-w-resize'
            onMouseDown={(e) => onHandleMouseDown(e, 'w')}
          />
          <div
            className='absolute inset-y-2 right-0 w-1 cursor-e-resize'
            onMouseDown={(e) => onHandleMouseDown(e, 'e')}
          />
          <div
            className='absolute left-0 top-0 h-3 w-3 cursor-nw-resize'
            onMouseDown={(e) => onHandleMouseDown(e, 'nw')}
          />
          <div
            className='absolute right-0 top-0 h-3 w-3 cursor-ne-resize'
            onMouseDown={(e) => onHandleMouseDown(e, 'ne')}
          />
          <div
            className='absolute bottom-0 left-0 h-3 w-3 cursor-sw-resize'
            onMouseDown={(e) => onHandleMouseDown(e, 'sw')}
          />
          <div
            className='absolute bottom-0 right-0 h-3 w-3 cursor-se-resize'
            onMouseDown={(e) => onHandleMouseDown(e, 'se')}
          />
        </>
      )}
    </div>
  );
}
