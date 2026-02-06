# Technical Lead Contribution — PRD Rewrite Round 1

**Author:** Technical Lead (Claude Agent)
**Date:** February 6, 2026
**Scope:** Phase 0 only
**Status:** Draft for review

---

## 1. Architecture Overview (PRD Section 10 Rewrite)

### System Boundaries

DraftCrane Phase 0 has three deployment boundaries:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER'S IPAD / BROWSER                       │
│                                                                     │
│  Next.js App (SSR + Client)                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ Auth (Clerk   │  │ Chapter      │  │ Export UI                │  │
│  │ Components)   │  │ Editor       │  │ (trigger + download)     │  │
│  └──────┬───────┘  └──────┬───────┘  └───────────┬──────────────┘  │
│         │                 │                       │                  │
└─────────┼─────────────────┼───────────────────────┼──────────────────┘
          │                 │                       │
          ▼                 ▼                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE EDGE (dc-api Worker)                  │
│                                                                     │
│  Hono Router                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ /auth/*      │  │ /projects/*  │  │ /ai/*        │              │
│  │ /drive/*     │  │ /chapters/*  │  │ /export/*    │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                 │                  │                       │
│  ┌──────┴─────────────────┴──────────────────┴───────┐              │
│  │                 Services Layer                     │              │
│  │  DriveService │ ProjectService │ AIService │ etc.  │              │
│  └──────┬─────────────────┬──────────────────┬───────┘              │
│         │                 │                  │                       │
│  ┌──────┴───┐  ┌─────────┴───┐  ┌──────────┴────┐                  │
│  │ D1       │  │ R2          │  │ KV             │                  │
│  │ (meta)   │  │ (artifacts) │  │ (cache)        │                  │
│  └──────────┘  └─────────────┘  └────────────────┘                  │
└─────────────────────────────────────────────────────────────────────┘
          │                 │                  │
          ▼                 ▼                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       EXTERNAL SERVICES                             │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ Clerk        │  │ Google Drive  │  │ Anthropic    │              │
│  │ (auth/users) │  │ API (files)   │  │ Claude API   │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

| Layer | Technology | Responsibility | Does NOT Do |
|-------|-----------|----------------|-------------|
| **Frontend** | Next.js + Tailwind | Rendering, editor state, local auto-save buffer, user interactions | Store canonical content, call external APIs directly, hold OAuth tokens |
| **Backend** | Hono on CF Workers | API gateway, business logic, Drive/AI orchestration, token management | Render UI, hold long-lived state, run >30s operations |
| **D1** | Cloudflare D1 (SQLite) | User metadata, project structure, chapter ordering, AI logs | Store manuscript content (that belongs in Drive) |
| **R2** | Cloudflare R2 | Export artifacts (PDF/EPUB), cached images | Long-term content storage (Drive is canonical) |
| **KV** | Cloudflare KV | Session data, Drive API response caching, rate limit counters | Relational queries, large objects |
| **Clerk** | External SaaS | User authentication, session management, JWT issuance | Authorization logic (we own that) |
| **Google Drive** | External API | Canonical manuscript storage, user file ownership | Indexing, search, metadata queries |
| **Claude API** | External API | Text rewriting, expansion, simplification | Autonomous content generation, training on user data |

### Request Flow: Three Core Operations

#### Flow A: User Signs In and Connects Google Drive

```
1. User opens DraftCrane in Safari → Next.js serves the app
2. User clicks "Sign In" → Clerk embedded component handles auth
3. Clerk issues a session JWT → stored as httpOnly cookie
4. Frontend redirects to /dashboard → Next.js SSR calls dc-api with JWT
5. dc-api validates JWT via Clerk SDK → returns user profile + project list

6. User clicks "Connect Google Drive" → frontend redirects to:
   GET /api/drive/authorize
7. dc-api builds Google OAuth URL (scope: drive.file) → returns redirect
8. User grants consent on Google's OAuth screen
9. Google redirects back to /api/drive/callback?code=XXX
10. dc-api exchanges code for access_token + refresh_token
11. dc-api stores encrypted tokens in D1 (drive_connections table)
12. dc-api calls Drive API: list root folders → returns to frontend
13. User selects a folder as their "Book Folder"
14. dc-api stores folder_id in D1 (projects table)
15. Frontend shows "Drive Connected" state
```

**Key design decisions:**
- OAuth tokens never reach the frontend. Stored server-side in D1, encrypted at rest.
- We request `drive.file` scope (not full Drive access) -- only files created by or explicitly shared with our app.
- Refresh token rotation: dc-api handles token refresh transparently on every Drive API call.

#### Flow B: User Writes and Auto-Saves a Chapter

```
1. User navigates to a chapter → frontend loads chapter metadata from dc-api
2. dc-api returns chapter metadata (title, order, drive_file_id) from D1
3. Frontend fetches chapter content:
   GET /api/chapters/:id/content
4. dc-api reads file content from Google Drive API using stored tokens
5. Content returned to frontend → rendered in editor

6. User types in editor → changes buffered in local state
7. Auto-save triggers (debounced, every 5 seconds of inactivity):
   PUT /api/chapters/:id/content
   Body: { content: "<html>...", version: 42 }
8. dc-api writes content to Google Drive via Files.update()
9. dc-api updates chapter metadata in D1 (updated_at, word_count, version)
10. dc-api returns { saved: true, version: 43 } → frontend shows "Saved" indicator

Edge cases:
- If Drive API fails → dc-api returns error → frontend retains local buffer,
  shows "Save failed, retrying..." → exponential backoff retry (3 attempts)
- If version conflict → dc-api returns 409 → frontend prompts user:
  "This chapter was modified elsewhere. Reload or overwrite?"
- If offline → frontend detects navigator.onLine === false → queues save,
  shows "Offline - changes saved locally" → flushes queue when back online
```

**Key design decisions:**
- Content flows: Editor -> dc-api -> Google Drive. D1 never stores chapter body text.
- Optimistic versioning: each save increments a version counter in D1. Conflicts detected server-side.
- Auto-save debounce in the frontend, not the backend. Reduces unnecessary API calls.
- Local buffer persists in browser storage (IndexedDB) as crash protection.

#### Flow C: User Requests AI Rewrite of Selected Text

```
1. User selects text in editor → context menu shows "Rewrite with AI"
2. User clicks → frontend sends:
   POST /api/ai/rewrite
   Body: {
     chapter_id: "ch_123",
     selected_text: "The paragraph to rewrite...",
     instruction: "simplify",  // or "expand", "rewrite"
     surrounding_context: "...preceding 500 chars... [SELECTED] ...following 500 chars..."
   }

3. dc-api validates request (auth, ownership, content length limits)
4. dc-api builds Claude API prompt:
   - System: "You are a writing assistant. Rewrite the selected text. Preserve meaning.
              Match the surrounding tone. Return only the rewritten text."
   - User: selected_text + surrounding_context + instruction
5. dc-api calls Anthropic Claude API (streaming response)
6. dc-api streams response back to frontend via Server-Sent Events (SSE)
7. Frontend shows rewritten text in a diff/preview panel (not inline yet)
8. User clicks "Accept" → rewritten text replaces selection in editor
   User clicks "Reject" → original text preserved, diff panel dismissed

9. dc-api logs the interaction to D1 (ai_interactions table):
   { chapter_id, action, input_length, output_length, model, latency_ms, accepted }
10. If accepted → triggers auto-save flow (Flow B)
```

**Key design decisions:**
- AI never modifies content directly. User always sees a preview and explicitly accepts or rejects.
- Surrounding context (before/after the selection) is sent to preserve tone continuity.
- SSE streaming gives the user immediate feedback -- they see the rewrite appear token by token.
- Every AI interaction is logged for analytics and cost tracking (but input/output text is NOT stored -- only metadata).
- Content length limits enforced server-side: max 2,000 words selected, max 5,000 words context.

---

## 2. Proposed Data Model (Phase 0)

### Guiding Principle: Metadata in D1, Content in Drive

D1 stores everything needed to render the UI, enforce authorization, and track state. Google Drive stores everything the user would want to keep if DraftCrane disappeared.

| Data | Storage | Rationale |
|------|---------|-----------|
| User profile, preferences | D1 | App-internal, not user-owned content |
| Project structure (title, settings) | D1 | Metadata about the book, not the book itself |
| Chapter ordering, titles, word counts | D1 | Navigation structure, frequently queried |
| Chapter body content | Google Drive | User's canonical manuscript. Sacred. |
| OAuth tokens (encrypted) | D1 | Server-side only, never exposed to client |
| AI interaction logs | D1 | Analytics, cost tracking. No user content stored. |
| Export artifacts (PDF/EPUB) | R2 | Temporary; also written back to user's Drive |
| Session/cache data | KV | Ephemeral, performance optimization |

### D1 Schema (Phase 0)

#### Migration 0001: `0001_create_users.sql`

```sql
CREATE TABLE users (
    id              TEXT PRIMARY KEY,           -- Clerk user ID (e.g., "user_2x...")
    email           TEXT NOT NULL,
    display_name    TEXT,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX idx_users_email ON users(email);
```

#### Migration 0002: `0002_create_drive_connections.sql`

```sql
CREATE TABLE drive_connections (
    id              TEXT PRIMARY KEY,           -- ULID
    user_id         TEXT NOT NULL REFERENCES users(id),
    access_token    TEXT NOT NULL,              -- Encrypted at rest
    refresh_token   TEXT NOT NULL,              -- Encrypted at rest
    token_expires_at TEXT NOT NULL,
    drive_email     TEXT,                       -- Google account email
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX idx_drive_connections_user ON drive_connections(user_id);
```

#### Migration 0003: `0003_create_projects.sql`

```sql
CREATE TABLE projects (
    id              TEXT PRIMARY KEY,           -- ULID
    user_id         TEXT NOT NULL REFERENCES users(id),
    title           TEXT NOT NULL,
    drive_folder_id TEXT,                       -- Google Drive folder ID for this book
    status          TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'archived')),
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_projects_user ON projects(user_id);
```

#### Migration 0004: `0004_create_chapters.sql`

```sql
CREATE TABLE chapters (
    id              TEXT PRIMARY KEY,           -- ULID
    project_id      TEXT NOT NULL REFERENCES projects(id),
    title           TEXT NOT NULL,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    drive_file_id   TEXT,                       -- Google Drive file ID for this chapter
    word_count      INTEGER NOT NULL DEFAULT 0,
    version         INTEGER NOT NULL DEFAULT 1, -- Optimistic concurrency control
    status          TEXT NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'review', 'final')),
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_chapters_project ON chapters(project_id);
CREATE UNIQUE INDEX idx_chapters_sort ON chapters(project_id, sort_order);
```

#### Migration 0005: `0005_create_ai_interactions.sql`

```sql
CREATE TABLE ai_interactions (
    id              TEXT PRIMARY KEY,           -- ULID
    user_id         TEXT NOT NULL REFERENCES users(id),
    chapter_id      TEXT REFERENCES chapters(id),
    action          TEXT NOT NULL               -- 'rewrite', 'expand', 'simplify'
                    CHECK (action IN ('rewrite', 'expand', 'simplify')),
    input_chars     INTEGER NOT NULL,           -- Length of selected text
    output_chars    INTEGER NOT NULL,           -- Length of AI response
    model           TEXT NOT NULL,              -- e.g., 'claude-sonnet-4-20250514'
    latency_ms      INTEGER NOT NULL,
    accepted        INTEGER NOT NULL DEFAULT 0, -- 0 = rejected, 1 = accepted
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_ai_interactions_user ON ai_interactions(user_id);
CREATE INDEX idx_ai_interactions_chapter ON ai_interactions(chapter_id);
```

#### Migration 0006: `0006_create_export_jobs.sql`

```sql
CREATE TABLE export_jobs (
    id              TEXT PRIMARY KEY,           -- ULID
    project_id      TEXT NOT NULL REFERENCES projects(id),
    user_id         TEXT NOT NULL REFERENCES users(id),
    format          TEXT NOT NULL               -- 'pdf', 'epub'
                    CHECK (format IN ('pdf', 'epub')),
    status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    r2_key          TEXT,                       -- R2 object key for the generated file
    drive_file_id   TEXT,                       -- Drive file ID once uploaded
    error_message   TEXT,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    completed_at    TEXT
);

CREATE INDEX idx_export_jobs_project ON export_jobs(project_id);
CREATE INDEX idx_export_jobs_user ON export_jobs(user_id);
```

### Google Drive File Structure (per user)

```
Book Folder (user-selected)/
├── Chapter 1 - Introduction.html        -- Created/managed by DraftCrane
├── Chapter 2 - The Problem.html         -- One file per chapter
├── Chapter 3 - The Solution.html
└── _exports/                            -- Subfolder for generated files
    ├── MyBook_2026-02-06.pdf
    └── MyBook_2026-02-06.epub
```

**File format:** HTML (not plain text, not Google Docs native). HTML preserves rich text formatting (bold, italic, headings) and is the natural output of browser-based editors. Google Drive stores it as a regular file; the user can also open it in any browser.

**Why not Google Docs native format?** The Google Docs API for content manipulation is separate from the Drive API, adds complexity, and introduces formatting translation issues. Storing as HTML keeps us in control of the format and eliminates a dependency on the Docs API.

### Notes on Schema Design

- **ULID over UUID:** ULIDs are sortable by creation time, which is useful for ordering without an extra query. They also work well as TEXT primary keys in SQLite/D1.
- **TEXT for dates:** D1 is SQLite under the hood. SQLite does not have a native datetime type. ISO 8601 text strings (`datetime('now')`) sort correctly and are unambiguous.
- **No cascading deletes:** Phase 0 does not need delete operations. When we add them, explicit service-level logic is safer than relying on CASCADE in a distributed system where Drive files also need cleanup.
- **No content in D1:** The `chapters` table has no `body` or `content` column. That data lives in Google Drive. D1 only has the `drive_file_id` pointer.

---

## 3. Non-Functional Requirements (PRD Section 9 Rewrite)

### 3.1 Platform Compatibility

| Requirement | Target | How to Verify |
|-------------|--------|---------------|
| iPad Safari support | iOS/iPadOS 17.0+ (Safari 17+) | Manual testing on iPad Air 5th gen or later; BrowserStack for coverage |
| Desktop browser support | Chrome 120+, Firefox 120+, Safari 17+ | Automated E2E tests via Playwright |
| Minimum viewport | 768px width (iPad portrait) | CSS breakpoint testing |
| Touch interaction | All primary actions completable via touch only | Manual QA checklist: no hover-dependent functionality |
| Virtual keyboard | Editor must not break when iOS keyboard appears/disappears | Manual test: type in editor, keyboard appears, scroll position and toolbar remain accessible |
| No native dependencies | Zero plugins, extensions, or app installs required | Verify via clean Safari profile |

### 3.2 Performance Budgets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Largest Contentful Paint (LCP) | < 2.5 seconds on WiFi | Lighthouse on iPad Safari; throttled to "Fast 3G" as stress test |
| Time to Interactive (TTI) | < 3.5 seconds on WiFi | Lighthouse, same conditions |
| Chapter load (open existing chapter) | < 2 seconds for chapters under 10,000 words | Custom timing: from navigation click to editor content visible |
| Chapter load (large) | < 5 seconds for chapters up to 50,000 words | Same measurement, larger payload |
| Auto-save round trip | < 3 seconds from trigger to "Saved" confirmation | Custom timing: from debounce fire to server response |
| AI rewrite first token | < 2 seconds from request to first visible token | Custom timing: SSE stream onset |
| AI rewrite complete | < 15 seconds for rewrites of up to 500 words | End-to-end timing including streaming display |
| JS bundle size (initial) | < 300 KB gzipped | Build output analysis; tree-shaking verification |
| Editor JS (lazy loaded) | < 200 KB gzipped | Separate chunk; loaded on first editor navigation |

### 3.3 Auto-Save Reliability

| Requirement | Specification |
|-------------|---------------|
| Save trigger | Debounced: 5 seconds after last keystroke |
| Save indicator | Three states visible to user: "Saving...", "Saved [timestamp]", "Save failed" |
| Failure retry | Exponential backoff: 2s, 4s, 8s. Max 3 retries. Then surface error to user. |
| Conflict detection | Optimistic versioning: `version` counter in D1. Server rejects save if client version does not match. |
| Conflict resolution | User-facing prompt: "This chapter was modified elsewhere. View changes / Overwrite / Reload." No silent data loss. |
| Offline behavior | Detect `navigator.onLine` transitions. When offline: queue saves in IndexedDB, show "Offline" indicator. When back online: flush queue in order, resolve conflicts per above. |
| Crash recovery | On editor mount, check IndexedDB for unsaved content newer than Drive version. If found, prompt user to restore or discard. |
| Maximum data loss window | 5 seconds of typing (one debounce interval). IndexedDB write happens on every keystroke as a safety net. |

### 3.4 Security Model

| Requirement | Specification |
|-------------|---------------|
| Authentication | Clerk-managed; session tokens as httpOnly, Secure, SameSite=Lax cookies |
| Authorization | All D1 queries include `WHERE user_id = ?` clause. No query returns data across users. Enforced in service layer, not just route handlers. |
| OAuth token storage | Google OAuth tokens encrypted at rest in D1 using a Worker-level secret (AES-256-GCM). Never sent to frontend. |
| OAuth scope | `https://www.googleapis.com/auth/drive.file` -- access only to files created by or opened with DraftCrane. Not full Drive access. |
| Token refresh | Automatic refresh when `token_expires_at` is within 5 minutes of current time. Old refresh tokens invalidated after use (rotation). |
| Content isolation | User A must never see User B's projects, chapters, or AI interactions. Verified via integration tests with two test users. |
| API rate limiting | Per-user rate limits enforced via KV counters: 60 requests/minute for standard endpoints, 10 requests/minute for AI endpoints. |
| Input validation | All user input validated and sanitized at the API boundary. HTML content sanitized with an allowlist of safe tags before storage. |
| CORS | Production: only the DraftCrane frontend origin. No wildcards. |

### 3.5 Cloudflare Platform Constraints

These are hard limits that constrain the architecture. Design within them.

| Constraint | Limit | Implication |
|-----------|-------|-------------|
| Worker CPU time | 30ms (bundled), 30s (unbound) | Use unbound Workers for AI and export routes. Keep standard routes under 30ms CPU. |
| Worker memory | 128 MB | Cannot load entire large manuscripts into memory. Process chapter-by-chapter. |
| Worker request size | 100 MB | Not a concern for text; relevant for future image handling. |
| Worker subrequests | 1,000 per invocation | Batch Drive API calls. A 50-chapter export must not make 50+ serial subrequests. |
| D1 row size | 1 MB max | No concern for metadata-only rows. Validates decision to keep content out of D1. |
| D1 database size | 2 GB (free), 10 GB (paid) | Monitor table sizes. Millions of AI interaction logs could grow. Add TTL-based cleanup. |
| D1 rows read/write | 5M reads/day, 100K writes/day (free) | Phase 0 with <100 users is fine. Monitor for export-heavy usage patterns. |
| R2 object size | 5 GB max | Sufficient for any PDF/EPUB. |
| R2 operations | 10M Class A, 10M Class B/month (free) | Generous for Phase 0. |
| KV value size | 25 MB max | Sufficient for cached Drive responses. |
| KV operations | 100K reads/day, 1K writes/day (free) | Tight. Use KV for hot-path reads only (session validation, rate limit checks). Evaluate paid plan thresholds. |

### 3.6 Reliability & Data Integrity

| Requirement | Specification |
|-------------|---------------|
| Data durability | Google Drive is the system of record. D1 metadata is reconstructible from Drive if lost. |
| Backup strategy | D1: rely on Cloudflare's automatic backups. Drive: user's own Google Workspace backup. No additional backup in Phase 0. |
| Error handling | All API errors return structured JSON: `{ error: string, code: string, details?: object }`. No stack traces in production responses. |
| Uptime target | No formal SLA in Phase 0. Rely on Cloudflare's platform SLA (99.9%). Monitor informally. |

---

## 4. Technical Risks & Constraints (Phase 0)

### Risk 1: Rich Text Editing on iPad Safari

**Severity:** HIGH -- Could block Phase 0 if editor is unusable on iPad.

**The problem:** Browser-based rich text editors rely heavily on the `contenteditable` API and `Selection`/`Range` APIs, both of which have long-standing inconsistencies in Safari. Known issues include: cursor positioning bugs after formatting changes, selection jumping when virtual keyboard appears/disappears, toolbar interactions causing focus loss, and inconsistent paste handling from other iPad apps.

**Specific concerns:**
- Tiptap (ProseMirror-based) has the strongest iPad track record but still has open issues with iOS selection.
- Lexical (Meta) is newer and has fewer Safari battle scars in production.
- Plate (Slate-based) has documented iOS problems.
- All editors struggle with the iOS virtual keyboard viewport resize behavior (the "visual viewport" vs "layout viewport" split introduced in iOS 15).

**Mitigation:** Prototype the top 2 editor candidates (Tiptap and Lexical) on a physical iPad within the first sprint. Test: basic typing, selection, bold/italic, heading changes, undo/redo, copy/paste from Notes app, behavior when keyboard appears/hides. Decision must be made from real-device testing, not documentation claims.

**Could block Phase 0:** Yes, if no editor works acceptably on iPad Safari.

---

### Risk 2: Google Drive API Latency and Rate Limits

**Severity:** MEDIUM -- Degrades experience but does not block Phase 0.

**The problem:** Every chapter open and every auto-save requires a Google Drive API call. Drive API latency is typically 200-500ms but can spike to 2-3 seconds. Rate limits are 12,000 queries per user per minute (generous) but 20,000 per project per 100 seconds (relevant at scale).

**Specific concerns:**
- Auto-save every 5 seconds means ~12 Drive writes per minute per active user. At 50 concurrent users, that is 600 writes/minute -- well within limits but worth monitoring.
- Opening a chapter requires reading file content from Drive. If the user navigates quickly between chapters, requests pile up.
- Token refresh adds an extra round trip (~500ms) when the access token expires (every hour).

**Mitigation:**
- Cache chapter content in the frontend after first load. Only fetch from Drive on chapter open, not on every render.
- Pre-fetch the next/previous chapter content when the user is reading the current one.
- Implement token refresh proactively (5 minutes before expiry) rather than reactively.
- KV cache for Drive folder listings (TTL: 60 seconds) to avoid repeated list calls.

**Could block Phase 0:** No. But poor save latency directly hurts the "it just works" experience. Must be under 3 seconds.

---

### Risk 3: Real-Time Auto-Save Reliability

**Severity:** HIGH -- Data loss is unacceptable for a writing tool.

**The problem:** Auto-save has multiple failure modes: network dropout (especially on WiFi), Drive API errors (quota, transient failures, token expiry), browser crash/tab close, and version conflicts (user opens same chapter on two devices).

**Specific concerns:**
- iPad Safari aggressively suspends background tabs. If the user switches to another app and back, pending saves may be lost.
- The `beforeunload` event is unreliable on iPad Safari for triggering a final save.
- IndexedDB for local buffering works on iPad Safari but has storage pressure limits (the OS can evict data under storage pressure).

**Mitigation:**
- Write to IndexedDB on every keystroke (cheap, local, fast). Treat it as a write-ahead log.
- On editor mount, compare IndexedDB content with Drive version. If IndexedDB is newer, offer recovery.
- Use the `visibilitychange` event (more reliable than `beforeunload` on iOS) to trigger an immediate save when the tab goes to background.
- Accept that a hard crash (iOS kills Safari) may lose up to 5 seconds of work. Document this as a known limitation.

**Could block Phase 0:** No, but if users lose work during validation testing, it will torpedo confidence. Must be solid before beta.

---

### Risk 4: Claude API Response Times for Inline Rewrites

**Severity:** LOW-MEDIUM -- Affects perceived quality but has known workarounds.

**The problem:** Claude API response time for a 500-word rewrite is typically 3-8 seconds end-to-end. If the user perceives this as "frozen," they will click again or abandon the feature. Non-streaming responses feel much slower than streaming ones.

**Specific concerns:**
- Anthropic API rate limits: 4,000 requests/minute on the Growth tier. Phase 0 traffic is well within this.
- Cost: roughly $0.003-0.01 per rewrite (Sonnet-class model). At 50 rewrites/user/month, approximately $0.50/user/month. Manageable.
- SSE streaming from a Cloudflare Worker to the browser is well-supported but adds implementation complexity.
- Context window: sending surrounding paragraphs for tone matching increases input tokens and cost.

**Mitigation:**
- Stream responses via SSE. The user sees tokens appear within 1-2 seconds.
- Show a clear loading state with "Rewriting..." indicator.
- Limit context to 500 characters before and after the selection (enough for tone, not expensive).
- Use Claude Haiku for simple operations (simplify, shorten) and Sonnet for complex ones (rewrite, expand) to balance cost and quality.

**Could block Phase 0:** No. Even with 8-second response times, the feature is usable with streaming. Optimize later.

---

### Risk 5: PDF/EPUB Generation in a Workers Environment

**Severity:** HIGH -- Significant architectural constraint.

**The problem:** Workers have no filesystem, no headless browser, and a 128 MB memory limit. Traditional PDF generation libraries (Puppeteer, wkhtmltopdf, Prince) will not run. EPUB generation (which is essentially a ZIP of HTML/CSS files) is more feasible but still constrained by memory.

**Specific concerns:**
- A 50-chapter book at 5,000 words per chapter = 250,000 words of HTML. Generating a PDF from this in a Worker is not straightforward.
- PDF libraries that work in Workers/edge environments are limited: `@react-pdf/renderer` (React-based, generates in browser), `jsPDF` (basic, poor typographic quality), `pdf-lib` (low-level PDF manipulation, not layout).
- EPUB generation is more tractable: it is a ZIP file with XHTML content files, a manifest, and CSS. Libraries like `epub-gen` could work with adaptation.
- Cloudflare Browser Rendering API exists but is in beta and has usage limits.

**Mitigation options (to be decided via ADR):**
1. **Client-side generation:** Use `@react-pdf/renderer` or `print-to-pdf` in the browser. Works on iPad Safari. Quality may be limited.
2. **Workers + pdf-lib:** Construct PDF programmatically in the Worker. Full control but significant development effort for typographic layout.
3. **Cloudflare Browser Rendering:** Spin up a headless browser via the Browser Rendering API. Render HTML to PDF. Best quality but beta dependency and per-request cost.
4. **External service:** Offload to a dedicated PDF generation service (e.g., DocRaptor, self-hosted Prince). Adds a dependency.

**Could block Phase 0:** Potentially. If no approach produces acceptable PDF quality within Workers constraints, this feature may need to be descoped to "Export as HTML" or "Export to Google Doc" for Phase 0, with PDF/EPUB added once a solution is validated.

---

## 5. ADR Framing

### ADR-001: Editor Library Selection

**Decision:** Which rich text editor library to use for the chapter writing experience.

**Options:**

| Option | Pros | Cons |
|--------|------|------|
| **Tiptap (ProseMirror)** | Most mature iPad Safari support; large ecosystem of extensions; collaborative editing foundation for future; strong TypeScript support; active commercial backing | Larger bundle size (~150 KB); some extensions are paid (Tiptap Pro); ProseMirror learning curve for custom behavior |
| **Lexical (Meta)** | Smallest bundle (~30 KB core); designed for extensibility; excellent React integration; accessibility-first design; active Meta investment | Younger project, fewer production deployments on iPad; smaller extension ecosystem; iOS Safari support is improving but less battle-tested |
| **Plate (Slate)** | Rich plugin ecosystem; highly customizable UI; good React integration | Known iOS Safari issues (selection, IME); Slate's architecture has had stability concerns; smaller team than Tiptap/Lexical |

**Preliminary recommendation:** Tiptap. The iPad Safari constraint makes maturity the deciding factor. Tiptap/ProseMirror has the most production deployments on iOS Safari. The bundle size cost is acceptable given lazy loading.

**To decide:** Build a minimal editor prototype with Tiptap and Lexical. On a physical iPad (Air 5th gen, iPadOS 17+), test: basic typing, formatting (bold/italic/heading), selection and cursor behavior, copy/paste from other apps, undo/redo, and behavior during virtual keyboard show/hide. Score each on a 1-5 scale. Allocate 2 days.

---

### ADR-002: Google Drive Sync Strategy

**Decision:** When and how chapter content is synchronized between DraftCrane and Google Drive.

**Options:**

| Option | Pros | Cons |
|--------|------|------|
| **On-save (debounced)** | Simple to implement; predictable Drive API usage; clear mental model for users ("save" means "write to Drive") | 5-second data loss window; user must be online to save; no real-time sync between devices |
| **Periodic background sync** | Decouples save from Drive write; can batch multiple changes; more resilient to transient Drive errors | More complex state management; user may see stale data if switching devices; harder to reason about "current" version |
| **Real-time (operational transforms)** | Google-Docs-like experience; multi-device support | Enormous complexity for Phase 0; Drive API is not designed for OT; would need a separate sync layer (e.g., Yjs + WebSocket server); overkill for single-user |

**Preliminary recommendation:** On-save (debounced). Phase 0 is single-user. The simplest approach that works is the right one. Multi-device sync is a Phase 2+ concern.

**To decide:** Prototype the on-save flow end-to-end: editor change -> debounce -> API call -> Drive write -> confirmation. Measure: round-trip latency on WiFi and cellular. If consistently under 3 seconds, ship it. If not, add a local persistence layer (IndexedDB) and consider background sync. Allocate 1 day.

---

### ADR-003: AI Integration Path

**Decision:** How DraftCrane calls the Claude API -- directly or through Cloudflare AI Gateway.

**Options:**

| Option | Pros | Cons |
|--------|------|------|
| **Direct Anthropic API** | Simplest integration; full control over prompts and streaming; no additional abstraction layer; best documentation and SDK support | No built-in caching, rate limiting, or analytics from the gateway; must implement observability ourselves |
| **Cloudflare AI Gateway** | Built-in request logging, caching, rate limiting, and fallback; analytics dashboard; potential cost savings from response caching | Adds a dependency and abstraction layer; may introduce latency; caching only helps if identical prompts recur (unlikely for rewrites); less control over streaming behavior |
| **Workers AI (Cloudflare's own models)** | Zero egress cost; lowest latency (same network); simple binding | Model quality not comparable to Claude for writing tasks; limited model selection; not suitable as primary AI for a writing tool |

**Preliminary recommendation:** Direct Anthropic API for Phase 0. The AI Gateway benefits (caching, analytics) are more valuable at scale. In Phase 0 with <100 users, the simplicity of a direct integration wins. We can add the gateway later without changing the API surface -- just swap the HTTP endpoint in the service layer.

**To decide:** No prototype needed. This is a straightforward integration. Use the Anthropic TypeScript SDK (`@anthropic-ai/sdk`). Implement a thin `AIService` wrapper that can be re-pointed to AI Gateway later. Ship direct and measure cost/latency for 30 days before reconsidering.

---

### ADR-004: PDF/EPUB Generation Approach

**Decision:** How to generate print-ready PDF and EPUB files from chapter HTML content.

**Options:**

| Option | Pros | Cons |
|--------|------|------|
| **Client-side (browser)** | No server constraints; works within Workers limits; user can preview before saving; `react-pdf` for PDF, custom ZIP for EPUB | PDF typographic quality is limited; large documents may strain iPad memory; browser print-to-PDF varies by platform; EPUB packaging in browser is unusual |
| **Worker-side (pdf-lib + custom EPUB)** | Full server control; consistent output across clients; can use R2 for staging; EPUB is tractable (ZIP of XHTML) | `pdf-lib` is low-level (no automatic text layout, pagination, or styling from HTML); building a typographic layout engine is a project unto itself; memory-constrained for large books |
| **Cloudflare Browser Rendering** | High-quality PDF via headless Chrome; renders HTML/CSS faithfully; Cloudflare-native integration | Beta product; per-session pricing; cold start latency (~2-5s); availability and limits may change; dependency on a beta API for a core feature |

**Preliminary recommendation:** Hybrid approach. EPUB generation in the Worker (it is fundamentally a ZIP of XHTML -- tractable). PDF generation via Cloudflare Browser Rendering if available and stable; fall back to client-side `window.print()` styled export as MVP. This is the highest-risk ADR and needs prototyping before committing.

**To decide:** Three spikes, 1 day each:
1. Build an EPUB generator in a Worker: take 3 chapters of HTML, produce a valid EPUB file, write to R2, verify it opens in Apple Books.
2. Test Cloudflare Browser Rendering: render a 10-chapter HTML manuscript to PDF. Measure quality, latency, and cost.
3. Test client-side PDF generation: use `react-pdf` or `window.print()` on iPad Safari for the same 10-chapter manuscript. Evaluate quality and iPad performance.

Compare outputs side by side. Accept the approach that produces "good enough for a self-published nonfiction book" quality.

---

### ADR-005: Data Model Split (D1 vs. Google Drive)

**Decision:** Precisely what data lives in D1 (our database) vs. Google Drive (user's storage).

**Options:**

| Option | Pros | Cons |
|--------|------|------|
| **Metadata-only in D1** (proposed above) | Clean separation; user owns all content; D1 stays small; Drive is system of record; simplest mental model | Every chapter open requires a Drive API call; no full-text search without indexing content; export must re-fetch all chapters from Drive |
| **Content cached in D1** | Faster chapter loads (no Drive API call after first load); enables full-text search; reduces Drive API dependency | Content duplication; sync complexity (which copy is authoritative?); D1 storage grows with content; must handle cache invalidation when user edits in Drive directly |
| **Content in R2, metadata in D1** | R2 handles large objects well; no D1 size concerns; faster than Drive API for reads | Still duplicated content; R2 is not queryable (no search); adds another storage layer to keep in sync; user's Drive is no longer the live version |

**Preliminary recommendation:** Metadata-only in D1 (Option 1). The "user's files are sacred" principle means Drive is always authoritative. The performance cost of Drive API reads is acceptable for Phase 0 given caching in the frontend and KV. If search becomes critical (Phase 2: Source Intelligence), we can add a search index at that point.

**To decide:** Measure Drive API read latency for chapter-sized files (1,000-10,000 words of HTML). If consistently under 1 second, metadata-only is validated. If over 2 seconds, consider Option 2 (D1 content cache) with clear invalidation rules. Allocate 0.5 days to benchmark.

---

## 6. API Surface (Phase 0)

All routes are served by the `dc-api` Worker (Hono). All routes except `/auth/webhook` require a valid Clerk session JWT. Responses are JSON unless noted.

### Auth & User

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/webhook` | Clerk webhook: user created/updated/deleted events. Syncs user record to D1. |
| GET | `/users/me` | Returns current user profile and Drive connection status. |

### Google Drive

| Method | Path | Description |
|--------|------|-------------|
| GET | `/drive/authorize` | Returns Google OAuth authorization URL. Redirects user to Google consent screen. |
| GET | `/drive/callback` | OAuth callback. Exchanges code for tokens, stores in D1, redirects to app. |
| GET | `/drive/folders` | Lists folders in user's Drive root. Used for "Select Book Folder" UI. |
| GET | `/drive/folders/:folderId/children` | Lists subfolders of a given folder. For folder navigation during selection. |
| DELETE | `/drive/connection` | Disconnects Google Drive. Revokes token, deletes from D1. |

### Projects

| Method | Path | Description |
|--------|------|-------------|
| POST | `/projects` | Creates a new book project. Links to Drive folder. |
| GET | `/projects` | Lists all projects for the current user. |
| GET | `/projects/:projectId` | Returns project details including chapter list. |
| PATCH | `/projects/:projectId` | Updates project title or settings. |

### Chapters

| Method | Path | Description |
|--------|------|-------------|
| POST | `/projects/:projectId/chapters` | Creates a new chapter. Creates corresponding file in Google Drive. |
| GET | `/projects/:projectId/chapters` | Lists chapters for a project (metadata only: title, order, word count). |
| PATCH | `/chapters/:chapterId` | Updates chapter metadata (title, sort_order, status). |
| GET | `/chapters/:chapterId/content` | Fetches chapter body content from Google Drive. Returns HTML. |
| PUT | `/chapters/:chapterId/content` | Writes chapter body content to Google Drive. Accepts HTML. Expects `version` header for conflict detection. |
| DELETE | `/chapters/:chapterId` | Deletes chapter metadata from D1. Optionally trashes Drive file (query param `?trash_drive=true`). |
| PATCH | `/projects/:projectId/chapters/reorder` | Batch-updates sort_order for multiple chapters. Accepts `[{ id, sort_order }]`. |

### AI

| Method | Path | Description |
|--------|------|-------------|
| POST | `/ai/rewrite` | Sends selected text + instruction to Claude API. Returns SSE stream of rewritten text. |
| POST | `/ai/accept` | Records that the user accepted an AI suggestion. Updates ai_interactions log. |
| POST | `/ai/reject` | Records that the user rejected an AI suggestion. Updates ai_interactions log. |

### Export

| Method | Path | Description |
|--------|------|-------------|
| POST | `/projects/:projectId/export` | Initiates export job. Accepts `{ format: "pdf" | "epub" }`. Returns job ID. |
| GET | `/export/:jobId` | Returns export job status. When completed, includes a signed R2 download URL. |
| POST | `/export/:jobId/to-drive` | Uploads completed export artifact from R2 to user's Drive Book Folder. |

### Conventions

- **IDs:** All entity IDs are ULIDs, passed as path parameters.
- **Pagination:** List endpoints support `?limit=N&cursor=ULID` for cursor-based pagination. Default limit: 50.
- **Errors:** All errors return `{ error: string, code: string }` with appropriate HTTP status codes. Common codes: `AUTH_REQUIRED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `CONFLICT` (409), `RATE_LIMITED` (429), `DRIVE_ERROR` (502).
- **Versioning:** No URL versioning in Phase 0. If breaking changes are needed, introduce `/v2/` prefix.
- **CORS:** Restricted to the DraftCrane frontend origin.
- **Rate limiting:** Standard endpoints: 60 req/min/user. AI endpoints: 10 req/min/user. Export endpoints: 5 req/min/user.

---

## Appendix: Open Questions for PRD Discussion

These are not decisions for the Technical Lead to make unilaterally, but they surfaced during this analysis:

1. **File format for chapters:** This document proposes HTML files in Drive. The PM should confirm this is acceptable to users. Alternative: Google Docs native format (adds Docs API dependency but files are editable in Docs).

2. **Export quality bar:** What does "print-ready PDF" mean specifically? Trim size, margins, font, headers/footers, page numbering? These affect the PDF generation approach significantly. Recommend the PM define 2-3 reference books as quality targets.

3. **Offline writing:** The current design requires internet for auto-save (Drive API). Should Phase 0 support meaningful offline writing (local-only mode with sync on reconnect), or is "offline indicator + local buffer" sufficient?

4. **Multi-device:** Phase 0 assumes single-device usage. If a user opens the same chapter on their iPad and laptop simultaneously, we detect the conflict but the resolution UX is basic. Is that acceptable for validation?

5. **AI cost controls:** Should Phase 0 have per-user AI usage limits (e.g., 100 rewrites/month on free tier)? This affects both the data model (tracking usage) and the UX (showing remaining quota). Recommend deferring monetization limits to post-validation but tracking usage from day one.
