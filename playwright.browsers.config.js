import { defineConfig, devices } from '@playwright/test';
import process from 'node:process';

export default defineConfig({
  testDir: './tests/browser',
  workers: 1,
  projects: [
    { name: 'Chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
    { name: 'Chromium (Edge互換エンジン)', use: { ...devices['Desktop Edge'] } },
    { name: 'Firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'WebKit (Safari互換エンジン)', use: { ...devices['Desktop Safari'] } },
  ],
  use: { baseURL: 'http://127.0.0.1:4173' },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
});
