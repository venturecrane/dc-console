import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright config for dc-console E2E + agent-driven authenticated browser flows.
 *
 * Crane runbook: docs/runbooks/clerk-playwright-auth-setup.md (in crane-console)
 *
 * Captain prereqs before tests run:
 *  - Clerk test user `agent-test+clerk_test@venturecrane.com` exists in dc-console's Clerk dev instance
 *  - CLERK_SECRET_KEY, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, E2E_CLERK_USER_EMAIL set (Infisical /dc)
 */
export default defineConfig({
  testDir: './e2e',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',

  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'setup-clerk',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'chromium-authed',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.clerk/user.json',
      },
      dependencies: ['setup-clerk'],
    },
    {
      name: 'chromium-public',
      testMatch: /.*\.public\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev --workspace=web',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
