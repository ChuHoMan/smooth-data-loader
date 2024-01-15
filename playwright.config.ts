import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: [
    {
      command: 'pnpm --filter "@integration-test/react" dev',
      port: 8777,
      reuseExistingServer: true,
      stderr: 'pipe',
    },
    {
      command: 'pnpm --filter "@integration-test/vue3-router" dev',
      port: 7788,
      reuseExistingServer: true,
      stderr: 'pipe',
    },
  ],
  // Run your local dev server before starting the tests
  projects: [
    {
      name: 'react',
      testMatch: /.*react.test.ts/,
      retries: 0,
      use: {
        baseURL: 'http://127.0.0.1:8777',
      },
    },
    {
      name: 'vue',
      testMatch: /.*vue.test.ts/,
      retries: 0,
      use: {
        baseURL: 'http://127.0.0.1:7788',
      },
    },
  ],

});
