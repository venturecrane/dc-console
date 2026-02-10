# Dev Team Handoff

**Last Updated:** 2026-02-09
**Repository:** draftcrane/dc-console

---

## Current State

### In Progress

_Nothing currently in progress_

### Ready to Pick Up (P0 -- start here)

- **ADR-001: Editor library spike** -- 2-day Tiptap vs Lexical evaluation on physical iPad. Blocks US-011, US-015, AI Rewrite.
- **ADR-004: PDF/EPUB generation approach** -- Blocks US-019-022 export epic.
- #39 Decision: Content storage when Drive not connected
- #43 Decision: Dual Google OAuth token conflict

### Implemented (close these issues)

- #19 US-009: Create a project
- #20 US-010: Create a chapter
- #22 US-012: Chapter navigation sidebar (shell implemented)

### Blocked

- US-011, US-015: Edit/Auto-save -- Blocked by ADR-001
- US-016-018: AI Rewrite epic -- Blocked by ADR-001
- US-019-022: Export epic -- Blocked by ADR-004

---

## Session Summary (2026-02-09)

### Accomplished

**PR #46 Merged: DraftCrane Phase 0 Core Implementation**

- 28 files changed, 5,206 insertions
- Executed parallel agent plan with 3 phases

**Phase A (Auth Foundation):**

- Clerk JWT verification middleware for API routes
- Webhook handler for Clerk user events (create/update/delete)
- `GET /users/me` endpoint with Drive status and project summary
- ClerkProvider integration in Next.js
- Sign-in/sign-up pages with Clerk components
- Protected route middleware

**Phase B (3 Parallel Agents):**

- B1: Landing page with author-friendly copy, enhanced auth UI
- B2: Google Drive OAuth flow (`/drive/authorize`, `/drive/callback`, `/drive/folders`, `/drive/connection`)
- B2: DriveService with AES-256-GCM token encryption
- B3: Full project CRUD (`POST/GET/PATCH/DELETE /projects`)
- B3: Full chapter CRUD with reorder support
- B3: ProjectService with user authorization
- B3: Book Setup UI page
- B3: Sidebar component with chapter navigation

**Phase C (Integration):**

- Dashboard page with project redirect logic
- Writing Environment shell (3-zone layout: sidebar, toolbar, editor)
- Drive connection banner component
- Project switcher dropdown
- Editor placeholder (pending ADR-001)

**User Stories Implemented:**

- US-001: Sign Up
- US-002: Sign In
- US-003: Sign Out
- US-004: Session Persistence
- US-005: Connect Google Drive
- US-006: Create Book Folder
- US-009: Create a Project
- US-010: Create a Chapter
- US-012: Chapter Navigation Sidebar (shell)
- US-013: Rename a Chapter
- US-014: Delete a Chapter
- US-012A: Reorder Chapters

### Left Off

All Phase 0 parallel execution plan work is merged. Editor area displays placeholder pending ADR-001 decision.

### Needs Attention

- **Close GitHub issues:** #19, #20, #22 (just implemented)
- **ADR-001 spike is highest priority** -- unblocks the most work
- **Decision issues** #39, #43 need resolution for implementation clarity

---

## Next Session Guidance

1. **Close completed issues** -- #19 (US-009), #20 (US-010), #22 (US-012 partial)

2. **ADR-001 Editor Library Spike** (Highest Priority)
   - 2-day evaluation of Tiptap vs Lexical
   - Test on physical iPad with 8-point protocol from PRD
   - Score 1-5 per test, decision from real-device testing only
   - Unblocks: US-011 (edit), US-015 (auto-save), US-016-018 (AI Rewrite)

3. **Resolve decision issues**
   - #39: Content storage when Drive not connected (IndexedDB-only vs R2 buffer)
   - #43: Dual OAuth token conflict (use separate Google OAuth client IDs)

4. **After ADR-001 resolved**
   - Implement US-011: Edit chapter content (rich text editor)
   - Implement US-015: Auto-save with three-tier architecture

---

## API Endpoints Implemented

| Method | Path                             | Description                         |
| ------ | -------------------------------- | ----------------------------------- |
| POST   | `/auth/webhook`                  | Clerk webhook handler               |
| GET    | `/users/me`                      | Current user profile + Drive status |
| GET    | `/drive/authorize`               | Google OAuth URL                    |
| GET    | `/drive/callback`                | OAuth token exchange                |
| POST   | `/drive/folders`                 | Create Book Folder                  |
| GET    | `/drive/folders/:id/children`    | List files                          |
| DELETE | `/drive/connection`              | Disconnect Drive                    |
| POST   | `/projects`                      | Create project                      |
| GET    | `/projects`                      | List projects                       |
| GET    | `/projects/:id`                  | Get project with chapters           |
| PATCH  | `/projects/:id`                  | Update project                      |
| DELETE | `/projects/:id`                  | Soft delete project                 |
| POST   | `/projects/:id/chapters`         | Create chapter                      |
| GET    | `/projects/:id/chapters`         | List chapters                       |
| PATCH  | `/projects/:id/chapters/reorder` | Reorder chapters                    |
| GET    | `/chapters/:id`                  | Get chapter                         |
| PATCH  | `/chapters/:id`                  | Update chapter                      |
| DELETE | `/chapters/:id`                  | Delete chapter                      |

---

## Quick Reference

| Command   | When to Use          |
| --------- | -------------------- |
| `/sod`    | Start of session     |
| `/status` | View full work queue |
| `/eod`    | End of session       |

---

## Previous Session (2026-02-06)

**Foundation Scaffolding (PR #45) -- Merged**

- Next.js frontend, Hono Worker API, 6 D1 migrations
- Cloudflare resources provisioned (D1, R2, KV)
- GitHub Actions CI pipeline
