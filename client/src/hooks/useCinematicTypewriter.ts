import { useState, useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   useCinematicTypewriter
   ─────────────────────────────────────────────────────────────────────────────
   Sequences through multiple lines, typing each one character by character.
   After each line completes it pauses, then moves to the next.
   The cursor index stays on the last line after all lines are done.

   Usage:
     const { lines, cursor, done } = useCinematicTypewriter([
       { text: 'DATA SCIENTIST · AI/ML ENGINEER', speed: 38, pauseAfter: 500 },
       { text: 'Transforming raw data into insights', speed: 28 },
     ], 1000);
     // lines[0] = current text for line 0
     // lines[1] = current text for line 1
     // cursor   = which line's cursor should be shown (−1 before start)
     // done     = true when all lines finished
───────────────────────────────────────────────────────────────────────────── */

export interface TypewriterLine {
  text: string;
  speed?: number;       // ms per character (default 38)
  pauseAfter?: number;  // pause after line completes before next begins (default 400)
}

export interface CinematicState {
  lines: string[];
  cursor: number;  // index of line with active cursor, −1 = not yet started
  done: boolean;
}

export function useCinematicTypewriter(
  lineDefs: TypewriterLine[],
  startDelay = 800,
): CinematicState {
  const [lines,  setLines]  = useState<string[]>(() => lineDefs.map(() => ''));
  const [cursor, setCursor] = useState(-1);
  const [done,   setDone]   = useState(false);

  /* Store initial values in refs so effect deps stay stable */
  const lineDefsRef   = useRef(lineDefs);
  const startDelayRef = useRef(startDelay);

  useEffect(() => {
    let alive = true;

    const sleep = (ms: number) =>
      new Promise<void>(r => setTimeout(r, ms));

    async function run() {
      await sleep(startDelayRef.current);
      if (!alive) return;

      const defs = lineDefsRef.current;

      for (let li = 0; li < defs.length; li++) {
        const { text, speed = 38, pauseAfter = 400 } = defs[li];

        setCursor(li);

        /* Type this line char by char */
        for (let ci = 1; ci <= text.length; ci++) {
          if (!alive) return;
          const slice = text.slice(0, ci);
          setLines(prev => {
            const next = [...prev];
            next[li] = slice;
            return next;
          });
          await sleep(speed);
        }

        /* Pause before next line (but not after the last) */
        if (alive && li < defs.length - 1 && pauseAfter > 0) {
          await sleep(pauseAfter);
        }
      }

      if (alive) {
        setCursor(defs.length - 1); // cursor stays on last line
        setDone(true);
      }
    }

    run();

    return () => {
      alive = false;
    };
  }, []); // runs once on mount — inputs captured via refs

  return { lines, cursor, done };
}
