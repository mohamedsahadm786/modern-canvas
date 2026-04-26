import { useEffect, useRef } from 'react';

const TRAIL_LENGTH = 10;

/**
 * Custom cursor: glowing dot (zero-lag) + lagging ring + fading trail.
 * Only rendered on pointer-fine (non-touch) devices.
 */
export default function CustomCursor() {
  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Don't activate on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot   = dotRef.current;
    const ring  = ringRef.current;
    if (!dot || !ring) return;

    let mx = -200, my = -200;
    let rx = -200, ry = -200;
    let rafId: number;

    // Trail positions ring-buffer
    const trail: Array<{ x: number; y: number }> = Array(TRAIL_LENGTH)
      .fill(null)
      .map(() => ({ x: -200, y: -200 }));
    let trailIdx = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      // Instantly move dot
      dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;

      // Store trail point
      trail[trailIdx % TRAIL_LENGTH] = { x: mx, y: my };
      trailIdx++;

      // Update trail elements
      trailRef.current.forEach((el, i) => {
        if (!el) return;
        const idx = (trailIdx - 1 - i + TRAIL_LENGTH * 10) % TRAIL_LENGTH;
        const pt  = trail[idx] ?? { x: -200, y: -200 };
        const alpha = (1 - i / TRAIL_LENGTH) * 0.35;
        const size  = 3 - (i / TRAIL_LENGTH) * 2;
        el.style.transform  = `translate(${pt.x - size / 2}px, ${pt.y - size / 2}px)`;
        el.style.opacity    = String(alpha);
        el.style.width      = `${size}px`;
        el.style.height     = `${size}px`;
      });
    };

    // Lerp ring toward cursor each frame
    const tick = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // Hover state: enlarge ring, change dot color on buttons/links
    const onEnter = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.closest('a, button, [role="button"]')) {
        ring.style.width  = '48px';
        ring.style.height = '48px';
        ring.style.borderColor = 'var(--neon-purple, #7c3aed)';
        dot.style.background   = 'var(--neon-purple, #7c3aed)';
        dot.style.boxShadow    = '0 0 8px var(--neon-purple, #7c3aed)';
      }
    };
    const onLeave = () => {
      ring.style.width  = '32px';
      ring.style.height = '32px';
      ring.style.borderColor = 'var(--neon-cyan, #00d4ff)';
      dot.style.background   = 'var(--neon-cyan, #00d4ff)';
      dot.style.boxShadow    = '0 0 8px var(--neon-cyan, #00d4ff)';
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover',  onEnter);
    document.addEventListener('mouseout',   onLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover',  onEnter);
      document.removeEventListener('mouseout',   onLeave);
    };
  }, []);

  // Don't render on touch devices at all
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  const cursorBase: React.CSSProperties = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 9999,
    borderRadius: '50%',
    transition: 'width 0.2s, height 0.2s, border-color 0.2s, background 0.2s',
    willChange: 'transform',
  };

  return (
    <>
      {/* Dot — instant */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          ...cursorBase,
          width: 8,
          height: 8,
          background: 'var(--neon-cyan, #00d4ff)',
          boxShadow: '0 0 8px var(--neon-cyan, #00d4ff)',
          top: 0,
          left: 0,
        }}
      />

      {/* Ring — lerped */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          ...cursorBase,
          width: 32,
          height: 32,
          border: '1.5px solid var(--neon-cyan, #00d4ff)',
          background: 'transparent',
          top: 0,
          left: 0,
        }}
      />

      {/* Trail */}
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
        <div
          key={i}
          ref={el => { if (el) trailRef.current[i] = el; }}
          aria-hidden="true"
          style={{
            ...cursorBase,
            background: 'var(--neon-cyan, #00d4ff)',
            top: 0,
            left: 0,
            transition: 'none',
          }}
        />
      ))}
    </>
  );
}
