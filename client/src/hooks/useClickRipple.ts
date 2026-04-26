import { useEffect } from 'react';

/**
 * Attaches a global click listener that spawns two ripple rings
 * (cyan + purple) at the click position using the CSS .click-ripple class.
 */
export function useClickRipple(): void {
  useEffect(() => {
    // Only on pointer-fine devices (not touch)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handler = (e: MouseEvent) => {
      const spawn = (cls: string, delay: number) => {
        const el = document.createElement('div');
        el.className = cls;
        el.style.left = `${e.clientX}px`;
        el.style.top = `${e.clientY}px`;
        el.style.animationDelay = `${delay}ms`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 800 + delay);
      };

      spawn('click-ripple', 0);
      spawn('click-ripple secondary', 80);
    };

    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);
}
