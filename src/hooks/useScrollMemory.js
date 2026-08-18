import { useEffect, useRef } from 'react';
const PREFIX = 'scroll-pos:';
const RETRY_WINDOW_MS = 1200;

export function useScrollMemory(key, ready = true) {
  const doneRef = useRef(false);
  useEffect(() => {
    if (!ready || doneRef.current) return;

    let saved;
    try {
      saved = sessionStorage.getItem(PREFIX + key);
    } catch {
      saved = null;
    }
    if (!saved) {
      doneRef.current = true;
      return;
    }
    const target = Number(saved);

    doneRef.current = true;

    const jump = () => window.scrollTo({ top: target, left: 0, behavior: 'instant' });

    jump();

    let stopped = false;
    const stop = () => {
      if (stopped) return;
      stopped = true;
      observer.disconnect();
      clearTimeout(timeoutId);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
    };

    const observer = new ResizeObserver(() => {
      if (!stopped) jump();
    });
    observer.observe(document.body);

    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchstart', stop, { passive: true });

    const timeoutId = setTimeout(stop, RETRY_WINDOW_MS);

    return stop;
  }, [ready, key]);

  useEffect(() => {
    function save() {
      try {
        sessionStorage.setItem(PREFIX + key, String(window.scrollY));
      } catch {
  
      }
    }
    window.addEventListener('beforeunload', save);
    return () => {
      save();
      window.removeEventListener('beforeunload', save);
    };
  }, [key]);
}
