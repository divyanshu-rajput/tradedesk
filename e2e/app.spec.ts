import { test, expect } from '@playwright/test';

test('shows TradeDesk shell and navigates to Market Watch', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'TradeDesk' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Market Watch' })).toBeVisible();
});

test('navigates to Order Placement', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Order Placement' }).click();
  await expect(page.getByRole('heading', { name: 'Order Placement' })).toBeVisible();
});
