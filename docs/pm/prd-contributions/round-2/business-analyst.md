# Business Analyst Contribution -- PRD Rewrite (Round 2)

**Author:** Business Analyst
**Date:** February 6, 2026
**Scope:** Phase 0 only -- Auth, Google Drive Integration, Basic Editor, Simple AI Rewrite, PDF/EPUB Export

---

## Changes from Round 1

### Key Revisions

1. **Resolved 12 of 20 open questions.** Cross-referencing the Tech Lead's architecture, PM's gate criteria, UX Lead's design decisions, and Target Customer feedback allowed concrete decisions where Round 1 had "OPEN QUESTION" placeholders. Remaining 8 questions are genuinely blocked on ADR outcomes or product decisions.

2. **Added persona references (Diane Mercer, Marcus Chen) to all user stories.** The UX Lead's personas provide testable behavioral context. Each user story now names which persona's needs it primarily serves and why.

3. **Revised AI rewrite stories (US-016 through US-018) significantly.** The UX Lead designed a bottom-sheet interaction pattern with instruction chips and a "Try Again" option. The Tech Lead specified SSE streaming and surrounding context of 500 chars. The Target Customer flagged voice preservation as the make-or-break concern. Round 1's floating-toolbar-only model was too thin. Stories now reflect the richer interaction.

4. **Added US-023: Delete a Project.** Round 1 flagged this as an open question. The PM's kill criteria require measurable user engagement. The Target Customer described creating exploratory projects. Without project deletion, the dashboard becomes cluttered during validation testing. Added as a new story with safeguards.

5. **Added US-024: Word Count Display.** The Target Customer explicitly asked for progress tracking. The PM's success metric "time to first draft chapter" implies measurable word output. The UX Lead's personas both need to see tangible progress. A simple word count per chapter and per project is Phase 0 achievable and directly supports the "complete a chapter" kill criterion measurement.

6. **Revised auto-save timing from 2 seconds to 5 seconds.** The Tech Lead specified a 5-second debounce aligned with Drive API write patterns. Round 1 proposed 2 seconds, which would create excessive API calls. Aligned to Tech Lead's architecture.

7. **Revised data model: manuscript content lives in Google Drive, not D1.** Round 1 proposed D1 as the working copy with Drive for exports only. The Tech Lead's architecture places chapter body content in Google Drive (as HTML files) with D1 holding metadata only. The PM's Principle 2 (no lock-in) and the Target Customer's fear of data loss both support Drive as canonical. Round 1's recommendation was wrong; corrected.

8. **Added "Social login (Google)" to Phase 0 sign-up.** The UX Lead's journey specifies "Continue with Google" as the primary sign-in path. The Target Customer said "I sign in with Google, I expect it to work." Round 1 excluded social login entirely from Phase 0; this was a gap.

9. **Revised project creation to include an optional description field.** The UX Lead's Book Setup screen includes a brief description field. The Tech Lead's project schema does not have one, but this is a simple addition. The Target Customer needs the AI to have minimal context, and a 1-2 sentence description serves that purpose even without the full Book Blueprint.

10. **Revised export stories to include single-chapter export option.** The UX Lead noted Marcus would want to export individual chapters. The Target Customer ranked "seeing a chapter as a tangible artifact" as psychologically important. Added single-chapter export as an acceptance criterion.

11. **Added explicit "Try Again" to AI acceptance story.** Both the UX Lead and Target Customer described a workflow where the user iterates on AI suggestions before accepting. Round 1 had only Accept/Reject. Added "Try Again" as a third option per UX Lead's interaction design.

12. **Expanded edge cases with Tech Lead's specific failure modes.** Round 1's edge cases were behavioral descriptions. Round 2 adds specific technical failure modes from the Tech Lead (version conflicts via 409 responses, IndexedDB crash recovery, visibilitychange event for tab backgrounding, Worker CPU limits on export).

13. **Added cross-references to Tech Lead API endpoints throughout.** Each user story now references the specific API endpoint(s) that implement it, validating technical feasibility.

14. **Aligned traceability matrix with PM's gate criteria and kill criteria.** Round 1 traced stories to PRD principles. Round 2 adds explicit mapping to PM's Phase 0 gate criteria and kill criteria so we can verify that every gate criterion is covered by at least one testable story.

---

## 1. Phase 0 User Stories

---

### Auth

---

**US-001: Sign Up**
As a new user (Diane Mercer or Marcus Chen), I want to create an account so that I can access DraftCrane and begin writing.

_Persona context: Both Diane and Marcus expect frictionless sign-up. The UX Lead specifies "Continue with Google" as the primary path because every target user has a Google account. Diane will not tolerate a complex sign-up form. Marcus is suspicious of tools that seem complex._

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
- Google OAuth at sign-up requests authentication scopes only -- NOT Drive scopes (Drive connection is a separate, later step per UX Lead's journey design)
- One account per email address
- Password requirements for email/password are governed by Clerk's default policy

Out of Scope:

- Apple sign-in, Facebook sign-in, or other social providers -- evaluate for Phase 1+
- Email verification flow beyond Clerk defaults
- Team or organization accounts
- Invitation-based sign-up

---

**US-002: Sign In**
As a returning user (Diane or Marcus), I want to sign in to my existing account so that I can resume writing where I left off.

_Persona context: Marcus writes in bursts separated by weeks. He needs to return and be immediately back where he was. Diane writes from hotel lobbies and airport lounges -- sign-in must not be a barrier._

API Endpoints: `GET /users/me` (returns user profile + Drive connection status after auth)

Acceptance Criteria:

- [ ] Given I am on the sign-in page, when I tap "Continue with Google" and select my account, then I am authenticated and taken directly to the Writing Environment with my last-edited chapter loaded
- [ ] Given I choose email/password and enter valid credentials, when I submit, then I am authenticated and taken to the Writing Environment
- [ ] Given I enter incorrect credentials, when I submit, then I see a generic error message ("Invalid email or password") that does not reveal whether the email exists
- [ ] Given I have forgotten my password, when I tap "Forgot Password," then Clerk's password reset flow is initiated
- [ ] Given I am already signed in and navigate to the sign-in page, when the page loads, then I am redirected to the Writing Environment
- [ ] Given I sign in after a previous session, when the Writing Environment loads, then I see my last-edited chapter with scroll position restored (per UX Lead's continuity requirement)

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

_Persona context: Diane works on a shared iPad occasionally (client site). Secure sign-out matters._

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

_Persona context: Marcus opens DraftCrane after a 3-week gap. He must not be forced to re-authenticate and re-orient. Diane opens DraftCrane multiple times per day from hotel rooms._

Acceptance Criteria:

- [ ] Given I signed in previously and did not sign out, when I close and reopen Safari and navigate to DraftCrane, then I am still authenticated and taken directly to the Writing Environment with my last-edited chapter
- [ ] Given my session token has expired (after 30 days), when I navigate to DraftCrane, then I am redirected to the sign-in page
- [ ] Given I am authenticated on one browser tab, when I open DraftCrane in a second tab, then I am also authenticated without re-entering credentials

Business Rules:

- Session lifetime: **30 days.** (Resolved from Round 1 OQ-1. Matches typical SaaS products for low-friction re-engagement. Configured via Clerk.)
- Session duration is governed by Clerk configuration

Out of Scope:

- Cross-device session sync
- Session management UI (view active sessions, revoke sessions)

---

### Google Drive Integration

---

**US-005: Connect Google Drive via OAuth**
As a user (Diane or Marcus), I want to connect my Google Drive account so that my chapters are saved to my own cloud storage and my files stay mine.

_Persona context: The Target Customer (Dr. Sarah Chen) said Drive integration is the #1 reason she would try DraftCrane. Diane needs reassurance her IP is safe. Marcus wants access to his existing 100+ documents. The UX Lead designed this as a contextual prompt after project creation -- not blocking, but encouraged._

API Endpoints: `GET /drive/authorize` (returns Google OAuth URL), `GET /drive/callback` (exchanges code for tokens)

Acceptance Criteria:

- [ ] Given I have created a project and see the Drive connection banner, when I tap "Connect Google Drive," then I am redirected to Google's OAuth consent screen requesting the `drive.file` scope
- [ ] Given I am on the Google OAuth consent screen, when I grant permissions, then I am redirected back to DraftCrane and see the folder picker for selecting a Book Folder
- [ ] Given I am on the Google OAuth consent screen, when I deny permissions or cancel, then I am redirected back to DraftCrane with a message that Drive was not connected and an option to retry
- [ ] Given I have connected Google Drive, when I view the Settings menu, then I see my connected Google account email and a "Disconnect" option
- [ ] Given I am on an iPad in Safari, when I initiate the OAuth flow, then the redirect flow (not popup) completes without being blocked by Safari
- [ ] Given I tap "Maybe Later" on the Drive connection banner, when the banner dismisses, then I can continue writing without Drive connected and the option to connect remains available in Settings

Business Rules:

- OAuth tokens are stored server-side only, encrypted at rest in D1 using AES-256-GCM (per Tech Lead's security model), never exposed to the client
- DraftCrane requests `https://www.googleapis.com/auth/drive.file` scope only -- access limited to files created by or opened with DraftCrane (Resolved from Round 1 OQ-2. Confirmed by Tech Lead.)
- Drive connection is optional. The user can write and auto-save to the server without Drive connected. Drive sync begins when connected. (Per UX Lead's "Maybe Later" design.)
- Google OAuth at sign-up (US-001) and Google OAuth for Drive (US-005) are separate flows requesting different scopes (per UX Lead's trust design -- do not ask for Drive access at sign-in)

Out of Scope:

- Connecting multiple Google accounts simultaneously
- Other cloud storage providers (OneDrive, Dropbox, iCloud) -- not in any current phase
- Automatic re-authorization when scopes change

---

**US-006: Select Book Folder**
As a user, I want to select or create a folder in my Google Drive to use as my Book Folder so that all my chapters and exports are organized in one location I control.

_Persona context: Marcus already has a "Book Project" folder in Drive. He needs to select it. Diane does not have one and will create "Leadership Book." The UX Lead designed a bottom-sheet folder picker with "Create New Folder" at the top._

API Endpoints: `GET /drive/folders` (lists root folders), `GET /drive/folders/:folderId/children` (lists subfolders)

Acceptance Criteria:

- [ ] Given I have connected Google Drive, when the folder picker appears, then I see my Drive folder hierarchy with familiar folder icons, tap-to-open navigation, and a "Create New Folder" option
- [ ] Given I am in the folder picker, when I select an existing folder and tap "Select This Folder," then that folder is saved as my Book Folder and the picker closes with a confirmation message showing the folder path
- [ ] Given I am in the folder picker, when I tap "Create New Folder," type a name, and tap "Create," then the folder is created in my Drive and automatically selected as my Book Folder
- [ ] Given I have already selected a Book Folder, when I want to change it via Settings, then I can access the folder picker again and select a different folder
- [ ] Given I select a different Book Folder, when the change is confirmed, then the previous folder and its files remain untouched in my Drive and existing chapters are saved to the new folder on next auto-save

Business Rules:

- Book Folder is **per-project.** (Resolved from Round 1 OQ-3. Per-project allows different folders for different books. The Tech Lead's schema stores `drive_folder_id` on the `projects` table, confirming this.)
- The Book Folder is where chapter files (HTML) and export files (PDF/EPUB in an `_exports` subfolder) are saved
- DraftCrane does not delete or modify any pre-existing files in the selected folder
- The folder picker should show only folders, not files, to reduce visual noise

Out of Scope:

- Nested sub-folder management within the Book Folder
- Importing existing files from the Book Folder into the editor (Source Intelligence is Phase 2)
- File conflict resolution for files not created by DraftCrane

---

**US-007: View Files in Book Folder**
As a user, I want to see a listing of files in my Book Folder so that I can verify my chapters and exports are saved and understand what DraftCrane has stored.

_Persona context: The Target Customer said she wants to "verify my files are in Drive by opening Drive in another tab." This view provides that reassurance within DraftCrane itself, supporting PM Principle 2 (visible file ownership)._

API Endpoints: `GET /drive/folders/:folderId/children` (reused from folder picker, filtered for files)

Acceptance Criteria:

- [ ] Given I have a connected Book Folder, when I navigate to the Book Folder view (accessible from Settings), then I see a list of files showing file name, type icon, and last modified date
- [ ] Given there are files in my Book Folder, when the list loads, then files are sorted by last modified date (most recent first)
- [ ] Given my Book Folder is empty, when the list loads, then I see an empty state message: "No files yet. Your chapters will appear here as you write."
- [ ] Given I have exported files previously, when I view the file list, then exports are shown in the `_exports` subfolder and are distinguishable from chapter files

Business Rules:

- File listing is read-only in Phase 0 -- no renaming, deleting, or moving files from this view
- File listing reflects current Drive state (cached in KV with 60-second TTL per Tech Lead's caching strategy)

Out of Scope:

- File preview within DraftCrane
- File search or filtering
- Importing files from the Book Folder into the editor (Phase 2 Source Intelligence)
- Direct file download from this view (user can access via Drive)

---

**US-008: Disconnect Google Drive**
As a user, I want to disconnect my Google Drive from DraftCrane so that the application no longer has access to my Drive.

_Persona context: The Target Customer expressed concern about lock-in and startup disappearance. Disconnection must be clean and leave the user's files fully intact in their Drive._

API Endpoints: `DELETE /drive/connection` (revokes token, deletes from D1)

Acceptance Criteria:

- [ ] Given my Google Drive is connected, when I tap "Disconnect Google Drive" in Settings, then I see a confirmation dialog explaining: "Your files in Google Drive will not be deleted. You can reconnect at any time."
- [ ] Given I confirm disconnection, when the process completes, then the OAuth token is revoked via Google's API and deleted from DraftCrane's D1 storage
- [ ] Given I have disconnected, when I view Settings, then the Drive status shows "Not Connected" with an option to reconnect
- [ ] Given I have disconnected, when I attempt to export, then I see a message indicating Google Drive must be connected to save to Drive, with a local download fallback offered
- [ ] Given I have disconnected, when I look in my Google Drive, then all previously saved chapter files and exports remain in my Book Folder

Business Rules:

- Disconnecting does NOT delete any files from the user's Drive
- Disconnecting does NOT delete the user's DraftCrane account or project data in D1
- After disconnecting, auto-save continues to work via server storage (D1 metadata updates continue; content writes to Drive stop until reconnected)
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

_Persona context: The UX Lead designed a focused Book Setup screen with two fields: title and optional description. Marcus might hesitate on the title because his is not final -- helper text says "You can change this anytime." Diane might overthink the description -- it is marked optional._

API Endpoints: `POST /projects` (creates project, links to Drive folder)

Acceptance Criteria:

- [ ] Given I am a first-time user who has just signed up, when I am redirected after sign-up, then I see the Book Setup screen with a title field and an optional description field
- [ ] Given I enter a book title (e.g., "The Operational Leader"), when I tap "Create Book," then a project is created and I am redirected to the Writing Environment with one default chapter ("Chapter 1") created
- [ ] Given I enter a title and a brief description (1-2 sentences), when the project is created, then both title and description are stored in D1 (the description will inform future AI context)
- [ ] Given I attempt to create a project with an empty title, when I tap "Create Book," then I see a validation error asking me to enter a title
- [ ] Given I have created one project already, when I want to create another, then I can do so from the Settings or project menu (multiple projects are supported)
- [ ] Given I have created a project, when my project is stored, then the `projects` table in D1 contains my user_id, title, and status='active'

Business Rules:

- **Multiple projects per user are supported.** (Resolved from Round 1 OQ-4. No artificial limit. The Tech Lead's schema has `user_id` as a non-unique foreign key on `projects`, confirming multiple projects per user.)
- A newly created project has one default chapter ("Chapter 1") with an empty body
- Project title can be edited later from Settings
- Project title is required, non-empty, maximum 500 characters
- Project description is optional, maximum 1,000 characters
- The Book Setup screen appears only for new project creation, not on every sign-in (per UX Lead: returning users go directly to the Writing Environment)

Out of Scope:

- Project templates or starting structures
- Audience, promise/outcome, tone selection (Phase 1 Book Blueprint)
- Length target setting
- Project duplication or archival

---

**US-010: Create a Chapter**
As a user (Marcus), I want to create new chapters within my project so that I can organize my manuscript into logical sections.

_Persona context: Marcus thinks in chapters (he already has a 12-chapter mental structure). Diane will discover her structure as she writes. Both need the "+" button to be obvious and the naming to be instant and inline._

API Endpoints: `POST /projects/:projectId/chapters` (creates chapter record in D1 and corresponding HTML file in Google Drive)

Acceptance Criteria:

- [ ] Given I am in the Writing Environment, when I tap the "+" button at the bottom of the sidebar chapter list, then a new chapter is created and appears at the end of the chapter list with an editable title field active and "Untitled Chapter" pre-filled and selected
- [ ] Given a new chapter is created, when I type a name and tap Enter or tap into the editor, then the chapter is named and the editor loads the new empty chapter
- [ ] Given a new chapter is created and Google Drive is connected, when the chapter is created, then a corresponding HTML file is created in the Book Folder (e.g., "Chapter 4 - The Delegation Framework.html")
- [ ] Given I have multiple chapters, when I view the sidebar, then chapters are listed in order with their titles, with the active chapter highlighted

Business Rules:

- Chapters are ordered sequentially within a project (via `sort_order` column in D1)
- **No artificial limit on chapter count.** (Resolved from Round 1 OQ-5. Performance test at 50+ chapters. The Tech Lead's `idx_chapters_sort` unique index enforces ordering but does not limit count.)
- Chapter creation auto-saves project metadata to D1

Out of Scope:

- Chapter sections or sub-chapters
- Chapter templates
- Bulk chapter operations

---

**US-011: Edit Chapter Content**
As a user (Diane or Marcus), I want to write and edit text within a chapter so that I can compose my manuscript.

_Persona context: Diane works on iPad with virtual keyboard 80% of the time. Marcus uses a Smart Keyboard Folio. The UX Lead specifies 16-18pt base font, generous line height, max content width of 680-720pt. The editor must feel "as natural as Google Docs but with actual book structure."_

API Endpoints: `GET /chapters/:chapterId/content` (fetches HTML from Drive), `PUT /chapters/:chapterId/content` (writes HTML to Drive)

Acceptance Criteria:

- [ ] Given I have selected a chapter, when I tap in the content area, then a cursor appears and I can begin typing
- [ ] Given I am typing in the editor, when I type text, then it appears in real-time with no perceptible lag (< 100ms input latency)
- [ ] Given I am in the editor, when I use keyboard shortcuts (Cmd+B for bold, Cmd+I for italic, Cmd+Z for undo, Cmd+Shift+Z for redo), then the selected text is formatted or changes are undone/redone accordingly
- [ ] Given I am in the editor, when I use the formatting toolbar, then I can apply: Bold, Italic, Heading (H2, H3), Bulleted list, Numbered list, and Block quote
- [ ] Given I am on an iPad with a virtual keyboard, when the keyboard appears, then the editor resizes so that the cursor and active line remain visible above the keyboard (using the `visualViewport` API per UX Lead specification)
- [ ] Given I am on an iPad with a virtual keyboard, when I type and format text, then the formatting toolbar remains accessible and no controls are hidden behind the keyboard
- [ ] Given I press Cmd+S (external keyboard), when the shortcut fires, then an immediate save is triggered and the "Saved" indicator updates (no "you don't need to save" message -- just let it work, per UX Lead)
- [ ] Given I am editing, when chapter content loads from Google Drive, then the HTML preserves all supported formatting (bold, italic, headings, lists, block quotes)

Business Rules:

- The editor is a rich-text editor, not a code/markdown editor (target users are non-technical)
- Formatting is limited in Phase 0 to: Bold, Italic, H2, H3 (H1 is reserved for chapter title, auto-applied), Bulleted lists, Numbered lists, Block quote (added per UX Lead's spec, which included block quote)
- Chapter body content is stored as HTML files in Google Drive (per Tech Lead's data model). D1 stores only metadata (title, sort_order, word_count, drive_file_id).
- **Editor library selection requires ADR-001.** (Unresolved. Tech Lead recommends Tiptap as preliminary choice. Physical iPad testing required before decision.)
- Maximum content width in the editor: approximately 680-720pt (per UX Lead, "similar to a book page or Medium article")

Out of Scope:

- Inline comments or annotations (Phase 1+)
- Tables, images, or embedded media
- Footnotes or endnotes
- Custom fonts or typography controls
- Collaborative real-time editing
- Track changes
- Chapter reordering via drag-and-drop (moved to Phase 0 scope per UX Lead's writing flow design -- see US-012A)

---

**US-012: Chapter Navigation**
As a user, I want to navigate between chapters using a sidebar so that I can move through my manuscript quickly.

_Persona context: Marcus switches between chapters frequently (reading Chapter 1, then writing Chapter 2, then back). The UX Lead specifies scroll position restoration on return. Diane writes more linearly but needs to see her progress across chapters._

API Endpoints: `GET /projects/:projectId/chapters` (returns chapter list with metadata)

Acceptance Criteria:

- [ ] Given I am in the Writing Environment, when I view the sidebar, then I see all chapters listed in order with their titles and the active chapter visually highlighted
- [ ] Given I tap a chapter in the sidebar, when the chapter loads, then the editor displays that chapter's content within 2 seconds (for chapters under 10,000 words, per Tech Lead's performance budget)
- [ ] Given I have unsaved changes in the current chapter, when I tap a different chapter, then my changes are auto-saved before navigation occurs
- [ ] Given I switch from Chapter 2 to Chapter 1 and back to Chapter 2, when Chapter 2 reloads, then my scroll position in Chapter 2 is restored to where I left off
- [ ] Given I am on an iPad, when I interact with the sidebar, then it is usable via touch (tap to select, scroll to browse) with touch targets at least 48pt tall (per UX Lead's Apple HIG compliance)
- [ ] Given I have more chapters than fit in the sidebar viewport, when I scroll the sidebar, then all chapters are accessible

Business Rules:

- Only one chapter is displayed in the editor at a time
- **Sidebar responsive behavior** (Resolved from Round 1 OQ-7):
  - iPad Landscape (1024pt+ width): Sidebar is persistent, ~240-280pt wide, collapsible via toggle or swipe
  - iPad Portrait (768pt width): Sidebar is hidden by default, revealed by tapping hamburger icon or swiping from left edge, overlays the editor
  - Desktop (1200pt+ width): Sidebar is persistent
    (Per UX Lead's responsive specification.)

Out of Scope:

- Chapter grouping or sections (e.g., "Part 1")
- Search within chapters from the sidebar
- Chapter status indicators (draft, complete, etc.) -- evaluate for Phase 1

---

**US-012A: Reorder Chapters**
As a user (Marcus), I want to reorder chapters by dragging them in the sidebar so that I can restructure my manuscript as my thinking evolves.

_Persona context: The UX Lead's writing flow explicitly describes Marcus realizing "Chapter 4 should actually be Chapter 2" and using long-press-and-drag to reorder. This is a standard iPadOS interaction pattern. Round 1 excluded this as "Phase 1 Chapter Organization" but the UX Lead and Target Customer both demonstrate it is essential for basic manuscript management._

API Endpoints: `PATCH /projects/:projectId/chapters/reorder` (batch-updates sort_order)

Acceptance Criteria:

- [ ] Given I am in the sidebar with multiple chapters, when I long-press a chapter name, then the item visually lifts (indicating it is draggable) with haptic feedback if the browser supports it
- [ ] Given I am dragging a chapter, when I move it to a new position, then a line indicator shows the drop target between other chapters
- [ ] Given I release the dragged chapter at a new position, when the drop completes, then chapters renumber and the new order is saved via `PATCH /projects/:projectId/chapters/reorder`
- [ ] Given I am on an iPad, when I use long-press-and-drag, then the gesture works with standard iPadOS touch behavior and does not conflict with text selection

Business Rules:

- Reorder persists immediately to D1 (batch update of `sort_order` values)
- If Google Drive is connected, chapter file names in Drive are NOT renamed on reorder (only internal ordering changes; file names retain their creation-time chapter numbers to avoid Drive API churn)

Out of Scope:

- Moving chapters between projects
- Automatic chapter number prefixes in chapter titles

---

**US-013: Rename a Chapter**
As a user, I want to rename a chapter so that the sidebar reflects the actual content of each chapter.

_Persona context: Both personas start with "Untitled Chapter" and name chapters as content takes shape. The UX Lead specifies inline editing -- no dialog or modal._

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
- **Maximum chapter title length: 200 characters.** (Resolved from Round 1 OQ-8. Prevents sidebar layout issues.)

Out of Scope:

- Chapter numbering auto-generation (e.g., "Chapter 1: [Title]")
- Subtitle or description fields for chapters

---

**US-014: Delete a Chapter**
As a user, I want to delete a chapter I no longer need so that my manuscript structure stays clean.

_Persona context: Marcus experiments with chapter structures. He may create a chapter, decide it belongs elsewhere, and want to remove it. The UX Lead specifies confirmation with clear consequences._

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
- **No soft-delete in DraftCrane in Phase 0.** (Resolved from Round 1 OQ-9. Drive trash provides sufficient recovery.)

Out of Scope:

- Undo chapter deletion within DraftCrane
- Trash/archive view for deleted chapters
- Bulk chapter deletion

---

**US-015: Auto-Save**
As a user, I want my writing to be automatically saved so that I never lose work due to forgetting to save or a browser crash.

_Persona context: The Target Customer (Dr. Sarah Chen) listed losing work as her #1 fear. Marcus has lost work before by accidentally closing a Safari tab. Both the UX Lead and Target Customer emphasize that the "Saved" indicator is critical trust infrastructure, not a nice-to-have._

API Endpoints: `PUT /chapters/:chapterId/content` (writes HTML to Drive, updates metadata in D1)

Acceptance Criteria:

- [ ] Given I am typing in the editor, when I pause for 5 seconds (debounced), then the current chapter content is saved automatically to Google Drive (if connected) and metadata is updated in D1
- [ ] Given auto-save triggers, when the save succeeds, then a subtle status indicator shows "Saved" with a timestamp in the toolbar area (same position every time per UX Lead)
- [ ] Given auto-save triggers, when the save fails (network error, Drive API error), then a visible warning is displayed: "Unable to save. Retrying..." and the system retries with exponential backoff (2s, 4s, 8s, max 3 retries per Tech Lead spec)
- [ ] Given auto-save fails after 3 retries, when the user continues typing, then a persistent warning bar is shown: "Your changes have not been saved. Please check your connection." Content is preserved in IndexedDB.
- [ ] Given I switch to another app on iPad (tab goes to background), when the `visibilitychange` event fires, then an immediate save attempt is made (per Tech Lead's iPad Safari mitigation)
- [ ] Given my browser crashes or iPad force-quits Safari, when I next open DraftCrane and load the chapter, then the system checks IndexedDB for unsaved content newer than the Drive version and prompts me to restore or discard
- [ ] Given a save includes a version counter, when the server detects a version conflict (response 409), then the user sees: "This chapter was modified elsewhere. View changes / Overwrite / Reload." (per Tech Lead's conflict detection)

Business Rules:

- **Auto-save debounce: 5 seconds after last keystroke.** (Changed from Round 1's 2 seconds. Aligned with Tech Lead's specification to reduce Drive API calls.)
- Auto-save writes to Google Drive as the canonical store. D1 is updated with metadata (word_count, updated_at, version) on each save.
- If Google Drive is not connected, auto-save writes to DraftCrane's server (exact mechanism TBD in ADR-005), and content syncs to Drive when connected.
- IndexedDB serves as a local write-ahead log -- content is written to IndexedDB on every keystroke as crash protection (per Tech Lead). Maximum data loss window: 5 seconds (one debounce interval).
- **Maximum data loss on hard crash: 5 seconds of typing.** This is a known limitation, documented for users.
- Save status has exactly three visible states: "Saving...", "Saved [timestamp]", "Save failed" (per Tech Lead)

Out of Scope:

- Version history or revision tracking (Phase 2, collaboration)
- Conflict resolution between multiple browser tabs editing the same chapter (see Edge Cases)
- Offline writing mode (full offline support not in Phase 0; brief connectivity loss is handled by IndexedDB buffer + retry)

---

**US-024: Word Count Display** _(NEW in Round 2)_
As a user, I want to see a word count for the current chapter and the full project so that I can track my progress and know how much I have written.

_Persona context: The Target Customer explicitly asked: "How far along am I? How many words do I have?" The PM's kill criterion is "user completes a full chapter in first session" -- word count makes "complete" measurable to the user. The UX Lead's writing flow describes Diane needing to feel progress._

API Endpoints: `GET /projects/:projectId/chapters` (returns word_count per chapter in metadata), `PATCH /chapters/:chapterId` (updates word_count on save)

Acceptance Criteria:

- [ ] Given I am writing in the editor, when I look at the bottom of the editor area (or a designated status area), then I see the current chapter's word count updated in real-time as I type
- [ ] Given I view the sidebar, when I look at each chapter entry, then I see a subtle word count beneath or beside the chapter title (e.g., "2,340 words")
- [ ] Given I view the project-level information (e.g., in a header or settings), then I see a total word count across all chapters
- [ ] Given I select text in the editor, when the selection is active, then the word count area shows both the selection word count and total chapter word count (e.g., "142 / 3,400 words")

Business Rules:

- Word count is calculated client-side for real-time display and stored server-side (in D1 `chapters.word_count`) on each auto-save
- Word count counts words in body text only; headings and formatting markup are excluded
- Word count updates do not trigger auto-save on their own (they piggyback on content saves)

Out of Scope:

- Word count targets or goals per chapter (Phase 1)
- Progress percentage or estimated completion (Phase 1)
- Reading time estimates

---

### AI Rewrite

---

**US-016: Select Text for AI Rewrite**
As a user (Diane), I want to select a passage of text in the editor so that I can request an AI improvement of that specific content.

_Persona context: Diane has written a jargon-heavy paragraph about psychological safety. She selects it on her iPad and wants to simplify it. The UX Lead designed a floating action bar with "AI Rewrite" that appears near the selection, separate from the native iPadOS text menu. Marcus selects text using his Smart Keyboard (Shift+Cmd+Right to extend selection)._

Acceptance Criteria:

- [ ] Given I am in the editor, when I select a range of text (via touch selection on iPad or keyboard selection with external keyboard), then a DraftCrane floating action bar appears near the selection containing an "AI Rewrite" button (separate from the native Cut/Copy/Paste menu)
- [ ] Given the floating action bar is visible, when I see it, then the "AI Rewrite" button has a minimum touch target of 48x48pt (per UX Lead spec for in-motion thumb interactions)
- [ ] Given I have no text selected, when I look at the editor, then no AI action bar is visible
- [ ] Given I adjust my selection (drag handles to extend or shrink), when the selection changes, then the floating action bar repositions to track the selection bounds
- [ ] Given I am on an iPad, when I select text using touch, then the floating action bar does not interfere with iPadOS selection handles or the native context menu

Business Rules:

- AI actions are only available on text selections, not on the entire chapter at once (in Phase 0)
- **Selection length limits: minimum 1 word, maximum ~2,000 words.** (Resolved from Round 1 OQ-11. Maximum aligned with Tech Lead's content length limit of 2,000 words selected.) Selections exceeding the maximum show a message: "Selection is too long for AI rewrite. Please select a shorter passage."
- The floating action bar must not conflict with the native iPadOS text selection menu. Recommended approach per UX Lead: display the DraftCrane bar slightly above or below the native menu.

Out of Scope:

- AI rewrite of an entire chapter
- Custom/freeform AI prompts entered directly in the editor (the bottom sheet handles custom instructions)
- AI actions triggered from a menu or panel (floating action bar is the trigger; bottom sheet is the interaction surface)

---

**US-017: Request AI Rewrite**
As a user (Diane or Marcus), I want to request an AI rewrite of my selected text with a specific instruction so that I can improve my writing with AI assistance while maintaining my voice.

_Persona context: Diane taps "Simpler language" from the suggestion chips. Marcus types "more conversational, like a mentor talking to a peer." The Target Customer's #1 fear is AI stripping her voice. The UX Lead designed a bottom-sheet interaction with instruction chips that reduce the need to "know how to talk to AI."_

API Endpoints: `POST /ai/rewrite` (sends selected text + instruction + surrounding context to Claude API, returns SSE stream)

Acceptance Criteria:

- [ ] Given I have selected text and tapped "AI Rewrite," when the bottom sheet appears, then I see: my original text (quoted), an instruction text field with placeholder "How should I change this?", suggestion chips ("Simpler language", "More concise", "More conversational", "Stronger"), and a "Rewrite" button (disabled until I type or tap a chip)
- [ ] Given I tap a suggestion chip (e.g., "Simpler language"), when the chip highlights, then the instruction field fills with the chip text and the "Rewrite" button becomes active
- [ ] Given I type a custom instruction and tap "Rewrite," when the request is sent, then the system sends to `POST /ai/rewrite`: the selected text, the instruction, and surrounding context (500 characters before and after the selection, per Tech Lead's specification)
- [ ] Given the AI is processing, when I see the loading state, then I see "Rewriting..." with a progress animation, and the rewritten text appears via streaming (SSE) token by token, giving immediate feedback
- [ ] Given the AI request takes longer than 15 seconds without producing output, when the timeout is reached, then I see: "This is taking longer than expected. You can wait or cancel."
- [ ] Given the bottom sheet is open and I am on an iPad with the virtual keyboard active, when the bottom sheet appears, then it positions above the keyboard (or the keyboard dismisses first), and the editor scrolls so my selected text remains visible above the bottom sheet

Business Rules:

- AI requests are sent to Anthropic Claude API via `POST /ai/rewrite` on the dc-api Worker
- **The AI receives: selected text + instruction + surrounding context (500 chars before and after).** (Resolved from Round 1 OQ-12. Per Tech Lead's specification. Surrounding context preserves tone continuity.)
- The AI system prompt instructs: "You are a writing assistant. Rewrite the selected text according to the user's instruction. Preserve the original meaning. Match the surrounding tone. Return only the rewritten text." (Per Tech Lead's AI flow.)
- **AI usage limits: Unlimited during beta with monitoring.** (Resolved from Round 1 OQ-13. Per PM's risk mitigation. AI interactions are logged to `ai_interactions` table for cost tracking. Rate limit: 10 requests/minute/user per Tech Lead's rate limiting spec.)
- AI responses are streamed via Server-Sent Events (SSE) for perceived speed (per Tech Lead's architecture)
- Suggestion chips are Phase 0's lightweight version of Phase 1's Craft Buttons (per UX Lead)

Out of Scope:

- Rewrite history (seeing previous AI suggestions for the same selection)
- AI receiving full manuscript context or Book Blueprint (Phase 1)
- AI-generated content from scratch (only rewriting existing text)
- Voice/tone matching based on Book Blueprint (Phase 1)

---

**US-018: Accept, Reject, or Try Again on AI Suggestion**
As a user (Diane), I want to review the AI's suggestion and choose to accept it, reject it, or try again so that I remain in full control of my manuscript content.

_Persona context: The UX Lead details Diane's flow: she tries "Simpler language," is not satisfied, taps "Try Again" with "Simpler language and more concise. About half the length," gets a better result, and taps "Use This." The Target Customer demands: "I would need to see a before/after preview. I would need to be able to undo instantly."_

API Endpoints: `POST /ai/accept` (logs acceptance), `POST /ai/reject` (logs rejection), `POST /ai/rewrite` (for "Try Again" iterations)

Acceptance Criteria:

- [ ] Given the AI has returned a suggestion, when I see the result in the bottom sheet, then I see: the original text (in a collapsible section), the rewritten text (prominently displayed), and three action buttons: "Use This" (primary), "Try Again" (secondary), "Discard" (tertiary)
- [ ] Given I tap "Use This," when the replacement occurs, then the selected text in the editor is replaced with the AI suggestion, a brief visual highlight (1-second background color flash) orients me to the change, the bottom sheet closes, and auto-save triggers
- [ ] Given I tap "Discard," when the bottom sheet closes, then the original text remains unchanged in the editor and no trace of the AI interaction remains in the document
- [ ] Given I tap "Try Again," when the instruction input reappears, then my previous instruction is still in the field (editable) and I can modify it or tap "Rewrite" again to generate a new suggestion while the original text is always preserved
- [ ] Given I tap "Use This" and then immediately press Cmd+Z (undo), when undo executes, then the acceptance is undone and the original text is restored
- [ ] Given the AI suggestion is shown, when I tap outside the bottom sheet, then the bottom sheet closes and the original text remains (treated as discard)
- [ ] Given the bottom sheet is open on iPad, when I view the action buttons, then "Use This" and "Discard" are at least 48pt tall with minimum 16pt gap between them to prevent accidental mis-taps (per UX Lead's touch target spec)
- [ ] Given I accept a suggestion, when the interaction is logged, then `POST /ai/accept` records the interaction in `ai_interactions` table with: chapter_id, action, input_chars, output_chars, model, latency_ms, accepted=1

Business Rules:

- AI suggestions are NEVER applied without explicit user acceptance (per project instructions: "AI assists, never replaces" and "Every AI action requires user approval")
- "Try Again" does NOT lose the original text. The original is always preserved until "Use This" is explicitly tapped.
- Accepted suggestions become part of the document and are subject to auto-save
- Rejected/discarded suggestions are not stored (only metadata is logged)
- The "Use This" action IS undoable via Cmd+Z (critical per UX Lead: "Diane must never feel that accepting an AI rewrite is a permanent, irreversible decision")
- There is no limit on "Try Again" iterations (each iteration is a new `POST /ai/rewrite` call, subject to rate limiting)
- Suggestion chips and their behavior (in US-017) constitute Phase 0's replacement for Phase 1's full Craft Buttons

Out of Scope:

- Editing the AI suggestion text directly before accepting
- Rating or providing feedback on the AI suggestion quality
- Viewing history of past AI suggestions for a passage

---

### Export

---

**US-019: Generate PDF Export**
As a user (Diane), I want to generate a PDF of my manuscript so that I can see my book as a tangible artifact and share it with colleagues.

_Persona context: The UX Lead calls export the "artifact moment" -- seeing your words in book format for the first time is psychologically powerful. Diane wants to share a chapter PDF with a trusted colleague. The Target Customer said export can be basic "as long as it looks professional." The Competitor Analyst warns that DraftCrane's export will be compared against Atticus and Vellum output._

API Endpoints: `POST /projects/:projectId/export` (body: `{ format: "pdf" }`), `GET /export/:jobId` (poll for completion), `POST /export/:jobId/to-drive` (upload to Drive)

Acceptance Criteria:

- [ ] Given I am in a project with at least one chapter containing text, when I tap "Export" and select "PDF," then a generation process begins with a progress indicator: "Generating your PDF..."
- [ ] Given I am in a project, when I tap "Export" and select "Export This Chapter as PDF," then only the current chapter is exported as a PDF (single-chapter export)
- [ ] Given the PDF is generated (full book), when generation completes, then the PDF contains: a title page with the book title, a table of contents, and all chapters in order with chapter titles as headings
- [ ] Given the PDF is generated, when I review formatting, then body text is in a readable serif font with consistent margins, page numbers, and professional spacing that looks intentionally designed (not a web page printout)
- [ ] Given my project has no chapters with content, when I tap "Export PDF," then I see: "Add content to at least one chapter before exporting."
- [ ] Given the export takes more than 10 seconds, when the user is waiting, then the progress indicator continues with: "Generating your book. This may take a moment for large manuscripts."

Business Rules:

- PDF includes: title page, table of contents (chapter titles only, no page numbers in Phase 0), all chapters in order
- PDF formatting uses a single default template with professional book-like typography (no customization in Phase 0)
- **PDF page size: 5.5" x 8.5" (US Trade).** (Resolved from Round 1 OQ-15. Standard self-publishing trim size. More book-like than A4/Letter.)
- **Export file naming: `{Book Title} - {YYYY-MM-DD}.pdf`** (Resolved from Round 1 OQ-14. Append date to prevent accidental overwrite. Timestamp provides version history in Drive.)
- Empty chapters are excluded from the export
- Export artifacts are staged in R2 before uploading to Drive (per Tech Lead's architecture)
- **PDF generation approach requires ADR-004.** (Unresolved. Tech Lead's options: Cloudflare Browser Rendering, client-side, or Worker-side. The Competitor Analyst warns that output quality is critical -- "if the export looks like a printed web page, the user will lose confidence.")

Out of Scope:

- Custom PDF templates or formatting options
- Cover page with images
- Headers/footers customization beyond page numbers
- Page break control
- Print-ready PDF with bleed and crop marks (Phase 3)
- Table of contents with clickable page numbers (evaluate feasibility)

---

**US-020: Generate EPUB Export**
As a user, I want to generate an EPUB of my manuscript so that I can read it on an e-reader or distribute it digitally.

_Persona context: Less immediately urgent than PDF (per Target Customer priority ranking), but important for users who want to see their book on a Kindle or in Apple Books._

API Endpoints: `POST /projects/:projectId/export` (body: `{ format: "epub" }`), `GET /export/:jobId`, `POST /export/:jobId/to-drive`

Acceptance Criteria:

- [ ] Given I am in a project with at least one chapter containing text, when I tap "Export" and select "EPUB," then an EPUB generation process begins with a progress indicator
- [ ] Given the EPUB is generated, when I open it in an e-reader (Apple Books, Kindle app), then all chapters are present, in order, with correct formatting preserved (bold, italic, headings, lists)
- [ ] Given the EPUB is generated, when I review it, then it includes a title page and a navigable table of contents
- [ ] Given my project has no chapters with content, when I tap "Export EPUB," then I see: "Add content to at least one chapter before exporting."

Business Rules:

- EPUB must be valid EPUB 3.0 format
- EPUB uses a single default stylesheet (no customization in Phase 0)
- EPUB file naming: `{Book Title} - {YYYY-MM-DD}.epub` (matches PDF convention)
- Empty chapters are excluded from the export
- EPUB generation in a Worker is tractable (it is fundamentally a ZIP of XHTML -- per Tech Lead's assessment)

Out of Scope:

- Custom EPUB styling or CSS
- Cover image embedding
- Metadata editing (author bio, ISBN, publisher)
- MOBI/KPF format for Kindle (Phase 3)
- DRM or encryption

---

**US-021: Save Export to Google Drive**
As a user, I want my exported files automatically saved to my Book Folder in Google Drive so that I always have access to the latest export.

_Persona context: The UX Lead specifies that if Drive is connected, export saves to Drive with a "View in Drive" link and a "Download" option. The Target Customer wants to verify files are in Drive._

API Endpoints: `POST /export/:jobId/to-drive` (uploads artifact from R2 to user's Drive Book Folder)

Acceptance Criteria:

- [ ] Given I trigger a PDF or EPUB export and my Google Drive is connected, when the file is generated, then it is automatically uploaded to the `_exports` subfolder in my Book Folder
- [ ] Given the upload completes, when I see the success notification, then it includes the file name, a "View in Drive" link, and a "Download" button for local copy
- [ ] Given my Google Drive is not connected, when I trigger an export, then the file is generated and I am offered a local download only, with a prompt: "Connect Google Drive to save exports automatically."

Business Rules:

- Export files are saved to an `_exports` subfolder within the Book Folder (per Tech Lead's Drive file structure)
- Date-stamped filenames prevent overwriting previous exports, creating a natural version history in Drive
- If the Book Folder has been deleted from Drive, export to Drive fails with: "Your Book Folder can no longer be found. Please select a new Book Folder." Local download is still offered.

Out of Scope:

- Exporting to a user-selected folder (always Book Folder/\_exports)
- Exporting to other cloud storage providers
- Email delivery of exports

---

**US-022: Download Export Locally**
As a user, I want to download my exported PDF or EPUB to my device so that I have a local copy.

_Persona context: The UX Lead notes that Safari handles downloads differently than Chrome -- files go to the Files app with subtle notification. For iPad users, Drive save with a direct link is the better primary experience, with local download as complementary._

API Endpoints: `GET /export/:jobId` (returns signed R2 download URL when complete)

Acceptance Criteria:

- [ ] Given a PDF or EPUB has been generated, when I tap "Download," then the file is downloaded via the browser's native download mechanism (signed R2 URL)
- [ ] Given I am on an iPad, when I download, then the file is handled by iPadOS (saved to Files app or presented via share sheet)
- [ ] Given my Google Drive is not connected, when I generate an export, then local download is the primary (and only) delivery method

Business Rules:

- Local download is always available, regardless of Google Drive connection status
- If Drive is connected, both Drive save (US-021) and local download are available simultaneously
- Download URL is a time-limited signed R2 URL (per Tech Lead's export architecture)

Out of Scope:

- AirDrop or other device-to-device sharing
- Sharing via link
- Print directly from DraftCrane

---

### Project Management

---

**US-023: Delete a Project** _(NEW in Round 2)_
As a user, I want to delete a book project I no longer need so that my project list stays clean and focused.

_Persona context: During Phase 0 validation testing, users may create exploratory projects. Without deletion, the experience degrades. The Target Customer described the frustration of digital clutter._

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

| Scenario                                                        | Expected Behavior                                                                                                                                                                                                                                                                                                      | Technical Detail                                                                        |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| User's Clerk session expires mid-editing                        | Auto-save attempts to persist content to IndexedDB. On next API call requiring authentication, dc-api returns 401 (`AUTH_REQUIRED`). Frontend shows: "Session expired, please sign in again." After re-authentication, the IndexedDB buffer is compared with the Drive version; if newer, user is prompted to restore. | Clerk JWT validation in dc-api middleware. IndexedDB write-ahead log preserves content. |
| User signs in on a new device while session is active elsewhere | Both sessions are valid. If both edit the same chapter, the second save triggers a version conflict (409 from `PUT /chapters/:chapterId/content`). User sees conflict resolution prompt per US-015.                                                                                                                    | Optimistic versioning via `version` counter in D1.                                      |
| Clerk service is unavailable                                    | Sign-in/sign-up pages show: "Authentication service is temporarily unavailable. Please try again in a few minutes." User cannot access the app until Clerk recovers.                                                                                                                                                   | Clerk SDK returns error; frontend catches and displays message.                         |

---

### Google Drive Edge Cases

| Scenario                                                     | Expected Behavior                                                                                                                                                                                                                                                                          | Technical Detail                                                                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| Google Drive is disconnected mid-editing session             | Editor continues to function. Auto-save continues writing to server storage. Export and Drive operations show: "Google Drive is not connected. Reconnect to save to your Book Folder." User can continue writing without interruption.                                                     | `DELETE /drive/connection` clears tokens. Subsequent Drive API calls fail; frontend detects and degrades gracefully. |
| Google Drive OAuth token expires mid-session                 | dc-api attempts silent token refresh using the stored refresh token. Refresh happens proactively (5 minutes before `token_expires_at` per Tech Lead). If refresh fails, user sees: "Your Google Drive connection needs to be renewed. Click here to reconnect." Editor remains functional. | Token refresh logic in DriveService. Refresh token rotation per Google's policy.                                     |
| User's Google Drive storage is full                          | Export upload to Drive fails. User sees: "Unable to save to Google Drive -- your Drive storage is full. Free up space or download the file locally." Local download is offered.                                                                                                            | Drive API returns 403 with `storageQuotaExceeded`. Frontend offers local download fallback.                          |
| Book Folder is deleted from Google Drive externally          | On next Drive operation, dc-api receives 404 for the folder_id. User sees: "Your Book Folder can no longer be found in Google Drive. Please select a new Book Folder." Existing D1 metadata is unaffected.                                                                                 | `GET /drive/folders/:folderId/children` returns 404. Frontend triggers folder re-selection flow.                     |
| Google Drive API rate limit is hit                           | dc-api retries with exponential backoff (up to 3 retries). If still failing: "Google Drive is temporarily unavailable. Your work is saved locally. Try again in a few minutes."                                                                                                            | Drive API returns 429. dc-api respects `Retry-After` header. KV caching (60s TTL) reduces repeat calls.              |
| User revokes DraftCrane access from Google Security Settings | On next Drive API call, dc-api receives 401 from Google. User sees: "Google Drive access has been revoked. Please reconnect your Google Drive." DraftCrane clears stored tokens and restarts OAuth flow.                                                                                   | Google returns `invalid_grant`. DriveService clears tokens from D1, returns `DRIVE_ERROR` (502) to frontend.         |

---

### Editor Edge Cases

| Scenario                                         | Expected Behavior                                                                                                                                                                                                                                                                        | Technical Detail                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auto-save fails due to network loss              | Persistent yellow warning bar: "Unable to save. Your changes are stored locally." Content preserved in IndexedDB. On reconnection (detected via `navigator.onLine` transition), auto-save resumes and flushes the IndexedDB queue.                                                       | IndexedDB write-ahead log. `online` event triggers flush. Exponential backoff retry: 2s, 4s, 8s.                                                                                                                                                                                                     |
| Auto-save fails due to server error (500)        | Retry with exponential backoff (2s, 4s, 8s, max 3 retries). After 3 failures, show persistent error bar. Content preserved in IndexedDB.                                                                                                                                                 | dc-api returns 500. Frontend retry logic with backoff.                                                                                                                                                                                                                                               |
| User opens the same project in two browser tabs  | **Decision: Last-write-wins with conflict detection.** Both tabs function independently. When one tab saves, the version increments. The other tab's next save receives a 409 (version conflict). That tab shows: "This chapter was modified in another tab. Reload latest / Overwrite." | Version field on `PUT /chapters/:chapterId/content`. Server compares client version to stored version. 409 response on mismatch. (Resolved from Round 1 OQ-16. Blocking the second tab was considered but is difficult to implement reliably in Safari. Conflict detection is the pragmatic choice.) |
| Browser crashes or iPad force-quits Safari       | On next session, editor mount checks IndexedDB for unsaved content with timestamp newer than Drive version. If found: "We found unsaved changes from your last session. Restore them?" User can restore or discard.                                                                      | IndexedDB stores { chapterId, content, timestamp } on every keystroke. Editor mount compares timestamps.                                                                                                                                                                                             |
| User pastes large amount of text (50,000+ words) | Editor accepts the paste. Performance may degrade. Chapter load time may exceed 5 seconds. No hard limit enforced.                                                                                                                                                                       | Tech Lead's performance budget: < 5 seconds for chapters up to 50,000 words. Beyond that is not guaranteed but not blocked.                                                                                                                                                                          |
| User pastes content with unsupported formatting  | Unsupported formatting (tables, images, colored text, custom fonts) is stripped on paste. Only supported formatting is preserved. **No user notification in Phase 0.**                                                                                                                   | Editor library's paste handling + HTML sanitization with allowlist of safe tags (per Tech Lead's input validation). (Resolved from Round 1 OQ-17. Silent strip reduces friction.)                                                                                                                    |
| iPad Safari suspends background tab              | The `visibilitychange` event fires before suspension, triggering an immediate save attempt. If the save completes before suspension, no data is lost. If Safari kills the tab before save completes, IndexedDB buffer has the latest content (written on each keystroke).                | `document.addEventListener('visibilitychange', ...)` per Tech Lead mitigation. `beforeunload` is unreliable on iPad Safari.                                                                                                                                                                          |

---

### AI Rewrite Edge Cases

| Scenario                                                         | Expected Behavior                                                                                                                                                              | Technical Detail                                                                          |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| AI request fails (API error)                                     | Bottom sheet shows: "AI is temporarily unavailable. Please try again." Original text unchanged. User can tap "Try Again" or "Discard."                                         | dc-api returns 502 (`DRIVE_ERROR` equivalent for AI). No automatic retry for AI requests. |
| AI request times out (> 30 seconds with no streaming tokens)     | Bottom sheet shows: "The AI request timed out. Please try again with a shorter selection." Original text unchanged.                                                            | SSE stream timeout. dc-api Worker unbound (30s CPU limit per Tech Lead).                  |
| AI returns empty or malformed response                           | Treat as failure. Bottom sheet shows: "Something went wrong. Please try again." Log error for debugging.                                                                       | AI response validation in dc-api before streaming to client.                              |
| User makes another text selection while AI is processing         | The current AI request continues in the bottom sheet. The new selection does not interrupt. The user must dismiss the bottom sheet (Discard) before starting a new AI request. | Bottom sheet is modal-like (traps focus per UX Lead's accessibility spec).                |
| AI returns content significantly longer or shorter than expected | Suggestion is shown in full (bottom sheet scrolls if needed). User decides via "Use This" or "Discard."                                                                        | No truncation of AI output.                                                               |
| Network disconnects after AI request is sent                     | SSE stream breaks. Bottom sheet shows: "Connection lost. The AI response could not be received. Please check your connection and try again."                                   | SSE `onerror` event handler.                                                              |
| AI rate limit is hit (10 req/min/user)                           | Bottom sheet shows: "You've made several requests quickly. Please wait a moment and try again."                                                                                | dc-api returns 429 (`RATE_LIMITED`). KV-based rate limit counter per Tech Lead spec.      |

---

### Export Edge Cases

| Scenario                                       | Expected Behavior                                                                                                                                                                     | Technical Detail                                                                                                                                  |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Export fails during generation                 | Show: "Export failed. Please try again." Include "Retry" button. Log error. Export job status set to 'failed' in D1.                                                                  | `export_jobs.status = 'failed'`, `error_message` populated.                                                                                       |
| Export succeeds but Drive upload fails         | Offer local download as fallback: "Your [PDF/EPUB] was generated but could not be saved to Google Drive. Download it here." File remains in R2.                                       | `POST /export/:jobId/to-drive` fails. R2 artifact still available via signed URL.                                                                 |
| User triggers multiple exports simultaneously  | Queue exports. Show: "An export is already in progress. Please wait."                                                                                                                 | `export_jobs` table tracks status. Frontend checks for pending jobs before allowing new request. Rate limit: 5 req/min/user for export endpoints. |
| Export of very large manuscript (50+ chapters) | Progress indicator continues. Worker processes chapters sequentially to stay within 128MB memory limit (per Tech Lead). If generation exceeds 60 seconds, show extended message.      | Worker subrequest batching for Drive reads (must stay under 1,000 subrequests per invocation).                                                    |
| Book Folder deleted before export upload       | Export generates successfully (staged in R2). Drive upload fails with 404. User sees: "Your Book Folder was not found. Please select a new Book Folder or download the file locally." | `POST /export/:jobId/to-drive` receives 404 from Drive. R2 fallback.                                                                              |

---

## 3. Cross-Cutting Business Rules

---

### Project Management

| Rule                          | Decision                                                                                                                           | Status  |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Multiple projects per user?   | **Yes.** No artificial limit. Tech Lead schema supports it via non-unique user_id FK on projects table.                            | Decided |
| Maximum chapters per project? | **No hard limit.** Performance budget supports up to 50,000-word chapters and 50+ chapter lists. Flag for testing at 50+ chapters. | Decided |
| Maximum chapter length?       | **No hard limit.** Tech Lead performance budget: < 5s load for 50,000 words. No warning displayed.                                 | Decided |
| Can a user delete a project?  | **Yes** (US-023). Soft delete (status='archived'). Drive files preserved.                                                          | Decided |
| Project naming constraints?   | Title required, non-empty, max 500 characters. Description optional, max 1,000 characters.                                         | Decided |
| Chapter title constraints?    | Non-empty, max 200 characters. Whitespace-only treated as empty, reverts to "Untitled Chapter."                                    | Decided |

### Data & Storage

| Rule                                                | Decision                                                                                                                                                                                                                                        | Status                                                                     |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Where does manuscript content live?                 | **Google Drive is canonical.** Chapter body content stored as HTML files in the user's Book Folder. D1 stores metadata only (title, sort_order, word_count, drive_file_id, version). IndexedDB is a local write-ahead log for crash protection. | Decided (aligned with Tech Lead ADR-005 recommendation and PM Principle 2) |
| What file format for chapters?                      | **HTML files** in Google Drive. Preserves rich text formatting. Readable in any browser. Avoids Google Docs API dependency.                                                                                                                     | Decided (per Tech Lead)                                                    |
| Data retention if user disconnects Drive?           | D1 metadata retained. If user wrote content before connecting Drive (during "Maybe Later" period), that content is held server-side until Drive is connected. Drive disconnect only affects new saves and exports.                              | Decided                                                                    |
| What happens to data if user deletes their account? | **Not addressed in Phase 0.** Recommend: delete all D1 data, revoke OAuth tokens, leave Drive files untouched. Must be defined before beta launch.                                                                                              | Needs product decision                                                     |
| Backup strategy for D1 data?                        | Rely on Cloudflare D1 automatic backups. Google Drive is user's own backup for content. No additional DraftCrane backup in Phase 0.                                                                                                             | Decided (per Tech Lead)                                                    |

### AI Usage

| Rule                       | Decision                                                                                                                                                                                                                 | Status                  |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| AI usage limits per user?  | **Unlimited during beta** with cost monitoring. Rate limit: 10 requests/minute/user enforced via KV counters. All interactions logged to `ai_interactions` table for cost tracking. Establish paid limits before launch. | Decided                 |
| AI data privacy            | No user content used for model training (per PRD). AI requests sent to Anthropic Claude API. Input/output text NOT stored in D1 -- only metadata (input_chars, output_chars, model, latency_ms, accepted).               | Confirmed               |
| AI context scope (Phase 0) | Selected text + 500 chars surrounding context + instruction. No full manuscript, no project metadata, no Book Blueprint.                                                                                                 | Decided (per Tech Lead) |
| AI model selection         | Claude Sonnet for rewrite/expand. Consider Claude Haiku for simplify (per Tech Lead cost optimization).                                                                                                                  | Decided                 |
| Estimated AI cost per user | ~$0.003-0.01 per rewrite. At 50 rewrites/user/month: ~$0.50/user/month. (Per Tech Lead estimate.)                                                                                                                        | Estimated               |

### Export

| Rule                             | Decision                                                                                                                                      | Status                                             |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Supported export formats         | PDF and EPUB in Phase 0.                                                                                                                      | Confirmed                                          |
| Export to Google Doc?            | Listed in PRD section 6.8 but explicitly NOT in Phase 0 scope.                                                                                | Confirmed                                          |
| Export file naming               | `{Book Title} - {YYYY-MM-DD}.pdf` / `.epub`. Special characters in title sanitized for filesystem compatibility.                              | Decided                                            |
| Export overwrite behavior        | **Date-stamped filenames prevent overwrite.** Each export creates a new file. Previous exports preserved in Drive as natural version history. | Decided                                            |
| Empty chapter handling in export | Empty chapters excluded. If ALL chapters empty, export blocked with message.                                                                  | Decided                                            |
| Single-chapter export?           | **Yes.** "Export This Chapter as PDF" available alongside full-book export.                                                                   | Decided (per UX Lead and Target Customer feedback) |
| Export staging                   | Artifacts generated and staged in R2, then uploaded to Drive and/or available via signed URL for local download.                              | Decided (per Tech Lead)                            |

### Platform & Performance

| Rule                       | Decision                                                                                                                                                           | Status                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| Primary test target        | Safari on iPad (iPadOS 17+, per Tech Lead). Chrome 120+ and Firefox 120+ on desktop are secondary.                                                                 | Confirmed                             |
| Minimum supported viewport | 768px width (iPad portrait, per Tech Lead).                                                                                                                        | Confirmed                             |
| Document load time         | < 2 seconds for chapters under 10,000 words. < 5 seconds for chapters up to 50,000 words. (Per Tech Lead's performance budget.)                                    | Confirmed                             |
| Input latency              | < 100ms keystroke to character display.                                                                                                                            | Confirmed                             |
| Auto-save round trip       | < 3 seconds from trigger to "Saved" confirmation.                                                                                                                  | Confirmed (per Tech Lead)             |
| AI first token latency     | < 2 seconds from request to first visible SSE token.                                                                                                               | Confirmed (per Tech Lead)             |
| JS bundle size             | < 300 KB gzipped (initial), < 200 KB gzipped (editor chunk, lazy loaded).                                                                                          | Confirmed (per Tech Lead)             |
| iPhone support?            | **Not supported in Phase 0.** Minimum viewport is 768px (iPad portrait).                                                                                           | Decided (Resolved from Round 1 OQ-18) |
| Offline support?           | **Not supported in Phase 0.** Brief connectivity loss handled by IndexedDB buffer + auto-save retry. Extended offline blocks AI, export, and Drive sync.           | Decided                               |
| iPad Split View?           | **Not actively supported.** DraftCrane must not break in Split View (no layout explosions). Sidebar auto-collapses in narrow widths. Not optimized. (Per UX Lead.) | Decided                               |

---

## 4. Requirements Traceability Matrix

---

### Story-to-PRD-to-Principle-to-Metric Mapping

| User Story                         | PRD Phase 0 Feature                | Project Instructions Principle           | PM Success Metric           | PM Kill/Gate Criteria Coverage           |
| ---------------------------------- | ---------------------------------- | ---------------------------------------- | --------------------------- | ---------------------------------------- |
| US-001: Sign Up                    | Auth system                        | P2: User is not technical                | Monthly active users        | Gate: Core flow completion               |
| US-002: Sign In                    | Auth system                        | P2: User is not technical                | Monthly active users        | Gate: Core flow completion               |
| US-003: Sign Out                   | Auth system                        | P3: User's files are sacred              | --                          | --                                       |
| US-004: Session Persistence        | Auth system                        | P2: User is not technical                | Monthly active users        | Gate: No critical usability blockers     |
| US-005: Connect Google Drive       | Drive integration                  | P3: User's files are sacred              | % users exporting           | Gate: Export validation                  |
| US-006: Select Book Folder         | Drive integration                  | P3: User's files are sacred              | % users exporting           | Gate: Export validation                  |
| US-007: View Files in Book Folder  | Drive integration                  | P3: User's files are sacred              | --                          | --                                       |
| US-008: Disconnect Google Drive    | Drive integration                  | P3: User's files are sacred (no lock-in) | --                          | --                                       |
| US-009: Create a Project           | Basic editor                       | P4: Structure reduces overwhelm          | Avg chapters/user           | Gate: Core flow completion               |
| US-010: Create a Chapter           | Basic editor                       | P4: Structure reduces overwhelm          | Avg chapters/user           | Kill: Chapter completion                 |
| US-011: Edit Chapter Content       | Basic editor / Writing Environment | P5: Browser-first, iPad-native           | Time to first chapter (<2h) | Kill: Chapter completion                 |
| US-012: Chapter Navigation         | Basic editor / Writing Environment | P4: Structure reduces overwhelm          | Avg chapters/user           | Gate: No critical usability blockers     |
| US-012A: Reorder Chapters          | Basic editor                       | P4: Structure reduces overwhelm          | --                          | Gate: No critical usability blockers     |
| US-013: Rename a Chapter           | Basic editor                       | P4: Structure reduces overwhelm          | --                          | --                                       |
| US-014: Delete a Chapter           | Basic editor                       | P4: Structure reduces overwhelm          | --                          | --                                       |
| US-015: Auto-Save                  | Basic editor                       | P3: User's files are sacred              | Time to first chapter       | Gate: No critical usability blockers     |
| US-016: Select Text for AI Rewrite | Simple AI rewrite                  | P4: AI assists, never replaces           | Time to first chapter       | --                                       |
| US-017: Request AI Rewrite         | Simple AI rewrite                  | P4: AI assists, never replaces           | Time to first chapter       | --                                       |
| US-018: Accept/Reject/Try Again    | Simple AI rewrite                  | P4: AI assists, never replaces           | Time to first chapter       | --                                       |
| US-019: Generate PDF Export        | PDF/EPUB export                    | P5: Publishing is a button               | % users exporting (>40%)    | Gate: Export validation                  |
| US-020: Generate EPUB Export       | PDF/EPUB export                    | P5: Publishing is a button               | % users exporting           | Gate: Export validation                  |
| US-021: Save Export to Drive       | PDF/EPUB export / Drive            | P3: User's files are sacred              | % users exporting           | Gate: Export validation                  |
| US-022: Download Export Locally    | PDF/EPUB export                    | P3: User's files are sacred (no lock-in) | % users exporting           | --                                       |
| US-023: Delete a Project           | Basic editor                       | P1: Ship smallest thing                  | --                          | Gate: Core flow completion (clean up)    |
| US-024: Word Count                 | Basic editor                       | P4: Structure reduces overwhelm          | Time to first chapter       | Kill: Chapter completion (measurability) |

### PM Gate Criteria Coverage Verification

| PM Phase 0 Gate Criterion                                                  | Covered By User Stories                                                      | Verification Method                                                                                          |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1. Prototype completion: all 5 features deployed                           | US-001 through US-022 cover all 5 feature areas                              | All stories have `status:done`                                                                               |
| 2. Chapter completion signal: 1+ user completes a chapter in first session | US-010, US-011, US-015, US-024                                               | Observe test users. D1 query: chapters with word_count >= 500 created within 2 hours of user's first sign-in |
| 3. Export validation: 1+ user exports and confirms usable output           | US-019, US-020, US-021, US-022                                               | export_jobs table with status='completed'. User feedback in test session.                                    |
| 4. No critical usability blockers                                          | US-011 (iPad editor), US-012 (sidebar), US-015 (auto-save), US-004 (session) | Manual QA on iPad Safari. Moderated test sessions.                                                           |
| 5. Explicit go/no-go decision                                              | All stories contribute data                                                  | PM reviews metrics against gate criteria                                                                     |

### PM Kill Criteria Coverage Verification

| PM Kill Criterion                                    | Data Source from User Stories                                                | Measurement                                                                                   |
| ---------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| No user completes a chapter in first session         | US-024 word count + D1 chapter metadata (word_count, created_at, updated_at) | Query: chapters where word_count >= 500 AND created within 2 hours of user's account creation |
| Fewer than 3/10 beta users return for second session | US-002 sign-in events + D1 session data                                      | Query: distinct user logins by calendar date                                                  |
| No willingness-to-pay signal after 90 days           | Not measurable via user stories (requires interviews/surveys)                | PM-led user research                                                                          |

---

## 5. Summary of Open Questions

The following questions remain unresolved and require product or ADR decisions before the corresponding user stories can be considered "Ready" per the Definition of Ready:

| #      | Question                                                                                                       | Relevant Stories | Blocked On              | Recommendation                                                                                                               |
| ------ | -------------------------------------------------------------------------------------------------------------- | ---------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| OQ-6   | Which editor library? (Tiptap vs. Lexical)                                                                     | US-011, US-016   | ADR-001 (Tech Lead)     | Build 2-day spike testing both on physical iPad. Tech Lead recommends Tiptap.                                                |
| OQ-10  | What happens to content written before Drive is connected ("Maybe Later" scenario)?                            | US-005, US-015   | ADR-005 (Data Model)    | Store in D1 temporarily; sync to Drive on connection. Requires defining the D1-to-Drive migration path.                      |
| OQ-15A | PDF generation approach?                                                                                       | US-019           | ADR-004 (Tech Lead)     | Tech Lead recommends: EPUB in Worker, PDF via Cloudflare Browser Rendering with client-side fallback. Needs 3-day spike.     |
| OQ-19  | Account deletion process?                                                                                      | --               | Product decision        | Must define before beta launch. Not a Phase 0 development blocker but a beta-launch blocker.                                 |
| OQ-21  | What does "professional" PDF quality mean specifically?                                                        | US-019           | PM + Tech Lead          | Competitor Analyst warns output will be compared to Atticus/Vellum. PM should define 2-3 reference books as quality targets. |
| OQ-22  | Google sign-in for authentication only: does Clerk's Google OAuth conflict with the separate Drive OAuth?      | US-001, US-005   | Technical investigation | Two separate OAuth flows (Clerk for auth, DraftCrane for Drive) with different scopes. Verify no token/session conflicts.    |
| OQ-23  | How is content handled when Drive is disconnected mid-edit (writes already going to Drive, now Drive is gone)? | US-008, US-015   | ADR-005                 | Auto-save must gracefully degrade. Recommend: continue saving to server-side storage, prompt user to reconnect.              |
| OQ-24  | Export quality for single-chapter PDF: does it include title page and TOC, or just the chapter content?        | US-019           | Product decision        | Recommend: single-chapter export includes a title page (book title + chapter title) but no TOC.                              |

### Questions Resolved Since Round 1

| Former # | Question                               | Resolution                                           | Decided By                                           |
| -------- | -------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------- |
| OQ-1     | Session lifetime                       | 30 days                                              | PM alignment with SaaS norms                         |
| OQ-2     | Google Drive API scopes                | `drive.file` scope only                              | Tech Lead confirmed                                  |
| OQ-3     | Book Folder per-project or per-account | Per-project                                          | Tech Lead schema (drive_folder_id on projects table) |
| OQ-4     | Multiple projects per user             | Yes, no limit                                        | Tech Lead schema + PM validation needs               |
| OQ-5     | Maximum chapters per project           | No hard limit; test at 50+                           | Tech Lead performance budgets                        |
| OQ-7     | Sidebar behavior on narrow screens     | Collapsible; portrait=hidden, landscape=persistent   | UX Lead responsive spec                              |
| OQ-8     | Maximum chapter title length           | 200 characters                                       | BA recommendation accepted                           |
| OQ-9     | Soft-delete for chapters               | No (hard delete in D1; Drive file trashed)           | Drive trash provides recovery                        |
| OQ-11    | AI selection length limits             | Min 1 word, max ~2,000 words                         | Tech Lead content length limits                      |
| OQ-12    | AI context scope                       | 500 chars surrounding context                        | Tech Lead AI flow spec                               |
| OQ-13    | AI usage limits                        | Unlimited in beta; 10 req/min rate limit; monitoring | PM + Tech Lead                                       |
| OQ-14    | Export file naming                     | Date-stamped: `{Title} - {YYYY-MM-DD}.ext`           | BA recommendation accepted                           |
| OQ-16    | Two tabs same project                  | Conflict detection (409) with user prompt            | Tech Lead versioning + pragmatism                    |
| OQ-17    | Notify on paste format stripping       | Silent strip in Phase 0                              | BA recommendation accepted                           |
| OQ-18    | iPhone support                         | Not in Phase 0 (768px minimum)                       | Tech Lead + UX Lead                                  |
| OQ-20    | Project deletion                       | Yes, soft delete (US-023)                            | Round 2 addition                                     |

---

_End of Business Analyst Round 2 contribution. This document incorporates inputs from all Round 1 team contributions: Product Manager (gate criteria, kill criteria, phase definitions), Technical Lead (API endpoints, data model, performance budgets, security model), UX Lead (personas, interaction design, responsive behavior, accessibility), Target Customer (priorities, pain points, fears), and Competitor Analyst (positioning context, export quality bar)._
