# Dev Team Handoff

**Last Updated:** 2026-02-06
**Repository:** draftcrane/dc-console

---

## Current State

### In Progress
- #45 PR: Foundation scaffolding and infrastructure setup (pending merge)

### Ready to Pick Up (P0 -- start here)
- #2 ADR-001: Choose editor library (Tiptap vs Lexical vs Plate) -- **Blocks all editor work**
- #3 ADR-004: PDF/EPUB generation approach -- **Blocks all export work**
- #9 US-001: Sign up with Google or email
- #10 US-002: Sign in and resume writing
- #14 US-005: Connect Google Drive via OAuth
- #15 US-006: Auto-create Book Folder in Drive
- #19 US-009: Create a project
- #20 US-010: Create a chapter
- #21 US-011: Edit chapter content (rich text editor)
- #22 US-012: Chapter navigation sidebar
- #26 US-015: Auto-save with three-tier architecture
- #30 US-016: Select text for AI Rewrite
- #31 US-017: Request AI Rewrite with streaming response
- #32 US-018: Accept, reject, or retry AI rewrite

### Needs Triage (decisions required)
- #39 Content storage when Drive not connected (IndexedDB-only vs R2 buffer)
- #40 Voice sample field in Phase 0 (customer wants it, PM excluded it)
- #41 PDF vs EPUB priority if only one can be excellent
- #42 Chapter completion definition for kill criteria
- #44 Approve D1 paid tier for Phase 0

### Blocked
Editor stories (#19-#28) are effectively blocked by ADR-001 (#2).

---

## Session Summary (2026-02-06, Session 2: Infra-E / S1)

### Accomplished

**Foundation Scaffolding (Issue #7) -- Complete**
- Scaffolded Next.js frontend in `web/` (TypeScript + Tailwind + ESLint)
- Created Hono Worker API in `workers/dc-api/` with full modular structure:
  - `src/index.ts` -- route mounting only
  - `src/middleware/` -- CORS (no wildcards) and error handling (`{ error, code }`)
  - `src/routes/` -- health check endpoint
  - `src/services/` -- empty, ready for business logic
  - `src/types/` -- Env bindings, API error types, pagination types
  - `src/utils/` -- empty, ready for utilities
  - `test/` -- health endpoint test (Vitest + Workers pool)
- Created 6 D1 migrations matching PRD Section 11 schema:
  - `0001_create_users.sql` -- Clerk user ID as PK
  - `0002_create_projects.sql` -- with ULID PKs, user isolation index
  - `0003_create_chapters.sql` -- unique (project_id, sort_order), no content column
  - `0004_create_drive_connections.sql` -- unique per user, encrypted token fields
  - `0005_create_ai_interactions.sql` -- action enum, no user content
  - `0006_create_export_jobs.sql` -- format/status enums, R2/Drive references
- Provisioned Cloudflare resources:
  - D1 database: `dc-main` (ID: `da753071-4176-4efa-9b7f-4f744b8e1aa2`)
  - R2 bucket: `dc-exports`
  - KV namespace: `dc-cache` (ID: `15db632cefe04003a94f1e6e7460c858`)
- All migrations applied to both local and remote D1
- Worker deployed at: `https://dc-api.automation-ab6.workers.dev`
- GitHub Actions CI pipeline: lint, typecheck, test
- Monorepo with npm workspaces (`web`, `workers/*`)
- Prettier configured at root, ESLint per workspace
- `.env.example` documenting all required environment variables
- PR #45 created

### Left Off
Foundation is complete and deployed. Ready to merge #45 and begin feature work.

### Needs Attention
- **Merge PR #45** to unblock all feature development
- **ADR-001 (editor library)** remains the highest priority -- blocks the entire editor epic
- **ADR-004 (PDF/EPUB generation)** is second priority -- blocks all export work
- **Captain needs to set up**: Clerk app, Google Cloud OAuth creds, Anthropic API key (see `.env.example`)
- **D1 paid tier** (#44) needs human decision for production readiness

---

## Next Session Guidance

### Recommended Start Order (per execution plan)
1. **Spike-R: ADR-001** (#2) -- Tiptap + Lexical iPad prototypes. Captain runs 8-point test on physical iPad.
2. **Spike-R: ADR-004** (#3) -- EPUB generator in Worker, Browser Rendering PDF test, DocRaptor fallback.
3. **Spike-R: ADR-002/003/005** (#4, #5, #6) -- Drive sync, AI provider, data model lightweight ratifications.
4. **Back-E: Auth** (#9, #10, #11, #12) -- Clerk webhook, `GET /users/me`, session middleware.
5. **Front-E: Auth UI** (#38, #9, #10) -- Landing page, Clerk integration, sign-up/sign-in.

### API Contract (for Front-E)
Worker base URL: `https://dc-api.automation-ab6.workers.dev`
- `GET /health` -- `{ status: "ok", service: "dc-api" }`
- Error format: `{ error: string, code: string }` (see `src/types/api.ts` for ErrorCode union)
- CORS: configured for `FRONTEND_URL` env var (currently `https://draftcrane.com`)

### Key Files
- `docs/pm/prd.md` -- The synthesized PRD (authoritative)
- `docs/process/dc-project-instructions.md` -- Project instructions
- `workers/dc-api/wrangler.toml` -- All Cloudflare bindings
- `.env.example` -- All required environment variables

---

## Quick Reference

| Command | When to Use |
|---------|-------------|
| `/sod` | Start of session |
| `/eod` | End of session |
| `/commit` | Create commit with good message |
