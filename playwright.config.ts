import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Set default values for testing if not in .env
process.env.ADMIN_CODE = process.env.ADMIN_CODE || '1234';
process.env.REQUIRED_TEXT = process.env.REQUIRED_TEXT || 'code.org';

export default defineConfig({
  testDir: './tests',
  // Run tests in serial mode to maintain state sequence
  fullyParallel: false,
  workers: 1,
  // Stop on first failure
  maxFailures: 1,
  // Show report automatically after test run
  reporter: [['html', { open: 'always' }]],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    // Run in headful mode (show browser)
    headless: false,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  globalSetup: require.resolve('./tests/setup/global-setup'),
});
