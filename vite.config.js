import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  // Relative URLs work both locally and below a GitHub Pages project path.
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        trial: resolve(import.meta.dirname, 'trial/index.html'),
      },
    },
  },
});
