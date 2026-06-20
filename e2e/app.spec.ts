import { test, expect } from '@playwright/test';

test('shows TradeDesk shell and Market Watch watchlist', async ({ page }) => {
  await page.goto('/market-watch');
  await expect(page.getByRole('heading', { name: 'Market Watch' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Symbol' })).toBeVisible();
  await expect(page.getByText('BTC/USDT')).toBeVisible();
});

test('places a market order from Order Placement', async ({ page }) => {
  await page.goto('/order-placement');
  await page.getByRole('button', { name: 'Place order' }).click();
  await expect(page.getByRole('heading', { name: 'Recent orders' })).toBeVisible();
  await expect(page.getByText(/BUY BTC\/USDT/)).toBeVisible();
});

test('shows order book depth for selected symbol', async ({ page }) => {
  await page.goto('/order-book');
  await expect(page.getByRole('heading', { name: 'Order Book' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Bids' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Asks' })).toBeVisible();
});
