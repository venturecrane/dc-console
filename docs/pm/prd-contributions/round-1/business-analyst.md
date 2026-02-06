# Business Analyst Contribution -- PRD Rewrite (Round 1)

**Author:** Business Analyst
**Date:** February 6, 2026
**Scope:** Phase 0 only -- Auth, Google Drive Integration, Basic Editor, Simple AI Rewrite, PDF/EPUB Export

---

## 1. Phase 0 User Stories

---

### Auth

---

**US-001: Sign Up**
As a new user, I want to create an account so that I can access DraftCrane and begin writing.

Acceptance Criteria:
- [ ] Given I am on the DraftCrane landing page, when I click "Sign Up," then I am presented with a Clerk-hosted sign-up flow
- [ ] Given I complete the sign-up form with a valid email and password, when I submit, then my account is created and I am redirected to the main application dashboard
- [ ] Given I attempt to sign up with an email already registered, when I submit, then I see an error message stating the email is already in use
- [ ] Given I attempt to sign up with a password that does not meet minimum requirements, when I submit, then I see a specific error message describing the password requirements
- [ ] Given I am on an iPad using Safari, when I complete sign-up, then the flow is fully functional with no layout or input issues

Business Rules:
- Authentication is handled by Clerk (per project instructions tech stack)
- One account per email address
- Password requirements are governed by Clerk's default policy

Out of Scope:
- Social login (Google, Apple, etc.) -- evaluate for Phase 1+
- Email verification flow beyond Clerk defaults
- Team or organization accounts
- Invitation-based sign-up

---

**US-002: Sign In**
As a returning user, I want to sign in to my existing account so that I can access my projects and continue writing.

Acceptance Criteria:
- [ ] Given I am on the sign-in page, when I enter valid credentials and submit, then I am authenticated and redirected to the dashboard showing my projects
- [ ] Given I enter an incorrect password, when I submit, then I see a generic error message ("Invalid email or password") that does not reveal whether the email exists
- [ ] Given I enter a non-existent email, when I submit, then I see the same generic error message
- [ ] Given I have forgotten my password, when I click "Forgot Password," then Clerk's password reset flow is initiated
- [ ] Given I am already signed in and navigate to the sign-in page, when the page loads, then I am redirected to the dashboard

Business Rules:
- Session is created upon successful authentication
- Failed login attempts are rate-limited (Clerk default behavior)

Out of Scope:
- Multi-factor authentication (MFA) -- evaluate for Phase 1+
- Single sign-on (SSO) / SAML
- "Remember this device" functionality beyond Clerk defaults

---

**US-003: Sign Out**
As a signed-in user, I want to sign out so that my account is secured when I am done working.

Acceptance Criteria:
- [ ] Given I am signed in, when I click "Sign Out" from the user menu, then my session is terminated and I am redirected to the sign-in page
- [ ] Given I have signed out, when I attempt to navigate to any authenticated page via URL, then I am redirected to the sign-in page
- [ ] Given I have signed out, when I press the browser back button, then I see the sign-in page (not cached authenticated content)
- [ ] Given I have unsaved changes in the editor, when I click "Sign Out," then my content is auto-saved before the session is terminated

Business Rules:
- Sign-out invalidates the session server-side, not just client-side
- All cached user data is cleared from the browser on sign-out

Out of Scope:
- "Sign out of all devices" functionality
- Session timeout warnings / automatic sign-out after inactivity (evaluate for Phase 1)

---

**US-004: Session Persistence**
As a user, I want my session to persist across browser restarts so that I do not have to sign in every time I open DraftCrane.

Acceptance Criteria:
- [ ] Given I signed in previously and did not sign out, when I close and reopen the browser and navigate to DraftCrane, then I am still authenticated and taken directly to the dashboard
- [ ] Given my session token has expired, when I navigate to DraftCrane, then I am redirected to the sign-in page
- [ ] Given I am authenticated on one browser tab, when I open DraftCrane in a second tab, then I am also authenticated in the second tab without re-entering credentials

Business Rules:
- Session duration is governed by Clerk configuration defaults
- **OPEN QUESTION:** What should the session lifetime be? 7 days? 30 days? This needs a product decision.

Out of Scope:
- Cross-device session sync
- Session management UI (view active sessions, revoke sessions)

---

### Google Drive Integration

---

**US-005: Connect Google Drive via OAuth**
As a user, I want to connect my Google Drive account so that DraftCrane can read and write files in my Drive.

Acceptance Criteria:
- [ ] Given I am on the dashboard and have not connected Google Drive, when I click "Connect Google Drive," then I am redirected to Google's OAuth consent screen
- [ ] Given I am on the Google OAuth consent screen, when I grant the requested permissions, then I am redirected back to DraftCrane and see a confirmation that my Drive is connected
- [ ] Given I am on the Google OAuth consent screen, when I deny permissions or cancel, then I am redirected back to DraftCrane and see a message that Drive was not connected, with an option to retry
- [ ] Given I have connected Google Drive, when I view the dashboard, then I see a visual indicator showing my Drive is connected (e.g., my Google account email)
- [ ] Given I am on an iPad in Safari, when I initiate the OAuth flow, then the popup or redirect completes without being blocked by Safari's pop-up blocker

Business Rules:
- OAuth tokens are stored server-side only, never exposed to the client (per project instructions security requirements)
- DraftCrane requests only the minimum required Drive scopes (file read/write within selected folder)
- **OPEN QUESTION:** What specific Google Drive API scopes are required? `drive.file` scope (only files created/opened by DraftCrane) vs. broader `drive.readonly` + `drive` scope?

Out of Scope:
- Connecting multiple Google accounts simultaneously
- Other cloud storage providers (OneDrive, Dropbox, iCloud) -- these are not in any current phase
- Automatic re-authorization when scopes change

---

**US-006: Select Book Folder**
As a user, I want to select (or create) a folder in my Google Drive to use as my Book Folder so that all DraftCrane files are organized in one location.

Acceptance Criteria:
- [ ] Given my Google Drive is connected, when I am prompted to select a Book Folder, then I see a folder picker showing my Drive's folder hierarchy
- [ ] Given I am in the folder picker, when I select an existing folder and confirm, then that folder is saved as my Book Folder and I see it displayed on the dashboard
- [ ] Given I am in the folder picker, when I choose to create a new folder, then I can name it, it is created in my Drive, and it is set as my Book Folder
- [ ] Given I have already selected a Book Folder, when I want to change it, then I can access the folder picker again and select a different folder
- [ ] Given I select a different Book Folder, when the change is confirmed, then the previous folder and its files remain untouched in my Drive

Business Rules:
- Each project is associated with exactly one Book Folder
- The Book Folder is where export files (PDF, EPUB) are saved
- DraftCrane does not delete or modify any pre-existing files in the selected folder
- **OPEN QUESTION:** Is the Book Folder per-project or per-account? If per-project, can two projects share the same Book Folder?

Out of Scope:
- Nested sub-folder management within the Book Folder
- Syncing existing manuscript files from the Book Folder back into DraftCrane (Source Intelligence is Phase 2)
- File conflict resolution for files not created by DraftCrane

---

**US-007: View Files in Book Folder**
As a user, I want to see a listing of files in my Book Folder so that I can verify my exports and understand what DraftCrane has stored.

Acceptance Criteria:
- [ ] Given I have a connected Book Folder, when I navigate to the Book Folder view, then I see a list of files showing file name, type, and last modified date
- [ ] Given there are files in my Book Folder, when the list loads, then files are sorted by last modified date (most recent first)
- [ ] Given my Book Folder is empty, when the list loads, then I see an empty state message (e.g., "No files yet. Export your first chapter!")
- [ ] Given I have exported files previously, when I view the file list, then I can distinguish between DraftCrane-generated files and other files

Business Rules:
- File listing is read-only in Phase 0 -- no renaming, deleting, or moving files from this view
- File listing reflects current Drive state (may need a refresh mechanism)

Out of Scope:
- File preview within DraftCrane
- File search or filtering
- Importing files from the Book Folder into the editor (Phase 2 Source Intelligence)
- Direct file download from this view (user can download via Drive)

---

**US-008: Disconnect Google Drive**
As a user, I want to disconnect my Google Drive from DraftCrane so that the application no longer has access to my Drive.

Acceptance Criteria:
- [ ] Given my Google Drive is connected, when I click "Disconnect Google Drive" in settings, then I see a confirmation dialog explaining what will happen
- [ ] Given I confirm disconnection, when the process completes, then the OAuth token is revoked server-side and deleted from DraftCrane's storage
- [ ] Given I have disconnected, when I view the dashboard, then the Drive status shows "Not Connected" with an option to reconnect
- [ ] Given I have disconnected, when I attempt to export, then I see a message indicating that Google Drive must be connected to export
- [ ] Given I have disconnected, when I look in my Google Drive, then all previously exported files remain in my Book Folder (DraftCrane does not delete them)

Business Rules:
- Disconnecting does NOT delete any files from the user's Drive
- Disconnecting does NOT delete the user's DraftCrane account or project data stored in D1
- The user can reconnect at any time using US-005
- **OPEN QUESTION:** What happens to auto-save if the user disconnects Drive while editing? Does auto-save switch to local-only? Does the editor block saves? See Edge Cases section.

Out of Scope:
- Partial disconnection (keeping read but removing write access)
- Account deletion (separate feature)
- Data export from DraftCrane's own database

---

### Basic Editor

---

**US-009: Create a Project**
As a user, I want to create a new book project so that I can begin organizing and writing my manuscript.

Acceptance Criteria:
- [ ] Given I am on the dashboard, when I click "New Project," then I am presented with a form to enter the book title
- [ ] Given I enter a valid book title and submit, when the project is created, then I am redirected to the project's editor view with one default chapter ("Chapter 1") created
- [ ] Given I attempt to create a project with an empty title, when I submit, then I see a validation error asking me to enter a title
- [ ] Given I have created a project, when I return to the dashboard, then I see the project listed with its title and last modified date

Business Rules:
- **OPEN QUESTION:** Can a user have multiple projects? The PRD mentions "project setup" (singular), but doesn't explicitly state one-at-a-time. For Phase 0, recommend supporting multiple projects to avoid blocking users who want to experiment.
- A newly created project has one default untitled chapter
- Project title can be edited later (see project settings, which may be a thin settings panel in Phase 0)

Out of Scope:
- Project templates or starting structures
- Audience, promise/outcome, tone selection (Phase 1 Book Blueprint)
- Length target setting
- Project duplication or archival
- Deleting a project (evaluate for Phase 0 or Phase 1 -- flagged as open question)

---

**US-010: Create a Chapter**
As a user, I want to create new chapters within my project so that I can organize my manuscript into logical sections.

Acceptance Criteria:
- [ ] Given I am in the editor view, when I click "Add Chapter," then a new chapter is created and appears at the end of the chapter list in the sidebar
- [ ] Given a new chapter is created, when I view it, then it has a default name ("Untitled Chapter") and an empty body
- [ ] Given a new chapter is created, when the chapter appears, then the editor focus moves to the new chapter's content area
- [ ] Given I have multiple chapters, when I view the sidebar, then chapters are listed in the order they were created (with drag-to-reorder out of scope for Phase 0)

Business Rules:
- Chapters are ordered sequentially within a project
- **OPEN QUESTION:** Is there a maximum number of chapters per project? Recommend no artificial limit in Phase 0, but flag for performance testing.
- Chapter creation auto-saves the project metadata

Out of Scope:
- Drag-and-drop chapter reordering (Phase 1 Chapter Organization)
- Chapter sections or sub-chapters
- Chapter templates
- Bulk chapter operations

---

**US-011: Edit Chapter Content**
As a user, I want to write and edit text within a chapter so that I can compose my manuscript.

Acceptance Criteria:
- [ ] Given I have selected a chapter, when I click in the content area, then a cursor appears and I can begin typing
- [ ] Given I am typing in the editor, when I type text, then it appears in real-time with no perceptible lag (< 100ms input latency)
- [ ] Given I am in the editor, when I use keyboard shortcuts for bold (Cmd+B), italic (Cmd+I), then the selected text is formatted accordingly
- [ ] Given I am in the editor, when I use a heading formatting option, then I can apply Heading 1, Heading 2, and Heading 3 styles
- [ ] Given I am in the editor, when I use a list formatting option, then I can create bulleted lists and numbered lists
- [ ] Given I am on an iPad with a virtual keyboard, when I type and format text, then the editor is fully functional with no layout issues or inaccessible controls
- [ ] Given I am in the editor, when I perform undo (Cmd+Z) and redo (Cmd+Shift+Z), then changes are undone or redone correctly

Business Rules:
- The editor is a rich-text editor, not a code/markdown editor (target users are non-technical)
- Formatting is limited in Phase 0 to: bold, italic, headings (H1-H3), bulleted lists, numbered lists
- **OPEN QUESTION:** Which editor library will be used? (Tiptap, ProseMirror, Lexical, Plate) -- this is listed as a key decision in the project instructions

Out of Scope:
- Inline comments or annotations (Phase 1+)
- Tables, images, or embedded media
- Footnotes or endnotes
- Custom fonts or typography controls
- Collaborative real-time editing
- Word count targets per chapter
- Track changes

---

**US-012: Chapter Navigation**
As a user, I want to navigate between chapters using a sidebar so that I can move through my manuscript quickly.

Acceptance Criteria:
- [ ] Given I am in the editor, when I view the sidebar, then I see all chapters listed in order with their titles
- [ ] Given I click a chapter in the sidebar, when the chapter loads, then the editor displays that chapter's content and the sidebar highlights the active chapter
- [ ] Given I have unsaved changes in the current chapter, when I click a different chapter, then my changes are auto-saved before navigation occurs
- [ ] Given I have more chapters than fit in the sidebar viewport, when I scroll the sidebar, then all chapters are accessible
- [ ] Given I am on an iPad, when I interact with the sidebar, then it is usable via touch (tap to select, scroll to browse)

Business Rules:
- Only one chapter is displayed in the editor at a time
- The sidebar is always visible (not hidden behind a hamburger menu) on screens wide enough to support it
- **OPEN QUESTION:** On narrow iPad screens (portrait mode), should the sidebar collapse? If so, how is it accessed?

Out of Scope:
- Chapter drag-and-drop reordering
- Chapter grouping or sections (e.g., "Part 1")
- Search within chapters from the sidebar
- Chapter status indicators (draft, complete, etc.)

---

**US-013: Rename a Chapter**
As a user, I want to rename a chapter so that the sidebar reflects the actual content of each chapter.

Acceptance Criteria:
- [ ] Given I see a chapter in the sidebar, when I double-click (or long-press on iPad) the chapter title, then the title becomes an editable inline text field
- [ ] Given the chapter title is in edit mode, when I type a new name and press Enter (or tap away), then the chapter is renamed and the sidebar updates immediately
- [ ] Given I clear the chapter title and confirm, when the rename completes, then the chapter reverts to "Untitled Chapter" (empty titles are not allowed)
- [ ] Given I press Escape while editing a chapter title, when the edit is cancelled, then the original title is restored

Business Rules:
- Chapter titles must be non-empty (whitespace-only titles are treated as empty)
- Chapter title changes are auto-saved
- **OPEN QUESTION:** Is there a maximum length for chapter titles? Recommend 200 characters to prevent sidebar layout issues.

Out of Scope:
- Chapter numbering auto-generation (e.g., "Chapter 1: [Title]")
- Subtitle or description fields for chapters

---

**US-014: Delete a Chapter**
As a user, I want to delete a chapter I no longer need so that my manuscript structure stays clean.

Acceptance Criteria:
- [ ] Given I right-click (or long-press on iPad) a chapter in the sidebar, when I select "Delete," then a confirmation dialog appears warning that this action cannot be undone
- [ ] Given the confirmation dialog is displayed, when I confirm deletion, then the chapter is removed from the sidebar and its content is deleted
- [ ] Given I delete the currently active chapter, when deletion completes, then the editor navigates to the nearest remaining chapter
- [ ] Given I have only one chapter, when I attempt to delete it, then the delete option is disabled or I see a message that at least one chapter is required
- [ ] Given I cancel the deletion confirmation, when the dialog closes, then no changes are made

Business Rules:
- A project must always have at least one chapter
- Deleted chapters cannot be recovered in Phase 0
- **OPEN QUESTION:** Should deleted chapter content be recoverable? A soft-delete with 30-day retention could be a Phase 1 feature.

Out of Scope:
- Undo chapter deletion
- Trash/archive for deleted chapters
- Bulk chapter deletion

---

**US-015: Auto-Save**
As a user, I want my writing to be automatically saved so that I never lose work due to forgetting to save or a browser crash.

Acceptance Criteria:
- [ ] Given I am typing in the editor, when I pause for 2 seconds (debounced), then the current chapter content is saved automatically
- [ ] Given auto-save triggers, when the save succeeds, then a subtle status indicator shows "Saved" with a timestamp
- [ ] Given auto-save triggers, when the save fails (e.g., network error), then a visible warning is displayed: "Unable to save. Retrying..." and the system retries automatically
- [ ] Given I close the browser tab, when the tab close event fires, then a final save attempt is made (best-effort)
- [ ] Given auto-save fails repeatedly (3+ consecutive failures), when the user continues typing, then a persistent warning is shown: "Your changes have not been saved. Please check your connection."

Business Rules:
- Auto-save interval is debounced at 2 seconds after the last keystroke (not a fixed timer)
- Auto-save writes to DraftCrane's backend (D1 database); sync to Google Drive is a separate operation
- **OPEN QUESTION:** Does auto-save write to Google Drive in real-time, periodically, or only on explicit export? The project instructions list this as a key decision. For Phase 0, recommend saving to D1 with Drive sync on export only, to reduce complexity.
- Local content is never silently discarded -- if the server version is newer, the user must be notified

Out of Scope:
- Version history or revision tracking
- Manual save button (auto-save is the only mechanism)
- Conflict resolution between multiple browser tabs editing the same chapter

---

### AI Rewrite

---

**US-016: Select Text for AI Rewrite**
As a user, I want to select a passage of text in the editor so that I can request an AI rewrite of that specific content.

Acceptance Criteria:
- [ ] Given I am in the editor, when I select a range of text (via mouse drag or touch selection on iPad), then a floating toolbar appears near the selection with AI action options
- [ ] Given the floating toolbar is visible, when I see the options, then I see at least: "Rewrite," "Expand," and "Simplify"
- [ ] Given I have no text selected, when I look at the editor, then no AI action toolbar is visible
- [ ] Given I select text, when the selection is less than 1 character (empty selection), then the AI toolbar does not appear
- [ ] Given I am on an iPad, when I select text using touch, then the floating toolbar appears and is fully tappable without interfering with the iOS selection handles

Business Rules:
- AI actions are only available on text selections, not on the entire chapter at once (in Phase 0)
- **OPEN QUESTION:** Is there a minimum or maximum selection length for AI rewrite? Recommend minimum of 1 word, maximum of ~2000 words (to stay within reasonable AI context window and response time).

Out of Scope:
- AI rewrite of entire chapter
- Custom/freeform AI prompts (Ask Mode is Phase 1)
- Craft buttons beyond rewrite/expand/simplify (Phase 1)
- AI actions triggered from a menu or panel (floating toolbar only in Phase 0)

---

**US-017: Request AI Rewrite**
As a user, I want to request an AI rewrite of my selected text so that I can improve my writing with AI assistance.

Acceptance Criteria:
- [ ] Given I have selected text and the floating toolbar is visible, when I tap "Rewrite," then a loading indicator appears and an AI-generated rewrite is returned
- [ ] Given I have selected text, when I tap "Expand," then the AI returns an expanded version of the selected text (longer, more detailed)
- [ ] Given I have selected text, when I tap "Simplify," then the AI returns a simplified version (clearer, more concise)
- [ ] Given the AI is processing, when I see the loading state, then I can still read my current text (the original is not hidden or replaced during processing)
- [ ] Given the AI request takes longer than 10 seconds, when the timeout is reached, then the user sees a message: "This is taking longer than expected. You can wait or cancel."

Business Rules:
- AI requests are sent to Anthropic Claude API (per project instructions tech stack)
- The AI is given the selected text and the rewrite mode; it does NOT have access to the full manuscript in Phase 0
- AI responses must not contain content the author didn't request (e.g., no unsolicited additions or editorial commentary)
- **OPEN QUESTION:** Should the AI receive any context beyond the selected text (e.g., the surrounding paragraph, the chapter title)? Recommend including the surrounding paragraph for better results.
- **OPEN QUESTION:** What are the AI usage limits? Per session? Per day? Per account? The PRD and project instructions don't specify. Flag for product decision.

Out of Scope:
- Rewrite history (seeing previous AI suggestions for the same selection)
- Custom tone or style instructions for the AI
- AI-generated content from scratch (only rewriting existing text)
- Streaming AI responses (evaluate for Phase 1 UX improvement)

---

**US-018: Accept or Reject AI Suggestion**
As a user, I want to review the AI's suggestion and choose to accept or reject it so that I remain in full control of my manuscript content.

Acceptance Criteria:
- [ ] Given the AI has returned a suggestion, when I see the result, then the original text and the AI suggestion are both visible simultaneously (e.g., inline diff, side-by-side, or below the selection)
- [ ] Given I see the AI suggestion, when I click "Accept," then the selected text is replaced with the AI suggestion in the editor
- [ ] Given I see the AI suggestion, when I click "Reject," then the original text remains unchanged and the suggestion is dismissed
- [ ] Given I accept an AI suggestion, when I immediately press Undo (Cmd+Z), then the acceptance is undone and the original text is restored
- [ ] Given I see an AI suggestion, when I click elsewhere in the document without accepting or rejecting, then the suggestion is dismissed (treated as reject)
- [ ] Given the AI suggestion is shown, when I view it on iPad, then the accept/reject buttons are large enough to tap accurately (minimum 44x44pt touch target per Apple HIG)

Business Rules:
- AI suggestions are NEVER applied without explicit user acceptance (per project instructions: "AI assists, never replaces" and "Every AI action requires user approval")
- Accepted suggestions become part of the document and are subject to auto-save
- Rejected suggestions are discarded and not stored
- There is no "partial accept" -- the user accepts the full suggestion or rejects it

Out of Scope:
- Editing the AI suggestion before accepting
- Requesting a different version ("Regenerate")
- Rating or providing feedback on the AI suggestion
- History of past AI suggestions

---

### Export

---

**US-019: Generate PDF Export**
As a user, I want to generate a PDF of my manuscript so that I can share or review a formatted version of my book.

Acceptance Criteria:
- [ ] Given I am in a project with at least one chapter containing text, when I click "Export" and select "PDF," then a PDF generation process begins with a progress indicator
- [ ] Given the PDF is generated, when generation completes, then the PDF is saved to my Google Drive Book Folder
- [ ] Given the PDF is generated, when I view it, then it contains all chapters in order with chapter titles as headings and a title page with the book title
- [ ] Given the PDF is generated, when I review formatting, then body text is in a readable serif font, with consistent margins and page numbers
- [ ] Given my project has no chapters with content, when I click "Export PDF," then I see a message: "Add content to at least one chapter before exporting."

Business Rules:
- PDF includes: title page, table of contents, all chapters in order
- PDF formatting uses a single default template (no customization in Phase 0)
- PDF file is named: `{Book Title}.pdf`
- If a file with the same name exists in the Book Folder, it is overwritten (or versioned with timestamp -- **OPEN QUESTION**)
- **OPEN QUESTION:** What page size? US Letter (8.5x11) or A5 (standard book trim size)? Recommend A5 for book-like feel.

Out of Scope:
- Custom PDF templates or formatting options
- Cover page with images
- Headers/footers customization
- Page break control
- Table of contents with page numbers (evaluate feasibility in Phase 0)
- Print-ready PDF with bleed and crop marks (Phase 3)

---

**US-020: Generate EPUB Export**
As a user, I want to generate an EPUB of my manuscript so that I can read it on an e-reader or distribute it digitally.

Acceptance Criteria:
- [ ] Given I am in a project with at least one chapter containing text, when I click "Export" and select "EPUB," then an EPUB generation process begins with a progress indicator
- [ ] Given the EPUB is generated, when generation completes, then the EPUB file is saved to my Google Drive Book Folder
- [ ] Given the EPUB is generated, when I open it in an e-reader (Apple Books, Kindle app), then all chapters are present, in order, with correct formatting preserved (bold, italic, headings, lists)
- [ ] Given the EPUB is generated, when I review it, then it includes a title page and a navigable table of contents
- [ ] Given my project has no chapters with content, when I click "Export EPUB," then I see a message: "Add content to at least one chapter before exporting."

Business Rules:
- EPUB must be valid EPUB 3.0 format
- EPUB uses a single default stylesheet (no customization in Phase 0)
- EPUB file is named: `{Book Title}.epub`
- Same overwrite/versioning question as PDF (**OPEN QUESTION**)

Out of Scope:
- Custom EPUB styling or CSS
- Cover image embedding
- Metadata editing (author bio, ISBN, publisher)
- MOBI/KPF format for Kindle (Phase 3)
- DRM or encryption

---

**US-021: Save Export to Google Drive**
As a user, I want my exported files automatically saved to my Book Folder in Google Drive so that I always have access to the latest export.

Acceptance Criteria:
- [ ] Given I trigger a PDF or EPUB export, when the file is generated, then it is automatically uploaded to my Book Folder in Google Drive
- [ ] Given the upload completes, when I check my Google Drive, then the file appears in the Book Folder with the correct name and format
- [ ] Given the upload completes, when I see the success notification in DraftCrane, then it includes the file name and a link to open the file in Google Drive
- [ ] Given my Google Drive is not connected, when I attempt to export, then I see a message prompting me to connect Google Drive first (with a link to do so)

Business Rules:
- Export always saves to the Book Folder, never to Drive root or another location
- If the Book Folder has been deleted from Drive since it was selected, the export fails with a clear error message and the user is prompted to select a new Book Folder

Out of Scope:
- Exporting to a user-selected folder (always Book Folder)
- Exporting to other cloud storage providers
- Email delivery of exports

---

**US-022: Download Export Locally**
As a user, I want to download my exported PDF or EPUB to my device so that I have a local copy.

Acceptance Criteria:
- [ ] Given a PDF or EPUB has been generated, when I click "Download," then the file is downloaded to my device's default download location via the browser's native download mechanism
- [ ] Given I am on an iPad, when I download, then the file is saved to the Files app or opens in the share sheet (standard iPadOS behavior)
- [ ] Given my Google Drive is not connected, when I generate an export, then I can still download the file locally (local download does not require Drive)

Business Rules:
- Local download is always available, regardless of Google Drive connection status
- If Drive is connected, both Drive save (US-021) and local download happen; the user does not have to choose one or the other
- **OPEN QUESTION:** Should local download be the primary path when Drive is not connected? Or should the user be required to connect Drive before exporting? Recommend allowing local-only download to reduce friction, with a prompt encouraging Drive connection.

Out of Scope:
- AirDrop or other device-to-device sharing
- Sharing via link
- Print directly from DraftCrane

---

## 2. Edge Cases & Error States

---

### Auth Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| User's Clerk session expires mid-editing | Auto-save attempts to persist locally. On next interaction requiring authentication, the user sees a "Session expired, please sign in again" modal. After re-authentication, the locally cached content is reconciled with the server. |
| User signs in on a new device while a session is active elsewhere | Both sessions are valid. No content conflict in Phase 0 because concurrent editing is out of scope. |
| Clerk service is unavailable | Sign-in/sign-up pages show: "Authentication service is temporarily unavailable. Please try again in a few minutes." |

---

### Google Drive Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Google Drive is disconnected mid-editing session | The editor continues to function normally. Auto-save continues writing to D1. Export and Drive-related operations show: "Google Drive is not connected. Reconnect to save to your Book Folder." The user can continue writing. |
| Google Drive OAuth token expires mid-session | DraftCrane attempts a silent token refresh. If refresh fails, the user sees: "Your Google Drive connection needs to be renewed. Click here to reconnect." The editor remains functional. |
| User's Google Drive storage is full | Export upload to Drive fails. The user sees: "Unable to save to Google Drive -- your Drive storage is full. Free up space in Drive or download the file locally." Local download is still offered. |
| Book Folder is deleted from Google Drive externally | On next Drive operation (export, file listing), the user sees: "Your Book Folder can no longer be found in Google Drive. Please select a new Book Folder." Existing project data in D1 is unaffected. |
| Google Drive API rate limit is hit | Retry with exponential backoff (up to 3 retries). If still failing, show: "Google Drive is temporarily unavailable. Your work is saved locally. Try again in a few minutes." |
| User revokes DraftCrane access from Google's security settings | On next Drive API call, the request fails. The user sees: "Google Drive access has been revoked. Please reconnect your Google Drive." The OAuth flow restarts from scratch. |

---

### Editor Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Auto-save fails due to network loss | Show a persistent yellow warning bar: "Unable to save. Your changes are stored locally. Reconnect to the internet to save." Content is preserved in local browser storage. On reconnection, auto-save resumes and syncs the local content. |
| Auto-save fails due to server error (500) | Retry with exponential backoff (up to 3 retries). After 3 failures, show persistent error bar. Content is preserved locally. |
| User opens the same project in two browser tabs | **OPEN QUESTION:** Phase 0 does not handle concurrent editing. Options: (a) Block the second tab with a warning, (b) Last-write-wins with no conflict detection, (c) Ignore the issue and document it as a known limitation. Recommend option (a) for data safety. |
| Browser crashes or is force-quit | On next sign-in, auto-save restores the last successfully saved version. Content typed after the last auto-save (within the 2-second debounce window) is lost. |
| User pastes a very large amount of text (50,000+ words) | The editor should handle large documents without crashing. Performance may degrade. **OPEN QUESTION:** Should there be a chapter length limit? |
| User pastes content with unsupported formatting (tables, images, colored text) | Unsupported formatting is stripped on paste. Only supported formatting (bold, italic, headings, lists) is preserved. The user is not warned (silent stripping) -- **OPEN QUESTION:** Should the user be notified? |

---

### AI Rewrite Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| AI request fails (API error) | Show message: "AI is temporarily unavailable. Please try again." The original text remains unchanged. No retry is attempted automatically. |
| AI request times out (> 30 seconds) | Show message: "The AI request timed out. Please try again with a shorter selection." The original text remains unchanged. |
| AI returns empty or malformed response | Treat as a failure. Show: "Something went wrong with the AI response. Please try again." Log the error for debugging. |
| User makes another selection while AI is processing | The first AI request is cancelled. The new selection takes priority and a new request can be initiated. |
| AI returns content significantly longer than expected | The suggestion is shown in full. The user decides whether to accept or reject. No truncation. |
| Network disconnects after AI request is sent but before response | Show: "Connection lost. The AI response could not be received. Please check your connection and try again." |
| AI API rate limit is hit | Show: "AI service is busy. Please wait a moment and try again." Display a brief cooldown timer if available from the API response. |

---

### Export Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Export fails during PDF/EPUB generation | Show: "Export failed. Please try again." Include a "Retry" button. Log the error. |
| Export succeeds but Drive upload fails | Offer local download as fallback: "Your [PDF/EPUB] was generated but could not be saved to Google Drive. Download it here." |
| User triggers multiple exports simultaneously | Queue exports and process them sequentially. Show: "An export is already in progress. Please wait for it to complete." |
| Export of a very large manuscript (100+ chapters) | Show progress indicator. If generation exceeds 60 seconds, show: "Generating your book. This may take a minute for large manuscripts." **OPEN QUESTION:** Is there a practical limit on manuscript size for export? |
| No internet connection during export | If export is server-side: "Export requires an internet connection. Please reconnect and try again." If export is client-side: generation proceeds, but Drive upload is deferred with a message. |

---

## 3. Cross-Cutting Business Rules

---

### Project Management

| Rule | Decision | Status |
|------|----------|--------|
| Multiple projects per user? | **OPEN QUESTION.** PRD is ambiguous. Recommend: Allow multiple projects in Phase 0 to avoid blocking users. No artificial limit. | Needs product decision |
| Maximum chapters per project? | **OPEN QUESTION.** Recommend: No artificial limit. Flag for performance testing at 50+ chapters. | Needs product decision |
| Maximum chapter length? | **OPEN QUESTION.** Recommend: No hard limit, but test performance at 10,000+ words per chapter. Warn user if chapter exceeds 20,000 words. | Needs product decision |
| Can a user delete a project? | **OPEN QUESTION.** Not specified in PRD. Recommend: Yes, with confirmation dialog and 30-day soft delete. | Needs product decision |
| Project naming constraints? | Title required, non-empty. No maximum length specified. Recommend: 500 character max. | Needs product decision |

### Data & Storage

| Rule | Decision | Status |
|------|----------|--------|
| Where does manuscript content live? | In D1 (DraftCrane's database) as the working copy. Google Drive is for exports only in Phase 0. **OPEN QUESTION** in project instructions. | Needs ADR |
| Data retention if user disconnects Drive? | All project data in D1 is retained. Drive disconnect only affects export and file listing. The user can reconnect and resume. | Proposed |
| What happens to data if user deletes their account? | **OPEN QUESTION.** Not addressed in PRD or project instructions. Recommend: Delete all D1 data, revoke OAuth tokens, leave Drive files untouched. | Needs product decision |
| Backup strategy for D1 data? | **OPEN QUESTION.** Cloudflare D1 has automatic backups, but recovery procedures should be documented. | Needs technical decision |

### AI Usage

| Rule | Decision | Status |
|------|----------|--------|
| AI usage limits per user? | **OPEN QUESTION.** Not specified. Options: (a) Unlimited in Phase 0 beta, (b) N requests per day, (c) Token-based budget. Recommend: Unlimited during beta with monitoring, establish limits before paid launch. | Needs product decision |
| AI data privacy | No user content is used for model training (per PRD non-functional requirements). AI requests are sent to Anthropic Claude API. DraftCrane does not store AI inputs/outputs beyond the current session. | Confirmed by PRD |
| AI context scope | In Phase 0, AI receives only the selected text (plus optional surrounding paragraph). It does NOT receive the full manuscript, book title, or project metadata. | Proposed |

### Export

| Rule | Decision | Status |
|------|----------|--------|
| Supported export formats | PDF and EPUB only in Phase 0. | Confirmed by PRD |
| Export to Google Doc? | Listed in PRD section 6.8 but NOT listed in Phase 0 scope. **Explicitly excluded from Phase 0.** | Confirmed |
| Export file naming | `{Book Title}.pdf` / `{Book Title}.epub`. Special characters in title should be sanitized for file system compatibility. | Proposed |
| Export overwrite behavior | **OPEN QUESTION.** If a file with the same name exists in the Book Folder: (a) Overwrite, (b) Append timestamp, (c) Ask user. Recommend: Append timestamp (`{Book Title} - 2026-02-06.pdf`) to prevent accidental data loss. | Needs product decision |
| Empty chapter handling in export | Empty chapters are excluded from the export. If all chapters are empty, export is blocked with a message. | Proposed |

### Platform & Performance

| Rule | Decision | Status |
|------|----------|--------|
| Primary test target | Safari on iPad (per project instructions). Chrome and Firefox on desktop are secondary. | Confirmed |
| Document load time | Less than 3 seconds (per PRD non-functional requirements). | Confirmed |
| Minimum supported screen size | iPad Mini (8.3" display, 1488 x 2266 px). **OPEN QUESTION:** What about iPhone? Recommend: Not supported in Phase 0. | Needs product decision |
| Offline support | **Not supported in Phase 0.** User must be online to sign in, auto-save, use AI, and export. Editor continues to function temporarily during brief connectivity drops (content cached locally). | Proposed |

---

## 4. Requirements Traceability Matrix

---

| User Story | PRD Feature | Project Instruction Principle | Success Metric |
|------------|-------------|-------------------------------|----------------|
| US-001: Sign Up | Phase 0 -- Auth system | P2: User is not technical (simple onboarding) | Monthly active writing users (retention starts here) |
| US-002: Sign In | Phase 0 -- Auth system | P2: User is not technical | Monthly active writing users |
| US-003: Sign Out | Phase 0 -- Auth system | P3: User's files are sacred (secure logout) | -- |
| US-004: Session Persistence | Phase 0 -- Auth system | P2: User is not technical (low friction) | Monthly active writing users (reduces drop-off) |
| US-005: Connect Google Drive | Phase 0 -- Drive integration | P3: User's files are sacred (user owns storage) | % users exporting book formats (prerequisite) |
| US-006: Select Book Folder | Phase 0 -- Drive integration | P3: User's files are sacred (visible file ownership) | % users exporting book formats (prerequisite) |
| US-007: View Files in Book Folder | Phase 0 -- Drive integration | P3: User's files are sacred (visible ownership) | % users exporting book formats (confidence) |
| US-008: Disconnect Google Drive | Phase 0 -- Drive integration | P3: User's files are sacred (no lock-in) | -- |
| US-009: Create a Project | Phase 0 -- Basic editor / Project Setup | P4: Structure reduces overwhelm | Avg chapters completed per user (prerequisite) |
| US-010: Create a Chapter | Phase 0 -- Basic editor | P4: Structure reduces overwhelm | Avg chapters completed per user |
| US-011: Edit Chapter Content | Phase 0 -- Basic editor / Writing Environment | P5: Browser-first, iPad-native | Time to first draft chapter (< 2 hours) |
| US-012: Chapter Navigation | Phase 0 -- Basic editor / Writing Environment | P4: Structure reduces overwhelm | Avg chapters completed per user |
| US-013: Rename a Chapter | Phase 0 -- Basic editor / Writing Environment | P4: Structure reduces overwhelm | -- |
| US-014: Delete a Chapter | Phase 0 -- Basic editor / Writing Environment | P4: Structure reduces overwhelm | -- |
| US-015: Auto-Save | Phase 0 -- Basic editor / Writing Environment | P3: User's files are sacred (never lose work) | Time to first draft chapter (no friction) |
| US-016: Select Text for AI Rewrite | Phase 0 -- Simple AI rewrite | P4: AI as partner, not replacement | Time to first draft chapter |
| US-017: Request AI Rewrite | Phase 0 -- Simple AI rewrite | P4: AI as partner, not replacement | Time to first draft chapter |
| US-018: Accept/Reject AI Suggestion | Phase 0 -- Simple AI rewrite | P4: AI as partner, not replacement (user approval required) | Time to first draft chapter |
| US-019: Generate PDF Export | Phase 0 -- PDF/EPUB export | P5: Publishing is a button, not a project | % users exporting book formats (> 40%) |
| US-020: Generate EPUB Export | Phase 0 -- PDF/EPUB export | P5: Publishing is a button, not a project | % users exporting book formats (> 40%) |
| US-021: Save Export to Drive | Phase 0 -- PDF/EPUB export / Drive integration | P3: User's files are sacred (files in user's cloud) | % users exporting book formats |
| US-022: Download Export Locally | Phase 0 -- PDF/EPUB export | P3: User's files are sacred (no lock-in) | % users exporting book formats |

---

### PRD Principles Mapping Key

| Code | Principle (from PRD Section 4) |
|------|-------------------------------|
| P1 | Browser-first -- works in Safari, Chrome, or any modern iPad browser |
| P2 | No lock-in -- user files stored in their own cloud account |
| P3 | AI as partner, not replacement |
| P4 | Structure reduces overwhelm |
| P5 | Publishing is a button, not a project |

### Project Instruction Principles Mapping Key

| Code | Principle (from Project Instructions Section 1) |
|------|------------------------------------------------|
| P1 | Ship the smallest thing that teaches us something |
| P2 | The user is not technical |
| P3 | The user's files are sacred |
| P4 | AI assists, never replaces |
| P5 | Browser-first, iPad-native |

*Note: The traceability matrix above references the Project Instructions principles (P1-P5), which are the authoritative operational principles for development. The PRD principles (Section 4) inform product direction but the Project Instructions principles govern implementation decisions.*

---

## 5. Summary of Open Questions

The following questions require product or technical decisions before the corresponding user stories can be considered "Ready" per the Definition of Ready:

| # | Question | Relevant Stories | Recommendation |
|---|----------|------------------|----------------|
| OQ-1 | What should the session lifetime be? | US-004 | 30 days, matching typical SaaS products for low-friction re-engagement |
| OQ-2 | What Google Drive API scopes are needed? | US-005 | `drive.file` scope (narrowest) to minimize permission concerns |
| OQ-3 | Is the Book Folder per-project or per-account? | US-006 | Per-project, allowing different folders for different books |
| OQ-4 | Can a user have multiple projects? | US-009 | Yes, no artificial limit in Phase 0 |
| OQ-5 | Maximum chapters per project? | US-010 | No hard limit; test at 50+ |
| OQ-6 | Which editor library? | US-011 | TBD -- ADR required (listed in project instructions) |
| OQ-7 | Sidebar behavior on narrow screens? | US-012 | Collapsible sidebar with swipe gesture on iPad |
| OQ-8 | Maximum chapter title length? | US-013 | 200 characters |
| OQ-9 | Soft-delete for chapters? | US-014 | Defer to Phase 1; hard delete in Phase 0 |
| OQ-10 | Where does manuscript content live (D1 vs. Drive)? | US-015 | D1 as working copy, Drive for exports only; ADR required |
| OQ-11 | AI selection length limits? | US-016 | Min 1 word, max ~2000 words |
| OQ-12 | AI context scope (selected text only vs. surrounding context)? | US-017 | Include surrounding paragraph |
| OQ-13 | AI usage limits? | US-017 | Unlimited during beta, monitor costs, set limits pre-launch |
| OQ-14 | Export file naming -- overwrite or version? | US-019, US-020 | Append date to filename |
| OQ-15 | PDF page size? | US-019 | A5 (book trim size) |
| OQ-16 | What happens with two tabs on same project? | Edge Cases | Block second tab |
| OQ-17 | Notify user when pasted formatting is stripped? | Edge Cases | Silent strip in Phase 0 |
| OQ-18 | iPhone support? | Business Rules | Not in Phase 0 |
| OQ-19 | Account deletion process? | Business Rules | Define before beta launch |
| OQ-20 | Can a user delete a project? | US-009 | Yes, with confirmation; define details |
