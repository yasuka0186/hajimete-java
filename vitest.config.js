import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.js'],
    coverage: {
      provider: 'v8',
      include: [
        'src/js/modules/answer-validator.js',
        'src/js/modules/hint-resolver.js',
        'src/js/modules/progress-store.js',
      ],
      reporter: ['text', 'json-summary'],
      thresholds: {
        statements: 80,
      },
    },
  },
});
