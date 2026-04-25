/**
 * Scroll progress singleton — written from DOM, read in R3F useFrame.
 * No React state → zero re-renders.
 */
export const scrollSync = {
  /** 0 = page top, 1 = page bottom */
  progress: 0,
  /** IntersectionObserver ratio per section ID (0–1) */
  sections: {} as Record<string, number>,
};

const SECTION_IDS = ['hero', 'about', 'skills', 'projects', 'experience', 'contact'];

export function initScrollSync(): () => void {
  const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      scrollSync.sections[entry.target.id] = entry.intersectionRatio;
    });
  }, { threshold: thresholds });

  const observeSections = () => {
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  };

  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollSync.progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
  requestAnimationFrame(observeSections);

  return () => {
    observer.disconnect();
    window.removeEventListener('scroll', updateProgress);
  };
}
