import path from 'node:path'
import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-pool-workers'
import { defineConfig } from 'vitest/config'

/**
 * dc-api test layout has two projects:
 *
 *   - unit    — existing @cloudflare/vitest-pool-workers Miniflare-backed tests
 *               covering handlers, services, and helpers. Everything under
 *               test/ except test/harness/**.
 *   - harness — in-process D1 shim tests via @venturecrane/crane-test-harness.
 *               Validates that the full migration chain applies cleanly and
 *               that every table referenced by dc-api source code exists
 *               post-migration. Runs without Miniflare.
 *
 * `npm test` runs both projects.
 */
export default defineConfig(async () => {
  const migrationsPath = path.join(__dirname, 'migrations')
  const migrations = await readD1Migrations(migrationsPath)

  return {
    test: {
      projects: [
        {
          plugins: [
            cloudflareTest({
              // Use test config that omits [ai] to avoid remote proxy session in CI
              wrangler: { configPath: './wrangler.test.toml' },
              miniflare: {
                bindings: { TEST_MIGRATIONS: migrations },
              },
            }),
          ],
          test: {
            name: 'unit',
            include: ['test/**/*.test.ts'],
            exclude: ['test/harness/**'],
            setupFiles: ['./test/apply-migrations.ts'],
            deps: {
              optimizer: {
                ssr: {
                  enabled: true,
                  include: ['sanitize-html'],
                },
              },
            },
          },
        },
        {
          test: {
            name: 'harness',
            include: ['test/harness/**/*.test.ts'],
          },
        },
      ],
    },
  }
})
