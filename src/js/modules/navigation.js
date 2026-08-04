const DESKTOP_NAVIGATION_QUERY = '(min-width: 64rem)';

export const initNavigation = () => {
  const toggle = document.querySelector('[data-nav-toggle]');
  const navigation = document.querySelector('[data-navigation]');

  if (!toggle || !navigation) {
    return;
  }

  const setOpen = (isOpen, { restoreFocus = false } = {}) => {
    toggle.setAttribute('aria-expanded', String(isOpen));
    navigation.classList.toggle('js-nav-open', isOpen);

    if (restoreFocus) {
      toggle.focus();
    }
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false, { restoreFocus: true });
    }
  });

  globalThis.matchMedia(DESKTOP_NAVIGATION_QUERY).addEventListener('change', (event) => {
    if (event.matches) {
      setOpen(false);
    }
  });
};
