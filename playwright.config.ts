import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/browser',
  outputDir: process.env.PLAYWRIGHT_OUTPUT_DIR || '/tmp/yunyoujun-blog-playwright',
  fullyParallel: true,
  workers: 2,
  use: { baseURL: 'http://localhost:4851', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
    { name: 'dark', use: { ...devices['Desktop Chrome'], colorScheme: 'dark' } },
  ],
  webServer: {
    command: 'pnpm build && pnpm exec vite preview --host localhost --port 4851 --strictPort',
    url: 'http://localhost:4851',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
