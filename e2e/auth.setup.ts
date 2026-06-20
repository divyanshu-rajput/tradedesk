import { expect, test as setup } from '@playwright/test';

const authFile = 'e2e/.auth/user.json';
const bootTimeout = 60_000;

setup('authenticate as guest', async ({ page }) => {
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.error(`[browser] ${msg.text()}`);
    }
  });

  await page.goto('/login', { waitUntil: 'load' });

  await expect(page.getByRole('heading', { name: 'Welcome to TradeDesk' })).toBeVisible({
    timeout: bootTimeout,
  });
  await expect(page.getByRole('button', { name: 'Continue as guest' })).toBeEnabled({
    timeout: bootTimeout,
  });

  await page.getByRole('button', { name: 'Continue as guest' }).click();

  await expect(page.getByRole('heading', { name: 'Market Watch' })).toBeVisible({
    timeout: bootTimeout,
  });
  await page.waitForFunction(
    () => sessionStorage.getItem('tradedesk.app-session') === '1',
    undefined,
    { timeout: 30_000 },
  );
  await page.context().storageState({ path: authFile });
});
