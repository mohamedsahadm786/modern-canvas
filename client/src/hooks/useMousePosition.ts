import { useEffect, useRef } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

/**
 * Tracks global mouse position using a ref — zero re-renders.
 * Safe to read in requestAnimationFrame loops.
 */
export function useMousePosition(): React.RefObject<MousePosition> {
  const pos = useRef<MousePosition>({ x: -1000, y: -1000 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return pos;
}
