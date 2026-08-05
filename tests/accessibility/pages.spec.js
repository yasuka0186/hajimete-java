import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const assertNoSeriousViolations = async (page) => {
  const results = await new AxeBuilder({ page }).analyze();
  const seriousViolations = results.violations.filter(({ impact }) => ['critical', 'serious'].includes(impact));

  expect(seriousViolations).toEqual([]);
};

test('LPに重大・深刻なaxe違反がない', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await assertNoSeriousViolations(page);
});

test('無料体験の初期状態に重大・深刻なaxe違反がない', async ({ page }) => {
  await page.goto('./trial/');
  await assertNoSeriousViolations(page);
});

test('無料体験の誤答状態に重大・深刻なaxe違反がない', async ({ page }) => {
  await page.goto('./trial/');
  await page.locator('[data-fragment-input]').fill('print');
  await page.getByRole('button', { name: '答えを確認する' }).click();
  await assertNoSeriousViolations(page);
});
