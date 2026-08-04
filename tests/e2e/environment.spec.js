import { expect, test } from '@playwright/test';

test('serves both entry pages', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: /はじめてでも迷わない/ })).toBeVisible();

  await page.getByRole('main').getByRole('link', { name: '無料でJavaを体験する' }).click();
  await expect(page).toHaveURL(/\/trial\/$/);
  await expect(page.getByRole('heading', { name: '無料体験：文字を表示してみよう' })).toBeVisible();

  await page.getByRole('link', { name: 'LPへ戻る' }).click();
  await expect(page).toHaveURL(/\/$/);
});
