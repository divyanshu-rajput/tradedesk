import { expect, test as setup } from '@playwright/test';

const authFile = 'e2e/.auth/user.json';

setup('authenticate as guest', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('button', { name: 'Continue as guest' })).toBeEnabled();
  await page.getByRole('button', { name: 'Continue as guest' }).click();
  await expect(page.getByRole('heading', { name: 'Market Watch' })).toBeVisible({
    timeout: 120_000,
  });
  await page.waitForFunction(
    () => sessionStorage.getItem('tradedesk.app-session') === '1',
    undefined,
    { timeout: 30_000 },
  );
  await page.context().storageState({ path: authFile });
});
