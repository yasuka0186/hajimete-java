import '../scss/style.scss';
import { initNavigation } from './modules/navigation.js';
import { initReveal } from './modules/reveal.js';

document.documentElement.classList.add('js-enabled');

initNavigation();
initReveal();
