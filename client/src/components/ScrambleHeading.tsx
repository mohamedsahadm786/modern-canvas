import { useRef, useState, useCallback, useEffect } from 'react';
import { useInView } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────────────────────
   ScrambleHeading
   ─────────────────────────────────────────────────────────────────────────────
   Scroll-triggered character scramble that resolves left-to-right into the
   real text, then supports hover re-scramble.

   Usage:
     <ScrambleHeading as="h2" text="PROJECTS" className="..." data-testid="..." />

   For multi-colour headings, pass `children` — they are rendered after the
   scramble fully resolves, swapping the plain chars for your styled markup:
     <ScrambleHeading as="h2" text="SAHAD in a Snapshot" className="...">
       <span className="text-primary">SAHAD</span>{' '}
       <span className="text-foreground">in a Snapshot</span>
     </ScrambleHeading>
───────────────────────────────────────────────────────────────────────────── */

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&?!><{}';
const TICK_MS        = 42;  // interval between random-char refreshes

function rand(): string {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

interface ScrambleHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Plain text string — drives the scramble; also the default rendered text */
  text: string;
  /** HTML tag to render (default: 'h2') */
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  /** Extra delay before scramble starts (ms) — useful for staggering siblings */
  delay?: number;
  /**
   * Optional children — rendered after the scramble resolves.
   * Lets you keep multi-colour/styled markup while still getting the
   * scramble effect. If omitted, `text` is used for both phases.
   */
  children?: React.ReactNode;
}

export default function ScrambleHeading({
  text,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  children,
  style: externalStyle,
  ...rest
}: ScrambleHeadingProps) {
  const ref    = useRef<HTMLElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, {
    once: true,
    margin: '-60px',
  });

  const [chars,    setChars]    = useState<string[]>(() => text.split('').map(() => ''));
  const [resolved, setResolved] = useState(false);
  const [visible,  setVisible]  = useState(false);

  const triggered   = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockedRef   = useRef(0);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Core scramble engine ──────────────────────────────────────────────── */
  const runScramble = useCallback(
    (fast: boolean) => {
      /* Reduced-motion: skip straight to resolved */
      if (prefersReduced) {
        setChars(text.split(''));
        setResolved(true);
        setVisible(true);
        return;
      }

      if (intervalRef.current) clearInterval(intervalRef.current);
      lockedRef.current = 0;
      setResolved(false);
      setVisible(true);

      const realChars  = text.split('');
      const lockStagger = fast ? 32 : 58; // ms between each char "locking in"

      /* Fill with random chars */
      setChars(realChars.map(c => (c === ' ' ? ' ' : rand())));

      /* Tick: keep cycling unlocked positions */
      intervalRef.current = setInterval(() => {
        setChars(prev =>
          prev.map((_, i) =>
            i < lockedRef.current || realChars[i] === ' ' ? realChars[i] : rand()
          )
        );
      }, TICK_MS);

      /* Lock chars left-to-right */
      realChars.forEach((_, i) => {
        setTimeout(() => {
          lockedRef.current = i + 1;
          if (i === realChars.length - 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setChars(realChars);
            setResolved(true);
          }
        }, i * lockStagger + 80);
      });
    },
    [text, prefersReduced]
  );

  /* ── Trigger on scroll into view ──────────────────────────────────────── */
  useEffect(() => {
    if (isInView && !triggered.current) {
      triggered.current = true;
      const t = setTimeout(() => runScramble(false), delay);
      return () => clearTimeout(t);
    }
  }, [isInView, delay, runScramble]);

  /* ── Cleanup ──────────────────────────────────────────────────────────── */
  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    []
  );

  /* ── Hover re-scramble ────────────────────────────────────────────────── */
  const handleHover = useCallback(() => {
    if (!resolved) return;
    runScramble(true); // faster lock-in on hover
  }, [resolved, runScramble]);

  /* ── Render ───────────────────────────────────────────────────────────── */
  const content =
    resolved && children
      ? children
      : chars.map((char, i) => (
          <span
            key={i}
            style={{
              display: char === ' ' ? 'inline' : 'inline-block',
              /* Unresolved scramble chars glow cyan */
              color:
                !resolved && char !== text[i] && char !== ' '
                  ? 'var(--neon-cyan, #00d4ff)'
                  : undefined,
            }}
          >
            {char === ' ' ? '\u00A0' : char || '\u00A0'}
          </span>
        ));

  const TagComponent = Tag as React.ElementType;

  return (
    <TagComponent
      ref={ref as React.Ref<Element>}
      className={className}
      onMouseEnter={handleHover}
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.15s',
        ...externalStyle,
      }}
      {...rest}
    >
      {content}
    </TagComponent>
  );
}
