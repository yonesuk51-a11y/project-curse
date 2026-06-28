// Playwright optional E2E smoke test for local/GitHub QA.
// Run: npm run qa:e2e
const { test, expect } = require('@playwright/test');

test('UAC runtime QA mode passes core loader checks', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto('/index.html?uac_qa=1');
  await page.waitForTimeout(3500);
  const errors = await page.locator('.uac-qa-results .fail').count();
  expect(errors).toBe(0);
});

test('mobile faction relation avoids radial layout', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/index.html#faction-relation');
  await page.waitForTimeout(1200);
  await expect(page.locator('.pc623-relation-mobile-cards')).toBeVisible();
});
