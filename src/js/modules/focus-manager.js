const focusElement = (selector) => {
  const element = document.querySelector(selector);

  if (element && !element.hidden) {
    element.focus({ preventScroll: false });
  }
};

export const focusActiveAnswer = (inputType) =>
  focusElement(inputType === 'fragment' ? '[data-fragment-input]' : '[data-line-input]');

export const focusCompletion = () => focusElement('[data-completion]');

export const focusPageTitle = () => focusElement('[data-page-title]');

export const focusResult = () => focusElement('[data-feedback]');
