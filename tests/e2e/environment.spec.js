import { expect, test } from '@playwright/test';

test('serves both entry pages', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: /はじめてでも迷わない/ })).toBeVisible();

  await page.locator('.p-hero').getByRole('link', { name: '無料でJavaを体験する' }).click();
  await expect(page).toHaveURL(/\/trial\/$/);
  await expect(page.getByRole('heading', { name: '無料体験：文字を表示してみよう' })).toBeVisible();

  await page.getByRole('banner').getByRole('link', { name: 'LPへ戻る' }).click();
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

    await page.goto('./trial/');
    const trialDimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));

    expect(trialDimensions.scrollWidth).toBeLessThanOrEqual(trialDimensions.clientWidth);
  });
}

test('shows the initial trial question and locked future progress', async ({ page }) => {
  await page.goto('./trial/');

  await expect(page.getByRole('heading', { name: '無料体験：文字を表示してみよう' })).toBeVisible();
  await expect(page.getByText('問題 1 / 3', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: '空欄を埋めて、文字を表示しよう' })).toBeVisible();
  await expect(page.getByLabel('空欄に入る命令')).toBeVisible();
  await expect(page.getByLabel('Javaコードを1行で入力')).toBeHidden();

  const progressButtons = page.getByRole('navigation', { name: '問題の進捗' }).getByRole('button');
  await expect(progressButtons).toHaveCount(3);
  await expect(progressButtons.nth(0)).toHaveAttribute('aria-current', 'step');
  await expect(progressButtons.nth(1)).toBeDisabled();
  await expect(progressButtons.nth(2)).toBeDisabled();
});

test('uses two columns on desktop and one column on mobile for the trial', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto('./trial/');

  const lesson = page.locator('.p-trial-workspace__lesson');
  const practice = page.locator('.p-trial-workspace__practice');
  const desktopLessonBox = await lesson.boundingBox();
  const desktopPracticeBox = await practice.boundingBox();
  expect(desktopPracticeBox.x).toBeGreaterThan(desktopLessonBox.x);

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileLessonBox = await lesson.boundingBox();
  const mobilePracticeBox = await practice.boundingBox();
  expect(mobilePracticeBox.y).toBeGreaterThan(mobileLessonBox.y);
});
