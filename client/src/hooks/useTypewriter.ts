import { useState, useEffect } from 'react';

/**
 * Types out `text` character by character.
 * @param text     Full string to type out
 * @param speed    Milliseconds per character (default 40)
 * @param startDelay  Initial delay in ms before typing starts (default 600)
 */
export function useTypewriter(
  text: string,
  speed = 40,
  startDelay = 600,
): string {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    let startTimer: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;

    startTimer = setTimeout(() => {
      interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return displayed;
}
