# Technical Lead Contribution -- PRD Rewrite Round 3 (FINAL)

**Author:** Technical Lead (Claude Agent)
**Date:** February 6, 2026
**Scope:** Phase 0 only
**Status:** Final version. Incorporates all Round 2 cross-role feedback.

---

## Changes from Round 2

### Terminology & Consistency Fixes

1. **Auto-save debounce: standardized to 2 seconds.** Round 2 had an inconsistency across roles. My Round 2 document specified 2 seconds (revised from Round 1's 5 seconds based on BA US-015 and Target Customer feedback). The BA Round 2 revised _back_ to 5 seconds, citing alignment with "the Tech Lead." The UX Lead Round 2 Step 6 still references "5 seconds of inactivity." The PM Round 2 mentions "5-second maximum data loss window." These all reference my Round 1 value, not my Round 2 revision. **Final decision: 2-second debounce.** Rationale: The Target Customer's anxiety about data loss is acute. Two seconds is protective. The D1 write frequency at 2 seconds is manageable with the paid tier ($0.75/million writes). See Section 3.5 for updated cost analysis. This is flagged as an Unresolved Issue because the BA and UX Lead documents still reference 5 seconds and the PM has not explicitly arbitrated.

2. **PDF page size: standardized to 5.5" x 8.5" (US Trade).** My Round 2 proposed A5 (148mm x 210mm). The BA Round 2 (US-019) specifies 5.5" x 8.5" (US Trade). These are very close (A5 is ~5.83" x 8.27"; US Trade is 5.5" x 8.5") but differ. US Trade is the standard self-publishing trim size in the US market and is what Amazon KDP uses as its default. **Final decision: US Trade (5.5" x 8.5").** The BA's reasoning is sound: it is more standard for our target market.

3. **"Social login" terminology resolved.** The BA Round 2 added "Continue with Google" to US-001, aligning with the UX Lead and Target Customer. The BA Round 1's exclusion of social login was corrected. All roles now agree: Google sign-in via Clerk is Phase 0.

4. **Single-chapter export added.** The BA Round 2 (US-019) and UX Lead both specify single-chapter PDF export. My Round 2 API surface only had full-project export. Added `POST /projects/:projectId/chapters/:chapterId/export` to the API surface.

5. **Word count display added.** The BA added US-024 (Word Count Display). The UX Lead added word counts to the sidebar. My D1 schema already has `word_count` on the `chapters` table. No schema changes needed, but the API now explicitly returns word counts in chapter list responses. Added total word count to `GET /projects/:projectId` response.

6. **Project deletion added.** The BA added US-023 (Delete a Project). My Round 2 `projects` table already has a `status` column with 'active'/'archived' values, supporting soft delete. No schema changes needed. Added `DELETE /projects/:projectId` to the API surface (sets status='archived').

7. **`drive.file` scope and folder picker constraint acknowledged.** The UX Lead Round 2 identified a critical issue I missed: `drive.file` scope does NOT allow browsing the user's full Drive folder tree. My Round 2 API had `GET /drive/folders` and `GET /drive/folders/:folderId/children` assuming full folder navigation. **Revised:** These endpoints still exist but can only list DraftCrane-created folders or folders the user has explicitly selected via Google's Picker API. The UX Lead's Option A (auto-create a folder) is the simplest path for Phase 0. Updated the Drive API section and Flow A accordingly.

8. **"Maybe later" content storage clarified.** The UX Lead Round 2 Step 4 proposes that content saves to "server-side temporary storage" when Drive is not connected. The BA Round 2 OQ-10 proposes "D1 temporarily; sync to Drive on connection." My Round 2 recommended IndexedDB-only with a warning banner. **Revised position:** IndexedDB-only is too risky for the "Maybe later" path if the user writes thousands of words without connecting Drive. A user clearing Safari data would lose everything. **Final decision:** Store chapter content as HTML in R2 (keyed by `user_id/chapter_id`) as a temporary server-side buffer when Drive is not connected. On Drive connection, migrate all R2-buffered content to Drive files and delete the R2 copies. R2 is already in the stack, handles large objects, and does not pollute D1 with content. This resolves the tension between my "no content in D1" principle and the BA's concern about IndexedDB-only fragility.

9. **Chapter file naming in Drive revised for reorder resilience.** The BA Round 2 (US-012A) specifies that chapter file names in Drive are NOT renamed on reorder. My Round 2 proposed `Chapter 1 - Introduction.html`. If the user reorders, this creates confusing names (Chapter 3's file is named "Chapter 1 - ..."). **Revised:** File naming uses the chapter title only: `{Chapter Title}.html` (e.g., "Introduction.html", "The Problem.html"). No chapter number prefix. This avoids rename churn on reorder and produces cleaner Drive listings.

10. **Surrounding context for AI increased for future-proofing.** The Target Customer Round 2 raised a valid point: 500 characters of surrounding context (~2 paragraphs) provides tone matching but no book-level awareness. My Round 2 specification of 500 chars each side is unchanged for the API contract, but I have added the chapter title and project description to the AI prompt context. These are already in D1 and cost almost nothing in tokens. This partially addresses the Target Customer's voice concern without adding the Book Blueprint.

---

## 1. Architecture Overview (PRD Section 10 Rewrite)

### System Boundaries

DraftCrane Phase 0 has three deployment boundaries:

```
+-----------------------------------------------------------------+
|                    USER'S IPAD / BROWSER                         |
|                                                                   |
|  Next.js App (SSR + Client)                                      |
|  +------------+  +------------+  +--------------------------+    |
|  | Auth (Clerk |  | Chapter    |  | Export UI                |    |
|  | Components) |  | Editor     |  | (trigger + download)     |    |
|  +------+------+  +------+-----+  +----------+--------------+    |
|         |                |                    |                    |
|  +------+----------------+--------------------+--+                |
|  |           IndexedDB Local Buffer              |                |
|  |   (keystroke-level write-ahead log)           |                |
|  +------+----------------+--------------------+--+                |
|         |                |                    |                    |
+---------+----------------+--------------------+--------------------+
          |                |                    |
          v                v                    v
+-----------------------------------------------------------------+
|                CLOUDFLARE EDGE (dc-api Worker)                   |
|                                                                   |
|  Hono Router                                                      |
|  +------------+  +------------+  +------------+                  |
|  | /auth/*    |  | /projects/*|  | /ai/*      |                  |
|  | /drive/*   |  | /chapters/*|  | /export/*  |                  |
|  +------+-----+  +------+-----+  +------+-----+                  |
|         |                |               |                        |
|  +------+----------------+---------------+-----+                  |
|  |              Services Layer                  |                  |
|  |  DriveService | ProjectService | AIService   |                  |
|  +------+--------------+----------------+------+                  |
|         |               |                |                        |
|  +------+---+  +--------+--+  +----------+--+                    |
|  | D1       |  | R2        |  | KV           |                    |
|  | (meta)   |  | (artifacts)|  | (cache)     |                    |
|  +----------+  +-----------+  +--------------+                    |
+-----------------------------------------------------------------+
          |                |                    |
          v                v                    v
+-----------------------------------------------------------------+
|                     EXTERNAL SERVICES                            |
|                                                                   |
|  +------------+  +------------+  +------------+                  |
|  | Clerk      |  | Google Drive|  | Anthropic  |                  |
|  | (auth)     |  | API (files) |  | Claude API |                  |
|  +------------+  +------------+  +------------+                  |
+-----------------------------------------------------------------+
```

### Layer Responsibilities

| Layer            | Technology             | Responsibility                                                                                      | Does NOT Do                                                                       |
| ---------------- | ---------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Frontend**     | Next.js + Tailwind     | Rendering, editor state, IndexedDB write-ahead log, debounced save orchestration, user interactions | Store canonical content long-term, call external APIs directly, hold OAuth tokens |
| **Backend**      | Hono on CF Workers     | API gateway, business logic, Drive/AI orchestration, token management                               | Render UI, hold long-lived state, run >30s operations                             |
| **D1**           | Cloudflare D1 (SQLite) | User metadata, project structure, chapter ordering, AI interaction logs, export job tracking        | Store manuscript content (that belongs in Drive)                                  |
| **R2**           | Cloudflare R2          | Export artifacts (PDF/EPUB), cached images, temporary content buffer for "Maybe later" users        | Long-term content storage (Drive is canonical)                                    |
| **KV**           | Cloudflare KV          | Session data, Drive API response caching, rate limit counters                                       | Relational queries, large objects                                                 |
| **IndexedDB**    | Browser-native         | Keystroke-level content buffer, crash recovery, offline queue                                       | Long-term storage, cross-device sync                                              |
| **Clerk**        | External SaaS          | User authentication, session management, JWT issuance                                               | Authorization logic (we own that)                                                 |
| **Google Drive** | External API           | Canonical manuscript storage, user file ownership                                                   | Indexing, search, metadata queries                                                |
| **Claude API**   | External API           | Text rewriting, expansion, simplification                                                           | Autonomous content generation, training on user data                              |

### Three-Tier Save Architecture

This is the core data flow design that resolves the tension between local speed and canonical Drive storage. References: BA US-015, PM Principle 2, UX Lead Step 6, Target Customer pain point on data loss.

```
Tier 1: IndexedDB (instant, every keystroke)
  - Purpose: Crash protection, offline buffer
  - Latency: <1ms (local write)
  - Data loss window: Zero (within browser lifetime)
  - Survives: Tab switch, app switch, brief network loss
  - Does NOT survive: iOS killing Safari under memory pressure, browser cache clear

Tier 2: Google Drive (debounced, every 2s of inactivity)
  - Purpose: Canonical persistence, user file ownership
  - Latency: 200-1500ms (network + Drive API)
  - Data loss window: Up to 2s of typing if Drive save fails AND IndexedDB is lost
  - Survives: Everything except Google account deletion
  - Triggered by: Debounce timer, tab visibility change, explicit Cmd+S, chapter switch
  - Fallback: If Drive is not connected, content writes to R2 (temporary buffer)

Tier 3: D1 Metadata (on every successful Drive/R2 save)
  - Purpose: UI rendering (chapter list, word counts, timestamps), version tracking
  - Latency: <50ms (Cloudflare edge)
  - Stores: updated_at, word_count, version counter. Never stores content.
```

**Why NOT store content in D1:** If we cache content in D1, we create a second source of truth. Every Drive save must also update D1. If one succeeds and the other fails, we have divergent state. The project instructions are explicit: "We index and cache; we never become the canonical store." IndexedDB provides the fast local buffer, and R2 provides the server-side buffer for users who have not yet connected Drive.

### Request Flow: Core Operations

#### Flow A: User Signs In and Connects Google Drive

```
1. User opens DraftCrane in Safari -> Next.js serves the app
2. User taps "Get Started" -> Clerk embedded component handles auth
   - "Continue with Google" is primary (per UX Lead Step 2)
   - Redirect-based OAuth, NOT popup (Safari popup blocker mitigation)
   - Request only auth scopes here, not Drive scopes
3. Clerk issues a session JWT -> stored as httpOnly cookie
4. Frontend redirects to Writing Environment (not a dashboard)
   - Per UX Lead Section 3: "There is no dashboard" in Phase 0
   - First-run: redirect to Book Setup Screen (title + optional description)
   - Returning user: load last-edited chapter directly

5. User taps "Connect Google Drive" (contextual banner, not blocking)
   - Per UX Lead Step 4: gentle banner, "Maybe later" option
6. Frontend navigates to GET /api/drive/authorize
7. dc-api builds Google OAuth URL (scope: drive.file) -> returns redirect URL
8. User grants consent on Google's OAuth screen
9. Google redirects back to /api/drive/callback?code=XXX
10. dc-api exchanges code for access_token + refresh_token
11. dc-api encrypts tokens, stores in D1 (drive_connections table)

12. Folder setup (revised for drive.file scope constraint):
    - Phase 0 default: DraftCrane auto-creates a folder named after the book title
      "We'll create a folder called '[Book Title]' in your Google Drive."
    - User taps "Create Book Folder" -> dc-api calls Drive API to create folder
    - Per UX Lead Option A: simplest path, avoids drive.file scope limitation
    - If user testing reveals demand for existing folder selection, add Google
      Picker API in a fast follow

13. Frontend shows "Connected to Google Drive. Your book saves to: [folder name]"
    with a green checkmark and a "View in Google Drive" link
14. dc-api stores folder_id in D1 (projects.drive_folder_id)

15. If content was written before Drive connection ("Maybe later" path):
    - dc-api migrates R2-buffered chapter content to Drive files
    - Deletes R2 temporary copies
    - Frontend shows: "Your chapters have been saved to Google Drive."
```

**Key design decisions:**

- OAuth tokens never reach the frontend. Stored server-side in D1, encrypted at rest.
- We request `drive.file` scope (not full Drive access) -- only files created by or explicitly shared with our app.
- Redirect-based OAuth only. No popups.
- Refresh token rotation: dc-api handles token refresh transparently on every Drive API call.
- Drive connection is non-blocking. The user can write without connecting Drive. Content saves to IndexedDB (Tier 1) and R2 (server-side buffer). Once Drive is connected, existing content migrates.
- Folder auto-creation avoids the `drive.file` scope limitation that prevents full folder browsing.

#### Flow B: User Writes and Auto-Saves a Chapter

```
1. User navigates to a chapter -> frontend loads chapter metadata from dc-api
2. dc-api returns chapter metadata (title, order, drive_file_id, word_count) from D1
3. Frontend fetches chapter content:
   GET /api/chapters/:id/content
4. dc-api reads file content:
   - If Drive connected: from Google Drive API using stored tokens
   - If Drive not connected: from R2 temporary buffer
5. Content returned to frontend -> rendered in editor
6. Frontend also writes initial content to IndexedDB (Tier 1 baseline)

7. User types in editor -> every keystroke writes to IndexedDB (Tier 1)
8. Auto-save debounce triggers (2 seconds after last keystroke):
   PUT /api/chapters/:id/content
   Body: { content: "<html>...", version: 42 }
9. dc-api writes content:
   - If Drive connected: to Google Drive via Files.update() (Tier 2)
   - If Drive not connected: to R2 temporary buffer
10. dc-api updates chapter metadata in D1 (Tier 3):
    updated_at, word_count, version
11. dc-api returns { saved: true, version: 43, destination: "drive" | "server" }
12. Frontend shows save indicator:
    - "Saved to Drive" with checkmark (Drive connected)
    - "Saved locally" with warning (Drive not connected, per UX Lead Step 4)

Edge cases:
- Drive API fails -> dc-api returns error -> frontend retains IndexedDB buffer,
  shows "Unable to save. Your changes are stored locally. Will retry."
  -> exponential backoff: 2s, 4s, 8s
- Version conflict -> dc-api returns 409 -> frontend prompts user:
  "This chapter was modified elsewhere. View changes / Overwrite / Reload."
  (per BA US-015: "local content is never silently discarded")
- Tab goes to background -> visibilitychange event triggers immediate save
  (more reliable than beforeunload on iOS per Risk 3)
- Network offline -> navigator.onLine false -> queue saves in IndexedDB,
  show "Offline" indicator -> flush queue when back online
- Cmd+S pressed -> immediate save, "Saved" indicator updates
```

**Key design decisions:**

- Three-tier save: IndexedDB -> Drive (or R2 fallback) -> D1 metadata.
- 2-second debounce.
- `visibilitychange` event for background save (not `beforeunload`, which is unreliable on iOS).
- Cmd+S is supported as a reassurance mechanism even though auto-save is active.
- Save indicator differentiates "Saved to Drive" from "Saved locally" when Drive is not connected.

#### Flow C: User Requests AI Rewrite of Selected Text

```
1. User selects text in editor -> DraftCrane floating toolbar appears
   near the selection with "AI Rewrite" button
   (per UX Lead Section 5c: separate from native context menu)

2. User taps "AI Rewrite" -> bottom sheet slides up from bottom
   Bottom sheet shows:
   - Original text (quoted)
   - Instruction input with suggestion chips:
     "Simpler language" | "More concise" | "More conversational" | "Stronger"
   - Freeform text input for custom instructions
     (per UX Lead: single-line instruction field, NOT Ask Mode)
   - "Rewrite" button (disabled until instruction provided)

3. User taps a chip or types instruction, taps "Rewrite"

4. Frontend sends:
   POST /api/ai/rewrite
   Body: {
     chapter_id: "ch_123",
     selected_text: "The paragraph to rewrite...",
     instruction: "simpler language",
     surrounding_context: "...preceding 500 chars... [SELECTED] ...following 500 chars...",
     chapter_title: "Building Systems That Scale",
     project_description: "A practical guide for leaders managing organizational change"
   }

5. dc-api validates request (auth, ownership, content length limits)
6. dc-api builds Claude API prompt:
   - System: "You are a writing assistant helping an author with their book
     '[chapter_title]' (described as: '[project_description]'). Rewrite the
     selected text according to the user's instruction. Preserve the original
     meaning and match the surrounding tone. Return only the rewritten text."
   - User: selected_text + surrounding_context + instruction
7. dc-api calls Anthropic Claude API (streaming response)
8. dc-api streams response back to frontend via SSE
   (REQUIRED, not optional -- reduces perceived wait from 5-8s to <2s first token)

9. Frontend displays rewrite streaming word-by-word in bottom sheet

10. Bottom sheet shows completed result:
    - Original text (collapsible)
    - Rewritten text (prominent)
    - "Use This" (primary) | "Try Again" (secondary) | "Discard" (tertiary)

11a. User taps "Use This":
    - Text replaced in editor with brief highlight flash
      (respects prefers-reduced-motion)
    - Bottom sheet closes
    - POST /api/ai/interactions/:interactionId/accept
    - Auto-save triggers (Flow B)
    - Undo via Cmd+Z restores original (per BA US-018, UX Lead Section 5c)

11b. User taps "Try Again":
    - Instruction input reappears with previous instruction editable
    - User modifies instruction and taps "Rewrite" again
    - New API call, same flow from step 4
    - Original text always preserved until explicit "Use This"

11c. User taps "Discard" or taps outside bottom sheet:
    - Bottom sheet closes, original text unchanged
    - POST /api/ai/interactions/:interactionId/reject

12. dc-api logs the interaction to D1 (ai_interactions table):
    { chapter_id, action, instruction, input_chars, output_chars, model,
      latency_ms, accepted, attempt_number }
    Input/output text is NOT stored -- only metadata.
```

**Key design decisions:**

- AI never modifies content directly. User always sees a preview and explicitly accepts or rejects.
- SSE streaming is a requirement. First token visible in <2 seconds.
- "Try Again" supported within a single session. Original always preserved.
- Chapter title and project description are included in the AI prompt. This provides minimal book context without the Book Blueprint, partially addressing the Target Customer's concern about generic AI output.
- Suggestion chips replace Phase 0's need for freeform AI prompting, but a freeform text input is also available for users like Marcus who want specific tone instructions.
- Bottom sheet UI, not modal or inline.
- Content length limits enforced server-side: max 2,000 words selected, max 500 chars surrounding context each side.

---

## 2. Proposed Data Model (Phase 0)

### Guiding Principle: Metadata in D1, Content in Drive, Buffer in IndexedDB/R2

D1 stores everything needed to render the UI, enforce authorization, and track state. Google Drive stores everything the user would want to keep if DraftCrane disappeared. IndexedDB provides instant local persistence as crash protection. R2 provides server-side temporary content storage for users who have not yet connected Drive.

| Data                                             | Storage      | Rationale                                                            |
| ------------------------------------------------ | ------------ | -------------------------------------------------------------------- |
| User profile, preferences                        | D1           | App-internal, not user-owned content                                 |
| Project structure (title, description, settings) | D1           | Metadata about the book, not the book itself                         |
| Chapter ordering, titles, word counts            | D1           | Navigation structure, frequently queried                             |
| Chapter body content (canonical)                 | Google Drive | User's canonical manuscript. Sacred. (PM Principle 2)                |
| Chapter body content (pre-Drive buffer)          | R2           | Temporary. For "Maybe later" users. Migrated to Drive on connection. |
| Chapter body content (local buffer)              | IndexedDB    | Crash recovery, offline queue. Ephemeral.                            |
| OAuth tokens (encrypted)                         | D1           | Server-side only, never exposed to client                            |
| AI interaction logs                              | D1           | Analytics, cost tracking. No user content stored.                    |
| Export artifacts (PDF/EPUB)                      | R2           | Temporary; also written back to user's Drive                         |
| Session/cache data                               | KV           | Ephemeral, performance optimization                                  |

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
    access_token    TEXT NOT NULL,              -- Encrypted (AES-256-GCM)
    refresh_token   TEXT NOT NULL,              -- Encrypted (AES-256-GCM)
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
    description     TEXT,                       -- Brief book description (1-2 sentences)
    drive_folder_id TEXT,                       -- Google Drive folder ID for this book
    status          TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'archived')),
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_projects_user ON projects(user_id);
```

**Notes:**

- `description` is nullable and optional. Feeds AI context (chapter title + description in the rewrite prompt). UX Lead Step 3 includes it; BA US-009 confirms.
- `status` supports soft-delete ('archived') per BA US-023.
- Schema supports multiple projects per user. If the PM decides single-project for Phase 0 UI, enforce in the service layer, not the schema.

#### Migration 0004: `0004_create_chapters.sql`

```sql
CREATE TABLE chapters (
    id              TEXT PRIMARY KEY,           -- ULID
    project_id      TEXT NOT NULL REFERENCES projects(id),
    title           TEXT NOT NULL,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    drive_file_id   TEXT,                       -- Google Drive file ID for this chapter
    r2_key          TEXT,                       -- R2 object key (for pre-Drive buffer)
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

**Changes from Round 2:**

- Added `r2_key` column. When Drive is not connected, chapter content is stored in R2 with key `{user_id}/{chapter_id}.html`. This column is set when content is buffered in R2 and cleared when content migrates to Drive.

**Business rules enforced in service layer (per BA US-010, US-014):**

- A project must always have at least one chapter. Enforce on delete, not on schema.
- Chapter title must be non-empty; whitespace-only titles revert to "Untitled Chapter". Max 200 characters.
- No artificial chapter count limit. Performance test at 50+ chapters.
- `sort_order` is a gapless integer sequence within a project. Reorder operations update all affected sort_order values in a single transaction.

#### Migration 0005: `0005_create_ai_interactions.sql`

```sql
CREATE TABLE ai_interactions (
    id              TEXT PRIMARY KEY,           -- ULID
    user_id         TEXT NOT NULL REFERENCES users(id),
    chapter_id      TEXT REFERENCES chapters(id),
    action          TEXT NOT NULL               -- 'rewrite', 'expand', 'simplify'
                    CHECK (action IN ('rewrite', 'expand', 'simplify')),
    instruction     TEXT,                       -- The user's instruction text
    input_chars     INTEGER NOT NULL,           -- Length of selected text
    output_chars    INTEGER NOT NULL,           -- Length of AI response
    model           TEXT NOT NULL,              -- e.g., 'claude-sonnet-4-20250514'
    latency_ms      INTEGER NOT NULL,
    accepted        INTEGER NOT NULL DEFAULT 0, -- 0 = rejected/discarded, 1 = accepted
    attempt_number  INTEGER NOT NULL DEFAULT 1, -- Tracks "Try Again" iterations
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
    chapter_id      TEXT REFERENCES chapters(id), -- NULL for full-book export
    format          TEXT NOT NULL               -- 'pdf', 'epub'
                    CHECK (format IN ('pdf', 'epub')),
    status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    r2_key          TEXT,                       -- R2 object key for the generated file
    drive_file_id   TEXT,                       -- Drive file ID once uploaded
    error_message   TEXT,
    chapter_count   INTEGER,                    -- Number of chapters included
    total_word_count INTEGER,                   -- Total words across all chapters
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    completed_at    TEXT
);

CREATE INDEX idx_export_jobs_project ON export_jobs(project_id);
CREATE INDEX idx_export_jobs_user ON export_jobs(user_id);
```

**Changes from Round 2:** Added `chapter_id` column (nullable). When not null, this is a single-chapter export per BA US-019 and UX Lead feedback.

### Google Drive File Structure (per user)

```
Book Folder (auto-created by DraftCrane)/
+-- Introduction.html                  -- One HTML file per chapter
+-- The Problem.html                   -- Named by chapter title, no number prefix
+-- The Solution.html
+-- _exports/                          -- Subfolder for generated files
    +-- The Operational Leader - 2026-02-06.pdf
    +-- The Operational Leader - 2026-02-06.epub
```

**File format:** HTML. Preserves rich text formatting (bold, italic, headings, lists, block quotes) and is the natural output of browser-based editors. Google Drive stores it as a regular file. The user can open it in any browser.

**File naming:** `{Chapter Title}.html`. No chapter number prefix. This avoids rename churn when chapters are reordered (per BA US-012A business rule: "chapter file names in Drive are NOT renamed on reorder").

**Export file naming:** `{Book Title} - {YYYY-MM-DD}.{format}` with timestamp to prevent accidental overwrites. Single-chapter exports: `{Chapter Title} - {YYYY-MM-DD}.{format}`.

**Why not Google Docs native format?** The Google Docs API for content manipulation is separate from the Drive API, adds complexity, and introduces formatting translation issues. HTML keeps us in control and eliminates a dependency. The tradeoff: files are not editable in Google Docs' native editing experience. PM confirmed this is acceptable for Phase 0.

### R2 Temporary Content Buffer

For users who have not yet connected Google Drive ("Maybe later" path):

```
R2 bucket: dc-exports (also used for export artifacts)
Key pattern: content/{user_id}/{chapter_id}.html
```

This content is:

- Created on auto-save when Drive is not connected
- Migrated to Google Drive when the user connects Drive
- Deleted from R2 after successful Drive migration
- Not a permanent store -- R2 content older than 30 days without a Drive connection generates a warning email (Phase 1, not Phase 0)

### IndexedDB Schema (Client-Side)

```typescript
// IndexedDB database: "draftcrane"
// Object store: "chapter_buffer"

interface ChapterBuffer {
  chapterId: string; // Matches D1 chapter ID
  content: string; // HTML content
  localVersion: number; // Incremented on every local change
  serverVersion: number; // Last known server (Drive/R2) version
  lastModified: number; // Timestamp (Date.now())
  pendingSave: boolean; // True if not yet synced to server
}
```

**On editor mount:** Compare `localVersion` vs. `serverVersion`. If `localVersion > serverVersion` AND `lastModified` is more recent than the server file's modifiedTime, offer recovery: "You have unsaved changes from your last session. Restore or discard?"

**On every keystroke:** Update `content`, increment `localVersion`, set `pendingSave = true`, update `lastModified`.

**On successful server save:** Update `serverVersion` to match, set `pendingSave = false`.

### Notes on Schema Design

- **ULID over UUID:** ULIDs are sortable by creation time, useful for ordering without an extra query. They work well as TEXT primary keys in SQLite/D1.
- **TEXT for dates:** D1 is SQLite under the hood. SQLite does not have a native datetime type. ISO 8601 text strings (`datetime('now')`) sort correctly and are unambiguous.
- **No cascading deletes:** Phase 0 does not need cascading delete operations. Explicit service-level logic is safer in a distributed system where Drive files also need cleanup.
- **No content in D1:** The `chapters` table has no `body` or `content` column. Content lives in Google Drive (or R2 temporarily). D1 only has pointers (`drive_file_id`, `r2_key`).

---

## 3. Non-Functional Requirements (PRD Section 9 Rewrite)

### 3.1 Platform Compatibility

| Requirement               | Target                                                                                                                                      | How to Verify                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| iPad Safari support       | iPadOS 17.0+ (Safari 17+)                                                                                                                   | Manual testing on iPad Air 5th gen or later; BrowserStack for coverage |
| Desktop browser support   | Chrome 120+, Firefox 120+, Safari 17+                                                                                                       | Automated E2E tests via Playwright                                     |
| Minimum viewport          | 768px width (iPad portrait)                                                                                                                 | CSS breakpoint testing                                                 |
| Touch interaction         | All primary actions completable via touch only                                                                                              | Manual QA checklist: no hover-dependent functionality                  |
| Virtual keyboard handling | Editor must not break when iOS keyboard appears/disappears. Cursor and active line always visible above keyboard. Use `visualViewport` API. | Manual test on iPad with virtual keyboard                              |
| `100dvh` viewport units   | Use `100dvh` or `visualViewport` API, never raw `100vh`                                                                                     | CSS audit; iPad Safari manual test                                     |
| No native dependencies    | Zero plugins, extensions, or app installs required                                                                                          | Verify via clean Safari profile                                        |
| Split View resilience     | App must not break in iPadOS Split View, even if not optimized                                                                              | Manual test in 50/50 and 33/66 Split View                              |
| Orientation change        | Layout responds fluidly to landscape/portrait changes without content jumps or lost scroll position                                         | Manual test: rotate iPad during editing                                |
| `prefers-reduced-motion`  | All animations disabled when user has Reduce Motion enabled                                                                                 | Automated CSS audit + manual test on iPadOS                            |
| Pinch-to-zoom             | App remains functional at 200% zoom. No `user-scalable=no` in viewport meta.                                                                | Manual test with pinch zoom on iPad                                    |

### 3.2 Performance Budgets

| Metric                          | Target                              | Measurement                                               |
| ------------------------------- | ----------------------------------- | --------------------------------------------------------- |
| Largest Contentful Paint (LCP)  | < 2.5 seconds on WiFi               | Lighthouse on iPad Safari                                 |
| Time to Interactive (TTI)       | < 3.5 seconds on WiFi               | Lighthouse                                                |
| Chapter load (under 10K words)  | < 2 seconds                         | Custom timing: navigation click to editor content visible |
| Chapter load (up to 50K words)  | < 5 seconds                         | Same measurement, larger payload                          |
| Auto-save round trip            | < 3 seconds from trigger to "Saved" | Custom timing: debounce fire to server response           |
| IndexedDB local write           | < 5ms per keystroke                 | Performance.now() measurement                             |
| AI rewrite first token          | < 2 seconds                         | Custom timing: SSE stream onset                           |
| AI rewrite complete (500 words) | < 15 seconds                        | End-to-end including streaming                            |
| JS bundle size (initial)        | < 300 KB gzipped                    | Build output analysis                                     |
| Editor JS (lazy loaded)         | < 200 KB gzipped                    | Separate chunk                                            |
| PDF export (10 chapters)        | < 30 seconds                        | End-to-end from button click to file ready                |
| EPUB export (10 chapters)       | < 10 seconds                        | End-to-end from button click to file ready                |

**Note on PDF export timing:** Round 2 specified < 10 seconds for PDF. After further analysis of Cloudflare Browser Rendering cold start times (2-5 seconds) plus rendering time for a multi-chapter document, 10 seconds is too aggressive. Revised to < 30 seconds for PDF, < 10 seconds for EPUB (which does not require headless browser rendering). The UX Lead's progress indicator ("Generating your book. This may take a moment for large manuscripts.") accommodates this.

### 3.3 Auto-Save Reliability

| Requirement              | Specification                                                                                                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Save trigger             | Debounced: 2 seconds after last keystroke                                                                                                                                |
| Local buffer             | Every keystroke writes to IndexedDB. <5ms latency.                                                                                                                       |
| Save indicator           | Three states: "Saving...", "Saved to Drive" or "Saved locally" [timestamp], "Save failed"                                                                                |
| Failure retry            | Exponential backoff: 2s, 4s, 8s. Max 3 retries. Then persistent warning.                                                                                                 |
| Conflict detection       | Optimistic versioning: `version` counter in D1. Server rejects save if client version does not match.                                                                    |
| Conflict resolution      | User-facing prompt: "This chapter was modified elsewhere. View changes / Overwrite / Reload." No silent data loss.                                                       |
| Offline behavior         | Detect `navigator.onLine` transitions. When offline: queue saves in IndexedDB, show "Offline" indicator. When back online: flush queue in order, resolve conflicts.      |
| Crash recovery           | On editor mount, check IndexedDB for unsaved content newer than server version. If found, prompt: "You have unsaved changes from your last session. Restore or discard?" |
| Tab background           | Use `visibilitychange` event to trigger immediate save when tab goes to background.                                                                                      |
| Maximum data loss window | 2 seconds of typing (one debounce interval). IndexedDB keystroke write reduces this to near-zero within browser lifetime.                                                |
| Cmd+S support            | Triggers immediate save and "Saved" indicator update. No "you don't need to save" message.                                                                               |
| Drive-not-connected save | Content saves to R2 (server-side buffer). Save indicator shows "Saved locally" in yellow. Persistent banner: "Connect Google Drive to protect your work across devices." |

### 3.4 Security Model

| Requirement         | Specification                                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Authentication      | Clerk-managed; session tokens as httpOnly, Secure, SameSite=Lax cookies                                                             |
| Authorization       | All D1 queries include `WHERE user_id = ?` clause. No query returns data across users. Enforced in service layer.                   |
| OAuth token storage | Google OAuth tokens encrypted at rest in D1 using a Worker-level secret (AES-256-GCM). Never sent to frontend.                      |
| OAuth scope         | `drive.file` -- access only to files created by or opened with DraftCrane. Not full Drive access.                                   |
| OAuth flow type     | Redirect-based only. No popup OAuth.                                                                                                |
| Token refresh       | Automatic refresh when `token_expires_at` is within 5 minutes of current time. Old refresh tokens invalidated after use (rotation). |
| Content isolation   | User A must never see User B's projects, chapters, or AI interactions. Verified via integration tests with two test users.          |
| API rate limiting   | Per-user via KV counters: 60 req/min standard, 10 req/min AI, 5 req/min export.                                                     |
| Input validation    | All user input validated and sanitized at the API boundary. HTML content sanitized with an allowlist of safe tags before storage.   |
| CORS                | Production: only the DraftCrane frontend origin. No wildcards.                                                                      |

### 3.5 Cloudflare Platform Constraints

These are hard limits that constrain the architecture. Design within them.

| Constraint          | Limit                                 | Implication                                                                                                                                                          |
| ------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Worker CPU time     | 30ms (bundled), 30s (unbound)         | Use unbound Workers for AI and export routes. Keep standard routes under 30ms CPU.                                                                                   |
| Worker memory       | 128 MB                                | Cannot load entire large manuscripts into memory. Process chapter-by-chapter during export.                                                                          |
| Worker request size | 100 MB                                | Not a concern for text; relevant for future image handling.                                                                                                          |
| Worker subrequests  | 1,000 per invocation                  | Batch Drive API calls. A 50-chapter export must not make 50+ serial subrequests. Design export to batch-read chapter content.                                        |
| D1 row size         | 1 MB max                              | No concern for metadata-only rows. Validates decision to keep content out of D1.                                                                                     |
| D1 database size    | 2 GB (free), 10 GB (paid)             | Monitor table sizes. AI interaction logs will be the largest table. Add TTL-based cleanup at 90 days.                                                                |
| D1 rows read/write  | 5M reads/day, 100K writes/day (free)  | At 2s debounce with 50 concurrent users: ~90K metadata writes/hour. **Phase 0 requires the D1 paid tier ($0.75/million writes).** Trivial cost but must be budgeted. |
| R2 object size      | 5 GB max                              | Sufficient for any PDF/EPUB and chapter HTML.                                                                                                                        |
| R2 operations       | 10M Class A, 10M Class B/month (free) | Generous for Phase 0. R2 writes for "Maybe later" content buffer add ~30 writes/min/active user. At 50 users: ~1,500/min = ~2.2M/month. Within free tier.            |
| KV value size       | 25 MB max                             | Sufficient for cached Drive responses.                                                                                                                               |
| KV operations       | 100K reads/day, 1K writes/day (free)  | Tight for writes. Use KV for hot-path reads only. Budget for paid KV ($0.50/million reads, $5/million writes) if rate limit counters exhaust free tier.              |

### 3.6 Accessibility Baseline

| Requirement                    | Specification                                                            | How to Verify                                         |
| ------------------------------ | ------------------------------------------------------------------------ | ----------------------------------------------------- |
| WCAG level                     | 2.1 Level AA compliance                                                  | Automated: axe-core in CI. Manual: VoiceOver on iPad. |
| Screen reader: editor          | `role="textbox"` with `aria-multiline="true"` and chapter name as label  | VoiceOver testing                                     |
| Screen reader: chapter list    | Ordered list with position announcements ("Chapter 3 of 8")              | VoiceOver testing                                     |
| Screen reader: save status     | `aria-live="polite"` region for save state changes                       | VoiceOver testing                                     |
| Screen reader: AI bottom sheet | Focus trap while open. On close, focus returns to editor.                | VoiceOver + keyboard testing                          |
| Keyboard navigation            | All functionality reachable via external keyboard. Logical tab order.    | Manual testing with Smart Keyboard                    |
| Color contrast                 | 4.5:1 for normal text, 3:1 for large text. No color-only indicators.     | Automated: contrast checker in CI                     |
| Font sizing                    | Minimum 16px in editor (prevents iOS auto-zoom). Relative units (`rem`). | CSS audit                                             |
| Reduced motion                 | Respect `prefers-reduced-motion`. All animations are non-essential.      | Manual test with iPadOS Reduce Motion                 |
| Zoom                           | Functional at 200% browser zoom. No `user-scalable=no`.                  | Manual test                                           |

### 3.7 Reliability & Data Integrity

| Requirement     | Specification                                                                                                                                      |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Data durability | Google Drive is the system of record. D1 metadata is reconstructible from Drive if lost. IndexedDB and R2 content buffers are ephemeral/temporary. |
| Backup strategy | D1: rely on Cloudflare's automatic backups. Drive: user's own Google Workspace backup. No additional backup in Phase 0.                            |
| Error handling  | All API errors return structured JSON: `{ error: string, code: string, details?: object }`. No stack traces in production.                         |
| Uptime target   | No formal SLA in Phase 0. Rely on Cloudflare's platform SLA (99.9%).                                                                               |

---

## 4. Technical Risks & Constraints (Phase 0)

### Risk 1: Rich Text Editing on iPad Safari

**Severity:** HIGH -- Could block Phase 0 if editor is unusable on iPad.

**The problem:** Browser-based rich text editors rely on `contenteditable` and `Selection`/`Range` APIs, both with long-standing Safari inconsistencies. Known issues: cursor positioning bugs after formatting changes, selection jumping when virtual keyboard appears/disappears, toolbar interactions causing focus loss, inconsistent paste handling.

**Specific concerns:**

- Tiptap (ProseMirror-based) has the strongest iPad track record but still has open iOS selection issues.
- Lexical (Meta) is newer with fewer Safari battle scars.
- Plate (Slate-based) has documented iOS problems.
- All editors struggle with iOS virtual keyboard viewport resize (requires `visualViewport` API).
- The floating AI Rewrite toolbar must not conflict with iPadOS's native text selection menu.
- Block quote (UX Lead Section 5b requirement) must be verified on iPad.

**Mitigation:** Prototype Tiptap and Lexical on a physical iPad within the first sprint. Test the UX Lead's specific interaction patterns:

1. Basic typing and formatting (bold/italic/heading/list/block quote)
2. Text selection via touch (long-press, drag handles)
3. Custom floating toolbar near selection
4. Copy/paste from Notes app, Google Docs, email
5. Undo/redo (both Cmd+Z and toolbar)
6. Virtual keyboard appear/dismiss -- cursor stays visible
7. Orientation change during editing
8. Chapter switching -- scroll position preservation

Score each on a 1-5 scale. Allocate 2 days. Decision from real-device testing only.

**Could block Phase 0:** Yes, if no editor works acceptably on iPad Safari.

---

### Risk 2: Google Drive API Latency and Rate Limits

**Severity:** MEDIUM -- Degrades experience but does not block Phase 0.

**The problem:** Every chapter open and every auto-save requires a Google Drive API call. Drive API latency is typically 200-500ms but can spike to 2-3 seconds. With 2-second debounce, auto-save generates ~30 Drive writes per minute per active user.

**`drive.file` scope limitation (new):** The UX Lead identified that `drive.file` cannot browse the user's full Drive tree. This constrains the folder picker but does not affect read/write operations on DraftCrane-created files.

**Mitigation:**

- Cache chapter content in frontend + IndexedDB after first load.
- Pre-fetch next/previous chapter content.
- Proactive token refresh (5 minutes before expiry).
- KV cache for Drive folder listings (TTL: 60 seconds).
- Folder auto-creation avoids the browse limitation.

**Could block Phase 0:** No.

---

### Risk 3: Auto-Save Reliability Across iPad Safari Lifecycle

**Severity:** HIGH -- Data loss is unacceptable for a writing tool.

**The problem:** Auto-save has multiple failure modes: network dropout, Drive API errors, browser crash/tab close, iPadOS background tab suspension, and version conflicts.

**Updated analysis:** The three-tier save architecture (IndexedDB -> Drive/R2 -> D1 metadata) mitigates most failure modes. R2 as a server-side buffer for "Maybe later" users eliminates the IndexedDB-only fragility concern. The remaining risk is iPadOS killing Safari under severe memory pressure before the `visibilitychange` save completes.

**Specific iPad Safari concerns:**

- iPad Safari aggressively suspends background tabs. `visibilitychange` event is our best hook.
- `beforeunload` is unreliable on iPad Safari. Do not depend on it.
- IndexedDB has storage pressure limits -- iOS can evict data under extreme storage pressure.
- `position: fixed` and `position: sticky` behave inconsistently when virtual keyboard is open.

**Mitigation:**

- IndexedDB write-ahead log on every keystroke (Tier 1).
- `visibilitychange` for background save (Tier 2).
- Recovery prompt on editor mount if IndexedDB has unsaved data.
- BroadcastChannel API lock to prevent concurrent-editing across tabs.
- Accept that a hard OS kill of Safari may lose up to 2 seconds of work.

**Could block Phase 0:** No, but must be solid before beta.

---

### Risk 4: Claude API Response Times for Inline Rewrites

**Severity:** LOW-MEDIUM -- Mitigated by SSE streaming requirement.

**The problem:** Claude API response time for a 500-word rewrite is typically 3-8 seconds end-to-end. Without streaming, users stare at a spinner.

**Mitigation:** SSE streaming reduces perceived latency to under 2 seconds (first token). The Anthropic TypeScript SDK handles SSE streaming natively.

**Cost model:**

- Haiku for simple operations (simplify, shorten): ~$0.001/request
- Sonnet for complex operations (rewrite, expand): ~$0.003-0.01/request
- At 50 rewrites/user/month: ~$0.15-0.50/user/month
- Phase 0 with 50 users: <$25/month total AI cost

**Could block Phase 0:** No.

---

### Risk 5: PDF/EPUB Generation Quality and Feasibility

**Severity:** HIGH -- Export quality is psychologically critical to user confidence.

**The problem:** Workers have no filesystem, no headless browser, and a 128 MB memory limit. The Competitor Analyst and Target Customer both identify export quality as disproportionately important. Atticus at $147.99 sets the bar. If DraftCrane's export "looks like a printed web page," it undermines the "artifact moment."

**Export requirements (consolidated from all roles):**

- Title page with book title and author name
- Table of contents with chapter titles
- Chapter start on a new page with generous whitespace
- US Trade page size (5.5" x 8.5")
- Readable serif font (e.g., Georgia, Crimson Text), 11pt, 1.5 line height
- Margins: 0.75-1" on all sides
- Page numbers in footer
- Professional, intentionally designed appearance

**Mitigation options (to be decided via ADR-004):**

1. **Cloudflare Browser Rendering (PDF) + Worker (EPUB):** Best PDF quality via headless Chrome. EPUB is tractable in-Worker (ZIP of XHTML). Risk: Browser Rendering is beta; cold starts 2-5s.
2. **Client-side PDF + Worker EPUB:** Use `react-pdf` or styled `window.print()` on iPad. Risk: iPad Safari print quality varies.
3. **External service fallback (DocRaptor/Prince):** Professional typographic quality. Risk: external dependency, per-document pricing.

**Recommendation:** Design a single, well-crafted HTML+CSS book template first. This template works with any rendering approach. Prototype Cloudflare Browser Rendering. If quality is acceptable, use it. If not, fall back to an external service for PDF only. Do NOT ship a low-quality PDF.

**Could block Phase 0:** Potentially. If no approach produces acceptable PDF quality, consider EPUB-only for Phase 0 with "Download as HTML" as a PDF workaround. Last resort.

---

### Risk 6: "Maybe Later" Content Without Drive Connection

**Severity:** MEDIUM -- Architectural complexity, not a blocker.

**The problem:** The UX Lead's journey allows users to write before connecting Drive. Content must persist server-side even without Drive.

**Resolution (revised from Round 2):** R2 as a temporary server-side buffer. Content is stored at `content/{user_id}/{chapter_id}.html`. When Drive is connected, content migrates. The save indicator differentiates "Saved to Drive" (green) from "Saved locally" (yellow) so the user understands their content's status.

**Could block Phase 0:** No.

---

## 5. ADR Framing

### ADR-001: Editor Library Selection

**Decision:** Which rich text editor library to use for the chapter writing experience.

**Options:**

| Option                   | Pros                                                                                                                                                                              | Cons                                                                              |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Tiptap (ProseMirror)** | Most mature iPad Safari support; large extension ecosystem; collaborative editing foundation for future; strong TypeScript; active commercial backing; block quote out of the box | Larger bundle (~150 KB); some extensions paid; ProseMirror learning curve         |
| **Lexical (Meta)**       | Smallest bundle (~30 KB core); designed for extensibility; excellent React integration; accessibility-first; active Meta investment                                               | Younger project; fewer iPad production deployments; iOS Safari less battle-tested |
| **Plate (Slate)**        | Rich plugin ecosystem; highly customizable UI; good React integration                                                                                                             | Known iOS Safari issues (selection, IME); Slate stability concerns; smallest team |

**Preliminary recommendation:** Tiptap. iPad Safari maturity is the deciding factor.

**Test protocol:**
Build a minimal editor prototype with Tiptap and Lexical. On a physical iPad (Air 5th gen, iPadOS 17+), test:

1. Typing and formatting: bold, italic, H2, H3, bullet list, numbered list, block quote
2. Text selection: long-press, drag handles, extend selection
3. Custom floating toolbar near selection (for AI Rewrite trigger)
4. Copy/paste from Notes app, Safari, Google Docs
5. Undo/redo (Cmd+Z, Cmd+Shift+Z)
6. Virtual keyboard show/hide with `visualViewport` API integration
7. Orientation change during editing
8. Chapter switching with scroll position restoration

Score each on a 1-5 scale. Allocate 2 days. Decision from real-device testing only.

---

### ADR-002: Google Drive Sync Strategy

**Decision:** When and how chapter content is synchronized between DraftCrane and Google Drive.

**Options:**

| Option                                 | Pros                                                                                                     | Cons                                                                                          |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **On-save (debounced 2s)**             | Simple to implement; predictable Drive API usage; clear mental model; IndexedDB + R2 provide safety nets | 2-second data loss window (mitigated by IndexedDB); user must be online for Drive persistence |
| **Periodic background sync**           | Decouples user action from Drive write; batches changes                                                  | More complex state management; harder to reason about "current" version                       |
| **Real-time (operational transforms)** | Google-Docs-like experience; multi-device                                                                | Enormous complexity for Phase 0; overkill for single-user                                     |

**Recommendation:** On-save (debounced 2s). Phase 0 is single-user. IndexedDB provides local safety. R2 provides server-side safety for users without Drive.

**Validation:** Measure Drive API write latency for chapter-sized files. If consistently under 2 seconds, the architecture is validated. Allocate 0.5 days.

---

### ADR-003: AI Integration Path

**Decision:** How DraftCrane calls the Claude API.

**Options:**

| Option                    | Pros                                                                    | Cons                                                                           |
| ------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Direct Anthropic API**  | Simplest integration; full control over SSE streaming; best SDK support | Must implement observability ourselves                                         |
| **Cloudflare AI Gateway** | Built-in logging, caching, rate limiting                                | Adds latency; caching unlikely to help (rewrites are unique); less SSE control |
| **Workers AI**            | Zero egress cost; lowest latency                                        | Model quality not comparable to Claude for writing tasks                       |

**Recommendation:** Direct Anthropic API for Phase 0. SSE streaming support is critical and the Anthropic TypeScript SDK handles it well. Implement a thin `AIService` wrapper that can be re-pointed to AI Gateway later.

---

### ADR-004: PDF/EPUB Generation Approach

**Decision:** How to generate book-quality PDF and EPUB files from chapter HTML content.

**Options:**

| Option                                                 | PDF Quality | Pros                                                                         | Cons                                                            |
| ------------------------------------------------------ | ----------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **Cloudflare Browser Rendering (PDF) + Worker (EPUB)** | HIGH        | Headless Chrome for faithful HTML/CSS rendering; EPUB is tractable in-Worker | Browser Rendering is beta; cold start 2-5s; per-session pricing |
| **Client-side (browser)**                              | LOW-MEDIUM  | No server constraints; works offline                                         | iPad memory limits; quality varies by platform                  |
| **Worker-side (pdf-lib)**                              | MEDIUM      | Full server control; consistent output                                       | No HTML-to-PDF layout engine; significant effort                |
| **External service (DocRaptor/Prince)**                | HIGH        | Professional typographic quality                                             | External dependency; per-document pricing                       |

**Recommendation:** EPUB generation in the Worker (straightforward). For PDF, prototype Cloudflare Browser Rendering first. Design a single, well-crafted HTML+CSS book template targeting US Trade (5.5" x 8.5") before the spike. If Browser Rendering quality is acceptable, use it. If not, fall back to an external service.

**Template design requirements:**

- US Trade page size (5.5" x 8.5")
- Body text: serif font (e.g., Georgia, Crimson Text), 11pt, 1.5 line height
- Margins: ~0.75-1" all sides (inside margin slightly larger for binding)
- Chapter title pages with generous whitespace
- Page numbers in footer
- Table of contents with chapter titles
- Title page with book title and author name

**Spikes (3 days total):**

1. (Day 1) Design the HTML+CSS book template. Build EPUB generator in Worker (3 chapters -> valid EPUB).
2. (Day 2) Test Cloudflare Browser Rendering: render 10-chapter manuscript to PDF. Measure quality, latency, cost.
3. (Day 3) If Browser Rendering fails quality bar: test DocRaptor as fallback.

---

### ADR-005: Data Model Split (D1 vs. Google Drive vs. R2)

**Decision:** What data lives in D1 vs. Google Drive vs. R2 vs. IndexedDB.

**Options:**

| Option                                                     | Pros                                                                                                  | Cons                                                                             |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Metadata-only in D1 + R2 buffer + IndexedDB** (proposed) | Clean separation; user owns all content; D1 stays small; Drive is canonical; R2 handles "Maybe later" | Every chapter open requires a Drive or R2 read; no full-text search              |
| **Content cached in D1**                                   | Faster reads; enables full-text search                                                                | Content duplication; sync complexity; contradicts "Drive is canonical" principle |
| **Content in R2 permanently**                              | R2 handles large objects; no D1 size concern                                                          | Still duplicated; R2 is not queryable; another sync layer                        |

**Recommendation:** Metadata-only in D1 + R2 buffer for pre-Drive users + IndexedDB for local crash protection (Option 1). This is the architectural expression of PM Principle 2 and project instruction #3. R2 resolves the "Maybe later" fragility concern without adding content to D1.

**Validation:** Measure Drive API read latency for chapter-sized files (1,000-10,000 words of HTML). If consistently under 1 second, validated. If over 2 seconds, add KV caching of chapter content (TTL: 5 minutes, invalidated on save).

---

## 6. API Surface (Phase 0)

All routes are served by the `dc-api` Worker (Hono). All routes except `/auth/webhook` require a valid Clerk session JWT. Responses are JSON unless noted.

### Auth & User

| Method | Path            | Description                                                                                                     | BA Story       |
| ------ | --------------- | --------------------------------------------------------------------------------------------------------------- | -------------- |
| POST   | `/auth/webhook` | Clerk webhook: user created/updated/deleted events. Syncs user record to D1.                                    | US-001         |
| GET    | `/users/me`     | Returns current user profile, Drive connection status, active project(s), and total word count across projects. | US-002, US-004 |

### Google Drive

| Method | Path                                | Description                                                                                         | BA Story |
| ------ | ----------------------------------- | --------------------------------------------------------------------------------------------------- | -------- |
| GET    | `/drive/authorize`                  | Returns Google OAuth authorization URL. Redirect-based flow only.                                   | US-005   |
| GET    | `/drive/callback`                   | OAuth callback. Exchanges code for tokens, encrypts, stores in D1, redirects to app.                | US-005   |
| POST   | `/drive/folders`                    | Creates a new folder in Drive (for auto-create Book Folder in Phase 0). Returns folder ID and name. | US-006   |
| GET    | `/drive/folders/:folderId/children` | Lists files/subfolders of a DraftCrane-managed folder. For Book Folder file listing.                | US-007   |
| DELETE | `/drive/connection`                 | Disconnects Google Drive. Revokes token, deletes from D1. Drive files untouched.                    | US-008   |

**Changes from Round 2:** Removed `GET /drive/folders` (root folder listing). With `drive.file` scope, DraftCrane cannot browse the user's full Drive tree. Phase 0 uses folder auto-creation only. `GET /drive/folders/:folderId/children` remains for listing files within the DraftCrane-created Book Folder (US-007).

### Projects

| Method | Path                   | Description                                                                                                                                       | BA Story       |
| ------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| POST   | `/projects`            | Creates a new book project. Accepts `{ title, description? }`. Creates default "Chapter 1". If Drive connected, creates Book Folder and links it. | US-009         |
| GET    | `/projects`            | Lists all active projects for the current user. Includes total word count per project.                                                            | US-009         |
| GET    | `/projects/:projectId` | Returns project details including chapter list with metadata (title, sort_order, word_count, status).                                             | US-009, US-012 |
| PATCH  | `/projects/:projectId` | Updates project title, description, or settings.                                                                                                  | US-009         |
| DELETE | `/projects/:projectId` | Soft-deletes project (sets status='archived'). Drive files untouched.                                                                             | US-023         |

### Chapters

| Method | Path                                    | Description                                                                                                                                                                      | BA Story       |
| ------ | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| POST   | `/projects/:projectId/chapters`         | Creates a new chapter at end of list. Creates corresponding file (Drive HTML or R2 buffer). Returns chapter metadata.                                                            | US-010         |
| GET    | `/projects/:projectId/chapters`         | Lists chapters for a project (metadata only: title, order, word count, status).                                                                                                  | US-012, US-024 |
| PATCH  | `/chapters/:chapterId`                  | Updates chapter metadata (title, status). Title max 200 chars, non-empty.                                                                                                        | US-013         |
| GET    | `/chapters/:chapterId/content`          | Fetches chapter body content from Google Drive or R2 buffer. Returns HTML.                                                                                                       | US-011         |
| PUT    | `/chapters/:chapterId/content`          | Writes chapter body content to Drive or R2. Accepts HTML + `version` header. Returns new version. Rejects with 409 if version conflict. Updates word_count and updated_at in D1. | US-015         |
| DELETE | `/chapters/:chapterId`                  | Deletes chapter from D1. Moves Drive file to trash (not permanent delete). Rejects if last chapter.                                                                              | US-014         |
| PATCH  | `/projects/:projectId/chapters/reorder` | Batch-updates sort_order for multiple chapters. Accepts `[{ id, sort_order }]`. Single transaction.                                                                              | US-012A        |

### AI

| Method | Path                                     | Description                                                                                                                                                                                                                                         | BA Story       |
| ------ | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| POST   | `/ai/rewrite`                            | Sends selected text + instruction + context + chapter title + project description to Claude API. Returns SSE stream. Max 2,000 words selected, 500 chars context each side. Rate limited: 10 req/min/user. Returns `interaction_id` in SSE headers. | US-016, US-017 |
| POST   | `/ai/interactions/:interactionId/accept` | Records that the user accepted an AI suggestion. Updates ai_interactions log.                                                                                                                                                                       | US-018         |
| POST   | `/ai/interactions/:interactionId/reject` | Records that the user rejected/discarded an AI suggestion.                                                                                                                                                                                          | US-018         |

### Export

| Method | Path                                              | Description                                                                                                                                               | BA Story                |
| ------ | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| POST   | `/projects/:projectId/export`                     | Initiates full-book export job. Accepts `{ format: "pdf" \| "epub" }`. Rejects if no chapters have content. Returns job ID. Rate limited: 5 req/min/user. | US-019, US-020          |
| POST   | `/projects/:projectId/chapters/:chapterId/export` | Initiates single-chapter export. Same format options. Returns job ID.                                                                                     | US-019 (single-chapter) |
| GET    | `/export/:jobId`                                  | Returns export job status. When completed, includes signed R2 download URL (1-hour expiry).                                                               | US-019, US-020, US-022  |
| POST   | `/export/:jobId/to-drive`                         | Uploads completed artifact from R2 to user's Drive `_exports/` subfolder.                                                                                 | US-021                  |

### Conventions

- **IDs:** All entity IDs are ULIDs, passed as path parameters.
- **Pagination:** List endpoints support `?limit=N&cursor=ULID` for cursor-based pagination. Default limit: 50.
- **Errors:** All errors return `{ error: string, code: string }` with appropriate HTTP status codes. Common codes: `AUTH_REQUIRED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `CONFLICT` (409), `RATE_LIMITED` (429), `DRIVE_ERROR` (502), `DRIVE_NOT_CONNECTED` (422), `VALIDATION_ERROR` (400), `LAST_CHAPTER` (400).
- **Versioning:** No URL versioning in Phase 0.
- **CORS:** Restricted to the DraftCrane frontend origin.
- **Rate limiting:** Standard endpoints: 60 req/min/user. AI endpoints: 10 req/min/user. Export endpoints: 5 req/min/user.

---

## Unresolved Issues

The following items represent genuine disagreements or open questions that require human decision-making. I have not papered over these.

### 1. Auto-Save Debounce: 2 Seconds vs. 5 Seconds

**The disagreement:** My Round 2 and Round 3 specify 2-second debounce. The BA Round 2 revised to 5 seconds (US-015: "5 seconds after last keystroke"). The UX Lead Round 2 Step 6 also references "5 seconds of inactivity." The PM Round 2 references a "5-second maximum data loss window."

**My position:** 2 seconds. The Target Customer's data loss anxiety is acute. The 2-second interval produces more D1 metadata writes ($0.75/million, trivial cost) and more Drive API calls (~30/min/user vs. ~12/min/user) but both are within platform limits at Phase 0 scale. The risk of 5-second data loss is higher than the cost of 2-second write frequency.

**What needs to happen:** PM must explicitly choose 2 or 5 seconds. The choice propagates to the BA's acceptance criteria, the UX Lead's save indicator timing, and the performance budget.

### 2. Chapter Reorder: In or Out of Phase 0

**The disagreement:** The BA Round 2 added US-012A (Reorder Chapters) and notes it was "moved to Phase 0 scope per UX Lead's writing flow design." The UX Lead includes it in Step 8. My API supports it. However, the BA Round 1 excluded it (US-010 out of scope), and the PM has not explicitly ruled.

**My position:** Include it. The API cost is one endpoint. The frontend cost is a drag-and-drop gesture on an existing list. Without it, users must delete and recreate chapters to change order. The Competitor Analyst identified Scrivener's reorder as a key organizational feature.

**What needs to happen:** PM must confirm.

### 3. Freeform Instruction Field in AI Rewrite

**The disagreement:** The BA Round 2 (US-017 out of scope) excludes "Custom/freeform AI prompts." The UX Lead Round 2 includes a freeform text input alongside suggestion chips. The Target Customer explicitly described needing to adjust instructions iteratively.

**My position:** Include the freeform instruction field. It is a single-line text input scoped to the selected text, not Phase 1's full "Ask Mode" (multi-turn conversation). The UX Lead's distinction is correct: directing a single transformation is different from having a conversation with the AI.

**What needs to happen:** PM must confirm.

### 4. "Maybe Later" Content Storage Mechanism

**The disagreement:** My Round 2 proposed IndexedDB-only. The BA proposed D1 as working copy. The UX Lead proposed "server-side temporary storage." This Round 3 proposes R2 as a server-side buffer.

**My position:** R2 is the right answer. It provides server-side persistence without putting content in D1, avoids the IndexedDB-only fragility risk, and uses a resource already in the stack. The BA's D1 proposal contradicts PM Principle 2 (no content in D1). IndexedDB-only is too fragile for users who write thousands of words before connecting Drive.

**What needs to happen:** PM must confirm the R2 approach. If confirmed, the BA should update US-015 and OQ-10 accordingly.

### 5. PDF Page Size: A5 vs. US Trade (5.5" x 8.5")

**Resolved in this document:** I have aligned with the BA's US Trade (5.5" x 8.5") recommendation. However, my Round 2 specified A5 and the PM Round 2 also mentions A5. These are close but not identical (A5 is ~5.83" x 8.27"). US Trade is the standard Amazon KDP default and more recognizable to the US self-publishing market.

**What needs to happen:** PM should confirm US Trade. This is a minor difference but should be consistent across all documents.

### 6. Single-Chapter Export

**Resolved in this document:** I have added `POST /projects/:projectId/chapters/:chapterId/export` per BA US-019 and UX Lead feedback. The BA and UX Lead both include single-chapter export. My Round 2 did not. This is now included.

**Open question for PM:** Does single-chapter PDF include a title page (with book title + chapter title) or just the chapter content? The BA recommends title page; I agree.

### 7. Clerk Google OAuth vs. Drive Google OAuth: Token Conflict Risk

**The BA's OQ-22 is valid and unresolved.** The user authenticates with Google via Clerk (auth scopes) and separately authorizes Google Drive access (drive.file scope). Both use Google OAuth but with different scopes and through different flows (Clerk's managed flow vs. our custom drive flow). Potential issues:

- Google may prompt the user to grant permissions twice (confusing UX)
- Token conflicts if Clerk and our custom flow use the same Google client ID
- Session confusion if the Google accounts differ

**Recommended action:** Use separate Google OAuth client IDs for Clerk auth and Drive access. This eliminates token conflicts. Verify in a spike (0.5 days) that the dual-OAuth flow does not confuse users or create technical issues.

### 8. AI Context: Project Description in the Prompt

**New addition not in previous rounds.** I am including the project description and chapter title in the AI rewrite prompt to provide minimal book context. This partially addresses the Target Customer's concern about generic AI output without requiring the full Book Blueprint (Phase 1). The added token cost is negligible (~50 tokens per request).

**Risk:** If the user's project description is empty (it is optional), the AI prompt degrades gracefully (the system prompt simply omits the description clause).

**What needs to happen:** PM should confirm this is acceptable. The Target Customer may also want to provide a "voice sample" (pasting a page of their best writing as reference). This is a Phase 1 feature (Book Blueprint seed), not Phase 0, but worth noting.
