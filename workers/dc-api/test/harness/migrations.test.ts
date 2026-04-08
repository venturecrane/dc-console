/**
 * dc-api migration validation using @venturecrane/crane-test-harness.
 *
 * This test asserts that:
 *   1. discoverNumericMigrations returns dc-api migrations in numeric order.
 *   2. runMigrations applies the entire chain cleanly to a fresh in-memory
 *      D1 shim. Catches any future destructive migration or ordering bug.
 *   3. The post-migration schema includes every table that dc-api source
 *      code reads from or writes to. Catches schema drift if a migration is
 *      removed or renamed without updating source.
 */

import { describe, it, expect } from 'vitest'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  createTestD1,
  runMigrations,
  discoverNumericMigrations,
} from '@venturecrane/crane-test-harness'

const __dirname = dirname(fileURLToPath(import.meta.url))
const migrationsDir = join(__dirname, '..', '..', 'migrations')

describe('dc-api migrations via crane-test-harness', () => {
  it('discoverNumericMigrations returns migrations in numeric order', () => {
    const files = discoverNumericMigrations(migrationsDir)
    expect(files.length).toBeGreaterThan(0)

    const numbers = files.map((f) => {
      const match = f.match(/(\d{4})_/)
      return match ? Number(match[1]) : -1
    })
    for (let i = 1; i < numbers.length; i++) {
      expect(numbers[i]).toBeGreaterThan(numbers[i - 1]!)
    }
    expect(numbers[0]).toBe(1)
  })

  it('runMigrations applies the full chain cleanly to a fresh DB', async () => {
    const db = createTestD1()
    const files = discoverNumericMigrations(migrationsDir)
    await runMigrations(db, { files })

    const usersExists = await db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'users'")
      .first<{ name: string }>()
    expect(usersExists?.name).toBe('users')
  })

  it('post-migration schema includes every table the worker source code uses', async () => {
    const db = createTestD1()
    await runMigrations(db, { files: discoverNumericMigrations(migrationsDir) })

    // Tables that dc-api source code (workers/dc-api/src/**) reads or writes.
    // Grep: `(FROM|INTO|UPDATE) <table>` across src/.
    const expectedTables = [
      'users', // 0001
      'projects', // 0002
      'chapters', // 0003
      'drive_connections', // 0004 (evolved by 0010)
      'ai_interactions', // 0005
      'export_jobs', // 0006
      'source_materials', // 0009 (evolved by 0011)
      'research_clips', // 0016
      'research_queries', // 0017
      'project_source_connections', // 0018
      'project_linked_folders', // 0019
      'ai_instructions', // 0020
      'export_preferences', // 0022
      'linked_folder_exclusions', // 0023
      'rate_limit_counters', // 0024
      'analysis_jobs', // 0025
      'feedback', // 0026
    ]

    const result = await db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name")
      .all<{ name: string }>()
    const actualTables = (result.results || []).map((r) => r.name)

    for (const expected of expectedTables) {
      expect(actualTables, `expected table ${expected} to exist post-migration`).toContain(expected)
    }
  })

  it('post-migration schema includes source_content_fts virtual table', async () => {
    const db = createTestD1()
    await runMigrations(db, { files: discoverNumericMigrations(migrationsDir) })

    // source_content_fts is a virtual table (fts5) created in 0014.
    const result = await db
      .prepare("SELECT name FROM sqlite_master WHERE name = 'source_content_fts'")
      .first<{ name: string }>()
    expect(result?.name).toBe('source_content_fts')
  })
})
