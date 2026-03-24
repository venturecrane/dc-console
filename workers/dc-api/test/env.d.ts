import type { Env as AppEnv } from '../src/types/env.js'
import type { D1Migration } from 'cloudflare:test'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cloudflare {
    interface Env extends AppEnv {
      TEST_MIGRATIONS: D1Migration[]
    }
  }
}
