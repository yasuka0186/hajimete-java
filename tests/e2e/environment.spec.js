import { expect, test } from '@playwright/test';

test('serves both entry pages', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: /はじめてでも迷わない/ })).toBeVisible();

  await page.locator('.p-hero').getByRole('link', { name: '無料でJavaを体験する' }).click();
  await expect(page).toHaveURL(/\/trial\/$/);
  await expect(page.getByRole('heading', { name: '無料体験：文字を表示してみよう' })).toBeVisible();

  await page.getByRole('link', { name: 'LPへ戻る' }).click();
  await expect(page).toHaveURL(/\/$/);
});

test('shows the paid plan as unavailable', async ({ page }) => {
  await page.goto('./');

  const paidPlan = page.getByRole('article').filter({ hasText: '月額プラン' });
  await expect(paidPlan.getByText('準備中')).toBeVisible();
  await expect(paidPlan.getByText('現在はお申し込みできません')).toBeVisible();
  await expect(paidPlan.getByRole('link')).toHaveCount(0);
});
