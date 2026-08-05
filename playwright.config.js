import { defineConfig } from '@playwright/test';
import process from 'node:process';

const publishedBaseURL = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: publishedBaseURL ?? 'http://127.0.0.1:4173',
  },
  webServer: publishedBaseURL
    ? undefined
    : {
        command: 'npm run dev -- --host 127.0.0.1 --port 4173',
        url: 'http://127.0.0.1:4173',
        reuseExistingServer: !process.env.CI,
      },
});
