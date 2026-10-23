import { useEffect, useRef } from 'react';

/**
 * Hook to add scroll reveal animations using IntersectionObserver.
 * Adds 'visible' class to elements with .reveal, .reveal-left, .reveal-right, .reveal-scale
 * within the observed container (or the whole document).
 */
export function useScrollReveal(containerRef = null, options = {}) {
  const observerRef = useRef(null);

  useEffect(() => {
    const defaultOptions = {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
      ...options
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once revealed, stop observing to prevent re-triggering
          observerRef.current?.unobserve(entry.target);
        }
      });
    }, defaultOptions);

    const root = containerRef?.current || document;
    const elements = root.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  // Re-run when DOM changes (useful for dynamic content)
  const refresh = () => {
    const root = containerRef?.current || document;
    const elements = root.querySelectorAll('.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible), .reveal-scale:not(.visible)');
    elements.forEach((el) => observerRef.current?.observe(el));
  };

  return { refresh };
}

/**
 * Simple hook for a single element reveal
 */
export function useElementReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px', ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

export default useScrollReveal;
