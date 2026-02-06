# Business Analyst Contribution -- PRD Rewrite (Round 3 FINAL)

**Author:** Business Analyst
**Date:** February 6, 2026
**Round:** 3 of 3 (Final)
**Scope:** Phase 0 only -- Auth, Google Drive Integration, Basic Editor, Simple AI Rewrite, PDF/EPUB Export

---

## Changes from Round 2

### Key Revisions

1. **Resolved auto-save debounce interval conflict: standardized to 5 seconds.** The Tech Lead's Round 2 changed to 2 seconds (citing BA alignment), but the UX Lead's Step 6 specifies "5 seconds of inactivity." The PM did not specify a preference. My Round 2 already aligned with 5 seconds per the Tech Lead's Round 1 architecture. The 2-second interval generates approximately 2.5x more Drive API writes per active user, increasing D1 write costs and Drive API pressure. At 50 concurrent users with 2-second debounce, the D1 free tier (100K writes/day) is exhausted in approximately 2 hours of concurrent use (per Tech Lead's own calculation). With 5-second debounce, this extends to approximately 5 hours. IndexedDB writes on every keystroke already provide near-zero data loss within the browser lifetime regardless of debounce interval. **Final position: 5-second debounce.** The maximum data loss window on hard crash remains 5 seconds. This is documented as a known limitation. See Unresolved Issues for the remaining disagreement.

2. **Revised US-006 (Select Book Folder) to reflect `drive.file` scope constraint.** The UX Lead's Round 2 revealed a critical design change: the `drive.file` OAuth scope does NOT allow DraftCrane to browse the user's full Drive folder tree. My Round 2 user story assumed a full folder browser, which is not possible under this scope. Revised to align with the UX Lead's Option A (auto-create folder) as the Phase 0 approach, with Google Picker API (Option B) as a fast-follow if users demand folder selection. Updated acceptance criteria and business rules accordingly.

3. **Revised US-007 (View Files in Book Folder) to clarify visibility under `drive.file` scope.** Under `drive.file`, DraftCrane can only see files it created or files the user explicitly opened via DraftCrane. The "file listing" view shows DraftCrane-created chapter files and exports, not the user's pre-existing Drive files. This is a narrower feature than Round 2 described.

4. **Aligned PDF page size to A5 (148mm x 210mm) across all export stories.** Round 2 specified 5.5" x 8.5" (US Trade) in US-019. The PM, Tech Lead, and Competitor Analyst all specify A5. These are different sizes (A5 = 5.83" x 8.27" vs US Trade = 5.5" x 8.5"). Standardized to A5 per team consensus.

5. **Added explicit handling for the "Maybe Later" (no Drive) writing state.** The UX Lead and Tech Lead have different proposals for where content goes when Drive is not connected. The Tech Lead proposes IndexedDB-only with a warning banner. The UX Lead proposes server-side temporary storage. This affects US-005, US-011, and US-015. Documented as an unresolved issue requiring ADR-005 resolution, but added acceptance criteria covering both the connected and disconnected states.

6. **Confirmed SSE streaming as a requirement in all AI stories.** Round 2 already included streaming. The Target Customer, Tech Lead, and UX Lead all confirm it is required, not optional. Removed any residual "evaluate for Phase 1" language.

7. **Confirmed Google sign-in ("Continue with Google") as Phase 0.** Round 2 already corrected this from Round 1. The Target Customer, UX Lead, and PM all confirm. No remaining conflict.

8. **Addressed Target Customer's voice sample request in US-017 Out of Scope.** The Target Customer proposed a "voice sample" field during project setup to give the AI minimal voice context in Phase 0. The PM's scope definition excludes Book Blueprint features. Documented as out of scope with a note that this is a genuine product tension worth resolving before beta testing.

9. **Refined traceability matrix to align with PM's updated Phase 0 gate criteria.** The PM's Round 2 added a fifth gate criterion ("potential signal" -- users articulate wishes mapping to Phase 1+). Updated the traceability matrix to reflect this.

10. **Consolidated terminology across all sections.** "Book Folder" (not "book folder" or "Drive folder"), "Writing Environment" (not "editor view" or "writing interface"), "bottom sheet" (not "panel" or "modal"), "suggestion chips" (not "instruction chips" or "action buttons"), "Use This" / "Try Again" / "Discard" (not "Accept" / "Retry" / "Reject" in UI-facing text, though the API uses accept/reject).

---

## 1. Phase 0 User Stories

---

### Auth

---

**US-001: Sign Up**
As a new user, I want to create an account so that I can access DraftCrane and begin writing.

*Persona context: Both Diane Mercer and Marcus Chen expect frictionless sign-up. "Continue with Google" is the primary path because every target user has a Google account. Diane will not tolerate a complex sign-up form.*

API Endpoints: `POST /auth/webhook` (Clerk webhook syncs user to D1)

Acceptance Criteria:
- [ ] Given I am on the DraftCrane landing page, when I tap "Get Started," then I am presented with Clerk-hosted authentication with "Continue with Google" as the primary option and email/password as secondary
- [ ] Given I tap "Continue with Google," when I complete Google's OAuth flow (account selection, permission grant), then my DraftCrane account is created and I am redirected to the Book Setup screen
- [ ] Given I choose email/password sign-up and complete the form with valid credentials, when I submit, then my account is created and I am redirected to the Book Setup screen
- [ ] Given I attempt to sign up with an email already registered, when I submit, then I see an error message stating the email is already in use
- [ ] Given I am on an iPad using Safari, when I complete sign-up via either method, then the flow is fully functional with no layout or input issues
- [ ] Given I complete sign-up, when my account is created, then a `user.created` webhook fires to `POST /auth/webhook` and my user record is created in D1

Business Rules:
- Authentication is handled by Clerk (per project instructions tech stack)
- "Continue with Google" is the primary sign-up method; email/password is secondary
- Google OAuth at sign-up requests authentication scopes only -- NOT Drive scopes (Drive connection is a separate, later step per UX Lead's trust design)
- One account per email address
- Password requirements for email/password are governed by Clerk's default policy

Out of Scope:
- Apple sign-in, Facebook sign-in, or other social providers -- evaluate for Phase 1+
- Email verification flow beyond Clerk defaults
- Team or organization accounts
- Invitation-based sign-up

---

**US-002: Sign In**
As a returning user, I want to sign in to my existing account so that I can resume writing where I left off.

*Persona context: Marcus writes in bursts separated by weeks. He needs to return and be immediately back where he was. Diane writes from hotel lobbies and airport lounges -- sign-in must not be a barrier.*

API Endpoints: `GET /users/me` (returns user profile + Drive connection status after auth)

Acceptance Criteria:
- [ ] Given I am on the sign-in page, when I tap "Continue with Google" and select my account, then I am authenticated and taken directly to the Writing Environment with my last-edited chapter loaded
- [ ] Given I choose email/password and enter valid credentials, when I submit, then I am authenticated and taken to the Writing Environment
- [ ] Given I enter incorrect credentials, when I submit, then I see a generic error message ("Invalid email or password") that does not reveal whether the email exists
- [ ] Given I have forgotten my password, when I tap "Forgot Password," then Clerk's password reset flow is initiated
- [ ] Given I am already signed in and navigate to the sign-in page, when the page loads, then I am redirected to the Writing Environment
- [ ] Given I sign in after a previous session, when the Writing Environment loads, then I see my last-edited chapter with scroll position restored

Business Rules:
- Session is created upon successful authentication via Clerk JWT (httpOnly, Secure, SameSite=Lax cookie per Tech Lead's security model)
- Failed login attempts are rate-limited (Clerk default behavior)
- Returning users go directly to the Writing Environment, not a dashboard (per UX Lead: "There is no dashboard")

Out of Scope:
- Multi-factor authentication (MFA) -- evaluate for Phase 1+
- Single sign-on (SSO) / SAML
- "Remember this device" functionality beyond Clerk defaults

---

**US-003: Sign Out**
As a signed-in user, I want to sign out so that my account is secured when I am done working.

*Persona context: Diane works on a shared iPad occasionally (client site). Secure sign-out matters.*

Acceptance Criteria:
- [ ] Given I am signed in, when I tap "Sign Out" from the Settings menu, then my session is terminated and I am redirected to the sign-in page
- [ ] Given I have signed out, when I attempt to navigate to any authenticated page via URL, then I am redirected to the sign-in page
- [ ] Given I have signed out, when I press the browser back button, then I see the sign-in page (not cached authenticated content)
- [ ] Given I have unsaved changes in the editor, when I tap "Sign Out," then auto-save completes before the session is terminated (uses `visibilitychange` event as backup per Tech Lead's auto-save spec)

Business Rules:
- Sign-out invalidates the session server-side, not just client-side
- All cached user data is cleared from the browser on sign-out (including IndexedDB auto-save buffer)

Out of Scope:
- "Sign out of all devices" functionality
- Session timeout warnings / automatic sign-out after inactivity (evaluate for Phase 1)

---

**US-004: Session Persistence**
As a user, I want my session to persist across browser restarts so that I do not have to sign in every time I open DraftCrane.

*Persona context: Marcus opens DraftCrane after a 3-week gap. He must not be forced to re-authenticate and re-orient. Diane opens DraftCrane multiple times per day from hotel rooms.*

Acceptance Criteria:
- [ ] Given I signed in previously and did not sign out, when I close and reopen Safari and navigate to DraftCrane, then I am still authenticated and taken directly to the Writing Environment with my last-edited chapter
- [ ] Given my session token has expired (after 30 days), when I navigate to DraftCrane, then I am redirected to the sign-in page
- [ ] Given I am authenticated on one browser tab, when I open DraftCrane in a second tab, then I am also authenticated without re-entering credentials

Business Rules:
- Session lifetime: 30 days (configured via Clerk; matches typical SaaS products for low-friction re-engagement)

Out of Scope:
- Cross-device session sync
- Session management UI (view active sessions, revoke sessions)

---

### Google Drive Integration

---

**US-005: Connect Google Drive via OAuth**
As a user, I want to connect my Google Drive account so that my chapters are saved to my own cloud storage and my files stay mine.

*Persona context: The Target Customer said Drive integration is the number one reason she would try DraftCrane. Diane needs reassurance her IP is safe. The UX Lead designed this as a contextual prompt after project creation -- not blocking, but encouraged.*

API Endpoints: `GET /drive/authorize` (returns Google OAuth URL), `GET /drive/callback` (exchanges code for tokens)

Acceptance Criteria:
- [ ] Given I have created a project and see the Drive connection banner, when I tap "Connect Google Drive," then I am redirected to Google's OAuth consent screen requesting the `drive.file` scope
- [ ] Given I am on the Google OAuth consent screen, when I grant permissions, then I am redirected back to DraftCrane and the system automatically creates a Book Folder named after my project title in my Google Drive
- [ ] Given I am on the Google OAuth consent screen, when I deny permissions or cancel, then I am redirected back to DraftCrane with a message that Drive was not connected and an option to retry
- [ ] Given I have connected Google Drive, when I view the Settings menu, then I see my connected Google account email, the Book Folder name with a "View in Google Drive" link, and a "Disconnect" option
- [ ] Given I am on an iPad in Safari, when I initiate the OAuth flow, then the redirect flow (not popup) completes without being blocked by Safari
- [ ] Given I tap "Maybe Later" on the Drive connection banner, when the banner dismisses, then I can continue writing without Drive connected and the option to connect remains available in Settings
- [ ] Given I tap "Maybe Later," when I continue writing, then I see a persistent indicator: "Saved locally only. Connect Google Drive to protect your work." (yellow/amber state, distinct from the green "Saved to Drive" state)

Business Rules:
- OAuth tokens are stored server-side only, encrypted at rest in D1 using AES-256-GCM (per Tech Lead's security model), never exposed to the client
- DraftCrane requests `https://www.googleapis.com/auth/drive.file` scope only -- access limited to files created by or opened with DraftCrane
- Drive connection is optional. The user can write without Drive connected. When Drive is connected, existing chapter content is synced to the newly created Book Folder.
- Google OAuth at sign-up (US-001) and Google OAuth for Drive (US-005) are separate flows requesting different scopes
- The Book Folder is auto-created by DraftCrane using the project title as the folder name (UX Lead Option A). This is the simplest approach compatible with the `drive.file` scope, which does not allow browsing existing Drive folders.

Out of Scope:
- Connecting multiple Google accounts simultaneously
- Other cloud storage providers (OneDrive, Dropbox, iCloud)
- Selecting an existing Drive folder as the Book Folder (requires Google Picker API; evaluate as fast-follow if user testing reveals demand)
- Browsing the user's full Drive folder tree (not possible under `drive.file` scope)

---

**US-006: Create or Select Book Folder**
As a user, I want DraftCrane to create a dedicated Book Folder in my Google Drive so that all my chapters and exports are organized in one location I control.

*Persona context: Under the `drive.file` scope, DraftCrane cannot browse the user's existing folder structure. The UX Lead's revised design (Option A) auto-creates a folder. This is simpler for Diane. Marcus, who has an existing "Book Project" folder, loses the ability to choose it -- but his existing files are not accessible to DraftCrane under `drive.file` scope regardless.*

API Endpoints: `POST /drive/folders` (creates folder in Drive root)

Acceptance Criteria:
- [ ] Given I have connected Google Drive, when the connection completes, then DraftCrane automatically creates a folder in my Drive root named after my project title (e.g., "The Operational Leader") and sets it as the Book Folder
- [ ] Given the Book Folder is created, when I view the confirmation, then I see the folder name and a "View in Google Drive" link that opens the folder in Drive in a new tab so I can verify it exists
- [ ] Given I have an existing project with a Book Folder, when I change my project title, then the Book Folder name in Drive is NOT automatically renamed (to avoid confusion)
- [ ] Given I want to change my Book Folder for a project, when I access Settings, then I can create a new Book Folder. Existing files remain in the previous folder; new saves go to the new folder.
- [ ] Given the folder creation fails (network error, Drive API error), when the failure occurs, then I see: "We could not create your Book Folder. Tap to try again." The Drive connection is not left in a half-configured state.

Business Rules:
- Book Folder is per-project (the Tech Lead's schema stores `drive_folder_id` on the `projects` table)
- The Book Folder is where chapter files (HTML) and export files (PDF/EPUB in an `_exports` subfolder) are saved
- DraftCrane creates the folder in the Drive root. The user can move it within Drive afterward if desired.
- Folder creation uses the `drive.file` scope (DraftCrane can create files/folders it owns)

Out of Scope:
- Nested sub-folder management within the Book Folder
- Importing existing files from Drive into the editor (Source Intelligence is Phase 2)
- Full folder browser with navigation (not possible under `drive.file` scope)
- Renaming the Book Folder from within DraftCrane

---

**US-007: View Files in Book Folder**
As a user, I want to see a listing of files DraftCrane has saved to my Book Folder so that I can verify my chapters and exports are stored in my Drive.

*Persona context: The Target Customer said she wants to "verify my files are in Drive by opening Drive in another tab." This view provides that reassurance within DraftCrane itself, supporting PM Principle 2 (visible file ownership).*

API Endpoints: `GET /drive/folders/:folderId/children` (lists DraftCrane-created files in the Book Folder)

Acceptance Criteria:
- [ ] Given I have a connected Book Folder, when I navigate to the Book Folder view (accessible from Settings), then I see a list of DraftCrane-created files showing file name, type icon, and last modified date
- [ ] Given there are files in my Book Folder, when the list loads, then files are sorted by last modified date (most recent first)
- [ ] Given my Book Folder has no DraftCrane-created files yet, when the list loads, then I see an empty state message: "No files yet. Your chapters will appear here as you write."
- [ ] Given I have exported files previously, when I view the file list, then exports appear in the `_exports` subfolder and are distinguishable from chapter files

Business Rules:
- File listing shows only files DraftCrane created (per `drive.file` scope -- DraftCrane cannot see pre-existing user files in the folder)
- File listing is read-only in Phase 0 -- no renaming, deleting, or moving files from this view
- File listing reflects current Drive state (cached in KV with 60-second TTL per Tech Lead's caching strategy)

Out of Scope:
- Viewing files not created by DraftCrane (scope limitation)
- File preview within DraftCrane
- File search or filtering
- Importing files from the Book Folder into the editor (Phase 2 Source Intelligence)
- Direct file download from this view (user can access via Drive)

---

**US-008: Disconnect Google Drive**
As a user, I want to disconnect my Google Drive from DraftCrane so that the application no longer has access to my Drive.

*Persona context: The Target Customer expressed concern about lock-in and startup disappearance. Disconnection must be clean and leave the user's files fully intact in their Drive.*

API Endpoints: `DELETE /drive/connection` (revokes token, deletes from D1)

Acceptance Criteria:
- [ ] Given my Google Drive is connected, when I tap "Disconnect Google Drive" in Settings, then I see a confirmation dialog explaining: "Your files in Google Drive will not be deleted. You can reconnect at any time."
- [ ] Given I confirm disconnection, when the process completes, then the OAuth token is revoked via Google's API and deleted from DraftCrane's D1 storage
- [ ] Given I have disconnected, when I view Settings, then the Drive status shows "Not Connected" with an option to reconnect
- [ ] Given I have disconnected, when I attempt to export, then I see a message indicating Google Drive must be connected to save to Drive, with a local download fallback offered
- [ ] Given I have disconnected, when I look in my Google Drive, then all previously saved chapter files and exports remain in my Book Folder
- [ ] Given I have disconnected, when I continue writing, then the save indicator changes to "Saved locally only" (yellow/amber) and auto-save continues via the local buffer

Business Rules:
- Disconnecting does NOT delete any files from the user's Drive
- Disconnecting does NOT delete the user's DraftCrane account or project data in D1
- After disconnecting, content is preserved in IndexedDB and the user sees a persistent banner encouraging reconnection
- The user can reconnect at any time using US-005

Out of Scope:
- Partial disconnection (keeping read but removing write access)
- Account deletion (separate feature, see US-023)
- Data export from DraftCrane's own database

---

### Basic Editor

---

**US-009: Create a Project**
As a user, I want to create a new book project so that I can begin organizing and writing my manuscript.

*Persona context: The UX Lead designed a focused Book Setup screen with two fields: title and optional description. Marcus might hesitate on the title because his is not final -- helper text says "You can change this anytime." Diane might overthink the description -- it is marked optional.*

API Endpoints: `POST /projects` (creates project, links to Drive folder if connected)

Acceptance Criteria:
- [ ] Given I am a first-time user who has just signed up, when I am redirected after sign-up, then I see the Book Setup screen with a title field and an optional description field
- [ ] Given I enter a book title (e.g., "The Operational Leader"), when I tap "Create Book," then a project is created and I am redirected to the Writing Environment with one default chapter ("Chapter 1") created
- [ ] Given I enter a title and a brief description (1-2 sentences), when the project is created, then both title and description are stored in D1 (the description informs future AI context)
- [ ] Given I attempt to create a project with an empty title, when I tap "Create Book," then I see a validation error asking me to enter a title
- [ ] Given I have created one project already, when I want to create another, then I can do so from the Settings or project menu (multiple projects are supported)
- [ ] Given I have created a project, when my project is stored, then the `projects` table in D1 contains my user_id, title, description, and status='active'

Business Rules:
- Multiple projects per user are supported. No artificial limit. The Tech Lead's schema has `user_id` as a non-unique foreign key on `projects`, confirming multiple projects per user. The UX Lead's Phase 0 UI shows one project at a time in the Writing Environment (a dropdown or menu allows switching), not a full project dashboard.
- A newly created project has one default chapter ("Chapter 1") with an empty body
- Project title can be edited later from Settings
- Project title is required, non-empty, maximum 500 characters
- Project description is optional, maximum 1,000 characters
- The Book Setup screen appears only for new project creation, not on every sign-in

Out of Scope:
- Project templates or starting structures
- Audience, promise/outcome, tone selection (Phase 1 Book Blueprint)
- Length target setting
- Project duplication or archival
- Voice sample or style reference (the Target Customer requested a "voice sample" for AI context; this maps to Phase 1 Book Blueprint and is out of Phase 0 scope -- see Unresolved Issues)

---

**US-010: Create a Chapter**
As a user, I want to create new chapters within my project so that I can organize my manuscript into logical sections.

*Persona context: Marcus thinks in chapters (he already has a 12-chapter mental structure). Diane will discover her structure as she writes. Both need the "+" button to be obvious and the naming to be instant and inline.*

API Endpoints: `POST /projects/:projectId/chapters` (creates chapter record in D1 and corresponding HTML file in Google Drive if connected)

Acceptance Criteria:
- [ ] Given I am in the Writing Environment, when I tap the "+" button at the bottom of the sidebar chapter list, then a new chapter is created and appears at the end of the chapter list with an editable title field active and "Untitled Chapter" pre-filled and selected
- [ ] Given a new chapter is created, when I type a name and tap Enter or tap into the editor, then the chapter is named and the editor loads the new empty chapter
- [ ] Given a new chapter is created and Google Drive is connected, when the chapter is created, then a corresponding HTML file is created in the Book Folder (e.g., "Chapter 4 - The Delegation Framework.html")
- [ ] Given I have multiple chapters, when I view the sidebar, then chapters are listed in order with their titles and word counts, with the active chapter highlighted

Business Rules:
- Chapters are ordered sequentially within a project (via `sort_order` column in D1)
- No artificial limit on chapter count. Performance test at 50+ chapters. The Tech Lead's `idx_chapters_sort` unique index enforces ordering but does not limit count.
- Chapter creation auto-saves project metadata to D1

Out of Scope:
- Chapter sections or sub-chapters
- Chapter templates
- Bulk chapter operations

---

**US-011: Edit Chapter Content**
As a user, I want to write and edit text within a chapter so that I can compose my manuscript.

*Persona context: Diane works on iPad with virtual keyboard 80% of the time. Marcus uses a Smart Keyboard Folio. The UX Lead specifies 18px base font, generous line height, max content width of 680-720pt. The editor must feel "as natural as Google Docs but with actual book structure."*

API Endpoints: `GET /chapters/:chapterId/content` (fetches HTML from Drive), `PUT /chapters/:chapterId/content` (writes HTML to Drive)

Acceptance Criteria:
- [ ] Given I have selected a chapter, when I tap in the content area, then a cursor appears and I can begin typing
- [ ] Given I am typing in the editor, when I type text, then it appears in real-time with no perceptible lag (< 100ms input latency)
- [ ] Given I am in the editor, when I use keyboard shortcuts (Cmd+B for bold, Cmd+I for italic, Cmd+Z for undo, Cmd+Shift+Z for redo), then the selected text is formatted or changes are undone/redone accordingly
- [ ] Given I am in the editor, when I use the formatting toolbar, then I can apply: Bold, Italic, Heading (H2, H3), Bulleted list, Numbered list, and Block quote
- [ ] Given I am on an iPad with a virtual keyboard, when the keyboard appears, then the editor resizes so that the cursor and active line remain visible above the keyboard (using the `visualViewport` API per UX Lead specification)
- [ ] Given I am on an iPad with a virtual keyboard, when I type and format text, then the formatting toolbar remains accessible and no controls are hidden behind the keyboard
- [ ] Given I press Cmd+S (external keyboard), when the shortcut fires, then an immediate save is triggered and the "Saved" indicator updates
- [ ] Given I am editing, when chapter content loads from Google Drive, then the HTML preserves all supported formatting (bold, italic, headings, lists, block quotes)
- [ ] Given Google Drive is not connected, when I am editing, then content is still saved (to the local buffer / server-side temporary storage per ADR-005 resolution) and the save indicator shows "Saved locally only"

Business Rules:
- The editor is a rich-text editor, not a code/markdown editor (target users are non-technical)
- Formatting is limited in Phase 0 to: Bold, Italic, H2, H3 (H1 is reserved for chapter title, auto-applied), Bulleted lists, Numbered lists, Block quote
- Chapter body content is stored as HTML files in Google Drive when connected (per Tech Lead's data model). D1 stores only metadata (title, sort_order, word_count, drive_file_id, version).
- Editor library selection requires ADR-001. Tech Lead recommends Tiptap as preliminary choice. Physical iPad testing required before decision.
- Maximum content width in the editor: approximately 680-720pt
- Unsupported formatting (tables, images, colored text, custom fonts) is silently stripped on paste. Only supported formatting is preserved.
- Base font size in editor: 18px (prevents iOS auto-zoom on input focus)

Out of Scope:
- Inline comments or annotations (Phase 1+)
- Tables, images, or embedded media
- Footnotes or endnotes
- Custom fonts or typography controls
- Collaborative real-time editing
- Track changes
- Version history beyond undo (Phase 2 -- the Target Customer flagged this as a gap compared to Google Docs; acknowledged as a known Phase 0 limitation)

---

**US-012: Chapter Navigation**
As a user, I want to navigate between chapters using a sidebar so that I can move through my manuscript quickly.

*Persona context: Marcus switches between chapters frequently. The UX Lead specifies scroll position restoration on return. Diane writes more linearly but needs to see her progress across chapters.*

API Endpoints: `GET /projects/:projectId/chapters` (returns chapter list with metadata)

Acceptance Criteria:
- [ ] Given I am in the Writing Environment, when I view the sidebar, then I see all chapters listed in order with their titles, word counts in muted text below each title, and the active chapter visually highlighted (left border accent + bold title)
- [ ] Given I tap a chapter in the sidebar, when the chapter loads, then the editor displays that chapter's content within 2 seconds (for chapters under 10,000 words per Tech Lead's performance budget)
- [ ] Given I have unsaved changes in the current chapter, when I tap a different chapter, then my changes are auto-saved before navigation occurs
- [ ] Given I switch from Chapter 2 to Chapter 1 and back to Chapter 2, when Chapter 2 reloads, then my scroll position in Chapter 2 is restored to where I left off
- [ ] Given I am on an iPad, when I interact with the sidebar, then it is usable via touch (tap to select, scroll to browse) with touch targets at least 48pt tall (per UX Lead's Apple HIG compliance)
- [ ] Given I have more chapters than fit in the sidebar viewport, when I scroll the sidebar, then all chapters are accessible
- [ ] Given the sidebar shows chapter data, when I view the bottom of the chapter list, then I see a total word count for the entire project (e.g., "Book total: 4,147 words")

Business Rules:
- Only one chapter is displayed in the editor at a time
- Sidebar responsive behavior:
  - iPad Landscape (1024pt+ width): Sidebar is persistent, approximately 240-280pt wide, collapsible via toggle
  - iPad Portrait (768pt width): Sidebar is hidden by default; a persistent chapter indicator (e.g., "Ch 3" pill) shows at the left edge. Revealed by tapping the indicator or swiping from the left edge. Overlays the editor when open.
  - Desktop (1200pt+ width): Sidebar is persistent

Out of Scope:
- Chapter grouping or sections (e.g., "Part 1")
- Search within chapters from the sidebar
- Chapter status indicators (draft, complete, etc.) -- evaluate for Phase 1

---

**US-012A: Reorder Chapters**
As a user, I want to reorder chapters by dragging them in the sidebar so that I can restructure my manuscript as my thinking evolves.

*Persona context: The UX Lead's writing flow describes Marcus realizing "Chapter 4 should actually be Chapter 2" and using long-press-and-drag to reorder. This is a standard iPadOS interaction pattern. The PM confirmed inclusion in Phase 0. The Tech Lead's API surface already supports it.*

API Endpoints: `PATCH /projects/:projectId/chapters/reorder` (batch-updates sort_order)

Acceptance Criteria:
- [ ] Given I am in the sidebar with multiple chapters, when I long-press a chapter name, then the item visually lifts (indicating it is draggable)
- [ ] Given I am dragging a chapter, when I move it to a new position, then a line indicator shows the drop target between other chapters
- [ ] Given I release the dragged chapter at a new position, when the drop completes, then chapters reorder and the new order is saved via `PATCH /projects/:projectId/chapters/reorder`
- [ ] Given I am on an iPad, when I use long-press-and-drag, then the gesture works with standard iPadOS touch behavior and does not conflict with text selection

Business Rules:
- Reorder persists immediately to D1 (batch update of `sort_order` values)
- If Google Drive is connected, chapter file names in Drive are NOT renamed on reorder (only internal ordering changes; file names retain their creation-time chapter numbers to avoid Drive API churn)
- Keyboard-based reorder is available via Ctrl+Up/Ctrl+Down when a chapter is focused (per UX Lead accessibility spec)

Out of Scope:
- Moving chapters between projects
- Automatic chapter number prefixes in chapter titles

---

**US-013: Rename a Chapter**
As a user, I want to rename a chapter so that the sidebar reflects the actual content of each chapter.

*Persona context: Both personas start with "Untitled Chapter" and name chapters as content takes shape. The UX Lead specifies inline editing -- no dialog or modal.*

API Endpoints: `PATCH /chapters/:chapterId` (updates title)

Acceptance Criteria:
- [ ] Given I see a chapter in the sidebar, when I double-tap (or long-press then tap "Rename" on iPad) the chapter title, then the title becomes an editable inline text field
- [ ] Given the chapter title is in edit mode, when I type a new name and tap Enter (or tap away), then the chapter is renamed, the sidebar updates immediately, and the rename is saved to D1
- [ ] Given I clear the chapter title and confirm, when the rename completes, then the chapter reverts to "Untitled Chapter" (empty titles are not allowed)
- [ ] Given I press Escape while editing a chapter title, when the edit is cancelled, then the original title is restored
- [ ] Given I rename a chapter and Google Drive is connected, when the rename is saved, then the corresponding Drive file is renamed to match (e.g., "Chapter 3 - New Title.html")

Business Rules:
- Chapter titles must be non-empty (whitespace-only titles are treated as empty)
- Chapter title changes are auto-saved
- Maximum chapter title length: 200 characters

Out of Scope:
- Chapter numbering auto-generation (e.g., "Chapter 1: [Title]")
- Subtitle or description fields for chapters

---

**US-014: Delete a Chapter**
As a user, I want to delete a chapter I no longer need so that my manuscript structure stays clean.

*Persona context: Marcus experiments with chapter structures. He may create a chapter, decide it belongs elsewhere, and want to remove it. The UX Lead specifies confirmation with clear consequences.*

API Endpoints: `DELETE /chapters/:chapterId` (with `?trash_drive=true` query param to trash the Drive file)

Acceptance Criteria:
- [ ] Given I long-press a chapter in the sidebar and select "Delete" (or access delete from a chapter context menu), when I initiate deletion, then a confirmation dialog appears: "Delete '[Chapter Title]'? This cannot be undone in DraftCrane."
- [ ] Given the confirmation dialog is displayed, when I confirm deletion, then the chapter is removed from the sidebar, its metadata is deleted from D1, and (if Drive is connected) the corresponding Drive file is moved to Google Drive's trash
- [ ] Given I delete the currently active chapter, when deletion completes, then the editor navigates to the nearest remaining chapter
- [ ] Given I have only one chapter, when I attempt to delete it, then the delete option is disabled or I see a message that at least one chapter is required
- [ ] Given I cancel the deletion confirmation, when the dialog closes, then no changes are made

Business Rules:
- A project must always have at least one chapter
- Deleted chapters are hard-deleted from D1 in Phase 0. The corresponding Drive file is moved to Drive's trash (30-day retention by Google), providing a recovery path.
- No soft-delete in DraftCrane in Phase 0. Drive trash provides sufficient recovery.

Out of Scope:
- Undo chapter deletion within DraftCrane
- Trash/archive view for deleted chapters
- Bulk chapter deletion

---

**US-015: Auto-Save**
As a user, I want my writing to be automatically saved so that I never lose work due to forgetting to save or a browser crash.

*Persona context: The Target Customer listed losing work as her number one fear. Marcus has lost work before by accidentally closing a Safari tab. The "Saved" indicator is critical trust infrastructure.*

API Endpoints: `PUT /chapters/:chapterId/content` (writes HTML to Drive, updates metadata in D1)

Acceptance Criteria:
- [ ] Given I am typing in the editor, when I pause for 5 seconds (debounced), then the current chapter content is saved automatically to Google Drive (if connected) and metadata is updated in D1
- [ ] Given auto-save triggers, when the save succeeds, then a subtle status indicator shows "Saved" with a timestamp in the toolbar area (same position every time)
- [ ] Given auto-save triggers, when the save fails (network error, Drive API error), then a visible warning is displayed: "Unable to save. Retrying..." and the system retries with exponential backoff (2s, 4s, 8s, max 3 retries per Tech Lead spec)
- [ ] Given auto-save fails after 3 retries, when the user continues typing, then a persistent warning bar is shown: "Your changes have not been saved. Please check your connection." Content is preserved in IndexedDB.
- [ ] Given I switch to another app on iPad (tab goes to background), when the `visibilitychange` event fires, then an immediate save attempt is made
- [ ] Given my browser crashes or iPad force-quits Safari, when I next open DraftCrane and load the chapter, then the system checks IndexedDB for unsaved content newer than the Drive version and prompts me to restore or discard
- [ ] Given a save includes a version counter, when the server detects a version conflict (response 409), then the user sees: "This chapter was modified elsewhere. View changes / Overwrite / Reload."
- [ ] Given Google Drive is not connected, when auto-save triggers, then content is saved to IndexedDB and the indicator shows "Saved locally only" (yellow/amber)

Business Rules:
- Auto-save debounce: 5 seconds after last keystroke. (See Unresolved Issues for the 2s vs 5s debate.)
- Auto-save writes to Google Drive as the canonical store when connected. D1 is updated with metadata (word_count, updated_at, version) on each save.
- IndexedDB serves as a local write-ahead log -- content is written to IndexedDB on every keystroke as crash protection. Maximum data loss window on hard crash: 5 seconds (one debounce interval) if IndexedDB is also lost (e.g., iOS kills Safari under severe memory pressure).
- Save status has exactly three visible states when Drive is connected: "Saving...", "Saved [timestamp]", "Save failed". When Drive is not connected: "Saved locally only" replaces "Saved."
- The `visibilitychange` event (not `beforeunload`, which is unreliable on iPad Safari) triggers an immediate save when the tab backgrounds.

Out of Scope:
- Version history or revision tracking (Phase 2, collaboration)
- Conflict resolution between multiple browser tabs editing the same chapter (handled by conflict detection prompt per acceptance criteria above, but not a sophisticated merge)
- Full offline writing mode (brief connectivity loss is handled by IndexedDB buffer + retry; extended offline blocks Drive sync, AI, and export)

---

**US-024: Word Count Display**
As a user, I want to see a word count for the current chapter and the full project so that I can track my progress and know how much I have written.

*Persona context: The Target Customer explicitly asked: "How far along am I? How many words do I have?" The PM's kill criterion "user completes a full chapter in first session" implies measurable word output. The UX Lead added word counts to the sidebar chapter list and editor footer.*

API Endpoints: `GET /projects/:projectId/chapters` (returns word_count per chapter in metadata), auto-save updates `word_count` via `PUT /chapters/:chapterId/content`

Acceptance Criteria:
- [ ] Given I am writing in the editor, when I look at the bottom of the editor area (or a designated status area), then I see the current chapter's word count updated in real-time as I type
- [ ] Given I view the sidebar, when I look at each chapter entry, then I see a subtle word count beneath the chapter title in muted text (e.g., "2,340 words")
- [ ] Given I view the sidebar, when I look below the chapter list, then I see a total word count across all chapters (e.g., "Book total: 12,450 words")
- [ ] Given I select text in the editor, when the selection is active, then the word count area shows both the selection word count and total chapter word count (e.g., "142 / 3,400 words")

Business Rules:
- Word count is calculated client-side for real-time display and stored server-side (in D1 `chapters.word_count`) on each auto-save
- Word count counts words in body text only; headings and formatting markup are excluded
- Word count updates do not trigger auto-save on their own (they piggyback on content saves)
- Word count text in the sidebar must meet WCAG AA contrast ratio (4.5:1) even when styled as "muted" text

Out of Scope:
- Word count targets or goals per chapter (Phase 1)
- Progress percentage or estimated completion (Phase 1)
- Reading time estimates
- Session-level writing statistics (e.g., "You wrote 2,800 words today")

---

### AI Rewrite

---

**US-016: Select Text for AI Rewrite**
As a user, I want to select a passage of text in the editor so that I can request an AI improvement of that specific content.

*Persona context: Diane selects a jargon-heavy paragraph on her iPad and wants to simplify it. The UX Lead designed a floating action bar with "AI Rewrite" that appears near the selection, separate from the native iPadOS text menu.*

Acceptance Criteria:
- [ ] Given I am in the editor, when I select a range of text (via touch selection on iPad or keyboard selection with external keyboard), then a DraftCrane floating action bar appears near the selection containing an "AI Rewrite" button (separate from the native Cut/Copy/Paste menu)
- [ ] Given the floating action bar is visible, when I see it, then the "AI Rewrite" button has a minimum touch target of 48x48pt
- [ ] Given I have no text selected, when I look at the editor, then no AI action bar is visible
- [ ] Given I adjust my selection (drag handles to extend or shrink), when the selection changes, then the floating action bar repositions to track the selection bounds
- [ ] Given I am on an iPad, when I select text using touch, then the floating action bar does not interfere with iPadOS selection handles or the native context menu
- [ ] Given I select more than 2,000 words, when the floating bar appears, then the "AI Rewrite" button shows a message: "Selection is too long for AI rewrite. Please select a shorter passage."

Business Rules:
- AI actions are only available on text selections, not on the entire chapter at once (in Phase 0)
- Selection length limits: minimum 1 word, maximum approximately 2,000 words (per Tech Lead's content length limit). Selections exceeding the maximum show a message instead of enabling the AI Rewrite button.
- The floating action bar appears approximately 200ms after the native iPadOS text menu, positioned on the opposite side of the selection to avoid conflict (per UX Lead's interaction design)

Out of Scope:
- AI rewrite of an entire chapter
- Custom/freeform AI prompts entered directly in the editor (the bottom sheet handles custom instructions)
- AI actions triggered from a menu or panel (floating action bar is the trigger; bottom sheet is the interaction surface)

---

**US-017: Request AI Rewrite**
As a user, I want to request an AI rewrite of my selected text with a specific instruction so that I can improve my writing with AI assistance while maintaining my voice.

*Persona context: Diane taps "Simpler language" from the suggestion chips. Marcus types "more conversational, like a mentor talking to a peer." The Target Customer's number one fear is AI stripping her voice. The UX Lead designed a bottom sheet with suggestion chips AND a freeform instruction field.*

API Endpoints: `POST /ai/rewrite` (sends selected text + instruction + surrounding context to Claude API, returns SSE stream)

Acceptance Criteria:
- [ ] Given I have selected text and tapped "AI Rewrite," when the bottom sheet appears, then I see: my original text (quoted, scrollable if long), an instruction text field with placeholder "How should I change this?", suggestion chips ("Simpler language", "More concise", "More conversational", "Stronger", "Expand"), and a "Rewrite" button (disabled until I type or tap a chip)
- [ ] Given I tap a suggestion chip (e.g., "Simpler language"), when the chip highlights, then the instruction field fills with the chip text and the "Rewrite" button becomes active
- [ ] Given I type a custom instruction in the text field (e.g., "more conversational, like a mentor talking to a peer"), when I have entered text, then the "Rewrite" button becomes active
- [ ] Given I type a custom instruction and tap "Rewrite," when the request is sent, then the system sends to `POST /ai/rewrite`: the selected text, the instruction, and surrounding context (500 characters before and after the selection per Tech Lead's specification)
- [ ] Given the AI is processing, when I see the loading state, then I see "Rewriting..." with a progress animation, and the rewritten text appears via SSE streaming token by token, giving immediate feedback (first token within 2 seconds per Tech Lead's performance budget)
- [ ] Given the AI request takes longer than 15 seconds without producing output, when the timeout is reached, then I see: "This is taking longer than expected. You can wait or cancel."
- [ ] Given the bottom sheet is open and I am on an iPad with the virtual keyboard active, when the bottom sheet appears, then the keyboard dismisses first and the editor scrolls so my selected text remains visible above the bottom sheet

Business Rules:
- AI requests are sent to Anthropic Claude API via `POST /ai/rewrite` on the dc-api Worker
- The AI receives: selected text + instruction + surrounding context (500 chars before and after). Surrounding context preserves tone continuity.
- The AI system prompt instructs: "You are a writing assistant. Rewrite the selected text according to the user's instruction. Preserve the original meaning. Match the surrounding tone. Return only the rewritten text."
- AI usage limits: Unlimited during beta with monitoring. Rate limit: 10 requests/minute/user enforced via KV counters. All interactions logged to `ai_interactions` table for cost tracking.
- AI responses are streamed via Server-Sent Events (SSE). This is a requirement, not optional.
- Suggestion chips and the freeform instruction field are not mutually exclusive. The user can tap a chip, then edit the instruction text to refine it.
- Suggestion chips map to the three BA-specified rewrite modes plus the UX Lead's expanded set: "Simpler language" (simplify), "More concise" (shorten/rewrite), "More conversational" (rewrite with tone), "Stronger" (rewrite with emphasis), "Expand" (expand)

Out of Scope:
- Rewrite history (seeing previous AI suggestions for the same selection)
- AI receiving full manuscript context or Book Blueprint (Phase 1)
- AI-generated content from scratch (only rewriting existing text)
- Voice/tone matching based on a voice sample or Book Blueprint (Phase 1 -- the Target Customer strongly desires this for Phase 0; see Unresolved Issues)
- Multi-turn AI conversation ("Ask Mode" is Phase 1)

---

**US-018: Accept, Reject, or Try Again on AI Suggestion**
As a user, I want to review the AI's suggestion and choose to accept it, reject it, or try again so that I remain in full control of my manuscript content.

*Persona context: Diane tries "Simpler language," is not satisfied, taps "Try Again" with "Simpler language and more concise. About half the length," gets a better result, and taps "Use This." The Target Customer demands: "I would need to see a before/after preview. I would need to be able to undo instantly."*

API Endpoints: `POST /ai/interactions/:interactionId/accept` (logs acceptance), `POST /ai/interactions/:interactionId/reject` (logs rejection), `POST /ai/rewrite` (for "Try Again" iterations)

Acceptance Criteria:
- [ ] Given the AI has returned a suggestion, when I see the result in the bottom sheet, then I see: the original text (in a collapsible section, collapsed by default), the rewritten text (prominently displayed), and three action buttons: "Use This" (primary), "Try Again" (secondary), "Discard" (tertiary/text-only link)
- [ ] Given I tap "Use This," when the replacement occurs, then the selected text in the editor is replaced with the AI suggestion, a brief visual highlight (1-second background color flash, respecting `prefers-reduced-motion`) orients me to the change, the bottom sheet closes, and auto-save triggers
- [ ] Given I tap "Discard," when the bottom sheet closes, then the original text remains unchanged in the editor and no trace of the AI interaction remains in the document
- [ ] Given I tap "Try Again," when the instruction input reappears, then my previous instruction is still in the field (editable) and I can modify it or tap "Rewrite" again to generate a new suggestion while the original text is always preserved
- [ ] Given I tap "Use This" and then immediately press Cmd+Z (undo), when undo executes, then the acceptance is undone and the original text is restored
- [ ] Given the AI suggestion is shown, when I tap outside the bottom sheet, then the bottom sheet closes and the original text remains (treated as discard)
- [ ] Given the bottom sheet is open on iPad, when I view the action buttons, then "Use This" and "Discard" are at least 48pt tall with minimum 16pt gap between them to prevent accidental mis-taps
- [ ] Given I accept a suggestion, when the interaction is logged, then `POST /ai/interactions/:interactionId/accept` records the interaction in `ai_interactions` table with: chapter_id, action, instruction, input_chars, output_chars, model, latency_ms, accepted=1, attempt_number

Business Rules:
- AI suggestions are NEVER applied without explicit user acceptance (per project instructions: "AI assists, never replaces" and "Every AI action requires user approval")
- "Try Again" does NOT lose the original text. The original is always preserved until "Use This" is explicitly tapped.
- Accepted suggestions become part of the document and are subject to auto-save
- Rejected/discarded suggestions are not stored (only metadata is logged, never user content)
- The "Use This" action IS undoable via Cmd+Z (critical per UX Lead: "Diane must never feel that accepting an AI rewrite is a permanent, irreversible decision")
- There is no limit on "Try Again" iterations (each iteration is a new `POST /ai/rewrite` call, subject to rate limiting)
- The bottom sheet implements a focus trap while open (per UX Lead's accessibility spec). Escape key closes the bottom sheet (equivalent to "Discard"). On close, focus returns to the editor.

Out of Scope:
- Editing the AI suggestion text directly before accepting
- Rating or providing feedback on the AI suggestion quality
- Viewing history of past AI suggestions for a passage

---

### Export

---

**US-019: Generate PDF Export**
As a user, I want to generate a PDF of my manuscript so that I can see my book as a tangible artifact and share it with colleagues.

*Persona context: The UX Lead calls export the "artifact moment" -- seeing your words in book format for the first time is psychologically powerful. The Competitor Analyst warns that DraftCrane's export will be compared against Atticus and Vellum output. The Target Customer said: "one click and I get something I could show to a publisher without embarrassment."*

API Endpoints: `POST /projects/:projectId/export` (body: `{ format: "pdf", scope: "full" | "chapter", chapterId?: string }`), `GET /export/:jobId` (poll for completion), `POST /export/:jobId/to-drive` (upload to Drive)

Acceptance Criteria:
- [ ] Given I am in a project with at least one chapter containing text, when I tap "Export" and select "PDF," then a generation process begins with a progress indicator: "Generating your PDF..."
- [ ] Given I am in a project, when I tap "Export" and select "Export This Chapter as PDF," then only the current chapter is exported as a PDF (single-chapter export with a title page showing book title + chapter title, but no table of contents)
- [ ] Given the PDF is generated (full book), when generation completes, then the PDF contains: a title page with the book title and author name, a table of contents with chapter titles, and all chapters in order with chapter titles as headings
- [ ] Given the PDF is generated, when I review formatting, then body text is in a readable serif font (e.g., Georgia or Crimson Text) at approximately 11pt with 1.5 line height, proper margins (20mm inside, 15mm outside, 15mm top, 20mm bottom), page numbers, and professional spacing that looks intentionally designed
- [ ] Given my project has no chapters with content, when I tap "Export PDF," then I see: "Add content to at least one chapter before exporting."
- [ ] Given the export takes more than 10 seconds, when the user is waiting, then the progress indicator continues with: "Generating your book. This may take a moment for large manuscripts."

Business Rules:
- PDF includes: title page (book title + author name), table of contents (chapter titles), all chapters in order. Empty chapters are excluded.
- PDF formatting uses a single default template with professional book-like typography (no customization in Phase 0)
- PDF page size: A5 (148mm x 210mm). Standard book trim size that makes the output look like a book, not a document.
- Export file naming: `{Book Title} - {YYYY-MM-DD}.pdf`. Special characters in the title are sanitized for filesystem compatibility.
- Export artifacts are staged in R2 before uploading to Drive (per Tech Lead's architecture)
- PDF generation approach requires ADR-004. Tech Lead's options: Cloudflare Browser Rendering, client-side, or Worker-side with external fallback (DocRaptor/Prince). If no approach meets the quality bar, PM has approved descoping to EPUB-only for Phase 0.

Out of Scope:
- Custom PDF templates or formatting options
- Cover page with images
- Headers/footers customization beyond page numbers
- Page break control
- Print-ready PDF with bleed and crop marks (Phase 3)
- Table of contents with clickable page numbers

---

**US-020: Generate EPUB Export**
As a user, I want to generate an EPUB of my manuscript so that I can read it on an e-reader or distribute it digitally.

*Persona context: Less immediately urgent than PDF per Target Customer priority ranking, but important for users who want to see their book on a Kindle or in Apple Books.*

API Endpoints: `POST /projects/:projectId/export` (body: `{ format: "epub" }`), `GET /export/:jobId`, `POST /export/:jobId/to-drive`

Acceptance Criteria:
- [ ] Given I am in a project with at least one chapter containing text, when I tap "Export" and select "EPUB," then an EPUB generation process begins with a progress indicator
- [ ] Given the EPUB is generated, when I open it in an e-reader (Apple Books, Kindle app), then all chapters are present, in order, with correct formatting preserved (bold, italic, headings, lists, block quotes)
- [ ] Given the EPUB is generated, when I review it, then it includes a title page and a navigable table of contents
- [ ] Given my project has no chapters with content, when I tap "Export EPUB," then I see: "Add content to at least one chapter before exporting."

Business Rules:
- EPUB must be valid EPUB 3.0 format
- EPUB uses a single default stylesheet (no customization in Phase 0)
- EPUB file naming: `{Book Title} - {YYYY-MM-DD}.epub` (matches PDF convention)
- Empty chapters are excluded from the export
- EPUB generation in a Worker is tractable (it is fundamentally a ZIP of XHTML per Tech Lead's assessment)

Out of Scope:
- Custom EPUB styling or CSS
- Cover image embedding
- Metadata editing (author bio, ISBN, publisher)
- MOBI/KPF format for Kindle (Phase 3)
- DRM or encryption

---

**US-021: Save Export to Google Drive**
As a user, I want my exported files automatically saved to my Book Folder in Google Drive so that I always have access to the latest export.

*Persona context: The UX Lead specifies that if Drive is connected, export saves to Drive with a "View in Drive" link and a "Download" option. The Target Customer wants to verify files are in Drive.*

API Endpoints: `POST /export/:jobId/to-drive` (uploads artifact from R2 to user's Drive Book Folder)

Acceptance Criteria:
- [ ] Given I trigger a PDF or EPUB export and my Google Drive is connected, when the file is generated, then it is automatically uploaded to the `_exports` subfolder in my Book Folder
- [ ] Given the upload completes, when I see the success notification, then it includes the file name, a "View in Drive" link, and a "Download" button for a local copy
- [ ] Given my Google Drive is not connected, when I trigger an export, then the file is generated and I am offered a local download only, with a prompt: "Connect Google Drive to save exports automatically."

Business Rules:
- Export files are saved to an `_exports` subfolder within the Book Folder (per Tech Lead's Drive file structure)
- Date-stamped filenames prevent overwriting previous exports, creating a natural version history in Drive
- If the Book Folder has been deleted from Drive, export to Drive fails with: "Your Book Folder can no longer be found. Please select a new Book Folder." Local download is still offered.

Out of Scope:
- Exporting to a user-selected folder (always Book Folder/_exports)
- Exporting to other cloud storage providers
- Email delivery of exports

---

**US-022: Download Export Locally**
As a user, I want to download my exported PDF or EPUB to my device so that I have a local copy.

*Persona context: The UX Lead notes that Safari handles downloads differently than Chrome -- files go to the Files app with subtle notification. For iPad users, Drive save with a direct link is the better primary experience, with local download as complementary.*

API Endpoints: `GET /export/:jobId` (returns signed R2 download URL when complete)

Acceptance Criteria:
- [ ] Given a PDF or EPUB has been generated, when I tap "Download," then the file is downloaded via the browser's native download mechanism (signed R2 URL)
- [ ] Given I am on an iPad, when I download, then the file is handled by iPadOS (saved to Files app or presented via share sheet)
- [ ] Given my Google Drive is not connected, when I generate an export, then local download is the primary (and only) delivery method

Business Rules:
- Local download is always available, regardless of Google Drive connection status
- If Drive is connected, both Drive save (US-021) and local download are available simultaneously
- Download URL is a time-limited signed R2 URL (1-hour expiry per Tech Lead's export architecture)

Out of Scope:
- AirDrop or other device-to-device sharing
- Sharing via link
- Print directly from DraftCrane

---

### Project Management

---

**US-023: Delete a Project**
As a user, I want to delete a book project I no longer need so that my project list stays clean and focused.

*Persona context: During Phase 0 validation testing, users may create exploratory projects. Without deletion, the experience degrades. The PM confirmed this feature with a caveat: "Deferred to Phase 0 only if time permits."*

API Endpoints: `PATCH /projects/:projectId` (set status to 'archived' -- soft delete)

Acceptance Criteria:
- [ ] Given I am viewing my projects, when I select "Delete Project" from the project settings, then a confirmation dialog appears: "Delete '[Project Title]'? Your files in Google Drive will not be deleted. This removes the project from DraftCrane only."
- [ ] Given I confirm deletion, when the process completes, then the project is removed from my project list (soft-deleted by setting status='archived' in D1), and all chapter files remain in my Google Drive Book Folder
- [ ] Given I cancel the deletion, when the dialog closes, then no changes are made
- [ ] Given I have only one project, when I delete it, then I am taken to the Book Setup screen to create a new project

Business Rules:
- Project "deletion" is a soft delete (status='archived' in D1 per Tech Lead's schema). Data is retained for potential recovery. Hard deletion is Phase 1+.
- Drive files (chapters and exports) are NEVER deleted by project deletion. The user retains full ownership of their content in Drive.
- Archived projects do not appear in the project list

Out of Scope:
- Recovering deleted projects via UI
- Hard deletion of D1 data
- Deletion of associated Drive files
- Bulk project deletion

---

## 2. Edge Cases & Error States

---

### Auth Edge Cases

| Scenario | Expected Behavior | Technical Detail |
|----------|-------------------|-----------------|
| User's Clerk session expires mid-editing | Auto-save attempts to persist content to IndexedDB. On next API call, dc-api returns 401 (`AUTH_REQUIRED`). Frontend shows: "Session expired, please sign in again." After re-authentication, IndexedDB buffer is compared with Drive version; if newer, user is prompted to restore. | Clerk JWT validation in dc-api middleware. IndexedDB write-ahead log preserves content. |
| User signs in on a new device while session is active elsewhere | Both sessions are valid. If both edit the same chapter, the second save triggers a version conflict (409). User sees conflict resolution prompt per US-015. | Optimistic versioning via `version` counter in D1. |
| Clerk service is unavailable | Sign-in/sign-up pages show: "Authentication service is temporarily unavailable. Please try again in a few minutes." User cannot access the app until Clerk recovers. | Clerk SDK returns error; frontend catches and displays message. |

---

### Google Drive Edge Cases

| Scenario | Expected Behavior | Technical Detail |
|----------|-------------------|-----------------|
| Google Drive is disconnected mid-editing session | Editor continues to function. Auto-save falls back to IndexedDB with "Saved locally only" indicator. Export shows: "Google Drive is not connected. Reconnect to save to your Book Folder." Local download offered as export fallback. | `DELETE /drive/connection` clears tokens. Subsequent Drive API calls fail; frontend detects and degrades gracefully. |
| Google Drive OAuth token expires mid-session | dc-api attempts silent token refresh using the stored refresh token. Refresh happens proactively (5 minutes before `token_expires_at`). If refresh fails, user sees: "Your Google Drive connection needs to be renewed. Click here to reconnect." Editor remains functional. | Token refresh logic in DriveService. Refresh token rotation per Google's policy. |
| User's Google Drive storage is full | Export upload to Drive fails. User sees: "Unable to save to Google Drive -- your Drive storage is full. Free up space or download the file locally." Local download is offered as fallback. | Drive API returns 403 with `storageQuotaExceeded`. Frontend offers local download. |
| Book Folder is deleted from Google Drive externally | On next Drive operation, dc-api receives 404. User sees: "Your Book Folder can no longer be found in Google Drive. Please select a new Book Folder." Existing D1 metadata is unaffected. | `GET /drive/folders/:folderId/children` returns 404. Frontend triggers folder re-creation flow. |
| Google Drive API rate limit is hit | dc-api retries with exponential backoff (up to 3 retries). If still failing: "Google Drive is temporarily unavailable. Your work is saved locally. Try again in a few minutes." | Drive API returns 429. dc-api respects `Retry-After` header. KV caching (60s TTL) reduces repeat calls. |
| User revokes DraftCrane access from Google Security Settings | On next Drive API call, dc-api receives 401 from Google. User sees: "Google Drive access has been revoked. Please reconnect your Google Drive." DraftCrane clears stored tokens and offers reconnection. | Google returns `invalid_grant`. DriveService clears tokens from D1, returns `DRIVE_ERROR` (502) to frontend. |

---

### Editor Edge Cases

| Scenario | Expected Behavior | Technical Detail |
|----------|-------------------|-----------------|
| Auto-save fails due to network loss | Persistent yellow warning bar: "Unable to save. Your changes are stored locally." Content preserved in IndexedDB. On reconnection (detected via `navigator.onLine` transition), auto-save resumes and flushes the IndexedDB queue. | IndexedDB write-ahead log. `online` event triggers flush. Exponential backoff retry: 2s, 4s, 8s. |
| Auto-save fails due to server error (500) | Retry with exponential backoff (2s, 4s, 8s, max 3 retries). After 3 failures, show persistent error bar. Content preserved in IndexedDB. | dc-api returns 500. Frontend retry logic with backoff. |
| User opens the same project in two browser tabs | Last-write-wins with conflict detection. Both tabs function independently. When one tab saves, the version increments. The other tab's next save receives a 409 (version conflict). That tab shows: "This chapter was modified in another tab. Reload latest / Overwrite." | Version field on `PUT /chapters/:chapterId/content`. Server compares client version to stored version. 409 on mismatch. |
| Browser crashes or iPad force-quits Safari | On next session, editor mount checks IndexedDB for unsaved content with timestamp newer than Drive version. If found: "We found unsaved changes from your last session. Restore them?" User can restore or discard. | IndexedDB stores { chapterId, content, timestamp } on every keystroke. Editor mount compares timestamps. |
| User pastes large amount of text (50,000+ words) | Editor accepts the paste. Performance may degrade. Chapter load time may exceed 5 seconds. No hard limit enforced. | Tech Lead's performance budget: < 5 seconds for chapters up to 50,000 words. Beyond that is not guaranteed but not blocked. |
| User pastes content with unsupported formatting | Unsupported formatting (tables, images, colored text, custom fonts) is silently stripped on paste. Only supported formatting is preserved. No user notification in Phase 0. | Editor library's paste handling + HTML sanitization with allowlist of safe tags. |
| iPad Safari suspends background tab | `visibilitychange` event fires before suspension, triggering immediate save. If Safari kills the tab before save completes, IndexedDB buffer has the latest content. | `document.addEventListener('visibilitychange', ...)`. `beforeunload` is unreliable on iPad Safari. |

---

### AI Rewrite Edge Cases

| Scenario | Expected Behavior | Technical Detail |
|----------|-------------------|-----------------|
| AI request fails (API error) | Bottom sheet shows: "AI is temporarily unavailable. Please try again." Original text unchanged. User can tap "Try Again" or "Discard." | dc-api returns 502 (`AI_ERROR`). No automatic retry for AI requests. |
| AI request times out (> 30 seconds with no streaming tokens) | Bottom sheet shows: "The AI request timed out. Please try again with a shorter selection." Original text unchanged. | SSE stream timeout. dc-api Worker unbound (30s CPU limit). |
| AI returns empty or malformed response | Treat as failure. Bottom sheet shows: "Something went wrong. Please try again." Log error for debugging. | AI response validation in dc-api before streaming to client. |
| User makes another text selection while AI is processing | The current AI request continues in the bottom sheet. The new selection does not interrupt. The user must dismiss the bottom sheet (Discard) before starting a new AI request. | Bottom sheet implements a focus trap. |
| AI returns content significantly longer or shorter than expected | Suggestion is shown in full (bottom sheet scrolls if needed). User decides via "Use This" or "Discard." | No truncation of AI output. |
| Network disconnects after AI request is sent | SSE stream breaks. Bottom sheet shows: "Connection lost. The AI response could not be received. Please check your connection and try again." | SSE `onerror` event handler. |
| AI rate limit is hit (10 req/min/user) | Bottom sheet shows: "You've made several requests quickly. Please wait a moment and try again." | dc-api returns 429 (`RATE_LIMITED`). KV-based rate limit counter. |

---

### Export Edge Cases

| Scenario | Expected Behavior | Technical Detail |
|----------|-------------------|-----------------|
| Export fails during generation | Show: "Export failed. Please try again." Include "Retry" button. Export job status set to 'failed' in D1. | `export_jobs.status = 'failed'`, `error_message` populated. |
| Export succeeds but Drive upload fails | Offer local download as fallback: "Your [PDF/EPUB] was generated but could not be saved to Google Drive. Download it here." File remains in R2. | `POST /export/:jobId/to-drive` fails. R2 artifact still available via signed URL. |
| User triggers multiple exports simultaneously | Queue exports. Show: "An export is already in progress. Please wait." | `export_jobs` table tracks status. Frontend checks for pending jobs. Rate limit: 5 req/min/user for export endpoints. |
| Export of very large manuscript (50+ chapters) | Progress indicator continues. Worker processes chapters sequentially to stay within 128MB memory limit. If generation exceeds 60 seconds, show extended message. | Worker subrequest batching (must stay under 1,000 per invocation). |
| Book Folder deleted before export upload | Export generates successfully (staged in R2). Drive upload fails with 404. User sees: "Your Book Folder was not found. Please select a new Book Folder or download the file locally." | `POST /export/:jobId/to-drive` receives 404 from Drive. R2 fallback available. |

---

## 3. Cross-Cutting Business Rules

---

### Project Management

| Rule | Decision | Status |
|------|----------|--------|
| Multiple projects per user? | Yes. No artificial limit. UI shows one project at a time in the Writing Environment with switching via dropdown/menu. | Decided |
| Maximum chapters per project? | No hard limit. Performance test at 50+ chapters. | Decided |
| Maximum chapter length? | No hard limit. Performance budget: < 5s load for 50,000 words. | Decided |
| Can a user delete a project? | Yes (US-023). Soft delete (status='archived'). Drive files preserved. PM caveat: include if time permits. | Decided |
| Project naming constraints? | Title required, non-empty, max 500 characters. Description optional, max 1,000 characters. | Decided |
| Chapter title constraints? | Non-empty, max 200 characters. Whitespace-only treated as empty, reverts to "Untitled Chapter." | Decided |

### Data & Storage

| Rule | Decision | Status |
|------|----------|--------|
| Where does manuscript content live? | Google Drive is canonical when connected. Chapter body content stored as HTML files in the user's Book Folder. D1 stores metadata only. IndexedDB is a local write-ahead log for crash protection. | Decided (aligned with PM Principle 2, Tech Lead architecture, Target Customer demand) |
| What file format for chapters? | HTML files in Google Drive. Preserves rich text formatting. Readable in any browser. | Decided |
| Data retention if user disconnects Drive? | D1 metadata retained. IndexedDB retains local content. User sees "Saved locally only" indicator with reconnection prompt. | Decided |
| Where does content go before Drive is connected ("Maybe Later")? | Requires ADR-005. See Unresolved Issues. Content is preserved in IndexedDB. Server-side temporary storage is TBD. | Needs ADR decision |
| What happens to data if user deletes their account? | Not addressed in Phase 0. Must be defined before beta launch. Recommendation: delete all D1 data, revoke OAuth tokens, leave Drive files untouched. | Needs product decision |
| Backup strategy for D1 data? | Cloudflare D1 automatic backups. Google Drive is user's own backup for content. No additional backup in Phase 0. | Decided |

### AI Usage

| Rule | Decision | Status |
|------|----------|--------|
| AI usage limits per user? | Unlimited during beta with cost monitoring. Rate limit: 10 requests/minute/user via KV counters. All interactions logged. | Decided |
| AI data privacy | No user content used for model training. AI requests sent to Anthropic Claude API. Input/output text NOT stored in D1 -- only metadata (input_chars, output_chars, model, latency_ms, accepted, instruction, attempt_number). | Decided |
| AI context scope (Phase 0) | Selected text + 500 chars surrounding context + user instruction. No full manuscript, no project metadata, no Book Blueprint. | Decided |
| AI model selection | Claude Sonnet for rewrite/expand. Consider Claude Haiku for simplify (per Tech Lead cost optimization). | Decided |
| Estimated AI cost per user | Approximately $0.003-0.01 per rewrite. At 50 rewrites/user/month: approximately $0.50/user/month. | Estimated |

### Export

| Rule | Decision | Status |
|------|----------|--------|
| Supported export formats | PDF and EPUB in Phase 0. If PDF quality cannot meet the bar, PM has approved EPUB-only as a fallback. | Decided |
| Export to Google Doc? | Listed in PRD section 6.8 but explicitly NOT in Phase 0 scope. Competitor Analyst suggested it as a fallback if PDF quality is poor. | Confirmed out of scope; evaluate if PDF fails |
| Export file naming | `{Book Title} - {YYYY-MM-DD}.pdf` / `.epub`. Special characters sanitized. | Decided |
| Export overwrite behavior | Date-stamped filenames prevent overwrite. Each export creates a new file. | Decided |
| Empty chapter handling in export | Empty chapters excluded. If ALL chapters empty, export blocked with message. | Decided |
| Single-chapter export? | Yes. "Export This Chapter as PDF" available alongside full-book export. | Decided |
| Export staging | Artifacts generated and staged in R2, then uploaded to Drive and/or available via signed URL for local download (1-hour expiry). | Decided |

### Platform & Performance

| Rule | Decision | Status |
|------|----------|--------|
| Primary test target | Safari on iPad (iPadOS 17+). Chrome 120+ and Firefox 120+ on desktop are secondary. | Decided |
| Minimum supported viewport | 768px width (iPad portrait). | Decided |
| Document load time | < 2 seconds for chapters under 10,000 words. < 5 seconds for chapters up to 50,000 words. | Decided |
| Input latency | < 100ms keystroke to character display. | Decided |
| Auto-save round trip | < 3 seconds from trigger to "Saved" confirmation. | Decided |
| AI first token latency | < 2 seconds from request to first visible SSE token. | Decided |
| JS bundle size | < 300 KB gzipped (initial), < 200 KB gzipped (editor chunk, lazy loaded). | Decided |
| iPhone support? | Not supported in Phase 0. Minimum viewport is 768px (iPad portrait). | Decided |
| Offline support? | Not supported as a feature in Phase 0. Brief connectivity loss handled by IndexedDB buffer + auto-save retry. Extended offline blocks AI, export, and Drive sync. The IndexedDB buffer provides limited offline resilience -- the user can type, but content is not durably saved until connectivity returns. | Decided |
| iPad Split View? | Not actively supported. DraftCrane must not break in Split View. Sidebar auto-collapses in narrow widths. Not optimized. | Decided |

---

## 4. Requirements Traceability Matrix

---

### Story-to-PRD-to-Principle-to-Metric Mapping

| User Story | PRD Phase 0 Feature | Project Instructions Principle | PM Success Metric | PM Kill/Gate Criteria Coverage |
|------------|---------------------|-------------------------------|-------------------|-------------------------------|
| US-001: Sign Up | Auth system | P2: User is not technical | Monthly active users | Gate: Core flow completion |
| US-002: Sign In | Auth system | P2: User is not technical | Monthly active users | Gate: Core flow completion |
| US-003: Sign Out | Auth system | P3: User's files are sacred | -- | -- |
| US-004: Session Persistence | Auth system | P2: User is not technical | Monthly active users | Gate: No critical usability blockers |
| US-005: Connect Google Drive | Drive integration | P3: User's files are sacred | % users exporting | Gate: Export validation |
| US-006: Create/Select Book Folder | Drive integration | P3: User's files are sacred | % users exporting | Gate: Export validation |
| US-007: View Files in Book Folder | Drive integration | P3: User's files are sacred | -- | -- |
| US-008: Disconnect Google Drive | Drive integration | P3: User's files are sacred (no lock-in) | -- | -- |
| US-009: Create a Project | Basic editor | P4: Structure reduces overwhelm | Avg chapters/user | Gate: Core flow completion |
| US-010: Create a Chapter | Basic editor | P4: Structure reduces overwhelm | Avg chapters/user | Kill: Chapter completion |
| US-011: Edit Chapter Content | Basic editor / Writing Environment | P1: Browser-first, iPad-native | Time to first chapter (<2h) | Kill: Chapter completion |
| US-012: Chapter Navigation | Basic editor / Writing Environment | P4: Structure reduces overwhelm | Avg chapters/user | Gate: No critical usability blockers |
| US-012A: Reorder Chapters | Basic editor | P4: Structure reduces overwhelm | -- | Gate: No critical usability blockers |
| US-013: Rename a Chapter | Basic editor | P4: Structure reduces overwhelm | -- | -- |
| US-014: Delete a Chapter | Basic editor | P4: Structure reduces overwhelm | -- | -- |
| US-015: Auto-Save | Basic editor | P3: User's files are sacred | Time to first chapter | Gate: No critical usability blockers |
| US-016: Select Text for AI Rewrite | Simple AI rewrite | P3: AI assists, never replaces | Time to first chapter | -- |
| US-017: Request AI Rewrite | Simple AI rewrite | P3: AI assists, never replaces | Time to first chapter, AI acceptance rate | -- |
| US-018: Accept/Reject/Try Again | Simple AI rewrite | P3: AI assists, never replaces | AI acceptance rate | -- |
| US-019: Generate PDF Export | PDF/EPUB export | P5: Publishing is a button | % users exporting (>40%) | Gate: Export validation |
| US-020: Generate EPUB Export | PDF/EPUB export | P5: Publishing is a button | % users exporting | Gate: Export validation |
| US-021: Save Export to Drive | PDF/EPUB export / Drive | P3: User's files are sacred | % users exporting | Gate: Export validation |
| US-022: Download Export Locally | PDF/EPUB export | P3: User's files are sacred (no lock-in) | % users exporting | -- |
| US-023: Delete a Project | Basic editor | P1: Ship smallest thing | -- | Gate: Core flow completion (clean up) |
| US-024: Word Count | Basic editor | P4: Structure reduces overwhelm | Time to first chapter | Kill: Chapter completion (measurability) |

### PM Gate Criteria Coverage Verification

| PM Phase 0 Gate Criterion | Covered By User Stories | Verification Method |
|---------------------------|------------------------|---------------------|
| 1. Prototype completion: all 5 features deployed | US-001 through US-024 cover all 5 feature areas | All stories have `status:done` |
| 2. Chapter completion signal: 1+ user completes a chapter in first session | US-010, US-011, US-015, US-024 | Observe test users. D1 query: chapters with word_count >= 500 created within 2 hours of user's first sign-in |
| 3. Export validation: 1+ user exports and confirms usable output | US-019, US-020, US-021, US-022 | export_jobs table with status='completed'. User feedback in test session. |
| 4. No critical usability blockers | US-011 (iPad editor), US-012 (sidebar), US-015 (auto-save), US-004 (session) | Manual QA on iPad Safari. Moderated test sessions. |
| 5. Potential signal: 1+ user articulates unprompted wish for Phase 1+ feature | All stories contribute data | Post-session interviews. Observation notes. |
| 6. Explicit go/no-go decision | All stories contribute data | PM reviews metrics against gate criteria |

### PM Kill Criteria Coverage Verification

| PM Kill Criterion | Data Source from User Stories | Measurement |
|-------------------|------------------------------|-------------|
| No user completes a chapter in first session | US-024 word count + D1 chapter metadata (word_count, created_at, updated_at) | Query: chapters where word_count >= 500 AND created within 2 hours of user's account creation |
| Fewer than 3/10 beta users return for second session | US-002 sign-in events + D1 session data | Query: distinct user logins by calendar date |
| No willingness-to-pay signal after 90 days | Not measurable via user stories (requires interviews/surveys) | PM-led user research |

---

## 5. Unresolved Issues

The following items represent genuine disagreements, unresolved architectural decisions, or product tensions that require human decision-making. These are NOT issues the BA can resolve by cross-referencing documents -- they require explicit decisions.

---

### Issue 1: Auto-Save Debounce Interval (2 seconds vs. 5 seconds)

**The disagreement:** The Tech Lead's Round 2 specifies 2-second debounce. The UX Lead's Step 6 specifies 5 seconds. My (BA) analysis favors 5 seconds. The PM has not stated a preference.

**Why it matters:** At 2 seconds, D1 write volume is approximately 2.5x higher, exceeding the free tier within 2 hours of 50-user concurrent use (per Tech Lead's own calculation). At 5 seconds, the free tier lasts approximately 5 hours. Both intervals are acceptable for data loss (IndexedDB covers the gap), so this is a cost and API pressure question, not a data safety question.

**My position:** 5 seconds. The maximum data loss window with IndexedDB is effectively zero within the browser lifetime regardless of debounce interval. The debounce interval only affects the lag between a keystroke and that content reaching Google Drive. Five seconds is imperceptible to users (the "Saved" indicator will always show "Saved" within a few seconds of stopping typing). Two seconds generates unnecessary API load with no measurable user benefit.

**Needs:** PM decision.

---

### Issue 2: Content Storage When Drive Is Not Connected ("Maybe Later" Scenario)

**The disagreement:** The Tech Lead proposes IndexedDB-only with a persistent warning banner. The UX Lead proposes server-side temporary storage. These have different implications: IndexedDB-only means content exists only in the user's browser (lost if browser data is cleared). Server-side storage means content is on DraftCrane's servers (contradicts "your files, your cloud" but is more durable).

**Why it matters:** The Target Customer explicitly said: "If my writing is sitting on some startup's server, that is not my files in my cloud." But IndexedDB-only means a user who taps "Maybe Later" and writes 5,000 words has that content in a browser storage mechanism that iOS can evict under storage pressure. Neither option is clean.

**My position:** IndexedDB as the primary buffer with a strong, persistent UI warning ("Your work is only saved on this device. Connect Google Drive to protect your work."). If ADR-005 determines that server-side temporary storage is feasible without violating the "no lock-in" principle, use it as an additional safety net -- but make the degraded state visible and mildly uncomfortable so users are motivated to connect Drive.

**Needs:** ADR-005 resolution.

---

### Issue 3: Voice Sample / Minimal AI Context in Phase 0

**The tension:** The Target Customer's most passionate request is that Phase 0 AI should have some awareness of her voice. She proposed a "voice sample" field during project setup -- paste a page of your best writing, and the AI uses it as a reference. This is a lightweight approximation of the Phase 1 Book Blueprint. The PM's scope definition excludes Book Blueprint features from Phase 0. The UX Lead's project setup has only title and description.

**Why it matters:** The Competitor Analyst and Target Customer both predict that Phase 0 AI will feel like "ChatGPT in a different window" without any voice context. The surrounding-context approach (500 chars before and after) helps with tone matching within a section but does not give the AI any knowledge of the author's overall voice. If every beta tester says "the AI does not sound like me," the AI rewrite feature fails to differentiate, even though the convenience of in-editor AI is real.

**My position:** This is a product scope decision, not a BA decision. The project description field (already in US-009, optional, max 1,000 characters) could serve as a minimal AI context source without adding a new "voice sample" feature. If the PM decides to include the project description in the AI prompt's system context (a backend change, not a UX change), that provides some voice/topic awareness without scope creep. But this is not my call.

**Needs:** PM decision on whether to include the project description (and/or an optional voice sample) in the AI rewrite prompt context for Phase 0.

---

### Issue 4: PDF Generation Approach and Fallback Plan

**The tension:** The Tech Lead identified five possible approaches for PDF generation, none with high confidence. The Competitor Analyst and Target Customer both say export quality is make-or-break for user confidence. The PM has pre-approved an EPUB-only fallback if PDF quality is unacceptable.

**Why it matters:** If the ADR-004 spike determines that no approach produces book-quality PDF within Worker constraints, the PM's fallback is EPUB-only. But the Target Customer ranked PDF as more important than EPUB. Shipping without PDF is a significant gap, even if technically justified.

**My position:** Prioritize the ADR-004 spike early in the development schedule. If PDF must be cut, the Competitor Analyst's suggestion to add "Export to Google Doc" as a bridge is worth considering -- it is technically simple (upload the HTML to Drive as a Google Doc), gives the user a format they trust, and they can print to PDF from Google Docs themselves. This is not a great experience, but it is better than no PDF path at all.

**Needs:** ADR-004 resolution. If PDF is cut, PM decision on whether "Export to Google Doc" replaces it.

---

### Issue 5: Folder Selection vs. Auto-Create Under `drive.file` Scope

**The tension:** The UX Lead's Round 2 revealed that `drive.file` scope prevents DraftCrane from browsing the user's Drive folder tree. The recommended approach (Option A: auto-create a folder) is simpler but means Marcus cannot select his existing "Book Project" folder. Option B (Google Picker API) allows folder selection but adds a dependency and a different visual style.

**Why it matters:** Marcus's persona specifically has an existing folder structure. The Target Customer wants to select her existing folder. Auto-creation is cleaner but alienates users who have organized Drive folders. However, even with Option B, DraftCrane still cannot see the files inside the selected folder (only DraftCrane-created files are visible under `drive.file` scope), which may confuse users who expect their existing files to appear.

**My position:** Ship with Option A (auto-create) for Phase 0. Add Option B (Google Picker API) as a fast-follow only if user testing reveals strong demand. The reason: even Option B creates a false expectation (user selects a folder expecting DraftCrane to see existing files, but it cannot). Auto-create is honest about what DraftCrane can access.

**Needs:** PM decision. If Option B is chosen, add a user story for folder selection via Google Picker API.

---

### Issue 6: Account Deletion Process

**The status:** Not defined for Phase 0. The PM says "define before beta launch." GDPR and privacy regulations may require it before any user data is collected.

**My recommendation:** Delete all D1 data (users, projects, chapters metadata, drive_connections, ai_interactions, export_jobs), revoke OAuth tokens via Google's API, and leave Drive files untouched. The user should be able to initiate this from Settings. This is a beta-launch blocker, not a Phase 0 development blocker -- but development should not begin without a timeline for when this will be implemented.

**Needs:** PM to confirm timeline and approach.

---

### Issue 7: "Chapter Completion" Definition for Kill Criteria

**The tension:** The PM defines "complete a chapter" as 500+ words that the author considers a recognizable draft. The Target Customer says a complete chapter is 3,000-5,000 words. The Target Customer also notes that her scenario (organizing existing material) is different from writing from scratch, and Phase 0 only supports writing from scratch.

**Why it matters:** If the kill criterion is applied rigidly (no user writes 500+ words from scratch in their first session), it may fail for reasons unrelated to the product's value (e.g., users needed to organize existing material, which Phase 0 cannot do). The PM acknowledged this risk in Round 2 and recommended recruiting users who "have a topic in mind and can write from knowledge."

**My position:** The kill criterion measurement should include qualitative context. A user who writes 400 words and says "this is great, I just ran out of time" is a different signal than a user who writes 400 words and says "this is frustrating, I went back to Google Docs." The 500-word threshold is a useful quantitative proxy but should not be the sole determinant.

**Needs:** PM to confirm that kill criterion evaluation includes qualitative assessment, not just a D1 word count query.

---

*End of Business Analyst Round 3 (Final) contribution. This document incorporates inputs from all Round 2 team contributions: Product Manager (gate criteria, kill criteria, scope decisions, pricing position), Technical Lead (API endpoints, data model, performance budgets, security model, three-tier save architecture), UX Lead (personas, interaction design, `drive.file` scope constraint, responsive behavior, accessibility, word count), Target Customer (priorities, pain points, voice preservation fears, pricing signals, "Maybe Later" concerns, existing-content gap), and Competitor Analyst (positioning, export quality bar, Phase 0 survival strategy, real competitor = existing chaos).*

*All terminology has been standardized: "Book Folder" (capitalized, two words), "Writing Environment" (capitalized), "bottom sheet" (lowercase), "suggestion chips" (lowercase), "Use This" / "Try Again" / "Discard" (button labels in quotes), "IndexedDB" (proper capitalization). API endpoint paths follow the Tech Lead's Round 2 conventions.*
