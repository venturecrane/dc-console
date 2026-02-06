# UX Lead Contribution — PRD Rewrite Round 1

**Author:** UX Lead
**Date:** February 6, 2026
**Scope:** Phase 0 only
**Primary Target:** Safari on iPad (iPadOS 17+)

---

## 1. Target User Personas

### Persona 1: Diane Mercer — Leadership Consultant

**Age:** 52
**Title:** Principal, Mercer Leadership Group (solo consultancy)
**Location:** Austin, TX
**Devices:** iPad Pro 12.9" (primary work device), iPhone 15, MacBook Air (used occasionally at home desk)

**Background:** Diane has run a leadership consulting practice for 14 years. She works with mid-level managers at Fortune 500 companies, running workshops and executive coaching engagements. She has a deep body of knowledge that exists as scattered Google Docs: workshop decks, client debrief notes, frameworks she has refined over years, LinkedIn articles she wrote in bursts of motivation. Her clients and peers constantly tell her, "You should write a book." She agrees. She has tried three times.

**Technical Comfort:** Diane lives in Google Workspace. She can build a decent slide deck. She uses Calendly, Zoom, and a CRM. She tried Notion once and abandoned it after 20 minutes. She does not know what Markdown is. She uses her iPad for 80% of her work, including writing, because she travels frequently and prefers working from hotel lobbies and airport lounges with a Smart Keyboard Folio attached.

**Current Writing Workflow (Day in the Life):**

1. Diane opens a Google Doc titled "Book Draft v3 - REAL ONE" on her iPad.
2. She scrolls past 47 pages of mixed content: half-written chapters, pasted quotes from other docs, notes-to-self in red text, and a section that says "MOVE THIS TO CHAPTER 4???"
3. She opens a second Safari tab to find a Google Doc from 2023 with a framework she wants to reference. She searches Drive. It takes four minutes to find the right file among six with similar names.
4. She copies a paragraph from the source doc, switches tabs, scrolls to find her place again (she has lost it), pastes it, and reformats it because the font changed.
5. She thinks, "This paragraph is clunky." She opens a third tab to ChatGPT, pastes the paragraph, types "make this more concise and professional," copies the result back, pastes it into her doc, and edits it further because the AI lost her voice.
6. After 45 minutes, she has written approximately 200 words of net-new content. She feels defeated.
7. She closes everything and answers client emails instead.

**What is Broken:**

- There is no structure. Her "book" is one enormous document with no chapter separation, no outline, no sense of progress.
- Source material is scattered across dozens of Google Docs with no way to search or surface relevant content while writing.
- Using AI requires constant context-switching between tabs, with copy-paste as the integration layer.
- She has no sense of whether what she has written is "enough" or "good enough" for any given section.
- The iPad makes multi-tab workflows painful. Safari tab management is not designed for this.
- She has no export path. Even if she finished, she would not know how to turn a Google Doc into a professional PDF or EPUB.

**What Diane Needs from DraftCrane Phase 0:**

- A single place to write that is not a sprawling Google Doc.
- Chapter-based structure so she can see the pieces of her book as distinct, manageable units.
- AI assistance without leaving her writing surface.
- A way to connect to her existing Google Drive files so she is not starting from scratch.
- One-click export so she can see her work as a "real" book chapter, even early in the process. This matters psychologically.

---

### Persona 2: Marcus Chen — Executive Coach and Former VP of Operations

**Age:** 44
**Title:** Founder, Chen Performance Advisory
**Location:** Chicago, IL
**Devices:** iPad Air (primary personal device), company-issued laptop (rarely used for personal projects), iPhone

**Background:** Marcus left a VP role at a logistics company two years ago to start an executive coaching practice. His niche is operational leadership: helping leaders build systems, not just manage people. He has strong content already because he kept meticulous notes during his corporate career. He has a Google Drive folder with over 100 documents: meeting reflections, process frameworks, templates he created, even transcripts from talks he gave at internal conferences. His book idea is clear: distill 15 years of operational leadership into a practical guide. He is not blocked on what to say. He is blocked on how to organize it and how to actually produce the artifact.

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

**What Marcus Needs from DraftCrane Phase 0:**

- A chapter-based structure with one canonical document per chapter, not a folder of fragments.
- Connection to his existing Google Drive folder so his source material is accessible.
- Inline AI rewriting that maintains context (he should not have to re-explain his desired tone every time).
- Auto-save that he trusts. He has lost work before by accidentally closing a Safari tab.
- Export to PDF so he can see a chapter as a tangible artifact and share it with a trusted colleague for feedback.

---

## 2. Phase 0 User Journey Map

This journey maps the complete Phase 0 experience from first visit to first PDF export. Diane and Marcus are referenced throughout.

### Step 1: Landing Page

**What the user sees:** A simple page with the DraftCrane name, the tagline ("Your book. Your files. Your cloud. With an AI writing partner."), a brief 2-3 sentence description, and a single prominent "Get Started" button. Below the fold: three short bullet points explaining what DraftCrane does (write chapters, use AI to improve your writing, export as PDF). No feature matrix, no pricing table, no screenshots carousel.

**What the user does:** Reads the tagline, skims the bullets, taps "Get Started."

**What the system does:** Navigates to the sign-in screen.

**Friction points:** If the landing page looks like a software product aimed at developers, both Diane and Marcus will bounce. The language must feel like it was written for an author, not a technologist. Avoid words like "platform," "integrate," "workflow," "pipeline."

**10-second test:** A management consultant sees "write a book, AI helps, your files stay yours" and taps Get Started. Pass.

---

### Step 2: Sign In

**What the user sees:** A clean authentication screen (powered by Clerk). Options: "Continue with Google" (prominent, primary) and email/password as secondary. The Google option is emphasized because every target user has a Google account (they use Google Drive).

**What the user does:** Taps "Continue with Google." Completes Google's OAuth flow (account selection, permission grant).

**What the system does:** Creates the user account via Clerk. Returns to DraftCrane. The user is now authenticated.

**Friction points:**
- If the OAuth permission screen asks for too many scopes, users will hesitate. At sign-in, request only authentication scopes. Do not request Drive access here. That comes later, in context, when the user understands why.
- On iPad Safari, the OAuth popup behavior can be unpredictable. Prefer redirect-based OAuth flow over popup-based to avoid Safari's popup blocker.

**10-second test:** "Continue with Google" is the obvious action. Pass.

---

### Step 3: First-Run — Create Your Book Project

**What the user sees:** A focused, single-purpose screen: "Let's set up your book." Two fields:
1. Book title (text input, placeholder: "e.g., The Operational Leader")
2. A brief description of your book (textarea, placeholder: "e.g., A practical guide for managers who want to build systems, not just manage people." — 1-2 sentences.)

A "Create Book" button below.

No audience field. No tone picker. No length target. Those belong to Phase 1 (Book Blueprint). Phase 0 asks only what is necessary to create a meaningful project container.

**What the user does:** Types a working title and a short description. Taps "Create Book."

**What the system does:** Creates a project record in D1. Creates a default chapter structure: "Chapter 1" with an empty document. Navigates the user to their new book's writing environment.

**Friction points:**
- Marcus might hesitate at "book title" because his title is not final. The placeholder should suggest this is a working title: "You can change this anytime" as helper text below the field.
- Diane might overthink the description. Keep the field optional or add helper text: "Just a sentence or two. This helps your AI writing partner understand your book."

**10-second test:** Two fields and a button. Pass.

---

### Step 4: Connect Google Drive (Contextual, Not Blocking)

**What the user sees:** After project creation, the writing environment loads. A non-blocking prompt appears (a gentle banner or card, not a modal): "Connect your Google Drive to save your book and access your existing files." Button: "Connect Google Drive." Secondary link: "Maybe later."

**What the user does (Diane):** She might tap "Maybe later" to explore the editor first. The banner collapses. She can connect later from settings or when she tries to export.

**What the user does (Marcus):** He taps "Connect Google Drive" because he wants his existing files accessible.

**What the system does (on connect):**
1. Triggers Google OAuth with Drive-specific scopes (read/write to user's Drive).
2. On success, presents a folder picker: "Choose a folder for your book files. DraftCrane will save your chapters and exports here."
3. The folder picker shows the user's Google Drive folder structure. They can select an existing folder or create a new one.
4. Once a folder is selected, it becomes the "Book Folder." DraftCrane creates a subfolder structure inside it if needed (or uses it as-is).

**What the system does (on "Maybe later"):** The book project is created locally (D1 + auto-save to server). When the user eventually connects Drive, existing content is synced to the Book Folder. The user is never blocked from writing.

**Friction points:**
- The Google Drive permission prompt will ask for access to the user's files. This is a trust moment. The banner text must be clear: "DraftCrane will only access the folder you choose. Your other files stay private."
- Folder picker must be simple. Do not show a raw API tree. Show familiar folder names with folder icons. Support tap-to-open, tap-to-select. Include a "Create New Folder" option at the top.
- On iPad, if the OAuth flow opens in a new tab, the user might lose context. Use redirect flow and return them to exactly where they were.

**10-second test:** "Connect Google Drive" with a clear explanation of why. "Maybe later" available. Pass.

---

### Step 5: The Writing Environment — Orientation

**What the user sees (first time):** The main writing interface with three zones:
1. **Sidebar (left):** Chapter list showing "Chapter 1" (the default). A "+" button to add chapters. The book title at the top.
2. **Editor (center/main):** A clean, full-width writing area with a blinking cursor. The chapter title "Chapter 1" is editable at the top. Below it, placeholder text: "Start writing here..." in light gray.
3. **Toolbar (top):** Minimal formatting controls — Bold, Italic, Heading (H1/H2/H3 dropdown), List (bullet/numbered), and a divider. No font picker. No color picker. No table tools. Less is more.

A brief first-time tooltip or coaching overlay (3 steps max, dismiss-able):
- "This is your chapter. Just start writing."
- "Use the sidebar to add and switch between chapters."
- "Select any text and tap the AI button to improve it."

**What the user does:** Dismisses the tooltip (or reads it). Taps into the editor and begins writing.

**What the system does:** The editor is ready. Auto-save begins silently (see Step 6 details). The sidebar is interactive.

**Friction points:**
- If the editor looks too minimal, Diane might wonder "is this it?" The design needs to feel intentional, not unfinished. Clean typography, good spacing, and a professional feel communicate quality.
- If the sidebar takes up too much space on iPad, it competes with the writing area. On iPad in portrait mode, the sidebar should be collapsible (swipe from left edge to reveal, tap outside to dismiss). In landscape mode with sufficient width, it can be persistent but narrow.
- The formatting toolbar must not interfere with iPadOS's own text formatting bar. Test for conflicts with the Smart Keyboard's shortcut bar.

**10-second test:** Diane sees a chapter list, a writing area, and a formatting bar. She taps into the editor and types. Pass.

---

### Step 6: Writing — The Core Loop

**What the user sees:** Their text appearing in the editor. Clean, readable typography (16-18pt base size for iPad, generous line height). Formatting applied via toolbar or keyboard shortcuts (Cmd+B, Cmd+I for users with Smart Keyboard).

**What the user does:** Writes. Edits. Navigates between chapters using the sidebar. Creates new chapters with the "+" button. Renames chapters by tapping the chapter title and editing it.

**What the system does:**
- **Auto-save:** Every few seconds of inactivity after a change, content is saved. A subtle indicator shows save status: a small checkmark or "Saved" text in the toolbar area. When saving is in progress, a brief "Saving..." appears. When offline or save fails, an unobtrusive warning appears: "Unable to save. Will retry." The user must never wonder whether their work is safe.
- **Save destination:** If Google Drive is connected, content saves to a Google Doc in the Book Folder (one Doc per chapter). If Drive is not connected, content saves to D1/server storage and syncs to Drive when connected.
- **Chapter management:** Chapters are ordered. The user can reorder by long-press and drag in the sidebar (standard iPadOS reordering gesture). New chapters are created at the end of the list.

**Friction points:**
- Auto-save feedback is critical. Both Diane and Marcus have anxiety about losing work. The "Saved" indicator must be visible but not distracting. It should appear in the same place every time so users build trust through repetition.
- Chapter reordering by long-press-and-drag must be discoverable. Consider a subtle drag handle icon (three horizontal lines) on each chapter in the sidebar.
- The virtual keyboard on iPad consumes roughly half the screen in portrait mode. The editor must scroll properly so the cursor and current line of text are always visible above the keyboard. This is a common failure in web-based editors on iPad. Test this relentlessly.
- When switching between chapters, the editor should restore scroll position. If Diane was on paragraph 12 of Chapter 3, and she switches to Chapter 1 and back, she should return to paragraph 12.

**10-second test:** The user writes, sees "Saved," and trusts it. Pass.

---

### Step 7: AI Rewrite — Select, Request, Review

**What the user sees (trigger):** After selecting text in the editor (via touch: tap-and-hold, then drag selection handles), a floating action bar appears near the selection. This bar contains: the standard iPadOS text actions (Cut, Copy, Paste) and, appended to them or in a secondary bar just below the selection, a prominent "AI Rewrite" button (or icon + label).

**What the user does:** Selects a paragraph or sentence she is unhappy with. Taps "AI Rewrite."

**What the user sees (request):** A compact panel slides up from the bottom of the screen (a bottom sheet, not a modal that covers the editor). The panel shows:
- The selected text (quoted, for reference)
- A text input: "How should I rewrite this?" with placeholder suggestions: "Make it clearer," "More concise," "Simpler language," "More authoritative"
- A "Rewrite" button

The user can type a custom instruction or tap one of the placeholder suggestions.

**What the user does:** Diane types "make this more concise" and taps "Rewrite." Marcus taps "More conversational" from the suggestions.

**What the system does:**
1. Sends the selected text + instruction + surrounding context (the paragraph before and after, the chapter title) to the AI API.
2. Shows a brief loading state in the bottom sheet: a progress indicator with text like "Rewriting..."
3. Returns the rewritten text and displays it in the bottom sheet, below the original.

**What the user sees (review):** The bottom sheet now shows:
- Original text (grayed out or struck through)
- Rewritten text (highlighted or in a distinct card)
- Two clear action buttons: "Use This" (primary, prominent) and "Discard" (secondary)
- Optionally: "Try Again" to regenerate with the same or modified instruction

**What the user does:** Reads the rewrite. Taps "Use This" to accept or "Discard" to keep the original.

**What the system does (on accept):** Replaces the selected text in the editor with the rewritten version. The bottom sheet closes. The editor now shows the new text. Auto-save triggers.

**What the system does (on discard):** Closes the bottom sheet. The original text remains unchanged in the editor. Nothing happened. The user is back to writing.

**Friction points:**
- Text selection on iPad Safari is finicky. Long-press selects a word; dragging handles to extend selection is imprecise, especially on dense text. The AI Rewrite button must appear reliably and in a position that does not interfere with the selection handles. Test with paragraphs of varying length.
- The floating action bar (with AI Rewrite) must not conflict with iPadOS's native text selection menu (Cut/Copy/Paste). Options: (a) add AI Rewrite as an additional item in the native menu using the `UIMenuController` equivalent for web (limited control), or (b) show a custom floating bar that appears slightly above or below the native menu. Option (b) is more reliable but must be positioned carefully.
- The bottom sheet must not cover the selected text. The user needs to see the original text in-context while reviewing the rewrite. On iPad, a bottom sheet occupying the lower third of the screen should leave enough room. If the selected text is near the bottom of the visible editor, the editor should scroll up to keep it visible.
- Loading time for AI rewrite should feel fast. Target < 3 seconds for a paragraph-length rewrite. Show streaming text if possible (the rewrite appearing word-by-word) to reduce perceived wait time.
- Marcus will want to try multiple rewrites before accepting. "Try Again" must not lose the original text. The original is always preserved until the user explicitly taps "Use This."

**10-second test:** Diane selects text, taps "AI Rewrite," types "more concise," reads the result, taps "Use This." Five steps, each obvious. Pass.

---

### Step 8: Adding and Managing Chapters

**What the user sees:** In the sidebar, the list of chapters with a "+" button at the bottom (or top) of the chapter list.

**What the user does:** Taps "+." A new chapter appears in the sidebar: "Untitled Chapter" (editable immediately, with cursor in the name field). The user types a chapter name and taps into the editor to begin writing.

**What the system does:** Creates a new chapter record. If Google Drive is connected, creates a corresponding Google Doc in the Book Folder. The editor loads the new empty chapter.

**Friction points:**
- Naming should feel instant and inline. Do not open a dialog or modal to name a chapter. The name appears editable directly in the sidebar.
- If the user has 15 chapters, the sidebar must scroll. Consider a condensed view for long chapter lists: just the chapter number and title, truncated if necessary.
- Deleting a chapter should require confirmation: "Delete Chapter 7: Market Analysis? This cannot be undone." If Google Drive is connected, the corresponding Doc should be moved to Drive's trash, not permanently deleted.

**10-second test:** Tap "+," type a name. Pass.

---

### Step 9: Export to PDF

**What the user sees:** An "Export" button in the top toolbar or in a minimal "..." (more) menu. Tapping it reveals export options: "Export as PDF" (Phase 0 primary) and "Export as EPUB" (Phase 0 secondary).

**What the user does:** Diane taps "Export" then "Export as PDF."

**What the system does:**
1. Shows a brief loading state: "Generating your PDF..."
2. Compiles all chapters in order into a single formatted PDF.
3. If Google Drive is connected: saves the PDF to the Book Folder and shows a confirmation: "Your PDF has been saved to Google Drive." with a "View in Drive" link and a "Download" option.
4. If Google Drive is not connected: triggers a browser download of the PDF file.

**What the user sees (result):** A confirmation message with the file name and location. The PDF should look professional: clean typography, chapter titles as headers, page numbers, the book title on a simple title page.

**Friction points:**
- PDF generation must be fast enough that the user does not think something is broken. Target < 10 seconds for a 10-chapter book. Show a progress indicator.
- The PDF must look good. If the export looks like a printed web page, the user will lose confidence in DraftCrane. Typography, margins, and spacing must feel intentionally designed, even in Phase 0. This is the "artifact moment" where the user sees their work as a real book for the first time.
- On iPad Safari, browser downloads can be confusing. The file might appear in the Downloads folder, or Safari might show it in the download manager without clear feedback. If Google Drive is connected, saving to Drive and showing a direct link is the better experience.
- Marcus will want to export a single chapter as well as the full book. Consider offering "Export This Chapter" and "Export Full Book" as options. Phase 0 should support at minimum full-book export.

**10-second test:** Diane taps Export, taps PDF, waits a few seconds, sees "Saved to Google Drive." Pass.

---

## 3. Information Architecture

### Primary Screens/Views (Phase 0)

Phase 0 has exactly four screens:

1. **Landing / Marketing Page** — Pre-auth. Explains the product, has "Get Started."
2. **Auth Screen** — Sign in / sign up via Clerk.
3. **Book Setup Screen** — First-run only. Book title + description. Appears only when creating a new project (Phase 0 supports one book per user; multi-book is Phase 1+).
4. **Writing Environment** — The main screen. This is where the user spends 95% of their time.

### Writing Environment Layout

The Writing Environment is a single screen with regions, not multiple screens:

```
+---------------------------------------------------+
|  [Toolbar]                                         |
|  Title | Formatting Controls | [Export] [Settings] |
+--------+------------------------------------------+
|        |                                           |
| Side-  |  Editor                                   |
| bar    |                                           |
|        |  [Chapter Title]                          |
| Ch 1   |                                           |
| Ch 2   |  Body text area...                        |
| Ch 3 * |                                           |
| Ch 4   |                                           |
|        |                                           |
| [+]    |                                           |
|        |                                           |
+--------+------------------------------------------+
```

### Navigation Model

**Primary navigation:** Sidebar chapter list. Tapping a chapter loads it in the editor. The active chapter is visually highlighted.

**Secondary navigation:**
- Toolbar: Export, Settings (gear icon or "..." menu).
- Settings contains: Google Drive connection/management, Account, Sign Out.

**There is no "dashboard."** Phase 0 has one book. Opening DraftCrane takes the user directly to their Writing Environment, with the last-edited chapter loaded. No landing screen, no project picker, no dashboard of cards. The user opens the app and they are writing.

### Sidebar Behavior

**Content:**
- Book title (displayed, not editable here -- editable in Settings)
- Ordered list of chapters (name, number)
- "+" button to add a chapter
- Active chapter highlighted

**Responsive behavior:**
- **iPad Landscape (1024pt+ width):** Sidebar is persistent, occupying approximately 240-280pt on the left. Collapsible via a toggle button or swipe gesture.
- **iPad Portrait (768pt width):** Sidebar is hidden by default. Revealed by tapping a hamburger icon or swiping from the left edge. Overlays the editor (does not push it). Tap outside or swipe left to dismiss.
- **Desktop (1200pt+ width):** Sidebar is persistent. Same as iPad landscape, with more room.

### Main Content Area

The editor occupies all horizontal space not taken by the sidebar. Content is centered within the editor pane with comfortable margins (maximum content width of approximately 680-720pt, similar to a book page or Medium article). This prevents uncomfortably long lines on wide screens while maintaining the feeling of writing in a book.

### Minimum Viable Navigation Summary

The user needs exactly three navigation actions in Phase 0:
1. Switch between chapters (sidebar)
2. Export their book (toolbar)
3. Manage their account/Drive connection (settings menu)

Everything else happens inside the editor.

---

## 4. iPad-First Design Constraints

### Touch Target Sizes

- **Minimum touch target:** 44x44pt (Apple HIG standard). This applies to all buttons, chapter list items, toolbar icons, and interactive elements.
- **Chapter list items:** Full-width of sidebar, minimum 48pt tall with adequate padding. Tap target is the entire row, not just the text.
- **Toolbar buttons:** 44x44pt minimum. Spacing between toolbar buttons: minimum 8pt to prevent mis-taps.
- **AI Rewrite button:** 44pt tall minimum. If it appears as a floating action near text selection, make it at least 48x48pt because the user's thumb is in motion near text they are trying to preserve.
- **"Use This" / "Discard" buttons in AI review panel:** Large and well-separated. Minimum 48pt tall, minimum 16pt gap between them. Accidental "Discard" when you meant "Use This" is a destructive error.

### Keyboard Handling

**Virtual keyboard (on-screen):**
- When the virtual keyboard appears, it typically occupies 40-50% of the screen in portrait mode and 30-40% in landscape.
- The editor must resize or scroll so that the cursor and active line of text are always visible above the keyboard. Use the `visualViewport` API to detect keyboard presence and adjust layout.
- The formatting toolbar must remain accessible when the keyboard is open. Options: (a) pin the toolbar above the keyboard, or (b) keep it at the top of the screen (preferred, since the editor area between toolbar and keyboard is the writing zone).
- The AI Rewrite bottom sheet must account for keyboard state. If the user triggers AI Rewrite with the keyboard open, the bottom sheet should appear above the keyboard, not behind it.

**External keyboard (Smart Keyboard Folio, Magic Keyboard):**
- When an external keyboard is connected, the virtual keyboard does not appear. The full screen is available for the editor.
- Support standard keyboard shortcuts: Cmd+B (bold), Cmd+I (italic), Cmd+Z (undo), Cmd+Shift+Z (redo), Cmd+S (save, even though auto-save is active -- users expect this to work and it provides reassurance).
- The iPadOS shortcut discovery bar (the bar above the virtual keyboard showing autocomplete suggestions) disappears with an external keyboard. This frees additional vertical space.
- The formatting toolbar should show keyboard shortcut hints on hover/long-press (for users who discover them) but should not require them.

### Text Selection and Manipulation (Critical for AI Rewrite)

- Text selection on iPadOS Safari uses the native long-press-to-select, then drag-handles-to-extend pattern. DraftCrane must not interfere with this. Custom selection handling (overriding touch events on the editor) is a recipe for frustration.
- After text is selected, iPadOS shows a native context menu (Cut, Copy, Paste, Look Up, etc.). DraftCrane needs to add "AI Rewrite" to this context or show a secondary action bar.
- **Recommended approach:** After selection, display a small floating toolbar pinned just above or below the selection (separate from the native menu). This toolbar contains the "AI Rewrite" button. This avoids fighting with the native context menu while providing clear access.
- The floating toolbar must reposition if the user adjusts their selection (handles move). It should track the selection bounds.
- **Edge case:** If the user selects text spanning multiple paragraphs or large blocks, the AI Rewrite action should still work, but the instruction to the AI should note this is a longer passage. The bottom sheet should scroll if the original text is long.

### Split View and Slide Over

**Decision: Do not actively support Split View or Slide Over in Phase 0.**

Rationale: DraftCrane's writing environment needs screen real estate. In Split View (50/50 or 33/66), the sidebar becomes unusable or the editor becomes too narrow. Supporting these modes would require a fully responsive layout with multiple breakpoints that adds significant complexity for an edge use case in Phase 0.

**However:** DraftCrane must not break in Split View. If a user drags DraftCrane into Split View, it should remain functional (no layout explosions, no overlapping elements), even if not optimized. The sidebar should auto-collapse in narrow widths, and the editor should remain usable as a single column.

This is a Phase 1 consideration at earliest, if user feedback indicates it matters.

### Landscape vs. Portrait

- **Landscape is the primary writing mode.** When the iPad is in landscape with a keyboard attached (the most common writing posture), DraftCrane has approximately 1024x768pt of usable space (minus browser chrome). This is the design target.
- **Portrait is the secondary reading/review mode.** Users like Marcus switch to portrait when reading. The editor should be comfortable to read in portrait: single column, generous margins, no sidebar visible by default.
- The layout must respond fluidly to orientation changes. No page reloads, no content jumps, no lost scroll position. Orientation change is a CSS/layout event, not a navigation event.

### Safari-Specific Limitations

- **Toolbar behavior:** Safari's address bar and tab bar can be in "compact" or "expanded" mode. In compact mode (user has scrolled down), they collapse, giving more vertical space. DraftCrane's toolbar should be fixed/sticky at the top and account for the safe area inset at the top of the screen. Use `env(safe-area-inset-top)` CSS.
- **Bottom safe area:** On iPads with home indicators (all current models), the bottom of the screen has a safe area. Bottom sheets and fixed bottom elements must not overlap the home indicator. Use `env(safe-area-inset-bottom)`.
- **No native app capabilities:** No push notifications (not needed in Phase 0). No offline mode via Service Worker is expected in Phase 0, but graceful handling of brief connectivity loss (auto-save retry) is required.
- **File downloads:** Safari handles downloads differently than Chrome. Downloaded files go to the Files app, and the download notification is subtle. For PDF export, prefer saving to Google Drive with a direct link rather than relying on browser download.
- **PWA limitations:** Safari supports Add to Home Screen but with limited PWA capabilities (no background sync, limited Service Worker scope). Phase 0 should not depend on PWA features, but the app should include a basic web manifest so that "Add to Home Screen" produces a reasonable icon and name.
- **`position: fixed` and `position: sticky` behavior:** Safari on iPadOS has historically had quirks with fixed positioning, especially when the virtual keyboard is open. Test toolbar and bottom sheet positioning exhaustively with both virtual and external keyboards.
- **100vh is not what you think:** On Safari, `100vh` includes the area behind the address bar. Use `100dvh` (dynamic viewport height) or the `visualViewport` API for accurate viewport sizing.

---

## 5. Key Interaction Patterns

### (a) Connecting Google Drive and Selecting a Book Folder

**Context:** Diane has just created her book project. She sees the gentle banner prompting her to connect Google Drive. She decides to connect now because she wants her chapters saved to Drive.

**Flow:**

1. **Diane taps "Connect Google Drive."**
   - The banner or card contains a single button: "Connect Google Drive."
   - Below the button, a single line of reassurance text: "We'll only access the folder you choose."

2. **Google OAuth screen appears (redirect, not popup).**
   - Safari navigates to Google's consent screen.
   - The consent screen asks for permission to "See, edit, create, and delete files in Google Drive that DraftCrane uses." (This is the `drive.file` scope, which is limited to files DraftCrane creates or the user opens with DraftCrane. This is less scary than full Drive access.)
   - Diane taps "Continue" / "Allow."

3. **Redirect back to DraftCrane. Folder picker appears.**
   - DraftCrane loads a folder picker in a bottom sheet or a full-screen overlay.
   - The picker shows Diane's Google Drive folder structure: "My Drive" at the top, with expandable folders beneath.
   - Folders are displayed with standard folder icons. Tapping a folder opens it to reveal subfolders.
   - At the top of the picker: "Choose a folder for your book files" and a "Create New Folder" button.
   - At the bottom: "Select This Folder" button (disabled until a folder is tapped/highlighted).

4. **Diane navigates to her desired location.**
   - She taps "My Drive" then "Writing Projects." She sees no existing book folder, so she taps "Create New Folder."
   - A simple inline input appears: she types "Leadership Book" and taps "Create."
   - The new folder appears in the list and is auto-selected.
   - She taps "Select This Folder."

5. **Confirmation.**
   - The picker closes. The banner updates to show: "Connected to Google Drive. Saving to: Writing Projects / Leadership Book." with a small green checkmark.
   - The banner can be dismissed. The Drive connection status is visible in Settings from now on.

6. **System action:**
   - DraftCrane stores the OAuth tokens server-side (never client-side).
   - The selected folder ID is stored as the Book Folder for this project.
   - Existing chapters (if any) are saved as Google Docs in this folder.
   - Auto-save now writes to both server storage and Google Drive.

**Edge cases and recovery:**
- If Diane taps "Cancel" during OAuth, she returns to DraftCrane with Drive not connected. The banner reappears next time.
- If OAuth succeeds but the folder picker fails to load (network issue), show an error with a "Try Again" button. Do not leave the user in a half-connected state.
- If Diane later wants to change her Book Folder, she can do so from Settings. This is a simple re-selection, not a new OAuth flow.

---

### (b) Writing in the Editor

**Context:** Marcus has connected Google Drive and has created three chapters. He is working on Chapter 2: "Building Systems That Scale." He is on his iPad in landscape mode with a Smart Keyboard attached.

**Flow:**

1. **Marcus opens DraftCrane.**
   - Safari loads DraftCrane. He is already signed in (persistent session).
   - The Writing Environment loads directly. Chapter 2 is already displayed because it was his last-edited chapter. His scroll position is restored to where he left off.
   - The sidebar shows all three chapters. Chapter 2 is highlighted.
   - Time from Safari load to ready-to-type: target < 3 seconds.

2. **Marcus begins typing.**
   - He positions his cursor at the end of his last paragraph (tap to place cursor) and starts typing on his Smart Keyboard.
   - Text appears immediately. No perceptible input lag.
   - Formatting: He presses Cmd+B to bold a key phrase. The word turns bold instantly. He continues typing.

3. **Marcus wants to add a subheading.**
   - He presses Enter twice to create space, then types a line of text.
   - He selects the line (double-tap to select the word, Shift+Cmd+Right to extend to end of line on his keyboard, or triple-tap to select the full line).
   - He taps the "H2" option in the formatting toolbar, or uses a keyboard shortcut if available.
   - The line becomes a subheading with distinct visual styling (larger, bolder).

4. **Auto-save feedback.**
   - As Marcus pauses typing, within 2-3 seconds, the toolbar area shows "Saving..." briefly, then "Saved" with a subtle checkmark.
   - This transition is not animated or flashy. It is a quiet state change. Marcus notices it in his peripheral vision and does not think about it again.
   - If he presses Cmd+S out of habit, the save triggers immediately and the "Saved" indicator updates. No "you don't need to save" message. Just let it work.

5. **Marcus switches chapters.**
   - He taps "Chapter 1" in the sidebar.
   - The editor smoothly transitions to Chapter 1's content. Chapter 1 loads with the cursor at the position where Marcus last edited it.
   - Chapter 1 appears in the sidebar as the now-highlighted item.
   - He reads a few paragraphs, then taps "Chapter 2" to return. His scroll position in Chapter 2 is restored.

6. **Marcus creates a new chapter.**
   - He taps the "+" button at the bottom of the sidebar chapter list.
   - A new chapter appears at the bottom of the list with an editable title field active: "Untitled Chapter" is selected.
   - He types "The Delegation Framework" and taps Enter or taps into the editor.
   - The editor now shows the new empty chapter. He begins writing.

7. **Marcus reorders chapters.**
   - He realizes Chapter 4 should actually be Chapter 2.
   - He long-presses on "Chapter 4: The Delegation Framework" in the sidebar. After a brief haptic feedback (if the browser supports it), the item lifts visually.
   - He drags it upward to the position below Chapter 1. A line indicator shows the drop target.
   - He releases. The chapters renumber: The Delegation Framework is now Chapter 2; the previous Chapter 2 and 3 shift down.

**Formatting model (Phase 0 minimum):**
- Bold, Italic (toggle)
- Headings: H1 (chapter title only, auto-applied), H2, H3
- Bullet list, Numbered list
- Block quote
- No font changes. No color. No alignment. No tables. No images (Phase 0).
- These constraints are a feature, not a limitation. Fewer choices means faster writing.

---

### (c) Selecting Text and Requesting an AI Rewrite

**Context:** Diane is working on Chapter 3 of her leadership book. She has written a paragraph about psychological safety that she knows is too jargon-heavy. She is on her iPad in landscape mode with the virtual keyboard retracted (she was reading, not typing).

**Flow:**

1. **Diane selects the problem paragraph.**
   - She long-presses on a word in the middle of the paragraph. The word highlights with selection handles.
   - She drags the left handle to the beginning of the paragraph and the right handle to the end. The entire paragraph is now selected (approximately 80 words).
   - The iPadOS native text menu appears briefly (Cut | Copy | Paste | ...).
   - Simultaneously (or just after), a DraftCrane floating action bar appears just above the selection or above the native menu: a rounded pill-shaped bar containing an "AI Rewrite" button with a small sparkle/AI icon and the text label.

2. **Diane taps "AI Rewrite."**
   - The floating action bar and native text menu dismiss.
   - A bottom sheet slides up from the bottom of the screen, occupying approximately the lower third.
   - The bottom sheet contains:
     - **Header:** "Rewrite this passage"
     - **Original text** displayed in a quoted block (scrollable if long), slightly muted in color
     - **Instruction input:** A text field with placeholder text: "How should I change this?" Below the field, a row of suggestion chips: "Simpler language" | "More concise" | "More conversational" | "Stronger"
     - **Action button:** "Rewrite" (disabled until the user types something or taps a chip)
   - The editor scrolls if needed so the selected paragraph remains visible above the bottom sheet.

3. **Diane taps the "Simpler language" chip.**
   - The chip highlights. The instruction field fills with "Simpler language." The "Rewrite" button becomes active.
   - She taps "Rewrite."

4. **Loading state.**
   - The bottom sheet shows a loading indicator. The suggestion chips and instruction input fade slightly.
   - Text: "Rewriting..." with a subtle animation (pulsing dots or a thin progress bar).
   - The rewritten text begins appearing (streaming response preferred). Words appear one by one, giving Diane the experience of watching the AI "write." This is faster (perceived) than waiting for the complete response.

5. **Diane reviews the result.**
   - The bottom sheet now shows:
     - **Original text:** still visible, now in a collapsible section (tappable header "Original" with a chevron), collapsed by default to save space
     - **Rewritten text:** prominently displayed in a card or highlighted block
     - **Actions:** "Use This" (primary button, prominent color) | "Try Again" (secondary) | "Discard" (tertiary/text-only, less prominent)
   - Diane reads the rewrite. It is clearer but she wants it even shorter.

6. **Diane taps "Try Again."**
   - The instruction input reappears. Her previous instruction ("Simpler language") is still there. She edits it to "Simpler language and more concise. About half the length."
   - She taps "Rewrite" again.
   - New loading state. New result appears.

7. **Diane is satisfied. She taps "Use This."**
   - The bottom sheet animates closed.
   - In the editor, the original paragraph smoothly transitions to the new text. There is a brief visual highlight (a subtle background color flash lasting ~1 second) on the replaced text to orient Diane to what changed.
   - The text is now part of the document. Auto-save triggers.
   - Diane continues writing.

8. **Alternative: Diane taps "Discard."**
   - The bottom sheet closes.
   - The original text remains in the editor, completely unchanged.
   - No trace of the AI interaction remains in the document. It is as if nothing happened.

**Important interaction details:**
- The "Use This" action is undoable. Cmd+Z (or an undo button in the toolbar) reverts to the original text. This is critical. Diane must never feel that accepting an AI rewrite is a permanent, irreversible decision.
- If Diane selects text while the virtual keyboard is open (she was typing, then selected text to rewrite), the bottom sheet must appear above the keyboard. If there is not enough space, the keyboard should dismiss first, then the bottom sheet appears.
- The instruction chips ("Simpler language," "More concise," etc.) are Phase 0's lightweight version of Phase 1's Craft Buttons. They provide guidance without requiring the user to formulate a prompt from scratch. Diane should not need to know "how to talk to AI" -- the chips do that for her.

---

## 6. Accessibility Baseline

### Phase 0 Accessibility Requirements

DraftCrane Phase 0 must meet WCAG 2.1 Level AA as a baseline. This is not aspirational; it is a requirement. The target users include professionals in their 40s-60s who may have age-related vision changes, and the legal landscape for web accessibility makes this a business necessity.

### Screen Reader Compatibility

- All interactive elements (buttons, links, form inputs, chapter list items) must have accessible names via proper HTML semantics or ARIA labels.
- The chapter list in the sidebar must be an ordered list (`<ol>`) or have `role="list"` with proper list item roles. Each chapter must announce its name and position ("Chapter 3 of 8: Building Systems That Scale").
- The editor must be announced as a text editing region. Use `role="textbox"` with `aria-multiline="true"` and a label ("Chapter editor" or the chapter name).
- AI Rewrite bottom sheet: when it appears, focus must move to the bottom sheet. When it closes, focus must return to the editor at the point where the rewrite was applied. This is a standard dialog accessibility pattern.
- Save status changes ("Saving..." to "Saved") must be announced via `aria-live="polite"` region so screen reader users know their work is being saved.
- Export progress and completion must be announced.

### Keyboard Navigation (External Keyboard)

- All functionality must be reachable via keyboard. Tab order must be logical: toolbar, then sidebar (if visible), then editor.
- The sidebar chapter list must be navigable with arrow keys (up/down to move between chapters, Enter to select/open a chapter).
- The formatting toolbar must be navigable with arrow keys (left/right between buttons, Enter/Space to activate).
- The AI Rewrite bottom sheet must trap focus while open (standard modal focus trap). Escape key closes it (equivalent to "Discard").
- Keyboard shortcuts must not conflict with iPadOS system shortcuts or Safari shortcuts. Test: Cmd+B, Cmd+I, Cmd+Z, Cmd+S, Cmd+Shift+Z.
- Provide a visible focus indicator (outline or highlight) on all focusable elements. The default browser focus ring is acceptable but may need enhancement for visibility against the editor background.

### Color Contrast

- All text must meet WCAG AA contrast ratios: 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt+ bold).
- This applies to: body text in the editor, chapter names in the sidebar, toolbar button labels, button text in the AI Rewrite panel, placeholder text (which is often too light), save status text, and error messages.
- Do not rely on color alone to convey information. The "Saved" indicator should use text ("Saved"), not just a green dot. The active chapter in the sidebar should be indicated by background color AND a visual marker (bold text, side border, or icon), not color alone.

### Font Sizing

- Base font size in the editor: minimum 16px (to prevent iOS auto-zoom on input focus). Recommended: 18px for comfortable reading.
- Support the iPadOS Dynamic Type / system font size preferences. At minimum, DraftCrane should not break if the user has increased their system font size. Ideally, the editor respects the user's preferred text size.
- Sidebar and toolbar text: minimum 14px.
- Use relative units (`rem`, `em`) for font sizes to support user scaling.

### Reduced Motion Preferences

- Respect the `prefers-reduced-motion` media query. When the user has enabled "Reduce Motion" in iPadOS settings:
  - The AI Rewrite bottom sheet appears instantly (no slide animation).
  - The "Saved" indicator changes state without transition animation.
  - Text replacement after AI rewrite happens without the highlight flash.
  - Chapter transitions in the editor are instant (no fade or slide).
- All animations in Phase 0 are non-essential (they are polish, not function). Disabling them changes nothing about the experience except removing visual motion.

### Additional Accessibility Considerations

- **Touch accommodation:** iPadOS has built-in touch accommodations (hold duration, ignore repeat). DraftCrane's touch interactions (especially long-press for text selection and chapter reordering) must work with these system settings. Do not implement custom long-press timers that conflict with system accessibility settings.
- **Zoom:** DraftCrane must remain functional when the user pinch-zooms in Safari. Do not set `user-scalable=no` in the viewport meta tag. The app must not break at 200% zoom (WCAG AA requirement).
- **High contrast mode:** If the user has enabled "Increase Contrast" in iPadOS, ensure borders, separators, and subtle UI elements become more distinct. Test with this setting enabled.

---

## Appendix: Design Principles Summary

For quick reference during implementation, Phase 0 UX follows these principles:

1. **One thing per screen.** Landing page has one CTA. Book setup has two fields. Writing environment is the only working screen. Do not add dashboards, onboarding wizards, or feature tours.

2. **Show, don't tell.** The tooltip overlay during first-run is three steps maximum. After that, the UI should be self-evident. If it needs explaining, redesign it.

3. **The user's anxiety is about their content, not our software.** Auto-save feedback, undo support, and "your files are in Google Drive" messaging address the real fear: losing their work or losing control.

4. **AI is a tool, not a presence.** The AI Rewrite feature should feel like a built-in editor function (like spell check), not like a chatbot conversation. No AI avatar, no chat bubbles, no "personality." Just: select text, request improvement, review result, accept or discard.

5. **Respect the platform.** iPad Safari has specific behaviors. Do not fight them. Use native selection. Use bottom sheets instead of modals. Use swipe gestures where iPadOS users expect them. The best DraftCrane experience feels like it belongs on iPad.

6. **Every pixel of chrome competes with the writing.** Minimize UI. The toolbar is one row. The sidebar is narrow or hidden. The editor is the star. Diane and Marcus are here to write a book, not to use an app.
