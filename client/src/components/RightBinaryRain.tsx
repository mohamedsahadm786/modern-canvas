import { useEffect, useRef } from 'react';

interface Stream {
  x: number;
  y: number;
  speed: number;
  chars: ('0' | '1')[];
  alpha: number;
  size: number;
}

const COLUMN_GAP = 28;
const MIN_FONT = 18;
const MAX_FONT = 28;

export default function RightBinaryRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let streams: Stream[] = [];

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * Math.min(window.devicePixelRatio, 2));
      canvas.height = Math.floor(height * Math.min(window.devicePixelRatio, 2));
      ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);

      const cols = Math.max(10, Math.floor(width / COLUMN_GAP));
      streams = Array.from({ length: cols }, (_, index) => {
        const size = MIN_FONT + Math.random() * (MAX_FONT - MIN_FONT);
        const charCount = 10 + Math.floor(Math.random() * 10);
        return {
          x: 20 + index * (width - 40) / cols,
          y: -Math.random() * height,
          speed: 48 + Math.random() * 62,
          chars: Array.from({ length: charCount }, () => (Math.random() > 0.5 ? '1' : '0')),
          alpha: 0.18 + Math.random() * 0.16,
          size,
        };
      });
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // keep the graph area readable
      const quietX = width * 0.5;
      const quietY = height * 0.43;
      const quietRadius = Math.min(width, height) * 0.22;

      streams.forEach((stream, streamIndex) => {
        stream.y += stream.speed / 60;
        const step = stream.size * 1.1;

        if (stream.y - stream.chars.length * step > height + 60) {
          stream.y = -Math.random() * 220;
          stream.speed = 48 + Math.random() * 62;
          stream.alpha = 0.18 + Math.random() * 0.16;
          stream.size = MIN_FONT + Math.random() * (MAX_FONT - MIN_FONT);
          stream.chars = Array.from(
            { length: 10 + Math.floor(Math.random() * 10) },
            () => (Math.random() > 0.5 ? '1' : '0'),
          );
        }

        ctx.font = `700 ${stream.size}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < stream.chars.length; i += 1) {
          const y = stream.y - i * step;
          if (y < -40 || y > height + 40) continue;

          const dist = Math.hypot(stream.x - quietX, y - quietY);
          const quietMask = dist < quietRadius ? 0.38 : 1;
          const headGlow = 1 - i / stream.chars.length;
          const alpha = stream.alpha * quietMask * (0.35 + headGlow * 0.9);

          ctx.shadowBlur = i === 0 ? 18 : 10;
          ctx.shadowColor = 'rgba(80,255,120,0.45)';
          ctx.fillStyle = `rgba(90, 255, 110, ${alpha})`;
          ctx.fillText(stream.chars[(i + streamIndex + Math.floor(time / 220)) % stream.chars.length], stream.x, y);
        }
      });

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.9,
      }}
    />
  );
}
