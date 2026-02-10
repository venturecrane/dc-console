# UX Lead Contribution -- PRD Rewrite Round 3 (FINAL)

**Author:** UX Lead
**Date:** February 6, 2026
**Scope:** Phase 0 only
**Primary Target:** Safari on iPad (iPadOS 17+)

---

## Changes from Round 2

1. **Resolved the auto-save debounce conflict.** Round 2 referenced both 5-second and 2-second debounce intervals in different places due to conflicting inputs from the BA (5 seconds) and the Tech Lead (initially 5s, then revised to 2s). The Tech Lead's Round 2 explicitly changed to 2 seconds and provided the architectural justification (IndexedDB keystroke buffer makes a shorter debounce safe). The BA's Round 2, however, changed back to 5 seconds citing "alignment with Tech Lead." These still contradict. The UX-observable behavior is identical to the user -- they see "Saved" a few seconds after they stop typing. For this document I reference the save indicator UX without specifying the debounce interval, as this is a technical decision between the BA and Tech Lead. See Unresolved Issues.

2. **Aligned folder picker interaction with confirmed `drive.file` scope and PM's decision.** Round 2 presented Option A (auto-create folder) vs. Option B (Google Picker API). The PM endorsed per-project folders. The Tech Lead's API surface includes `POST /drive/folders` (create) and `GET /drive/folders` (list). The BA's US-006 describes a folder picker with "tap-to-open navigation" and "Create New Folder." This document now specifies Option A (auto-create) as the default path with a simplified picker for advanced users, consistent with the Tech Lead's available endpoints. The BA's folder picker description assumes the ability to browse the user's full Drive folder tree, which `drive.file` scope does not permit for pre-existing folders. See Unresolved Issues for the scope tension.

3. **Incorporated the Target Customer's "existing content" concern into the journey map.** Dr. Sarah Chen's Round 2 escalated this forcefully: "If Step 5 instead gives me one empty chapter titled 'Chapter 1' with gray placeholder text that says 'Start writing here...' -- I will feel deflated." The PM acknowledged this as a risk ("What DraftCrane Is Not Solving in Phase 0"). The Competitor Analyst reframed the real competitor as "the user's existing Google Drive folder chaos." This document now addresses the empty-project feeling at every relevant step without adding Phase 1+ features.

4. **Confirmed chapter reordering is in Phase 0.** The PM's Round 2 explicitly recommends including basic reorder: "Without it, an author who creates chapters in the wrong order has no recourse except deleting and recreating them, which is hostile." The Tech Lead's API includes `PATCH /projects/:projectId/chapters/reorder`. The BA added US-012A for reorder in Round 2. This is no longer flagged as a disagreement -- it is decided.

5. **Confirmed freeform instruction field for AI rewrite is in Phase 0.** The BA's Round 2 updated US-017 to include suggestion chips AND a freeform instruction field. The Tech Lead's `/ai/rewrite` endpoint accepts an `instruction` field. The Target Customer validated: "The suggestion chips are doing the work of translating 'I want this to sound better' into something the AI can act on." No longer flagged as a disagreement -- it is decided.

6. **Aligned word count display with BA's US-024.** The BA added US-024 (Word Count Display) in Round 2, matching my Round 2 design. The Tech Lead's schema has `word_count` on the chapters table. The Target Customer explicitly requested it. This section now references US-024 directly.

7. **Updated PDF page size to US Trade (5.5" x 8.5").** The BA's Round 2 resolved OQ-15 as "5.5 x 8.5 (US Trade)" rather than A5. The PM endorsed A5 in Round 2. These are nearly identical (A5 is 148x210mm, US Trade is 140x216mm). This document uses the BA's US Trade specification since it is the standard self-publishing trim size in the US market, which is our primary market. See Unresolved Issues for the minor discrepancy.

8. **Added "Paste existing content" as an explicit design consideration.** The Target Customer's core frustration is that Phase 0 assumes starting from scratch. While Source Intelligence is Phase 2, the editor must handle paste gracefully. The BA's edge case (US-011: paste with unsupported formatting stripped silently) and the Target Customer's request ("at the very least give me a way to manually paste content into chapters") both point to this. Paste-from-Google-Docs is now called out as a critical test scenario in the editor interaction pattern.

9. **Reconciled streaming as a requirement across all roles.** The BA's Round 2 still references streaming as Phase 0 scope (updated from Round 1's "out of scope"). The Tech Lead promoted it to a hard requirement. The Target Customer validated: "Streaming is not a nice-to-have. It is the difference between the AI feeling like a partner and feeling like a vending machine." All roles are now aligned. SSE streaming for AI rewrite is a Phase 0 requirement.

10. **Terminology consistency pass.** Standardized on: "Book Folder" (not "book folder" or "Drive folder"), "Writing Environment" (not "editor view" or "writing screen"), "bottom sheet" (not "panel" or "drawer"), "suggestion chips" (not "action chips" or "quick actions"), "Save to Google Drive" (not "Upload to Drive" or "Sync to Drive"), "Use This" / "Try Again" / "Discard" (the three AI review actions, consistently capitalized).

---

## 1. Target User Personas

### Persona 1: Diane Mercer -- Leadership Consultant

**Age:** 52
**Title:** Principal, Mercer Leadership Group (solo consultancy)
**Location:** Austin, TX
**Devices:** iPad Pro 12.9" (primary work device), iPhone 15, MacBook Air (used occasionally at home desk)

**Background:** Diane has run a leadership consulting practice for 14 years. She works with mid-level managers at Fortune 500 companies, running workshops and executive coaching engagements. She has a deep body of knowledge that exists as scattered Google Docs: workshop decks, client debrief notes, frameworks she has refined over years, LinkedIn articles she wrote in bursts of motivation. Her clients and peers constantly tell her, "You should write a book." She agrees. She has tried three times.

**Technical Comfort:** Diane lives in Google Workspace. She can build a decent slide deck. She uses Calendly, Zoom, and a CRM. She tried Notion once and abandoned it after 20 minutes. She does not know what Markdown is. She does not know what "OAuth" means -- she knows it as "the thing where you click Sign in with Google." She uses her iPad for 80% of her work, including writing, because she travels frequently and prefers working from hotel lobbies and airport lounges with a Smart Keyboard Folio attached.

**Current Writing Workflow (Day in the Life):**

1. Diane opens a Google Doc titled "Book Draft v3 - REAL ONE" on her iPad.
2. She scrolls past 47 pages of mixed content: half-written chapters, pasted quotes from other docs, notes-to-self in red text, and a section that says "MOVE THIS TO CHAPTER 4???"
3. She opens a second Safari tab to find a Google Doc from 2023 with a framework she wants to reference. She searches Drive. It takes four minutes to find the right file among six with similar names.
4. She copies a paragraph from the source doc, switches tabs, scrolls to find her place again (she has lost it), pastes it, and reformats it because the font changed.
5. She thinks, "This paragraph is clunky." She opens a third tab to ChatGPT, pastes the paragraph, types "make this more concise and professional," copies the result back, pastes it into her doc, and edits it further because the AI lost her voice.
6. After 45 minutes, she has written approximately 200 words of net-new content. She feels defeated.
7. She closes everything and answers client emails instead.

This matches the Target Customer's (Dr. Sarah Chen) reported experience: "I have been 'writing a book' for three years. I have 200 pages of raw material that could probably produce a strong 250-page book. I have zero finished chapters."

**What is Broken:**

- There is no structure. Her "book" is one enormous document with no chapter separation, no outline, no sense of progress.
- Source material is scattered across dozens of Google Docs with no way to search or surface relevant content while writing.
- Using AI requires constant context-switching between tabs, with copy-paste as the integration layer.
- The AI output "reads like a textbook written by a committee" and strips out her distinctive voice.
- She has no sense of whether what she has written is "enough" or "good enough" for any given section.
- The iPad makes multi-tab workflows painful. Safari tab management is not designed for this.
- She has no export path. Even if she finished, she would not know how to turn a Google Doc into a professional PDF or EPUB.

**What Diane Fears About Trying DraftCrane:**

- **Losing her work.** "What happens between the moment I type a sentence and the moment it saves to Drive? If my iPad loses Wi-Fi in a hotel, do I lose what I typed?" This fear must be addressed by visible, trustworthy auto-save feedback and the local IndexedDB buffer strategy (Tech Lead Three-Tier Save Architecture).
- **The AI replacing her voice.** "If I hit 'Expand' and it turns my concise, punchy paragraph into three paragraphs of filler, that is worse than useless." The accept/reject flow with preview is critical. So is the "Try Again" option with editable instructions so she can refine the direction.
- **Another tool that disappears.** She is aware DraftCrane is new. She will not invest serious time until she trusts the tool and sees that her content is safe in her Drive regardless of DraftCrane's future.
- **Setup without progress.** "If it shows me a blank project with an empty outline, I feel deflated." The first session must feel like forward motion, not configuration. Phase 0 mitigates this by getting the user into the editor quickly (two fields, one button) and by encouraging them to paste existing content immediately.

**What Diane Needs from DraftCrane Phase 0:**

- A single place to write that is not a sprawling Google Doc.
- Chapter-based structure so she can see the pieces of her book as distinct, manageable units.
- AI assistance without leaving her writing surface -- and AI that does not flatten her voice.
- A way to connect to her existing Google Drive so she knows her files are safe in her own cloud.
- One-click export so she can see her work as a "real" book chapter, even early in the process. This matters psychologically -- the "artifact moment" (Competitor Analyst Section 4.2).
- A visible word count so she has a tangible measure of progress (ref: BA US-024).

---

### Persona 2: Marcus Chen -- Executive Coach and Former VP of Operations

**Age:** 44
**Title:** Founder, Chen Performance Advisory
**Location:** Chicago, IL
**Devices:** iPad Air (primary personal device), company-issued laptop (rarely used for personal projects), iPhone

**Background:** Marcus left a VP role at a logistics company two years ago to start an executive coaching practice. His niche is operational leadership: helping leaders build systems, not just manage people. He has strong content already because he kept meticulous notes during his corporate career. He has a Google Drive folder with over 100 documents: meeting reflections, process frameworks, templates he created, even transcripts from talks he gave at internal conferences. His book idea is clear: distill 15 years of operational leadership into a practical guide. He is not blocked on what to say. He is blocked on how to organize it and how to actually produce the artifact.

Marcus's situation mirrors the Target Customer's core statement: "I have the content but not the structure." He does not need to generate text from nothing. He needs to organize and polish content he already has.

**Technical Comfort:** Marcus is slightly more technical than Diane. He has used Trello, Asana, and basic data tools. But he defines himself as "not a tech person" and is suspicious of tools that seem complex. He chose an iPad as his primary device specifically because it forces simplicity. He uses Google Docs, Google Sheets, and Apple Notes. He has a Smart Keyboard and uses it consistently. He also frequently works in portrait mode when reading, switching to landscape when writing.

**Current Writing Workflow (Day in the Life):**

1. Marcus has a Google Drive folder called "Book Project" with 12 subfolders, one per tentative chapter.
2. Each subfolder has between 3 and 15 documents: source notes, partial drafts, outlines, and pasted content from his corporate archive.
3. He opens the Chapter 3 subfolder, reads three different docs to remember what he was thinking, then opens a new blank Google Doc and starts drafting from scratch because the existing fragments do not fit together.
4. He writes 500 words in a flow state. Then he re-reads it and thinks it sounds "too corporate." He wants it to sound more like a mentor talking to a peer.
5. He opens ChatGPT on his iPad, pastes the 500 words, and asks it to "rewrite this in a more conversational, mentor-like tone." The result is too casual. He asks for a revision. The third attempt is usable but needs editing.
6. He pastes the AI version back into his Google Doc and manually adjusts sentences.
7. At the end of the session, he has a new Google Doc in his Chapter 3 folder. He now has four partial drafts of Chapter 3 and no clear "canonical" version.
8. He thinks, "I need to spend a whole weekend just organizing this." That weekend never comes.

**What is Broken:**

- He has too many documents and no single canonical manuscript. His "book" is a folder of folders, not a coherent work.
- Versioning is chaos. He cannot tell which draft is current or which fragments have been incorporated.
- Tone consistency is impossible across 100+ source documents and multiple writing sessions.
- AI assistance requires manual shuttling of text and produces inconsistent voice.
- He has no export workflow. He does not know how to go from Google Docs to a professional book format.
- The organizational overhead is so high that he procrastinates by doing more "research" (writing more notes) instead of writing actual chapters.

**What Marcus Fears About Trying DraftCrane:**

- **Lock-in beyond raw text.** The Target Customer articulated this precisely: "What about my chapter organization? What about my inline notes? If I cancel DraftCrane, do I just have a bunch of Google Docs with no structure?" Marcus needs to see that his organized structure survives in Drive as clearly named chapter files (e.g., "Chapter 1 - Introduction.html" per Tech Lead's Drive file structure), not just a blob of content.
- **AI that makes things worse.** He has experienced the ChatGPT cycle: paste in, get generic output, spend time fixing it, wonder if it would have been faster to just edit himself. The AI rewrite must beat "doing it myself" on the first or second attempt.
- **Another tool to learn.** He tried Scrivener and abandoned it (ref: Target Customer, Competitor Analyst Section 4.1). DraftCrane cannot have a learning curve. The 10-second test is non-negotiable.

**What Marcus Needs from DraftCrane Phase 0:**

- A chapter-based structure with one canonical document per chapter, not a folder of fragments.
- Connection to his Google Drive so his writing is saved in his own cloud.
- Inline AI rewriting that accepts freeform instructions so he can specify tone ("more conversational, mentor-like") without re-explaining it every time.
- Auto-save that he trusts. He has lost work before by accidentally closing a Safari tab.
- The ability to reorder chapters by dragging them in the sidebar, because he will reorganize his structure multiple times as the book takes shape (ref: BA US-012A).
- Export to PDF so he can see a chapter as a tangible artifact and share it with a trusted colleague for feedback.
- A word count per chapter and for the book total so he knows which chapters are thin and which are solid (ref: BA US-024).
- Good paste handling so he can copy content from his existing Google Docs into DraftCrane chapters as a manual migration path.

---

## 2. Phase 0 User Journey Map

This journey maps the complete Phase 0 experience from first visit to first PDF export. Diane and Marcus are referenced throughout. Each step cross-references the relevant BA user stories and Tech Lead API endpoints.

### Step 1: Landing Page

**Relevant:** Pre-auth. No user stories apply (landing page is marketing, not application).

**What the user sees:** A simple page with the DraftCrane name, the tagline ("Your book. Your files. Your cloud. With an AI writing partner."), a brief 2-3 sentence description, and a single prominent "Get Started" button. Below the fold: three short bullet points explaining what DraftCrane does (write chapters, use AI to improve your writing, export as PDF). No feature matrix, no pricing table, no screenshots carousel.

**What the user does:** Reads the tagline, skims the bullets, taps "Get Started."

**What the system does:** Navigates to the sign-in screen.

**Friction points:** If the landing page looks like a software product aimed at developers, both Diane and Marcus will bounce. The language must feel like it was written for an author, not a technologist. The Target Customer was explicit: "If the landing page talks about 'Cloudflare Workers' or 'AI orchestration,' I am gone." Avoid words like "platform," "integrate," "workflow," "pipeline," "orchestration" (ref: Competitor Analyst Section 6 positioning caveats). Use words like "write," "organize," "export," "your book," "your files."

**10-second test:** A management consultant sees "write a book, AI helps, your files stay yours" and taps Get Started. Pass.

---

### Step 2: Sign In

**Relevant:** BA US-001 (Sign Up), US-002 (Sign In), US-004 (Session Persistence). Tech Lead Flow A steps 1-5.

**What the user sees:** A clean authentication screen (powered by Clerk). Options: "Continue with Google" (prominent, primary) and email/password as secondary. The Google option is emphasized because every target user has a Google account (they use Google Drive). The BA's Round 2 confirmed Google sign-in is Phase 0 scope.

**What the user does:** Taps "Continue with Google." Completes Google's OAuth flow (account selection, permission grant).

**What the system does:** Creates the user account via Clerk. Returns to DraftCrane. The user is now authenticated. Clerk issues a session JWT stored as an httpOnly cookie (Tech Lead Section 3.4). Session lifetime: 30 days (PM decision, BA US-004).

**Design note:** The BA's US-001 includes email/password as a secondary path, which must exist. But the visual hierarchy must make the Google button the dominant action. Reasons: (a) every target user has a Google account, (b) it reduces friction by one step, (c) it primes the user for the Google Drive connection that follows.

**Friction points:**

- If the OAuth permission screen asks for too many scopes, users will hesitate. At sign-in, request only authentication scopes via Clerk. Do not request Drive access here. That comes later, in context, when the user understands why (ref: Tech Lead Flow A, BA US-005 business rules).
- On iPad Safari, the OAuth popup behavior can be unpredictable. Use redirect-based OAuth flow, not popup-based, to avoid Safari's popup blocker (ref: BA US-005 acceptance criteria, Tech Lead Section 3.4 specifying redirect-only).

**10-second test:** "Continue with Google" is the obvious action. Pass.

---

### Step 3: First-Run -- Create Your Book Project

**Relevant:** BA US-009 (Create a Project). Tech Lead: `POST /projects`.

**What the user sees:** A focused, single-purpose screen: "Let's set up your book." Two fields:

1. Book title (text input, placeholder: "e.g., The Operational Leader")
2. A brief description of your book (textarea, optional, placeholder: "e.g., A practical guide for managers who want to build systems, not just manage people." -- 1-2 sentences.)

Helper text below the title: "This is a working title. You can change it anytime."
Helper text below the description: "Just a sentence or two. This helps your AI writing partner understand your book."

A "Create Book" button below.

No audience field. No tone picker. No length target. Those belong to Phase 1 (Book Blueprint). Phase 0 asks only what is necessary to create a meaningful project container.

**Technical note:** The Tech Lead's `projects` table includes a `description TEXT` column (added in Round 2 Migration 0003). The BA's US-009 confirms both title (required, max 500 characters) and description (optional, max 1,000 characters).

**What the user does:** Types a working title and optionally a short description. Taps "Create Book."

**What the system does:** Creates a project record in D1 via `POST /projects`. Creates a default chapter: "Chapter 1" with an empty document via `POST /projects/:projectId/chapters`. Navigates the user to the Writing Environment.

**Addressing the "empty project" concern:** The Target Customer and Competitor Analyst both warned that a blank project feels deflating. Phase 0 cannot solve this fully (Source Intelligence is Phase 2), but the design mitigates it in three ways:

1. The project setup is fast (two fields, one button) so the user does not spend time configuring without writing.
2. The Drive connection prompt follows immediately, signaling that DraftCrane cares about the user's existing content.
3. The first-time tooltip in the Writing Environment includes guidance to paste existing content: "Have existing notes? Just paste them into a chapter to get started."

**Friction points:**

- Marcus might hesitate at "book title" because his title is not final. The "You can change this anytime" helper text addresses this.
- Diane might overthink the description. Keeping it optional prevents blocking.

**10-second test:** Two fields and a button. Pass.

---

### Step 4: Connect Google Drive (Contextual, Not Blocking)

**Relevant:** BA US-005 (Connect Google Drive), US-006 (Select Book Folder). Tech Lead Flow A steps 6-15. Tech Lead API: `GET /drive/authorize`, `GET /drive/callback`, `POST /drive/folders`.

**What the user sees:** After project creation, the Writing Environment loads. A non-blocking prompt appears (a gentle banner or card, not a modal): "Connect your Google Drive to keep your book safe and access your files." Button: "Connect Google Drive." Secondary link: "Maybe later."

The text is chosen carefully. The Target Customer's primary concern is file safety. "Keep your book safe" speaks to that anxiety more directly than "save your book" or "sync your files."

**What the user does (Diane):** She might tap "Maybe later" to explore the editor first. The banner collapses. She can connect later from Settings or when she tries to export.

**What the user does (Marcus):** He taps "Connect Google Drive" because he wants his book in his own cloud.

**What the system does (on connect):**

1. Frontend calls `GET /drive/authorize`. The API returns a Google OAuth URL with `drive.file` scope.
2. Safari redirects to Google's consent screen. The consent screen says: "DraftCrane will be able to see, edit, create, and delete only the files you use with this app." (Google's standard wording for `drive.file`.)
3. User taps "Allow." Google redirects to `GET /drive/callback`. The API exchanges the code for tokens and stores them encrypted in D1 (`drive_connections` table).

4. **Folder creation flow:**

   After OAuth completes, DraftCrane displays: "Where should we save your book? We will create a folder called '[Book Title]' in your Google Drive." Button: "Create Book Folder."

   The user taps it. DraftCrane calls `POST /drive/folders` to create the folder via the Drive API. The user sees confirmation: "Created folder 'The Operational Leader' in your Google Drive."

   This approach is the simplest, fastest path. The `drive.file` scope allows DraftCrane to create new folders and access DraftCrane-created files. It does not allow browsing the user's full existing Drive folder tree. Auto-creating a folder avoids this limitation entirely.

   **Trust-building detail:** After creation, add a link: "View in Google Drive" (opens the folder in a new tab). This lets the user verify their files are really there. The Target Customer explicitly mentioned wanting to verify this.

5. **Confirmation.** The banner updates to show: "Connected to Google Drive. Your book saves to: [Folder Name]." with a small green checkmark. The banner can be dismissed. The Drive connection status is also visible in Settings.

6. **System action:** DraftCrane stores the OAuth tokens server-side only (per Tech Lead Section 3.4). The folder ID is stored in D1 (`projects.drive_folder_id`). Auto-save now writes chapter content to Google Drive as HTML files. The existing default chapter ("Chapter 1") is saved as an HTML file in the new folder.

**What the system does (on "Maybe later"):** The book project is created. Content saves to IndexedDB locally on every keystroke. A persistent but unobtrusive indicator appears: "Not connected to Google Drive. Your work is saved on this device only." This is a degraded state -- the user's content is NOT in their Drive and does NOT fulfill the "your files, your cloud" promise.

When the user eventually connects Drive, DraftCrane syncs all existing chapter content from IndexedDB to the new Drive folder. The user is informed: "Your chapters have been saved to Google Drive."

**Friction points:**

- The Target Customer said: "I do not want to upload my intellectual property to some startup's server and pray they do not go out of business." The "Maybe later" state where content lives only in the browser's IndexedDB directly undermines this concern. The messaging must be transparent and slightly urgent (without blocking): "Your work is currently saved on this device only. Connect Google Drive to keep your files in your own cloud."
- Folder creation via auto-create is simple but the user cannot select an existing folder. For Marcus (who has an existing "Book Project" folder), this is slightly frustrating -- but his existing files are not accessible to DraftCrane under `drive.file` scope anyway. See Unresolved Issues for the scope tension around existing folders.

**10-second test:** "Connect Google Drive" with a clear explanation of why. "Maybe later" available. Pass.

---

### Step 5: The Writing Environment -- Orientation

**Relevant:** BA US-011 (Edit Chapter Content), US-012 (Chapter Navigation), US-024 (Word Count Display). All further interactions happen here.

**What the user sees (first time):** The main writing interface with three zones:

1. **Sidebar (left):** Chapter list showing "Chapter 1" (the default). A "+" button to add chapters. The book title at the top. Below each chapter name, a word count in small, muted text (e.g., "0 words"). At the bottom of the sidebar, a total word count: "Book total: 0 words." (ref: BA US-024.)
2. **Editor (center/main):** A clean, full-width writing area with a blinking cursor. The chapter title "Chapter 1" is editable at the top. Below it, placeholder text: "Start writing, or paste your existing notes here..." in light gray.
3. **Toolbar (top):** Minimal formatting controls -- Bold, Italic, Heading (H2/H3 dropdown -- H1 is reserved for chapter title), List (bullet/numbered), Block quote, and a divider. On the right side of the toolbar: save status indicator ("Saved"), an Export button, and a Settings gear icon. No font picker. No color picker. No table tools. Less is more.

**Revised placeholder text:** The placeholder reads "Start writing, or paste your existing notes here..." instead of the Round 2 "Start writing here..." This acknowledges the Target Customer's reality (she has existing content) and provides a concrete action (paste). It is one sentence of text, costs nothing to implement, and communicates that DraftCrane expects the user to bring existing material.

A brief first-time tooltip or coaching overlay (3 steps max, dismissible):

- "This is your chapter. Start writing or paste your existing notes."
- "Use the sidebar to add and switch between chapters."
- "Select any text and tap the AI button to improve it."

**What the user does:** Dismisses the tooltip (or reads it). Taps into the editor and begins writing or pasting.

**What the system does:** The editor is ready. Auto-save begins silently. The sidebar is interactive.

**Friction points:**

- If the editor looks too minimal, Diane might wonder "is this it?" The design needs to feel intentional, not unfinished. Clean typography, good spacing, and a professional feel communicate quality. The Competitor Analyst emphasized this via Vellum's design-first philosophy (Section 4.3): "The writing environment should feel calm, focused, and intentionally designed."
- If the sidebar takes up too much space on iPad, it competes with the writing area. See the Sidebar Behavior section in Information Architecture below for responsive rules.
- The formatting toolbar must not interfere with iPadOS's own text formatting bar. Test for conflicts with the Smart Keyboard's shortcut bar.

**10-second test:** Diane sees a chapter list with word counts, a writing area, and a formatting bar. She taps into the editor and types. Pass.

---

### Step 6: Writing -- The Core Loop

**Relevant:** BA US-011 (Edit Chapter Content), US-015 (Auto-Save), US-024 (Word Count Display). Tech Lead Flow B (Write and Auto-Save). Tech Lead API: `PUT /chapters/:chapterId/content`.

**What the user sees:** Their text appearing in the editor. Clean, readable typography (18px base size for iPad, generous line height of 1.6-1.7). Formatting applied via toolbar or keyboard shortcuts (Cmd+B, Cmd+I for users with Smart Keyboard).

**What the user does:** Writes. Edits. Pastes content from existing Google Docs. Navigates between chapters using the sidebar. Creates new chapters with the "+" button. Renames chapters by tapping the chapter title and editing inline. Reorders chapters by long-pressing and dragging in the sidebar (ref: BA US-012A).

**What the system does:**

- **Auto-save:** After a brief interval of inactivity following a change, content is saved. The save writes to Google Drive via `PUT /chapters/:chapterId/content` with a `version` header for conflict detection (Tech Lead Flow B). A subtle indicator shows save status in the toolbar area. Three states: "Saving..." (brief, during API call), "Saved" with a small checkmark, and "Unable to save. Will retry." (on failure, with exponential backoff per Tech Lead Section 3.3).

- **Local buffer (crash protection):** On every keystroke, content is written to IndexedDB as a write-ahead log (Tech Lead Three-Tier Save Architecture). On editor mount, the system compares IndexedDB content with the Drive version. If IndexedDB is newer, a recovery prompt appears: "We found unsaved changes from your last session. Restore them?" with "Restore" and "Discard" options.

- **Save destination:** If Google Drive is connected, content saves to an HTML file in the Book Folder (one file per chapter, per Tech Lead Section 2 Google Drive File Structure). If Drive is not connected, content exists only in IndexedDB and the save indicator clearly communicates this reduced state.

- **Chapter management:** Chapters are ordered. The user can reorder by long-press and drag in the sidebar (standard iPadOS reordering gesture). The sidebar shows a subtle drag handle icon (three horizontal lines) on each chapter item. New chapters are created at the end of the list via `POST /projects/:projectId/chapters`. Reordering calls `PATCH /projects/:projectId/chapters/reorder` with the new sort order.

- **Word count update:** After each auto-save, the word count for the current chapter updates in the sidebar. The book total updates simultaneously. This is derived from the `word_count` field in D1 (`chapters` table). A real-time word count in the editor footer updates as the user types (client-side calculation). The selection word count also displays when text is selected (ref: BA US-024: "142 / 3,400 words").

- **Paste handling (critical for existing-content users):** When Marcus copies 2,000 words from an existing Google Doc and pastes into a DraftCrane chapter, the editor preserves supported formatting (bold, italic, headings, lists, block quotes) and silently strips unsupported formatting (tables, images, colored text, custom fonts). No notification is shown for stripped formatting in Phase 0 (ref: BA US-011 edge case, resolved as "silent strip"). This must be tested thoroughly: paste from Google Docs in Safari, paste from Apple Notes, paste from email. The paste experience is the primary manual migration path for users with existing content.

**Friction points:**

- Auto-save feedback is critical. Both Diane and Marcus have anxiety about losing work. The "Saved" indicator must be visible but not distracting. It appears in the same place every time (right side of toolbar) so users build trust through repetition.
- Marcus presses Cmd+S out of habit. This triggers an immediate save and the "Saved" indicator updates. No "you don't need to save" message. Just let it work (ref: BA US-011, US-015).
- The virtual keyboard on iPad consumes roughly 40-50% of the screen in portrait mode. The editor must scroll properly so the cursor and current line of text are always visible above the keyboard. Use the `visualViewport` API to detect keyboard presence and adjust layout. This is a common failure in web-based editors on iPad -- test relentlessly.
- When switching between chapters (via sidebar tap), the editor should restore scroll position. If Diane was on paragraph 12 of Chapter 3, and she switches to Chapter 1 and back, she should return to paragraph 12. Scroll positions are stored in-memory per chapter during the session.

**10-second test:** The user writes, sees "Saved," and trusts it. Pass.

---

### Step 7: AI Rewrite -- Select, Request, Review

**Relevant:** BA US-016 (Select Text for AI Rewrite), US-017 (Request AI Rewrite), US-018 (Accept or Reject AI Suggestion). Tech Lead Flow C (AI Rewrite). Tech Lead API: `POST /ai/rewrite` (SSE response), `POST /ai/interactions/:interactionId/accept`, `POST /ai/interactions/:interactionId/reject`.

**What the user sees (trigger):** After selecting text in the editor (via touch: tap-and-hold, then drag selection handles), a floating action bar appears near the selection. This bar is a rounded pill-shaped element positioned just above or below the selected text (whichever has more space), separate from the iPadOS native text menu (Cut/Copy/Paste). It contains a single button: "AI Rewrite" with a small icon and text label.

The floating bar is separate from the native menu to avoid fighting with iPadOS's context menu behavior. It appears approximately 200ms after the native menu, positioned on the opposite side of the selection (if native menu is above, our bar is below, and vice versa). It tracks the selection bounds if the user adjusts handles.

**What the user does:** Selects a paragraph or sentence she is unhappy with. Taps "AI Rewrite."

**What the user sees (request):** A compact bottom sheet slides up from the bottom of the screen. The bottom sheet shows:

- **Header:** "Rewrite this passage"
- **The selected text** displayed in a quoted block (scrollable if long), slightly muted in color
- **Instruction input:** A text field with placeholder text: "How should I change this?" Below the field, a row of suggestion chips: "Simpler language" | "More concise" | "More conversational" | "Stronger" | "Expand"
- **Action button:** "Rewrite" (disabled until the user types something or taps a chip)

The suggestion chips are Phase 0's lightweight version of Phase 1's Craft Buttons. They map to the AI actions specified in BA US-017. The freeform text input allows instructions like Marcus's "more conversational, mentor-like tone" or the Target Customer's "simpler language and more concise, about half the length." This is NOT "Ask Mode" (Phase 1's full chat interface). It is a single-purpose instruction field scoped to the selected text.

**What the user does:** Diane taps the "Simpler language" chip. Or Marcus types "more conversational, like a mentor talking to a peer" in the instruction field. The chips and freeform text field are not mutually exclusive -- the user can tap a chip, then edit the text in the instruction field to refine it.

**What the system does:**

1. Frontend sends `POST /ai/rewrite` with: `chapter_id`, `selected_text`, `instruction` (chip label or freeform text), and `surrounding_context` (500 chars before and after the selection, per Tech Lead Flow C).
2. The API validates the request (auth, ownership, content length limits: max 2,000 words selected per BA US-016; rate limit: 10 req/min/user per Tech Lead).
3. The API builds a Claude prompt and sends it to the Anthropic API (direct integration, per Tech Lead ADR-003).
4. The response streams back via SSE (Server-Sent Events). The frontend begins displaying the rewritten text token by token in the bottom sheet.

**What the user sees (loading/streaming):**

- The bottom sheet shows "Rewriting..." with a subtle animation.
- Within 1-2 seconds (Tech Lead performance target: first token < 2 seconds), the rewritten text begins appearing word by word in the bottom sheet.
- The streaming display reduces perceived wait time. The user watches the AI "write" rather than staring at a spinner.

**What the user sees (review):** The bottom sheet now shows:

- **Original text:** collapsible section (tappable header "Original" with a chevron), collapsed by default to save space
- **Rewritten text:** prominently displayed in a card or highlighted block
- **Actions:** "Use This" (primary button, prominent color) | "Try Again" (secondary) | "Discard" (tertiary/text-only link, less prominent)
- "Use This" and "Discard" are separated by at least 16pt of space to prevent mis-taps. Both are minimum 48pt tall (ref: BA US-018 acceptance criteria).

**If the user taps "Try Again":**

- The instruction input reappears. The previous instruction is still populated. The user can edit it ("Simpler language" becomes "Simpler language and more concise. About half the length.").
- She taps "Rewrite" again. New SSE stream. New result appears.
- The original text is always preserved until "Use This" is explicitly tapped. "Try Again" never loses the original.
- There is no limit on "Try Again" iterations (ref: BA US-018 business rules). Each iteration is a new API call subject to rate limiting.

**If the user taps "Use This":**

- The bottom sheet animates closed (or appears instantly if `prefers-reduced-motion` is enabled).
- In the editor, the original text is replaced with the rewritten version. A brief visual highlight (subtle background color flash lasting approximately 1 second) marks the replaced text to orient the user.
- The text is now part of the document. Auto-save triggers (Flow B).
- The frontend calls `POST /ai/interactions/:interactionId/accept` to log the acceptance in `ai_interactions` (metadata only, per Tech Lead Section 2).
- CRITICAL: This action is undoable. Cmd+Z (or undo button) reverts to the original text. The user must never feel that accepting an AI rewrite is permanent (ref: BA US-018, Target Customer Section 2).

**If the user taps "Discard":**

- The bottom sheet closes. The original text remains unchanged. Nothing happened.
- The frontend calls `POST /ai/interactions/:interactionId/reject` to log the rejection.

**If the user taps elsewhere in the editor without choosing:**

- The bottom sheet closes. Original text is preserved. Treated as a discard (ref: BA US-018).

**Friction points:**

- Text selection on iPad Safari is finicky. Long-press selects a word; dragging handles is imprecise. The AI Rewrite floating bar must appear reliably and not interfere with selection handles. Test with paragraphs of varying length.
- If the user selects text while the virtual keyboard is open, the keyboard should dismiss first, then the bottom sheet appears. The editor should scroll to keep the selected text visible above the bottom sheet.
- Loading time target: first token < 2 seconds, complete rewrite of 500 words < 15 seconds (Tech Lead Section 3.2). Streaming text ensures the user sees progress immediately.
- The suggestion chips serve a dual purpose: they provide guidance for users who do not know "how to talk to AI" (Diane), and they offer a fast path for experienced users who want a quick transformation (Marcus).

**10-second test:** Diane selects text, taps "AI Rewrite," taps "Simpler language," watches the streaming result, taps "Use This." Five steps, each obvious. Pass.

---

### Step 8: Adding and Managing Chapters

**Relevant:** BA US-010 (Create a Chapter), US-012A (Reorder Chapters), US-013 (Rename a Chapter), US-014 (Delete a Chapter). Tech Lead API: `POST /projects/:projectId/chapters`, `PATCH /chapters/:chapterId`, `DELETE /chapters/:chapterId`, `PATCH /projects/:projectId/chapters/reorder`.

**What the user sees:** In the sidebar, the list of chapters with a "+" button at the bottom of the chapter list. Each chapter shows its title and word count. A drag handle icon (three horizontal lines) is visible on each chapter item.

**Creating a chapter:** The user taps "+." A new chapter appears at the bottom of the sidebar with an editable title field active: "Untitled Chapter" is pre-filled and selected (ref: BA US-010). The user types a chapter name and taps into the editor to begin writing. The editor loads the new empty chapter. If Google Drive is connected, a corresponding HTML file is created in the Book Folder.

**Renaming a chapter:** The user double-taps (or long-presses then taps "Rename") the chapter title in the sidebar. The title becomes an inline editable text field. The user types a new name and taps away or presses Enter. If the title is cleared, it reverts to "Untitled Chapter" (ref: BA US-013). Maximum title length: 200 characters (ref: BA US-013 business rules). If the chapter is renamed and Google Drive is connected, the corresponding Drive file is renamed to match.

**Reordering chapters:** The user long-presses on a chapter in the sidebar. After a brief visual lift (the item subtly elevates), the user drags it to a new position. A line indicator shows the drop target. On release, chapters renumber. The system calls `PATCH /projects/:projectId/chapters/reorder` with the new sort order (ref: BA US-012A).

**Deleting a chapter:** The user long-presses a chapter and a context action appears (a small "..." menu or a delete option in a slide-over). Tapping "Delete" triggers a confirmation: "Delete '[Chapter Title]'? This cannot be undone in DraftCrane." The user confirms. The chapter is removed from the sidebar and the editor navigates to the nearest remaining chapter. A project must always have at least one chapter (ref: BA US-014). If Google Drive is connected, the corresponding HTML file is moved to Drive's trash, not permanently deleted (ref: Tech Lead API: `DELETE /chapters/:chapterId`). Drive trash retains files for 30 days, providing a recovery path.

**10-second test:** Tap "+," type a name. Long-press and drag to reorder. Pass.

---

### Step 9: Export to PDF / EPUB

**Relevant:** BA US-019 (Generate PDF), US-020 (Generate EPUB), US-021 (Save Export to Drive), US-022 (Download Export Locally). Tech Lead API: `POST /projects/:projectId/export`, `GET /export/:jobId`, `POST /export/:jobId/to-drive`.

**What the user sees:** An "Export" button in the toolbar (right side, near Settings). Tapping it reveals a compact dropdown or bottom sheet with options: "Export Book as PDF," "Export Book as EPUB," and "Export This Chapter as PDF" (ref: BA US-019 acceptance criteria for single-chapter export).

**What the user does:** Diane taps "Export" then "Export Book as PDF."

**What the system does:**

1. Frontend calls `POST /projects/:projectId/export` with `{ format: "pdf" }`. Returns a job ID. If no chapters have content, the request is rejected with: "Add content to at least one chapter before exporting." (ref: BA US-019.)
2. Frontend polls `GET /export/:jobId` for status.
3. Shows a loading state in the export area: "Generating your PDF..." with a progress indicator.
4. The server compiles all chapters in order (empty chapters excluded) into a single formatted PDF. The PDF includes:
   - A simple title page (book title, author name)
   - A table of contents with chapter titles
   - All chapters in order with chapter titles as H1 headings
   - Page numbers
   - Professional typography: readable serif font, proper margins, line spacing
   - Page size: US Trade (5.5" x 8.5") (ref: BA US-019 business rules)
   - File named with a date stamp: `{Book Title} - YYYY-MM-DD.pdf` (ref: BA export naming convention)
5. When the job completes, the export area shows the result with two equal options:
   - "Save to Google Drive" (if Drive is connected) -- calls `POST /export/:jobId/to-drive`
   - "Download" -- triggers browser download via a signed R2 URL

If Drive is connected, both options are available. If Drive is not connected, only "Download" appears -- no blocking prompt to connect Drive (ref: BA US-022).

**What the user sees (result):** After "Save to Google Drive": "Saved to Google Drive: [filename]" with a "View in Drive" link. After "Download": standard browser download behavior (on iPad, the file goes to the Files app).

**Export quality standard:** The PDF must look like a book, not a printed web page. The Competitor Analyst (Section 4.2) and Target Customer both emphasize this. Even in Phase 0 with a single default template:

- Title page: centered book title and author name
- Table of contents with chapter names
- Chapter starts on a new page
- Consistent margins
- Readable serif font (e.g., Georgia, Libre Baskerville)
- 11-12pt body text with 1.5 line spacing
- Page numbers

This is the "artifact moment" where the user sees their work as a real book for the first time. Diane will feel a surge of motivation. Marcus will share it with a colleague. The psychological impact is outsized relative to the engineering effort. The PM's minimum quality bar: "good enough that an author would share this with a trusted colleague or developmental editor without apologizing for how it looks" (PM Section 7, ADR-004).

**Friction points:**

- PDF generation must be fast enough. Target < 10 seconds for a 10-chapter book, < 30 seconds for a large manuscript. Show a progress indicator so the user knows something is happening.
- On iPad Safari, browser downloads go to the Files app with subtle notification. When Drive is connected, "Save to Google Drive" should be the recommended/default action, with "Download" as secondary.
- The EPUB must be valid EPUB 3.0 and open correctly in Apple Books (ref: BA US-020). Test on actual iPad with Apple Books.

**10-second test:** Diane taps Export, taps PDF, waits a few seconds, taps "Save to Google Drive," sees confirmation. Pass.

---

## 3. Information Architecture

### Primary Screens/Views (Phase 0)

Phase 0 has exactly four screens:

1. **Landing / Marketing Page** -- Pre-auth. Explains the product, has "Get Started."
2. **Auth Screen** -- Sign in / sign up via Clerk.
3. **Book Setup Screen** -- First-run and new-project creation only. Book title + description. Appears only when creating a new project.
4. **Writing Environment** -- The main screen. This is where the user spends 95% of their time.

**Note on multi-project support:** The BA (US-009) confirmed multiple projects per user are supported. The PM endorsed this in the data model while keeping a single-project UI experience for Phase 0. If a user has multiple books, a minimal project switcher is needed. This should be a simple dropdown in the toolbar or sidebar header ("My Books: [current book title] [v]") rather than a separate dashboard screen. Do not build a full dashboard with cards, thumbnails, and metadata. The user opens DraftCrane and is writing immediately. If they have multiple books, switching is a one-tap action from within the Writing Environment.

### Writing Environment Layout

The Writing Environment is a single screen with regions, not multiple screens:

```
+---------------------------------------------------+
|  [Toolbar]                                         |
|  [Book Title v] | B I H2 H3 Ul Ol Bq | Saved | Export | Settings |
+--------+------------------------------------------+
|        |                                           |
| Side-  |  Editor                                   |
| bar    |                                           |
|        |  [Chapter Title - editable]               |
| Ch 1   |                                           |
|  342w  |  Body text area...                        |
| Ch 2   |                                           |
|  1,207w|                                           |
| Ch 3 * |                         142 / 3,400 words |
|  0w    |                                           |
| [+]    |                                           |
|        |                                           |
| Total: |                                           |
| 1,549w |                                           |
+--------+------------------------------------------+
```

### Navigation Model

**Primary navigation:** Sidebar chapter list. Tapping a chapter loads it in the editor. The active chapter is visually highlighted.

**Secondary navigation:**

- Toolbar: Export, Settings (gear icon).
- Settings contains: Google Drive connection/management, Account, Sign Out.
- If multi-project: a book-switching dropdown in the toolbar or sidebar header.

**There is no "dashboard."** Opening DraftCrane takes the user directly to their Writing Environment, with the last-edited chapter loaded. No landing screen, no project picker, no dashboard of cards. The user opens the app and they are writing (ref: PM Principle 4 -- structure reduces overwhelm; Target Customer Section 4 -- "setup without progress" is a close-the-tab moment).

### Sidebar Behavior

**Content:**

- Book title (displayed at top, tappable for multi-book switching if supported)
- Ordered list of chapters (name, word count in muted text below name)
- Drag handle icon on each chapter item (three horizontal lines, visible on touch-hold)
- "+" button to add a chapter at the bottom
- Active chapter highlighted with a left border accent and bold title
- Total word count at the bottom of the chapter list in muted text

**Responsive behavior:**

- **iPad Landscape (1024pt+ width):** Sidebar is persistent, occupying approximately 240-280pt on the left. Collapsible via a toggle button (hamburger icon) at the top of the sidebar. When collapsed, the editor expands to full width. (ref: BA US-012 responsive rules.)
- **iPad Portrait (768pt width):** Sidebar is hidden by default. A small persistent indicator shows at the left edge: a tab or pill showing the current chapter name/number (e.g., "Ch 3") that the user can tap or swipe-right to reveal the sidebar. When revealed, the sidebar overlays the editor (does not push it). Tap outside or swipe left to dismiss. This ensures the user always knows which chapter they are in, even with the sidebar collapsed.
- **Desktop (1200pt+ width):** Sidebar is persistent. Same as iPad landscape, with more room.

### Main Content Area

The editor occupies all horizontal space not taken by the sidebar. Content is centered within the editor pane with comfortable margins (maximum content width of approximately 680-720pt, similar to a book page or Medium article, per BA US-011). This prevents uncomfortably long lines on wide screens while maintaining the feeling of writing in a book.

### Minimum Viable Navigation Summary

The user needs exactly four navigation actions in Phase 0:

1. Switch between chapters (sidebar)
2. Reorder chapters (drag in sidebar)
3. Export their book (toolbar)
4. Manage their account/Drive connection (Settings menu)

Everything else happens inside the editor.

---

## 4. iPad-First Design Constraints

### Touch Target Sizes

- **Minimum touch target:** 44x44pt (Apple HIG standard). This applies to all buttons, chapter list items, toolbar icons, and interactive elements.
- **Chapter list items:** Full-width of sidebar, minimum 48pt tall with adequate padding. Tap target is the entire row, not just the text.
- **Toolbar buttons:** 44x44pt minimum. Spacing between toolbar buttons: minimum 8pt to prevent mis-taps.
- **AI Rewrite floating button:** At least 48x48pt because the user's thumb is in motion near text they are trying to preserve.
- **"Use This" / "Discard" buttons in AI review bottom sheet:** Minimum 48pt tall, minimum 16pt gap between them. Accidental "Discard" when you meant "Use This" is a destructive error. "Use This" is visually prominent (filled primary color); "Discard" is visually subdued (text-only link).
- **Suggestion chips in AI bottom sheet:** Minimum 36pt tall, minimum 8pt spacing between chips. Chips must be large enough for confident tap selection.

### Keyboard Handling

**Virtual keyboard (on-screen):**

- When the virtual keyboard appears, it typically occupies 40-50% of the screen in portrait mode and 30-40% in landscape.
- The editor must resize or scroll so that the cursor and active line of text are always visible above the keyboard. Use the `visualViewport` API to detect keyboard presence and adjust layout (ref: Tech Lead NFR Section 3.1).
- The formatting toolbar must remain accessible when the keyboard is open. Keep it pinned at the top of the screen (the editor area between toolbar and keyboard is the writing zone).
- The AI Rewrite bottom sheet must account for keyboard state. If the user triggers AI Rewrite with the keyboard open, the keyboard should dismiss first (since the user is now reviewing, not typing), then the bottom sheet appears.

**External keyboard (Smart Keyboard Folio, Magic Keyboard):**

- When an external keyboard is connected, the virtual keyboard does not appear. The full screen is available for the editor.
- Support standard keyboard shortcuts: Cmd+B (bold), Cmd+I (italic), Cmd+Z (undo), Cmd+Shift+Z (redo), Cmd+S (save -- triggers immediate save and updates indicator).
- The formatting toolbar should show keyboard shortcut hints on hover/long-press for discoverability but should not require them.

### Text Selection and Manipulation (Critical for AI Rewrite)

- Text selection on iPadOS Safari uses the native long-press-to-select, then drag-handles-to-extend pattern. DraftCrane must not interfere with this. Custom selection handling (overriding touch events on the editor) is a recipe for frustration.
- After text is selected, iPadOS shows a native context menu (Cut, Copy, Paste, Look Up, etc.). DraftCrane shows a separate floating toolbar nearby containing the "AI Rewrite" button. This avoids fighting with the native context menu.
- The floating toolbar must reposition if the user adjusts their selection (handles move). It should track the selection bounds.
- **Edge case:** If the user selects text spanning multiple paragraphs or large blocks, the AI Rewrite action should still work (up to the 2,000-word limit per Tech Lead and BA content length constraint). The bottom sheet should scroll if the original text display is long.

### Split View and Slide Over

**Decision: Do not actively support Split View or Slide Over in Phase 0.**

Rationale: DraftCrane's Writing Environment needs screen real estate. Supporting these modes would require a fully responsive layout with multiple breakpoints that adds significant complexity for an edge case.

**However:** DraftCrane must not break in Split View. If a user drags DraftCrane into Split View, it should remain functional (no layout explosions, no overlapping elements). The sidebar should auto-collapse in narrow widths, and the editor should remain usable as a single column. This is a "do not crash" requirement, not an "optimize for" requirement (ref: Tech Lead NFR Section 3.1 on Split View resilience).

### Landscape vs. Portrait

- **Landscape is the primary writing mode.** When the iPad is in landscape with a keyboard attached, DraftCrane has approximately 1024x768pt of usable space (minus browser chrome). This is the design target.
- **Portrait is the secondary reading/review mode.** Users like Marcus switch to portrait when reading. The editor should be comfortable to read in portrait: single column, generous margins, no sidebar visible by default. The persistent chapter indicator (the small "Ch 3" tab on the left edge) provides orientation without consuming space.
- The layout must respond fluidly to orientation changes. No page reloads, no content jumps, no lost scroll position. Orientation change is a CSS/layout event, not a navigation event (ref: Tech Lead NFR Section 3.1).

### Safari-Specific Limitations

- **Toolbar positioning:** Safari's address bar collapses and expands as the user scrolls. DraftCrane's toolbar should be fixed/sticky at the top and account for the safe area inset. Use `env(safe-area-inset-top)` CSS.
- **Bottom safe area:** Bottom sheets and fixed bottom elements must not overlap the home indicator. Use `env(safe-area-inset-bottom)`.
- **File downloads:** Safari handles downloads differently than Chrome. Downloaded files go to the Files app. For PDF export, prefer saving to Google Drive with a direct link rather than relying on browser download. When download is the only option, display clear post-download messaging: "Your file was saved. Check the Downloads folder in the Files app."
- **`100vh` issue:** On Safari, `100vh` includes the area behind the address bar. Use `100dvh` (dynamic viewport height) or the `visualViewport` API for accurate viewport sizing (ref: Tech Lead NFR Section 3.1).
- **`position: fixed` quirks:** Safari on iPadOS has historically had issues with fixed positioning when the virtual keyboard is open. Test toolbar and bottom sheet positioning exhaustively with both virtual and external keyboards.
- **PWA:** Phase 0 should not depend on PWA features, but include a basic web manifest so "Add to Home Screen" produces a reasonable icon and name.

---

## 5. Key Interaction Patterns

### (a) Connecting Google Drive and Selecting a Book Folder

**Relevant:** BA US-005, US-006. Tech Lead Flow A. See Journey Map Step 4 above for the full flow.

This section supplements the journey map with edge cases and recovery patterns.

**Edge cases and recovery:**

- If the user taps "Cancel" during Google OAuth, Safari returns to DraftCrane with Drive not connected. The banner reappears on next visit. No error message -- just the same gentle prompt.
- If OAuth succeeds but folder creation fails (network issue, Drive API error), show: "We could not create your book folder. Tap to try again." The user is not left in a half-connected state. Either the connection is complete (tokens + folder) or it is rolled back (tokens are revoked, user sees "Not Connected").
- If the user later wants to change their Book Folder, they can do so from Settings. Changing the folder means creating a new one and migrating existing chapter files to the new location.
- If the user revokes DraftCrane's Google access from Google's security settings, the next Drive API call fails. DraftCrane shows: "Your Google Drive connection was revoked. Reconnect to keep saving to Drive." The OAuth flow restarts from scratch (ref: BA Drive edge case table).
- **Trust-building detail:** After connecting Drive, add a link in the confirmation banner: "Open your Book Folder in Google Drive" (opens Drive in a new tab). This lets the user verify their files are really there. The Target Customer explicitly mentioned wanting to verify this.

---

### (b) Writing in the Editor

**Relevant:** BA US-011, US-012, US-012A, US-013, US-015, US-024. Tech Lead Flow B. See Journey Map Steps 5-6 above for the full flow.

This section supplements the journey map with Marcus's detailed writing workflow.

**Marcus's session:**

1. Marcus opens DraftCrane in Safari. He is already signed in (persistent session, ref: BA US-004). The Writing Environment loads directly. Chapter 2 is displayed (his last-edited chapter). His scroll position is restored. The sidebar shows all three chapters with word counts: Ch 1 (2,340w), Ch 2 (1,807w), Ch 3 (0w). Book total: 4,147w. Time from Safari load to ready-to-type: target < 3 seconds (Tech Lead Section 3.2).

2. He opens Chapter 3 in the sidebar and pastes 1,200 words from an existing Google Doc. The editor accepts the paste, preserving bold text and headings while silently stripping Google Docs-specific formatting (colored text, custom fonts, tables). The word count updates immediately: Ch 3 (1,200w). Book total: 5,347w.

3. He types additional content with his Smart Keyboard. Text appears immediately. He presses Cmd+B to bold a key phrase. He uses H2 from the toolbar for a subheading.

4. After a pause, "Saved" appears in the toolbar. He continues writing.

5. He wants to move Chapter 3 before Chapter 2. He long-presses "Chapter 3: The Delegation Framework" in the sidebar. The item lifts visually. He drags it above Chapter 2. A line indicator shows the drop target. He releases. Chapters renumber.

6. He creates a new chapter: taps "+", types "The Metrics That Matter", presses Enter. New empty chapter appears. He pastes another 800 words from a different Google Doc. He begins editing.

7. He realizes his Chapter 1 draft has a paragraph that belongs in Chapter 4. He selects the paragraph, cuts it (Cmd+X), navigates to Chapter 4 via the sidebar, positions his cursor, and pastes (Cmd+V). Standard clipboard operations -- no special feature needed.

8. At the end of his session, he has 4 chapters with content, 6,500+ total words, and a visible sense of progress he has never had before in his book project.

**Formatting model (Phase 0 minimum):**

- Bold, Italic (toggle)
- Headings: H1 (chapter title only, auto-applied), H2, H3
- Bullet list, Numbered list
- Block quote
- No font changes. No color. No alignment. No tables. No images (Phase 0).
- These constraints are a feature, not a limitation. Fewer choices means faster writing (ref: Competitor Analyst Section 4.3 on Vellum's opinionated defaults).

---

### (c) Selecting Text and Requesting an AI Rewrite

**Relevant:** BA US-016, US-017, US-018. Tech Lead Flow C. See Journey Map Step 7 above for the full flow.

This section supplements the journey map with Diane's specific scenario.

**Diane's AI Rewrite scenario:**

Diane is working on Chapter 3 of her leadership book. She has written a paragraph about psychological safety that she knows is too jargon-heavy. She is on her iPad in landscape mode with the virtual keyboard retracted.

1. She long-presses on a word in the paragraph. The word highlights with selection handles. She drags the handles to select the full paragraph (approximately 80 words).

2. The native iPadOS text menu (Cut | Copy | Paste) appears briefly. A DraftCrane floating bar appears just below the selection: "AI Rewrite" button.

3. She taps "AI Rewrite." The floating bar dismisses. A bottom sheet slides up.

4. The bottom sheet shows her selected text in a muted block, a text input field with placeholder "How should I change this?", and suggestion chips: "Simpler language" | "More concise" | "More conversational" | "Stronger" | "Expand."

5. She taps "Simpler language." The instruction field fills with "Simpler language." She taps "Rewrite."

6. "Rewriting..." appears. Within 1-2 seconds, text begins streaming into the result area word by word. Within 10-12 seconds, the full rewrite is visible.

7. She reads it. Better, but she wants it shorter too. She taps "Try Again." The instruction field shows "Simpler language." She edits it: "Simpler language and more concise. About half the length." She taps "Rewrite."

8. New streaming result. This one is tighter. She taps "Use This."

9. The bottom sheet closes. In the editor, the original paragraph is replaced. A brief highlight flash marks the new text (respects `prefers-reduced-motion` per accessibility section below). "Saving..." appears, then "Saved."

10. She continues writing. If she decides the rewrite was wrong, Cmd+Z restores the original.

**Important interaction details:**

- The original text is preserved through unlimited "Try Again" cycles until "Use This" is explicitly tapped.
- "Use This" is always undoable via Cmd+Z.
- The suggestion chips and freeform text field are not mutually exclusive. The user can tap a chip, then edit the text in the instruction field to refine it.
- If Diane selects text while the virtual keyboard is open, the keyboard dismisses first, then the bottom sheet appears. This ensures sufficient screen space for the review area.

---

## 6. Accessibility Baseline

### Phase 0 Accessibility Requirements

DraftCrane Phase 0 must meet WCAG 2.1 Level AA as a baseline. This is not aspirational; it is a requirement. The target users include professionals in their 40s-60s who may have age-related vision changes, and the legal landscape for web accessibility makes this a business necessity. The Tech Lead added a dedicated accessibility section in their NFRs (Section 3.6) aligned with these requirements.

### Screen Reader Compatibility

- All interactive elements (buttons, links, form inputs, chapter list items) must have accessible names via proper HTML semantics or ARIA labels.

- **Chapter list:** Must be an ordered list (`<ol>`) or have `role="list"` with proper `role="listitem"` on each chapter. Each chapter item must announce its name, position, and word count: "Chapter 3 of 8: Building Systems That Scale, 1,207 words." If using drag-to-reorder, include `aria-roledescription="sortable"` and instructions for keyboard-based reordering (see keyboard navigation below).

- **Editor:** Must be announced as a text editing region. Use `role="textbox"` with `aria-multiline="true"` and `aria-label` set to the chapter name ("Editing: Chapter 3 - Building Systems That Scale"). The editor library (Tiptap recommended per Tech Lead ADR-001) must support ARIA attributes on the editing surface.

- **AI Rewrite bottom sheet:** Implement as a modal dialog (`role="dialog"`, `aria-modal="true"`, `aria-label="Rewrite passage"`). When it opens, focus moves to the instruction input field. When it closes (via "Use This," "Discard," or Escape), focus returns to the editor at the point where the rewrite was applied or the original text begins. The streaming AI result should be in an `aria-live="polite"` region so screen reader users are informed when the rewrite is complete (announce completion rather than individual streaming tokens, which would be too verbose).

- **Save status indicator:** Must be in an `aria-live="polite"` region. Changes from "Saving..." to "Saved" are announced without interrupting the user's current activity. Error states ("Unable to save") should use `aria-live="assertive"` to ensure the user is immediately informed.

- **Export progress and completion:** Export status updates ("Generating your PDF...", "Saved to Google Drive") must be announced via `aria-live` regions.

### Keyboard Navigation (External Keyboard)

- All functionality must be reachable via keyboard. Tab order: toolbar, then sidebar (if visible), then editor.

- **Sidebar chapter list:** Navigable with arrow keys (up/down to move between chapters, Enter to select/open a chapter). For chapter reordering via keyboard: when a chapter is focused, Ctrl+Up/Ctrl+Down moves the chapter up/down in the list. Screen reader announces the new position ("Chapter 3, moved to position 2 of 8").

- **Formatting toolbar:** Navigable with arrow keys (left/right between buttons, Enter/Space to activate).

- **AI Rewrite bottom sheet:** Traps focus while open (standard modal focus trap). Tab cycles through: original text area, instruction input, suggestion chips, Rewrite button, and (after result appears) Use This / Try Again / Discard buttons. Escape key closes the bottom sheet (equivalent to "Discard").

- **Keyboard shortcuts:** Must not conflict with iPadOS system shortcuts or Safari shortcuts. Verified safe: Cmd+B (bold), Cmd+I (italic), Cmd+Z (undo), Cmd+S (save), Cmd+Shift+Z (redo).

- **Visible focus indicator:** All focusable elements must show a visible focus ring or highlight. Minimum 2px solid outline in a contrasting color. The default browser focus ring is acceptable as a starting point but should be enhanced for visibility against the editor background.

### Color Contrast

- All text must meet WCAG AA contrast ratios: 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt+ bold).
- This applies to: body text in the editor, chapter names in the sidebar, chapter word counts (muted text must still meet 4.5:1), toolbar button labels, button text in the AI Rewrite bottom sheet, placeholder text (which is often too light -- verify contrast), save status text, error messages, and the "Not connected to Google Drive" warning text.
- Do not rely on color alone to convey information. The "Saved" indicator should use text ("Saved") plus an icon (checkmark), not just a green dot. The active chapter in the sidebar should be indicated by background color AND a left border accent AND bold text -- not color alone. Error states should use text labels plus an icon (warning triangle), not just red coloring.

### Font Sizing

- Base font size in the editor: 18px (prevents iOS auto-zoom on input focus and provides comfortable reading). This is the editor's default body text size.
- Sidebar and toolbar text: minimum 14px.
- Use relative units (`rem`, `em`) for font sizes to support user scaling.
- Respect iPadOS Dynamic Type / system font size preferences. At minimum, DraftCrane should not break if the user has increased their system font size. The editor should scale its text proportionally.

### Reduced Motion Preferences

- Respect the `prefers-reduced-motion` media query (ref: Tech Lead NFR Section 3.1). When enabled:
  - The AI Rewrite bottom sheet appears instantly (no slide animation).
  - The "Saved" indicator changes state without transition.
  - Text replacement after AI rewrite happens without the highlight flash.
  - Chapter transitions in the editor are instant (no fade or slide).
  - AI streaming text appears in complete chunks rather than token-by-token animation (the content still streams from the server, but the display updates in larger batches for less visual motion).
- All animations in Phase 0 are non-essential (polish, not function). Disabling them changes nothing about the experience except removing visual motion.

### Additional Accessibility Considerations

- **Touch accommodation:** iPadOS has built-in touch accommodations (hold duration, ignore repeat). DraftCrane's long-press interactions (text selection, chapter reordering) must work with these system settings. Do not implement custom long-press timers that conflict with system accessibility settings.
- **Zoom:** DraftCrane must remain functional when the user pinch-zooms in Safari. Do not set `user-scalable=no` in the viewport meta tag. The app must not break at 200% zoom (WCAG AA requirement, ref: Tech Lead NFR Section 3.6).
- **High contrast mode:** If the user has enabled "Increase Contrast" in iPadOS, ensure borders, separators, and subtle UI elements become more distinct. Test with this setting enabled.

---

## Appendix: Design Principles Summary

For quick reference during implementation, Phase 0 UX follows these principles:

1. **One thing per screen.** Landing page has one CTA. Book setup has two fields. Writing Environment is the only working screen. Do not add dashboards, onboarding wizards, or feature tours.

2. **Show, do not tell.** The tooltip overlay during first-run is three steps maximum. After that, the UI should be self-evident. If it needs explaining, redesign it.

3. **The user's anxiety is about their content, not our software.** Auto-save feedback, undo support, and "your files are in Google Drive" messaging address the real fear: losing their work or losing control (ref: Target Customer Section 2).

4. **AI is a tool, not a presence.** The AI Rewrite feature should feel like a built-in editor function (like spell check), not like a chatbot conversation. No AI avatar, no chat bubbles, no "personality." Just: select text, request improvement, review result, accept or discard (ref: Target Customer Section 6).

5. **Respect the platform.** iPad Safari has specific behaviors. Do not fight them. Use native selection. Use bottom sheets instead of modals. Use swipe gestures where iPadOS users expect them. The best DraftCrane experience feels like it belongs on iPad.

6. **Every pixel of chrome competes with the writing.** Minimize UI. The toolbar is one row. The sidebar is narrow or hidden. The editor is the star. Diane and Marcus are here to write a book, not to use an app (ref: Competitor Analyst Section 4.3).

7. **Progress must be visible.** Word counts, save indicators, and chapter structure all serve one purpose: making Diane and Marcus feel like they are making progress on a real book. The Target Customer said: "I have never had a timeline for this book. Seeing one would make it feel achievable." Phase 0 delivers the basic building block: visible word counts per chapter and total (ref: BA US-024).

8. **Acknowledge existing content.** The user is not starting from nothing. The placeholder text says "paste your existing notes here." The paste handling is tested thoroughly. The Drive connection signals that DraftCrane knows about the user's existing world. Phase 0 cannot organize existing content (that is Phase 2), but it must never pretend the user is a blank slate.

---

## Unresolved Issues

The following are genuine disagreements or ambiguities that require human decision-making. They are not resolved by this document.

### 1. Auto-Save Debounce Interval: 2 Seconds vs. 5 Seconds

**The conflict:** The Tech Lead's Round 2 explicitly changed the debounce to 2 seconds (from 5s) and provided detailed justification (IndexedDB keystroke buffer makes shorter debounce safe; Target Customer anxiety about data loss; 2s is more protective). The BA's Round 2 changed to 5 seconds citing "alignment with Tech Lead" -- but the Tech Lead's Round 2 says 2 seconds, not 5. These documents contradict each other.

**UX impact:** Minimal. The user sees "Saved" a few seconds after they stop typing either way. The difference is in the maximum data loss window if the Drive save fails AND IndexedDB is lost simultaneously (2s vs. 5s). A shorter interval is marginally more reassuring but generates more API calls.

**Recommendation:** Align on 2 seconds per the Tech Lead's revised architecture. The IndexedDB keystroke buffer provides the true protection; the debounce interval is the secondary safety net. The D1 cost implications (more writes) are addressed by the Tech Lead's note about budgeting for the paid tier.

**Decision needed from:** Tech Lead and BA need to align. PM should confirm.

### 2. PDF Page Size: A5 vs. US Trade (5.5" x 8.5")

**The conflict:** The PM endorsed A5. The BA resolved OQ-15 as "5.5 x 8.5 (US Trade)." These are very similar but not identical: A5 is 148x210mm (5.83" x 8.27"), US Trade is 140x216mm (5.5" x 8.5"). US Trade is the more common self-publishing trim size in the US market.

**UX impact:** Negligible to the user. Both feel "book-sized."

**Recommendation:** US Trade (5.5" x 8.5"). It is the standard self-publishing trim size for the US market, which is our primary market. Atticus uses it. Amazon KDP uses it as a default.

**Decision needed from:** PM to confirm.

### 3. Google Drive Folder Picker vs. Auto-Create: The `drive.file` Scope Tension

**The conflict:** The BA's US-006 describes a folder picker with "tap-to-open navigation" where the user can browse their Drive folders. The Tech Lead's API includes `GET /drive/folders` and `GET /drive/folders/:folderId/children`. However, the `drive.file` scope only grants access to files/folders DraftCrane creates or the user explicitly opens via DraftCrane. This means the folder listing endpoints may return empty results or only DraftCrane-created folders -- NOT the user's full Drive folder tree.

The Target Customer (Dr. Chen) and Marcus both want to select an existing folder. Marcus has a "Book Project" folder he wants to use. Under `drive.file` scope, that folder is invisible to DraftCrane.

**Options:**

- **Option A (auto-create):** DraftCrane creates a new folder named after the book title. Simplest, avoids the scope limitation.
- **Option B (Google Picker API):** Use Google's Picker API to let the user browse and select folders. This works with `drive.file` because the user explicitly selects the folder.
- **Option C (broader scope):** Request `drive.readonly` or `drive` scope for folder listing. Addresses the problem but requests more access than needed, which conflicts with the minimal-scope principle.

**Recommendation:** Start with Option A (auto-create) for speed. If user testing reveals frustration, add Option B (Google Picker API) as a fast follow. Do not pursue Option C.

**Decision needed from:** PM and Tech Lead to confirm approach. The BA's US-006 acceptance criteria may need revision if auto-create is chosen.

### 4. Content Storage During "Maybe Later" (No Drive Connected)

**The conflict:** The Tech Lead proposes IndexedDB-only storage when Drive is not connected. The BA initially proposed D1 as a working copy (revised in Round 2 to align with Drive-canonical, but the "Maybe Later" path remains ambiguous). The PM's open decision table references this but does not resolve it.

**The risk:** If a user writes 5,000 words before connecting Drive and then clears their browser data, that content is gone. IndexedDB is browser-local storage that can be evicted.

**Options:**

- **IndexedDB only:** Simplest. User is warned their content is device-only. Content syncs to Drive on connection.
- **Server-side temporary store (D1 or R2):** Content is saved server-side even without Drive. More durable but creates the "content on someone else's server" scenario the product promises to avoid.

**Recommendation:** IndexedDB only, with a persistent and clear warning. The "Maybe later" path is a grace period, not a long-term state. The warning should escalate in urgency if the user writes more than 1,000 words without connecting Drive: "You have 3,200 words saved on this device only. Connect Google Drive to protect your work."

**Decision needed from:** PM and Tech Lead to confirm the acceptable risk level.

### 5. Voice Sample or Minimal Context for Phase 0 AI

**The conflict:** The Target Customer proposed a lightweight voice context for Phase 0: "What if, during project setup, the tool asked me to paste a page of my best writing as a 'voice sample'? And then the AI used that sample as a reference for every rewrite?" The PM acknowledged this as Risk 6 (AI rewrite quality without Book Blueprint). The Competitor Analyst called Phase 0's AI "just ChatGPT in a different window." No team member has committed to or rejected this idea.

**UX impact:** Significant. Adding a "voice sample" field to project setup would add one field and meaningfully improve AI rewrite quality. However, it blurs the Phase 0/Phase 1 boundary (the Book Blueprint is Phase 1's defining feature).

**This is not a UX decision.** This is a product scope decision. But the UX impact is worth stating: without any voice context, the AI rewrite will feel generic to users who have a distinctive writing style (which includes all three personas and the Target Customer). The suggestion chips ("Simpler language," "More conversational") address style direction but not voice preservation.

**Decision needed from:** PM. Is a single "voice sample" field in project setup within Phase 0 scope, or does it belong to Phase 1?
