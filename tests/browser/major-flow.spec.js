import { expect, test } from '@playwright/test';

test('LPから無料体験へ進み、第1問を完了できる', async ({ page }) => {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Javaを順番どおりに');
  await page.locator('.p-hero__cta').click();
  await expect(page).toHaveURL(/\/trial\/$/);
  await page.locator('[data-fragment-input]').fill('println');
  await page.getByRole('button', { name: '答えを確認する' }).click();
  await expect(page.locator('[data-result-title]')).toHaveText('正解！');
  await expect(page.locator('[data-console-output]')).toHaveText('Hello, Java!');
  expect(errors).toEqual([]);
});
