import { defineConfig, devices } from '@playwright/test';

const ciWebServerCommand =
  'firebase emulators:exec --only auth,firestore "ng serve --configuration=ci --port 4200"';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: !process.env['CI'],
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  timeout: process.env['CI'] ? 60_000 : 30_000,
  reporter: process.env['CI'] ? 'github' : 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    actionTimeout: 15_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: process.env['CI'] ? ciWebServerCommand : 'npm run start -- --configuration=demo',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
    timeout: 180_000,
  },
});
