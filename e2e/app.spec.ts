import { test, expect, type Page } from '@playwright/test';

/** Sign in as guest from the login page — reliable for CI with Firebase emulators. */
async function enterApp(page: Page): Promise<void> {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Continue as guest' }).click();
  await expect(page.getByRole('heading', { name: 'Market Watch' })).toBeVisible({
    timeout: 60_000,
  });
}

test('redirects unauthenticated users to login', async ({ page }) => {
  await page.goto('/market-watch');
  await expect(page.getByRole('heading', { name: 'Welcome to TradeDesk' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in with Google' })).toBeVisible();
});

test('shows TradeDesk shell and Market Watch watchlist', async ({ page }) => {
  await enterApp(page);
  await expect(page.getByRole('columnheader', { name: 'Symbol' })).toBeVisible();
  await expect(page.getByText('BTC/USDT')).toBeVisible();
});

test('places a market order from Order Placement', async ({ page }) => {
  await enterApp(page);
  await page.getByRole('link', { name: 'Order Placement' }).click();
  await expect(page.getByRole('heading', { name: 'Order Placement' })).toBeVisible();
  await page.getByRole('button', { name: 'Place order' }).click();
  await expect(page.getByRole('heading', { name: 'Recent orders' })).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByText(/BUY BTC\/USDT/)).toBeVisible();
});

test('shows order book depth for selected symbol', async ({ page }) => {
  await enterApp(page);
  await page.getByRole('link', { name: 'Order Book' }).click();
  await expect(page.getByRole('heading', { name: 'Order Book' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Bids' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Asks' })).toBeVisible();
});

test('shows portfolio summary and holdings table', async ({ page }) => {
  await enterApp(page);
  await page.getByRole('link', { name: 'Portfolio' }).click();
  await expect(page.getByRole('heading', { name: 'Portfolio' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'P&L' })).toBeVisible();
});

test('shows virtualized order history', async ({ page }) => {
  await enterApp(page);
  await page.getByRole('link', { name: 'Order History' }).click();
  await expect(page.getByRole('heading', { name: 'Order History' })).toBeVisible();
  await expect(page.getByText(/only visible rows render/)).toBeVisible();
});
