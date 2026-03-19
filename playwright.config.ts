import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'src/tests/e2e',
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    headless: true,
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:4173/playground/mock-chatgpt.html',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
