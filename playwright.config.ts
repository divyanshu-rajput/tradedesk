import { defineConfig, devices } from '@playwright/test';

const ciWebServerCommand =
  'firebase emulators:exec --only auth,firestore "ng serve --configuration=ci --port 4200"';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: 1,
  timeout: process.env['CI'] ? 90_000 : 30_000,
  reporter: process.env['CI'] ? 'github' : 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    actionTimeout: 20_000,
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'chromium',
      testIgnore: /auth\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: process.env['CI'] ? ciWebServerCommand : 'npm run start -- --configuration=demo',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
    timeout: 240_000,
  },
});
