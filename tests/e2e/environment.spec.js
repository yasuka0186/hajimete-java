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

test('opens and closes the mobile navigation with the keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');

  const menuButton = page.getByRole('button', { name: 'メニュー' });
  const featureLink = page.getByRole('navigation', { name: 'メインナビゲーション' }).getByRole('link', { name: '特徴' });

  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(featureLink).toBeHidden();
  await menuButton.focus();
  await expect(menuButton).toHaveCSS('outline-style', 'solid');
  await expect(menuButton).toHaveCSS('outline-width', '3px');
  await page.keyboard.press('Enter');
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  await expect(featureLink).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(menuButton).toBeFocused();
});

test('does not enable reveal motion when reduced motion is requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');

  await expect(page.locator('html')).not.toHaveClass(/js-reveal-ready/);
  await expect(page.locator('[data-reveal]').first()).toBeVisible();
});

for (const width of [360, 390, 768, 1024, 1440]) {
  test(`does not overflow horizontally at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./');

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });
}
