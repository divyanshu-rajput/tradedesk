import { test, expect } from '@playwright/test';

test('shows TradeDesk shell and Market Watch watchlist', async ({ page }) => {
  await page.goto('/market-watch');
  await expect(page.getByRole('heading', { name: 'Market Watch' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Symbol' })).toBeVisible();
  await expect(page.getByText('BTC/USDT')).toBeVisible();
});

test('navigates to Order Placement', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Order Placement' }).click();
  await expect(page.getByRole('heading', { name: 'Order Placement' })).toBeVisible();
});
