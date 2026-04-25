# Semgrep Initial Canary Verification

**Date:** 2026-04-25
**PR:** #519 (chore/security-semgrep-ci-gate)
**Captain concern addressed:** "Make sure this actually gets implemented correctly and doesn't end up being some theatre we only discover down the road."

This doc captures the pre-merge evidence that the Semgrep CI gate actually catches findings, not just runs and passes. It survives squash-merge as permanent proof the gate was real at installation time.

## Canary file

`scripts/semgrep-canary.ts` was committed to the draft PR with three deliberate `detect-child-process` findings — `execSync` and `spawn` calls where an argument traces back to a function parameter. All three are exact matches for rules in the pinned pack combination.

Canary content (removed before merge):

```typescript
import { execSync, spawn } from 'child_process'

export function canaryChildProcessExec(userName: string): string {
  return execSync(`echo hello ${userName}`).toString()
}

export function canaryChildProcessSpawn(cmd: string): void {
  spawn(cmd)
}

export function canaryExecThird(venture: string): void {
  execSync(`gh repo list ${venture}`)
}
```

## CI run — with canary (RED, as expected)

**Run:** https://github.com/venturecrane/dc-console/actions/runs/24942174380

**Static Analysis (Semgrep) job:** FAILED

Findings (3 total, 3 blocking):

```
   ❯❯❱ javascript.lang.security.detect-child-process.detect-child-process
           Blocking — scripts/semgrep-canary.ts:5

   ❯❯❱ javascript.lang.security.detect-child-process.detect-child-process
           Blocking — scripts/semgrep-canary.ts:9

   ❯❯❱ javascript.lang.security.detect-child-process.detect-child-process
           Blocking — scripts/semgrep-canary.ts:13
```

Semgrep scan metadata: `Rules run: 320`, `Targets scanned: 474`.

**Security Summary job:** FAILED (aggregated as expected — the semgrep job's failure propagates through `needs`).

**nosemgrep Justification Audit job:** PASSED.

## Pre-existing findings discovered

The first real CI run surfaced findings that required remediation before CI went green:

### 1. react-dangerouslysetinnerhtml XSS (fixed)

**File:** `web/src/components/sources/document-peek-view.tsx:180`
**Rule:** `typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml`

**Root cause:** `DriveFileService.getFileContent()` exported raw HTML from the Google Docs API without sanitization. The `sanitizeGoogleDocsHtml` utility existed in `workers/dc-api/src/utils/html-sanitize.ts` (with a strict tag/attribute allowlist and no-scripts/no-styles enforcement) but was not called in this code path.

**Fix applied:** Called `sanitizeGoogleDocsHtml()` in `DriveFileService.getFileContent()` for the `GOOGLE_DOC_MIME_TYPE` case before the HTML is returned from the API. Added justified `nosemgrep` annotation on the React component documenting that the HTML is sanitized at the API boundary.

**Post-fix pre-flight scan:** 0 findings.

### 2. Pre-existing npm audit vulnerabilities (fixed)

The new NPM Audit matrix (covering both `web` and `workers/dc-api` separately) surfaced high/critical vulnerabilities in the `web` workspace that were present on `main` before this PR. The old `security.yml` ran `npm audit` without workspace isolation, so these were technically already failing.

Vulnerabilities fixed via `npm audit fix`:

- **Critical:** `@clerk/nextjs` — middleware-based route protection bypass (GHSA-xxx)
- **Critical:** `@clerk/shared` — same Clerk SDK vulnerability
- **High:** `vite` — path traversal in optimized deps `.map` handling + `server.fs.deny` bypass

Remaining after fix: 4 moderate-severity only (below `--audit-level=high` threshold).

### 3. CI config iterations

Two CI fixes were needed during this PR (not pre-existing security findings):

- Added `packages: read` permission to security workflow (org packages require this; `ci.yml` inherits it from repo default, explicit `permissions:` block blocked it)
- Changed TypeScript job to run from root workspace (`npm run typecheck -w dc-api`) instead of within the worker directory, matching `ci.yml`'s approach — running `tsc` from within `workers/dc-api` misses root `devDependencies` like `mammoth` used via dynamic import

## CI run — canary removed (GREEN, post-fix)

**Run:** https://github.com/venturecrane/dc-console/actions/runs/24942379127

All 6 security checks pass:

- NPM Audit (web): PASSED
- NPM Audit (workers/dc-api): PASSED
- Secret Detection: PASSED
- TypeScript Validation: PASSED
- Static Analysis (Semgrep): PASSED
- nosemgrep Justification Audit: PASSED
- Security Summary: PASSED (aggregated green)

## Ruleset application to live repo

**Applied:** 2026-04-25 via `gh api --method POST /repos/venturecrane/dc-console/rulesets --input ~/dev/crane-console/config/github-ruleset-main-protection.json`

(Ruleset ID and enforcement recorded below after application)

## Takeaways

- Semgrep gate fires on canary (not theatre).
- Summary job correctly aggregates sub-job failures.
- `nosemgrep-audit` accepts justified annotations, rejects bare/short.
- Container pin `returntocorp/semgrep:1.157.0` + pack combo produces reproducible runs.
- Real pre-existing finding (`react-dangerouslysetinnerhtml`) discovered and fixed in the same PR rather than suppressed or deferred.
- Pre-existing npm audit vulnerabilities surfaced and fixed as a bonus.
