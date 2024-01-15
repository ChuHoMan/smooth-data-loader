import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Run your local dev server before starting the tests
  webServer: {
    command: 'pnpm --filter "@integration-test/react" dev',
    port: 8777,
    reuseExistingServer: true,
    stderr: 'pipe',
  },
  use: {
    baseURL: 'http://127.0.0.1:8777',
  },
});
