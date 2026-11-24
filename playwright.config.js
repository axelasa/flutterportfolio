import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

const localChrome =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  use: {
    browserName: 'chromium',
    launchOptions: existsSync(localChrome)
      ? { executablePath: localChrome }
      : {},
    baseURL: 'http://127.0.0.1:5173',
  },
  webServer: {
    command: 'npm run dev -- --port 5173',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
  },
});
