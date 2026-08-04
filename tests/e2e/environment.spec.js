import { expect, test } from '@playwright/test';

test('serves both entry pages', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'はじめてJava' })).toBeVisible();

  await page.goto('./trial/');
  await expect(page.getByRole('heading', { name: '無料体験' })).toBeVisible();
});

