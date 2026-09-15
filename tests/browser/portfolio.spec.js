import { test, expect } from '@playwright/test';

for (const language of ['tr', 'en']) {
  const route = language === 'tr' ? '/' : '/en/';
  test(`${language}: current CV, local assets and no browser errors`, async ({ page }) => {
    const errors = [];
    const requests = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('request', (request) => requests.push(request.url()));
    page.on('response', (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    await expect(page.locator('.experience-item.is-current')).toContainText('Fonksiyonel Holding');
    await expect(page.locator('.facts')).toContainText('C1');
    await expect(page.locator('.project-card')).toHaveCount(4);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(errors).toEqual([]);
    expect(requests.every((url) => url.startsWith('http://localhost:4173/'))).toBe(true);
  });

  test(`${language}: filters, keyboard dialog and focus restoration`, async ({ page }) => {
    await page.goto(route);
    await page.locator('[data-filter="personal"]').click();
    await expect(page.locator('.project-card:visible')).toHaveCount(2);
    await expect(page.locator('[data-filter="personal"]')).toHaveAttribute('aria-pressed', 'true');
    const trigger = page.locator('h3 [data-project="cloud-resume"]');
    await trigger.focus();
    await page.keyboard.press('Enter');
    const dialog = page.locator('#dialog-cloud-resume');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('h2')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(dialog.getByRole('link')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await page.locator('[data-filter="work"]').click();
    await expect(page.locator('.project-card:visible')).toHaveCount(2);
    await page.locator('[data-filter="all"]').click();
    await expect(page.locator('.project-card:visible')).toHaveCount(4);
  });
}

test('language switching preserves the section and CV can be downloaded', async ({ page }) => {
  await page.goto('/#experience');
  await page.locator('[data-language-link]').click();
  await expect(page).toHaveURL('/en/#experience');
  const downloadEvent = page.waitForEvent('download');
  await page.locator('.hero-actions a[download]').click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe('Yunus_Ergul_CV_EN.pdf');
  expect(await download.failure()).toBeNull();
});

test('mobile menu opens, closes with Escape and navigates', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.locator('.menu-toggle');
  await expect(page.locator('#navigation')).not.toBeVisible();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#navigation')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(page.locator('#navigation')).not.toBeVisible();
  await toggle.click();
  await page.locator('#navigation a[href="#projects"]').click();
  await expect(page).toHaveURL('/#projects');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('layout fits narrow mobile, tablet and desktop in both languages', async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/en/']) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const dimensions = await page.evaluate(() => ({ viewport: innerWidth, content: document.documentElement.scrollWidth }));
      expect(dimensions.content, `${route} at ${width}px`).toBeLessThanOrEqual(dimensions.viewport);
    }
  }
});

test('clipboard reports success and failure accessibly', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: async (text) => { window.copiedEmail = text; } }, configurable: true }));
  await page.goto('/');
  await page.locator('[data-copy-email]').click();
  await expect(page.locator('[data-copy-status]')).toHaveText('E-posta kopyalandı');
  expect(await page.evaluate(() => window.copiedEmail)).toBe('yunus.ergul7@outlook.com');
  await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw new Error('Permission denied'); }; });
  await page.locator('[data-copy-email]').click();
  await expect(page.locator('[data-copy-status]')).toContainText('Kopyalanamadı');
});

test('essential CV content remains available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://localhost:4173/');
  await expect(page.locator('#navigation')).toBeVisible();
  await expect(page.locator('#experience')).toContainText('Fonksiyonel Holding');
  await expect(page.locator('.hero-actions a[download]')).toBeVisible();
  await expect(page.locator('[data-copy-email]')).not.toBeVisible();
  await context.close();
});
