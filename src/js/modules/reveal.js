const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export const initReveal = () => {
  const targets = [...document.querySelectorAll('[data-reveal]')];
  const reduceMotion = globalThis.matchMedia(REDUCED_MOTION_QUERY).matches;

  if (targets.length === 0 || reduceMotion || !('IntersectionObserver' in globalThis)) {
    return;
  }

  document.documentElement.classList.add('js-reveal-ready');

  const observer = new globalThis.IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('js-revealed');
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.08,
    },
  );

  targets.forEach((target) => observer.observe(target));
};
