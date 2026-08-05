import { expect, test } from '@playwright/test';

const completeTrial = async (page) => {
  await page.getByLabel('空欄に入る命令').fill('println');
  await page.getByRole('button', { name: '答えを確認する' }).click();
  await page.getByRole('button', { name: '次の問題へ' }).click();
  await page.getByLabel('Javaコードを1行で入力').fill('System.out.println("Hello, Java!");');
  await page.getByRole('button', { name: '答えを確認する' }).click();
  await page.getByRole('button', { name: '次の問題へ' }).click();
  await page.getByLabel('Javaコードを1行で入力').fill('System.out.println("Javaをはじめよう");');
  await page.getByRole('button', { name: '答えを確認する' }).click();
  await page.getByRole('button', { name: '結果を見る' }).click();
};

const expectNoHorizontalOverflow = async (page) => {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
};

test('serves both entry pages', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: /はじめてでも迷わない/ })).toBeVisible();

  await page.locator('.p-hero').getByRole('link', { name: '無料でJavaを体験する' }).click();
  await expect(page).toHaveURL(/\/trial\/$/);
  await expect(page.getByRole('heading', { name: '無料体験：文字を表示してみよう' })).toBeVisible();

  await page.getByRole('banner').getByRole('link', { name: 'トップページへ戻る' }).click();
  await expect(page).toHaveURL(/\/$/);
});

test('completes the published flow without console errors', async ({ page }) => {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('./trial/');
  await completeTrial(page);

  await expect(page.getByRole('heading', { name: '全3問、完了しました！' })).toBeVisible();
  expect(errors).toEqual([]);
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

test('shows a specific hint for an incorrect trial answer', async ({ page }) => {
  await page.goto('./trial/');

  await page.getByLabel('空欄に入る命令').fill('print');
  await page.getByRole('button', { name: '答えを確認する' }).click();

  const feedback = page.locator('[data-feedback]');
  await expect(feedback).toBeFocused();
  await expect(feedback.getByRole('heading', { name: 'もう一度確認してみよう' })).toBeVisible();
  await expect(feedback.getByText(/println.*小文字/)).toBeVisible();
  const answer = page.getByLabel('空欄に入る命令');
  await expect(answer).toHaveValue('print');
  await expect(answer).toHaveAttribute('aria-invalid', 'true');
  await expect(answer).toHaveAttribute('aria-describedby', /hint-text/);
  await expect(page.getByRole('status')).toContainText(/不正解です.*ヒント/);

  await answer.fill('println');
  await expect(answer).not.toHaveAttribute('aria-invalid');
  await expect(answer).toHaveAttribute('aria-describedby', 'answer-shortcut');
  await expect(feedback).toBeHidden();
});

test('shows feedback without auto-advancing and advances only with the next button', async ({ page }) => {
  await page.goto('./trial/');

  await page.getByLabel('空欄に入る命令').fill('println');
  await page.getByRole('button', { name: '答えを確認する' }).click();

  const feedback = page.locator('[data-feedback]');
  await expect(feedback.getByRole('heading', { name: '正解！' })).toBeVisible();
  await expect(feedback.getByText(/printlnは/)).toBeVisible();
  await expect(feedback.getByText('Hello, Java!', { exact: true })).toBeVisible();
  await expect(feedback.locator('[data-result-icon]')).toHaveText('✓');
  await expect(page.getByRole('status')).toContainText(/正解です.*想定出力/);
  await expect(page.getByText('問題 1 / 3', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: '次の問題へ' }).click();
  await expect(page.getByText('問題 2 / 3', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Javaコードを1行で入力')).toBeFocused();
});

test('submits all three answer formats with the keyboard shortcut', async ({ page }) => {
  await page.goto('./trial/');

  await page.getByLabel('空欄に入る命令').fill('  println  ');
  await page.keyboard.press('Control+Enter');
  await expect(page.getByRole('heading', { name: '正解！' })).toBeVisible();
  await page.getByRole('button', { name: '次の問題へ' }).click();

  await page.getByLabel('Javaコードを1行で入力').fill('System.out.println("Hello, Java!");');
  await page.keyboard.press('Meta+Enter');
  await expect(page.getByRole('heading', { name: '正解！' })).toBeVisible();
  await page.getByRole('button', { name: '次の問題へ' }).click();

  await page.getByLabel('Javaコードを1行で入力').fill('System.out.println("Javaをはじめよう");');
  await page.keyboard.press('Control+Enter');
  await expect(page.getByRole('heading', { name: '正解！' })).toBeVisible();
  await expect(page.getByText('Javaをはじめよう', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: '結果を見る' })).toBeVisible();
  await expect(page.getByText('問題 3 / 3', { exact: true })).toBeVisible();
});

test('restores an unfinished answer and resumes the unfinished problem after reload', async ({ page }) => {
  await page.goto('./trial/');

  await page.getByLabel('空欄に入る命令').fill('prin');
  await page.waitForTimeout(300);
  await page.reload();
  await expect(page.getByLabel('空欄に入る命令')).toHaveValue('prin');

  await page.getByLabel('空欄に入る命令').fill('println');
  await page.getByRole('button', { name: '答えを確認する' }).click();
  await page.getByRole('button', { name: '次の問題へ' }).click();
  await page.getByLabel('Javaコードを1行で入力').fill('System.out.println(');
  await page.waitForTimeout(300);
  await page.reload();

  await expect(page.getByText('問題 2 / 3', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Javaコードを1行で入力')).toHaveValue('System.out.println(');
});

test('shows the completion screen and restores it after reload', async ({ page }) => {
  await page.goto('./trial/');
  await completeTrial(page);

  await expect(page.getByRole('heading', { name: '全3問、完了しました！' })).toBeVisible();
  await expect(page.getByText('3 / 3', { exact: true })).toBeVisible();
  await expect(page.getByText(/System\.out\.printlnで文字を表示できる/)).toBeVisible();
  await expect(page.getByRole('heading', { name: '第2章：変数とデータ型' })).toBeVisible();
  await expect(page.getByRole('button', { name: '準備中' })).toBeDisabled();

  await page.reload();
  await expect(page.getByRole('heading', { name: '全3問、完了しました！' })).toBeVisible();
});

test('opens a completed problem read-only and enables editing only after retry', async ({ page }) => {
  await page.goto('./trial/');
  await completeTrial(page);

  const progress = page.getByRole('navigation', { name: '問題の進捗' });
  await progress.locator('[data-question-id="question-1"]').click();

  const answer = page.getByLabel('空欄に入る命令');
  await expect(answer).toHaveAttribute('readonly', '');
  await expect(answer).toHaveValue('println');
  await expect(page.getByRole('heading', { name: '完了した問題' })).toBeVisible();
  await expect(page.getByRole('button', { name: '答えを確認する' })).toBeHidden();

  await page.getByRole('button', { name: '再挑戦' }).click();
  await expect(answer).not.toHaveAttribute('readonly');
  await expect(page.getByRole('button', { name: '答えを確認する' })).toBeVisible();
  await answer.fill('println');
  await page.getByRole('button', { name: '答えを確認する' }).click();
  await page.getByRole('button', { name: '学習に戻る' }).click();
  await expect(page.getByRole('heading', { name: '全3問、完了しました！' })).toBeVisible();
});

test('keeps state when reset is cancelled and clears it after confirmation', async ({ page }) => {
  await page.goto('./trial/');
  await page.getByLabel('空欄に入る命令').fill('prin');
  await page.waitForTimeout(300);

  page.once('dialog', (dialog) => dialog.dismiss());
  await page.getByRole('button', { name: '最初からやり直す' }).click();
  await expect(page.getByLabel('空欄に入る命令')).toHaveValue('prin');

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: '最初からやり直す' }).click();
  await expect(page.getByLabel('空欄に入る命令')).toHaveValue('');
  await expect(page.getByRole('heading', { name: '無料体験：文字を表示してみよう' })).toBeFocused();

  await page.reload();
  await expect(page.getByLabel('空欄に入る命令')).toHaveValue('');
  await expect(page.getByText('問題 1 / 3', { exact: true })).toBeVisible();
});

test('completes the main trial flow using only the keyboard', async ({ page }) => {
  await page.goto('./trial/');

  await page.keyboard.type('println');
  await page.keyboard.press('Control+Enter');
  await expect(page.locator('[data-feedback]')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: '次の問題へ' })).toBeFocused();
  await page.keyboard.press('Enter');

  await page.keyboard.type('System.out.println("Hello, Java!");');
  await page.keyboard.press('Control+Enter');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');

  await page.keyboard.type('System.out.println("Javaをはじめよう");');
  await page.keyboard.press('Control+Enter');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: '結果を見る' })).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(page.getByRole('heading', { name: '全3問、完了しました！' })).toBeVisible();
  await expect(page.locator('[data-completion]')).toBeFocused();
});

test('recovers safely from broken and unknown saved data', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.goto('./trial/');

  await page.evaluate(() => window.localStorage.setItem('hajimete-java:trial:v1', '{broken'));
  await page.reload();
  await expect(page.getByText('問題 1 / 3', { exact: true })).toBeVisible();

  await page.evaluate(() =>
    window.localStorage.setItem(
      'hajimete-java:trial:v1',
      JSON.stringify({
        currentQuestionId: 'unknown',
        completedQuestionIds: ['unknown'],
        answers: { unknown: 'value' },
      }),
    ),
  );
  await page.reload();
  await expect(page.getByLabel('空欄に入る命令')).toBeEditable();
  await expect(page.getByText('問題 1 / 3', { exact: true })).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test('continues the trial when browser storage is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    window.Storage.prototype.getItem = () => {
      throw new Error('storage unavailable');
    };
    window.Storage.prototype.setItem = () => {
      throw new Error('storage unavailable');
    };
  });
  await page.goto('./trial/');

  await page.getByLabel('空欄に入る命令').fill('println');
  await page.getByRole('button', { name: '答えを確認する' }).click();
  await expect(page.getByRole('heading', { name: '正解！' })).toBeVisible();
});

for (const width of [390, 1024]) {
  test(`keeps every trial state usable without horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./trial/');
    await expectNoHorizontalOverflow(page);

    await page.getByLabel('空欄に入る命令').fill('print');
    await page.getByRole('button', { name: '答えを確認する' }).click();
    await expectNoHorizontalOverflow(page);

    await page.getByLabel('空欄に入る命令').fill('println');
    await page.getByRole('button', { name: '答えを確認する' }).click();
    await expectNoHorizontalOverflow(page);
    await page.getByRole('button', { name: '次の問題へ' }).click();
    await page.getByLabel('Javaコードを1行で入力').fill('System.out.println("Hello, Java!");');
    await page.getByRole('button', { name: '答えを確認する' }).click();
    await page.getByRole('button', { name: '次の問題へ' }).click();
    await page.getByLabel('Javaコードを1行で入力').fill('System.out.println("Javaをはじめよう");');
    await page.getByRole('button', { name: '答えを確認する' }).click();
    await page.getByRole('button', { name: '結果を見る' }).click();
    await expectNoHorizontalOverflow(page);

    await page.getByRole('button', { name: '3問を見直す' }).click();
    await expect(page.getByLabel('空欄に入る命令')).toHaveAttribute('readonly', '');
    await expectNoHorizontalOverflow(page);
    await page.getByRole('button', { name: '再挑戦' }).click();
    await expectNoHorizontalOverflow(page);
  });
}

test('keeps primary controls usable at a desktop-equivalent 200% zoom width', async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 900 });
  await page.goto('./trial/');

  await expectNoHorizontalOverflow(page);
  for (const control of [
    page.getByRole('button', { name: '最初からやり直す' }),
    page.getByRole('button', { name: '答えを確認する' }),
  ]) {
    const box = await control.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
  }

  await page.getByLabel('空欄に入る命令').fill('print');
  await page.getByRole('button', { name: '答えを確認する' }).click();
  await expect(page.getByRole('heading', { name: 'もう一度確認してみよう' })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});
