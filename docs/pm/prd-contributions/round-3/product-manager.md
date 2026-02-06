# Product Manager Contribution -- PRD Rewrite Round 3 (FINAL)

**Author:** Product Manager
**Date:** February 6, 2026
**Scope:** Phase 0 focus. Project instructions override original PRD where they conflict.
**Status:** Final version. Incorporates all Round 2 cross-role feedback.

---

## Changes from Round 2

### Terminology and Consistency

1. **Auto-save debounce interval standardized to 2 seconds.** Round 2 had an internal contradiction: I referenced the Technical Lead's 2-second debounce in some places, while the Business Analyst's Round 2 revised to 5 seconds (their changelog item 6 says they "Revised auto-save timing from 2 seconds to 5 seconds"). The Technical Lead's Round 2 explicitly changed from 5s to 2s (their changelog item 1), citing the Target Customer's data loss anxiety and the Business Analyst's own US-015 specification. The Technical Lead's three-tier save architecture (IndexedDB on every keystroke, Drive on 2s debounce, D1 metadata on Drive save) is the authoritative design. The Business Analyst's 5-second figure is stale. This document uses 2 seconds throughout.

2. **PDF page size standardized to US Trade (5.5" x 8.5").** Round 2 used "A5" in several places. The Business Analyst's Round 2 resolved this to 5.5" x 8.5" (US Trade), which is the standard self-publishing trim size for nonfiction. The Technical Lead's export template specification uses A5 (148mm x 210mm), which is metrically very close but not identical. US Trade (5.5" x 8.5" = 139.7mm x 215.9mm) is the more common standard in the US self-publishing market, where our target users operate. This document uses US Trade. The Technical Lead should update their template specification to match.

3. **"Content written before Drive is connected" flow clarified.** The UX Lead's Round 2 (Step 4, "Maybe later" path) says content saves to "a server-side buffer (D1 or R2 temporary storage)." The Technical Lead says content saves to IndexedDB only when Drive is not connected. These conflict. The Technical Lead's approach is architecturally cleaner (no content in D1, per Principle 2), but IndexedDB-only means the user's pre-connection writing exists only on one device. Decision: IndexedDB is the primary buffer. Add a persistent, prominent banner when Drive is not connected: "Your writing is only saved on this device. Connect Google Drive to protect your work." This is an acceptable risk for Phase 0 because the goal is to get users to connect Drive quickly, not to build a robust pre-connection persistence layer.

4. **Chapter reorder confirmed as Phase 0 scope.** The Business Analyst's Round 2 added US-012A for chapter reordering, reversing their Round 1 exclusion. The UX Lead includes it. The Technical Lead's API supports it. All roles now agree. This is in Phase 0.

5. **SSE streaming confirmed as a Phase 0 requirement.** The Business Analyst's Round 2 still lists streaming as an open question in some places (US-017 Out of Scope in Round 1 said "evaluate for Phase 1"), but their Round 2 acceptance criteria for US-017 include "the rewritten text appears via streaming (SSE) token by token." The Technical Lead elevated streaming to a requirement in Round 2. All roles now functionally agree. SSE streaming is in Phase 0.

6. **Freeform AI instruction field confirmed as Phase 0 scope.** The UX Lead includes a freeform text input alongside suggestion chips. The Business Analyst flags this as deviating from their original "Out of Scope" for custom prompts but does not object in Round 2. The Target Customer explicitly needs freeform instructions ("more conversational, like a mentor talking to a peer"). This is not Ask Mode (Phase 1's multi-turn conversation). It is a single-purpose instruction directing a single transformation. Confirmed for Phase 0.

7. **Word count display confirmed as Phase 0 scope.** The Business Analyst added US-024 in Round 2. The UX Lead includes word counts in the sidebar and editor. The Technical Lead's schema already stores `word_count`. All roles agree. This is in Phase 0.

8. **Single-chapter export confirmed as Phase 0 scope.** The Business Analyst's Round 2 includes single-chapter export as an acceptance criterion on US-019. The Target Customer and UX Lead both describe the value of exporting individual chapters. Confirmed for Phase 0.

9. **Google sign-in confirmed as Phase 0 scope.** The Business Analyst's Round 2 added Google sign-in (via Clerk) back into Phase 0, resolving the Round 1 exclusion. The UX Lead, Target Customer, and all other roles agree. "Continue with Google" is the primary sign-in method.

### Substantive Revisions

10. **Revised the "What DraftCrane Is Not Solving in Phase 0" section to acknowledge the `drive.file` scope constraint more directly.** The UX Lead's Round 2 revealed a critical design change: `drive.file` scope does not allow browsing the user's full Drive folder tree. This means the Target Customer's scenario -- "I connected my Drive and I can at least browse my existing docs" -- is not technically possible without broader scopes. The UX Lead's recommended Option A (DraftCrane auto-creates a new folder) is the pragmatic choice. This further narrows Phase 0's value for users with existing material.

11. **Added explicit PM decisions on all remaining open questions from the Business Analyst.** OQ-6 (editor library), OQ-10 (pre-Drive content), OQ-15A (PDF generation), OQ-19 (account deletion), OQ-21 (PDF quality bar), OQ-22 (dual OAuth flows), OQ-23 (Drive disconnect mid-edit), OQ-24 (single-chapter export format) are all addressed.

12. **Removed the Target Customer's request for a "voice sample" field from Phase 0 scope.** Dr. Chen suggested that during project setup, the tool could ask for a page of existing writing as a "voice sample" to improve AI quality. This is a compelling idea. However, it is functionally a lightweight version of the Book Blueprint, which is Phase 1. Adding it to Phase 0 would mean the AI prompt includes not just the selected text + surrounding context + instruction, but also a persistent "voice reference" stored in the project. That changes the AI architecture from stateless to stateful per project. Decision: not Phase 0. Flag as a strong Phase 1 candidate and the first feature to build when Phase 1 begins.

---

## 1. Executive Summary

DraftCrane is a browser-based writing environment that helps non-technical professionals turn their scattered expertise into a publishable nonfiction book. It connects to the author's own Google Drive, provides a chapter-based editor with AI writing assistance, and exports directly to PDF and EPUB -- with all manuscript files stored in the author's own cloud account.

Phase 0 delivers the minimum tool needed to test one hypothesis: **will a non-technical professional use a chapter-based browser editor with integrated AI to write and export at least one complete chapter?** The five Phase 0 features are: sign in, connect Google Drive, write in a structured editor, get AI help rewriting passages, and export a book file.

Phase 0 is not a differentiated product. It is a validation vehicle. What we ship in Phase 0 is a chapter editor with basic AI rewrite and export. Competitors like Atticus already offer browser-based, chapter-organized writing with professional export for a one-time $148 fee. Google Docs plus ChatGPT is free and already the workflow our target users employ. Phase 0 does not win on features. It wins on learning. The strategic bet is that Phase 0 validates whether the foundation is sound enough to build Phase 1, which is where the real differentiation lives: the Book Blueprint (AI that knows the author's voice and terminology), contextual writing guidance, and structured assistance. No competitor offers that. But it does not exist yet. Phase 0's job is to prove the foundation deserves it.

DraftCrane is a Business Validation Machine portfolio product. It may not survive Phase 0. The kill criteria are real. If the prototype does not produce chapter completions, user returns, or willingness-to-pay signals at the thresholds defined below, the product is killed or pivoted. This PRD is written with that possibility in mind.

---

## 2. Product Vision & Identity

### What DraftCrane Is

DraftCrane is a guided writing environment for nonfiction authors who have expertise but not a manuscript. It is a source-to-manuscript pipeline that works with the author's existing cloud storage. It is an AI writing partner that respects the author's voice, sources, and ownership.

The core problem: writing a professional nonfiction book today requires stitching together word processors, note apps, research folders, AI chat tools, and formatting software. The UX Lead's persona Diane Mercer illustrates this: a 47-page Google Doc titled "Book Draft v3 - REAL ONE," three Safari tabs open for source material and ChatGPT, and 45 minutes of work that produces 200 net-new words. The persona Marcus Chen shows the organizational version: 12 subfolders with 3-15 documents each, four partial drafts of Chapter 3, and no canonical version. The Target Customer (Dr. Sarah Chen) summarizes it: "I have 200 pages of raw material and zero finished chapters." DraftCrane replaces that patchwork with a single guided environment.

Every feature in DraftCrane must pass one test: **does this reduce the author's cognitive overhead, or move the manuscript closer to publishable?** If it does neither, it gets cut. This test applies to Phase 0 and every phase after it.

### What DraftCrane Is Not

- **Not a general-purpose word processor.** Google Docs already exists. DraftCrane is purpose-built for book-length nonfiction.
- **Not a fiction or creative writing tool.** Scrivener and tools like Sudowrite, Novelcrafter, and Dabble serve a different audience with different needs.
- **Not an AI ghostwriter.** The author writes. The AI assists. Every AI-generated change requires the author's explicit approval before it is applied. No silent rewrites. No content presented as the author's work without their review. Source attribution is non-negotiable in later phases.
- **Not a publishing house.** DraftCrane produces export-ready files (PDF, EPUB). It does not print, distribute, or sell books.

### What DraftCrane Is Not Solving in Phase 0

This section exists because the Target Customer and UX Lead exposed a gap between what Phase 0 delivers and what the target user most urgently needs.

Dr. Chen's number one request: "Look at my 40 documents and tell me which ones go in Chapter 1 versus Chapter 7 versus the trash." Marcus Chen's core pain: "I have four partial drafts of Chapter 3 and no canonical version." Both users have extensive existing material. Both are blocked on organization, not on writing from a blank page.

Phase 0 does not help with this. Phase 0 gives authors a new project with an empty first chapter. Source Intelligence (importing and organizing existing materials) is Phase 2. The Book Blueprint (teaching the AI about the author's voice and terminology) is Phase 1.

Furthermore, the `drive.file` OAuth scope used in Phase 0 limits DraftCrane's access to files it creates or the user explicitly opens with DraftCrane. The user's existing 40 Google Docs are invisible to DraftCrane. The folder picker cannot browse the user's full Drive tree. The UX Lead's recommended approach -- DraftCrane auto-creates a new Book Folder rather than selecting an existing one -- is the pragmatic choice but means the user's existing material is not even visible within DraftCrane.

This means Phase 0's first experience is the thing Dr. Chen explicitly called a red flag: "If it shows me a blank project with an empty outline, I feel deflated." We must design the Phase 0 onboarding to acknowledge this honestly. The author is not starting from zero -- they are choosing to use a new tool for new writing while their existing material lives in Google Drive. We are not yet the tool that helps them make sense of their existing chaos. That is a Phase 1-2 capability.

**Risk acknowledgment:** If every test user's reaction to Phase 0 is "but what about my existing notes?", that is a signal that Phase 0 cannot validate anything useful because it is testing the wrong starting point. See Risk 2 in Section 6.

### Target User

Non-technical professionals who want to write a nonfiction book but feel overwhelmed by tools and process. The UX Lead defined two detailed personas:

- **Diane Mercer** (Leadership Consultant, 52): works primarily on iPad Pro, lives in Google Workspace, tried Notion and abandoned it in 20 minutes, has scattered Google Docs, writes in bursts between client work. She represents the user who needs structure and simplicity above all.

- **Marcus Chen** (Executive Coach, 44): more organized than Diane (has a folder-per-chapter system in Google Drive), but still drowning in fragments and versions. He represents the user who has abundant source material but no way to turn it into a coherent manuscript.

Both personas work on iPad as their primary device. Both are comfortable with Google Docs but not with technical software. Both have existing notes and materials in Google Drive. Both value ownership of their intellectual property.

The usability bar, per the project instructions: a management consultant should be able to figure out any screen in 10 seconds without instructions.

---

## 3. Product Principles

Each principle below is a decision-making rule. When we face a tradeoff, these resolve it.

### Principle 1: Browser-First, iPad-Native

DraftCrane works in Safari, Chrome, or any modern browser. No desktop app. No Electron. Safari on iPad is the primary test target. If it works there, it works everywhere.

**What this means in practice:**
- Every UI element must be tested on iPad Safari (iPadOS 17+) before it ships. Touch targets of 44x44pt minimum per Apple HIG.
- The editor library decision (ADR-001) must be validated on a physical iPad, not based on documentation claims. The Technical Lead rates this as the highest-priority technical risk.
- The virtual keyboard consumes 40-50% of the screen in portrait mode. The editor must keep the cursor visible above the keyboard using the `visualViewport` API. CSS `100vh` does not work correctly in Safari; use `100dvh`.
- Split View and Slide Over: not actively supported in Phase 0, but the app must not break in these modes.
- Input latency must be under 100ms. The editor must feel as responsive as Google Docs on iPad.

### Principle 2: No Lock-In -- The User's Files Are Sacred

All manuscript content lives in the author's Google Drive. DraftCrane indexes and caches, but the user's Drive is the canonical store. If DraftCrane disappears tomorrow, the author still has their book in standard HTML files in their own cloud account.

**What this means in practice:**
- Chapter body content lives in Google Drive as HTML files. The application database (D1) stores only metadata: project structure, chapter ordering, word counts, AI interaction logs. Content never lives in D1.
- The Technical Lead's three-tier save architecture enforces this: IndexedDB (instant local buffer, every keystroke) -> Google Drive (canonical, 2-second debounce) -> D1 (metadata only, on successful Drive save).
- OAuth tokens are stored server-side only, never exposed to the client. The `drive.file` scope limits access to files DraftCrane creates or the user explicitly opens with DraftCrane -- the narrowest useful scope.
- File ownership must be visible in the product, not just claimed in marketing. The UX Lead's design shows the Book Folder connection status and a "View in Drive" link after export. Users should be able to open their Book Folder in Google Drive and see a recognizable book structure: `Chapter 1 - Introduction.html`, `Chapter 2 - The Problem.html`, etc.
- Honest limitation: if DraftCrane disappears, the user has HTML files in Drive but not the project structure (chapter ordering). In Phase 0, this is acceptable because the structure is simple (an ordered list of chapters). In later phases, we should consider exporting a project manifest file to Drive alongside the chapters.

### Principle 3: AI as Partner, Not Replacement

The author writes. The AI assists. Every AI-generated change requires the author's explicit approval before it is applied. No silent rewrites. No content presented as the author's work without their review.

**What this means in practice:**
- The AI rewrite flow uses a bottom sheet with "Use This" / "Try Again" / "Discard" buttons, showing original and rewritten text simultaneously. The user always sees a preview and explicitly accepts or rejects. "Try Again" preserves the original through unlimited iterations.
- Acceptance must be undoable. Cmd+Z restores original text after accepting an AI suggestion. The Target Customer's core fear -- "If the AI rewrites a paragraph and I do not like it, can I go back?" -- must be answered with an immediate, obvious yes.
- AI never modifies content directly. The AI interaction is logged (metadata only, not content) for analytics.
- Phase 0 offers three specific modes (rewrite, expand, simplify) with suggestion chips ("Simpler language," "More concise," "More conversational," "Stronger") plus a freeform instruction field. This gives users vocabulary for their intent without requiring them to "know how to talk to AI."
- Phase 0 AI has no knowledge of the author's voice, terminology, or manuscript context beyond the selected text and 500 characters of surrounding context. This is a known limitation. The Book Blueprint (Phase 1) is what makes the AI meaningfully context-aware. Phase 0's AI is better than copy-pasting to ChatGPT because it eliminates tab-switching and provides in-context suggestions, but it is not yet personalized.

### Principle 4: Structure Reduces Overwhelm

A blank page is the enemy. DraftCrane gives authors a chapter-based structure that breaks the overwhelming task of "write a book" into manageable pieces.

**What this means in practice:**
- The editor is chapter-based from day one. Opening DraftCrane takes the user directly to their last-edited chapter. No dashboard, no project picker screen. The writing environment is the primary (and nearly only) screen.
- The sidebar shows chapters with word counts, providing tangible progress visibility. A total book word count anchors the sense that this is a real, measurable project.
- Chapter reordering via long-press-and-drag in the sidebar is included in Phase 0. Without it, an author who creates chapters in the wrong order has no recourse except deleting and recreating them. The Technical Lead's API supports it. The Business Analyst added the user story (US-012A).
- Onboarding is three tooltips maximum: "This is your chapter," "Use the sidebar for chapters," "Select text for AI." No tutorials, no feature tours, no onboarding wizards.

### Principle 5: Publishing Is a Button, Not a Project

Generating a professional book file should take one click. No wrestling with formatting software.

**What this means in practice:**
- PDF and EPUB export must work with sensible defaults and a single default template. No configuration required.
- Export quality determines user confidence. If the export looks like a printed web page, the user loses confidence in DraftCrane as a serious tool. The minimum quality bar: readable serif font, proper margins, chapter title pages, page numbers, a title page with book title. US Trade page size (5.5" x 8.5") to make the export feel like a book, not a document.
- PDF generation in Cloudflare Workers is technically constrained (no filesystem, no headless browser, 128 MB memory). The Technical Lead proposes EPUB in-Worker (tractable) and PDF via Cloudflare Browser Rendering or external fallback (needs validation via ADR-004). If no PDF approach meets the quality bar, we ship Phase 0 with EPUB-only rather than shipping an ugly PDF that undermines user confidence.
- Both full-book and single-chapter export are Phase 0 scope. Single-chapter export lets the author see individual chapters as tangible artifacts and share them with colleagues early.
- Export file naming uses date stamps (`{Book Title} - 2026-02-06.pdf`) to prevent accidental overwrites and create natural version history in Drive.

---

## 4. Phased Development Plan

DraftCrane follows the Business Validation Machine methodology. We are entering Design to Prototype. The goal is to reach a functional tool, put it in front of real users, and learn whether this product deserves to exist.

### Phase 0 Strategic Tension

The real differentiator does not arrive until Phase 1. The Book Blueprint (AI that knows the author's voice and terminology) is what makes DraftCrane meaningfully different from Google Docs plus ChatGPT. But the Book Blueprint is Phase 1.

This means Phase 0 must thread a needle:
- It must be good enough that test users complete the core flow (write a chapter, export a file) and come back.
- It must give us learning about whether the foundation (chapter-based editor, integrated AI, Drive-based file storage) is worth building on.
- It must not be so thin that users conclude "this is just Google Docs with a worse editor and a basic AI rewrite."

The Target Customer predicted: "My first experience with DraftCrane will feel like 'a slightly nicer Google Doc with ChatGPT bolted on' rather than 'the tool that finally helps me finish my book.'" She may be right. The Competitor Analyst identified a counter-narrative: Phase 0 does not need to be impressive. It needs to be organized and reliable. The chapter structure, auto-save trust, and Google Drive visibility may be enough to pass the kill criteria -- not because the AI is amazing, but because the organization is a relief.

**What we are testing in Phase 0:**
1. Can a non-technical professional complete the core flow on iPad Safari without getting stuck?
2. Does the chapter-based structure feel meaningfully better than a long Google Doc?
3. Is the integrated AI rewrite (even without the Book Blueprint) useful enough that authors use it?
4. Does seeing their manuscript as a PDF/EPUB create an emotional "this is real" moment?
5. Do users articulate what they wish the tool did next? (This tells us whether they see potential beyond Phase 0.)

### Phase 0 -- Foundations (Current Phase)

Phase 0 delivers the minimum tool that lets an author write and export a book.

| Feature | What It Delivers |
|---------|-----------------|
| **Auth system** | User can sign in (Google or email/password via Clerk) and have a persistent 30-day session |
| **Google Drive integration** | Connect via OAuth (`drive.file` scope), auto-create or select a Book Folder, read/write chapter files |
| **Basic editor** | Chapter-based manuscript writing with auto-save (2s debounce to Drive, keystroke-level IndexedDB buffer), chapter reordering, word count display |
| **Simple AI rewrite** | Select text, choose an instruction (chips or freeform), review streaming AI suggestion, accept/reject/try again |
| **PDF/EPUB export** | One-click generation of full-book or single-chapter files, saved to Drive Book Folder and/or downloaded locally |

**Explicitly NOT in Phase 0:**
Book Blueprint, outline generation, Craft Buttons (beyond the three basic modes + chips), Idea Inbox, Source Intelligence, collaboration, cover toolkit, structural guidance, consistency engine, voice dictation, progress tracking dashboard, voice sample/context, offline writing mode, version history beyond undo, importing/organizing existing documents from Drive, and any feature from Phases 1-4.

**Phase 0 Outcome:** A user can sign in, connect their Google Drive, write chapters in a structured editor, get AI help rewriting passages, and export a PDF or EPUB. That is the entire deliverable.

#### Gate Criteria: Phase 0 to Phase 1

All of the following must be true before Phase 1 development begins:

1. **Prototype completion.** All five Phase 0 features are deployed and functional in production.
2. **Chapter completion signal.** At least one test user completes a full chapter in their first session. "Complete" means at least 500 words of coherent content that the author considers a recognizable draft. Measured via moderated test sessions and the D1 `chapters.word_count` field. If zero users complete a chapter, we investigate why before building more features. (This is a kill criterion.)
3. **Export validation.** At least one test user successfully exports a PDF or EPUB and confirms the output is usable -- meaning they would share it with a colleague or editor without embarrassment.
4. **No critical usability blockers.** No test user is unable to complete the core flow (sign in, connect Drive, write, export) due to a UI or technical problem on iPad Safari.
5. **Potential signal.** At least one test user articulates an unprompted wish for a feature that maps to Phase 1 or Phase 2 (e.g., "I wish it knew my writing style," "I wish I could bring in my existing notes"). This tells us the user sees the product as a platform worth building on, not a dead end.
6. **Go/no-go decision.** An explicit decision is made by the product owner based on the data above. This is not automatic. The data must be weighed, and the decision must be documented.

**Note on test user recruitment:** The Competitor Analyst recommends recruiting a mix of test users -- some with existing material, some starting fresh. If users with existing material fail to complete chapters because Phase 0 does not help with organization, while fresh-start users succeed, that is a product gap signal, not a kill signal. Recruit users who have a book topic and can write new content from knowledge, not users whose primary need is organizing existing material (which Phase 0 cannot do).

### Phase 1 -- Guided Writing (Post-Validation)

High-level scope: Book Blueprint (voice rules, terminology, key claims), outline generation, Craft Buttons (one-tap AI transformations beyond the basic modes), Idea Inbox, chapter organization tools.

The Target Customer's most-wanted feature is the Book Blueprint: AI that knows her voice, her terminology, and her audience. The Competitor Analyst identified this as the feature where DraftCrane's differentiation truly begins. No competitor offers AI that understands the author's book-level context.

**Outcome:** Structured, AI-assisted authoring where the AI understands the author's book.

#### Gate Criteria: Phase 1 to Phase 2

1. Beta cohort of at least 10 users has used the product for at least two sessions each.
2. At least 3 of 10 beta users return for a second session unprompted. (This is a kill criterion.)
3. Qualitative signal that guided writing features (Blueprint, outline) reduce time-to-first-chapter vs. Phase 0 baseline.
4. Explicit go/no-go decision.

### Phase 2 -- Source Intelligence (Post-Validation)

High-level scope: Import and index source materials from Drive, searchable source panel, AI-suggested sources for current section, insert quotes with attribution. This is the phase that would address Dr. Chen's "help me organize my 200 pages of notes" need.

**Outcome:** A pipeline from the author's existing knowledge artifacts to their manuscript.

#### Gate Criteria: Phase 2 to Phase 3

1. Signal of willingness to pay from at least a subset of active users. (This is a kill criterion -- the 90-day mark per project instructions.)
2. Source integration is used by at least half of active users.
3. Explicit go/no-go decision.

### Phase 3 -- Publishing Polish (Post-Validation)

High-level scope: Professional templates, layout tuning, cover dimension guidance, ISBN walkthrough, distribution checklists (KDP, Apple Books).

**Outcome:** End-to-end publishing readiness. Export quality approaches Atticus/Vellum standards.

### Phase 4 -- Advanced AI & Ecosystem (Post-Validation)

High-level scope: Consistency engine, developmental editing feedback, multi-book memory, audiobook prep.

**Outcome:** DraftCrane becomes the default environment for knowledge-to-book publishing.

**Note on Phases 3 and 4:** These are directional. Their scope will be reshaped by what we learn in earlier phases. Do not plan detailed work for these phases now.

---

## 5. Success Metrics & Kill Criteria

### Kill Criteria

These are non-negotiable. If we hit a kill criterion, we stop building and assess whether to pivot or shut down. No heroics, no "one more feature."

| Trigger Point | Kill Criterion | How Measured | Notes |
|--------------|---------------|-------------|-------|
| After prototype (Phase 0 complete) | No user completes a full chapter in their first session | Observe 5-10 test users in moderated sessions. Track chapter completion via D1 `chapters.word_count` field. "Complete" = 500+ words that the author considers a recognizable draft. | Recruit users who can write from knowledge, not users who need to organize existing material. "Complete a chapter" is a high bar for a first session; it tests whether the tool is frictionless enough to produce output. |
| After market test (Phase 1 beta) | Fewer than 3 of 10 beta users return for a second session | Track unique user logins by date in D1. A "return" = a login on a different calendar day from the first session. | The Competitor Analyst's insight: what brings users back is the feeling that their book is a real project. If they do not return, the product has not created that feeling. |
| After 90 days of beta availability | No signal of willingness to pay | Direct user interviews or survey: "Would you pay for this? How much?" Acceptable signals: explicit "yes" with a price, or unprompted complaint about losing access. | The Target Customer's comfort zone: $19-29/month is a no-brainer, $49+ requires demonstrated value. The Competitor Analyst established that the target user already pays ~$32/month for ChatGPT Plus + Grammarly Premium. |

### Phase 0 Metrics

These are the metrics we can actually measure during Phase 0 with the infrastructure we will have. D1 tables for projects, chapters, ai_interactions, and export_jobs are our measurement instruments.

| Metric | Target | Data Source | Why It Matters |
|--------|--------|-------------|----------------|
| Core flow completion rate | 80%+ of test users complete sign-in through export | Moderated test sessions (observed) | If users cannot complete the flow, nothing else matters. |
| Time to first chapter draft | Under 2 hours from sign-in to a chapter with 500+ words | Session observation + D1 chapter metadata (word_count, created_at) | The Target Customer considers this aggressive for writing from scratch but reasonable if the tool is intuitive. |
| Export success rate | 100% of export attempts produce a valid, usable file | D1 export_jobs table (status field) + user confirmation | If export fails, the product promise ("publishing is a button") is broken. |
| AI rewrite usage and acceptance rate | At least 50% of test users try AI rewrite; at least 40% acceptance rate on suggestions | D1 ai_interactions table (accepted field) | If users do not try the AI, it is not discoverable or not trusted. If they try it and reject most suggestions, AI quality is too low for Phase 0 to teach us anything about AI-assisted writing. |
| iPad Safari usability | No critical blockers on iPad Safari | Manual QA testing on physical iPad (Air 5th gen, iPadOS 17+) | Safari on iPad is the make-or-break platform. |
| User-reported confusion points | Fewer than 3 per test session | Session notes from moderated testing | The "10-second test" at each journey step is the design-level enforcement of this metric. |
| Unprompted feature requests | At least 1 user articulates a Phase 1-2 feature wish | Session observation and post-session interview | This is the "potential signal" from the gate criteria. It tells us whether users see DraftCrane as a promising start or a dead end. |

### Post-Validation Metrics (Phase 1+)

These metrics matter but cannot be reliably measured until we have a real user base.

| Metric | Target | Data Source | Earliest Phase |
|--------|--------|-------------|---------------|
| Monthly active writing users | 60%+ retention month-over-month | D1 session/login data | Phase 1 (beta cohort) |
| % of users who export at least one book file | 40%+ | D1 export_jobs records | Phase 1 |
| Average chapters completed per user | 6+ | D1 chapter records | Phase 1 |
| Net Promoter Score | 40+ | User survey | Phase 1 |
| Willingness to pay | 3+ of 10 beta users express willingness | User interviews | Phase 2 (90-day mark) |

### What We Are Not Measuring in Phase 0

- **Revenue, conversion rates, or pricing sensitivity.** Phase 0 is free. The Competitor Analyst recommends communicating future pricing intent ("We plan to offer a Pro plan at ~$24/month when guided writing features launch") without charging during validation.
- **Organic growth or virality.** We do not have a distribution channel yet.
- **Long-term retention.** We will not have enough users or enough time.

Being honest about measurement boundaries prevents us from making decisions based on data we do not have.

---

## 6. Risks & Mitigations

Risks are ordered by a combination of likelihood and impact. This final version integrates findings from all team members across both rounds.

### High Priority

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|-----------|
| 1 | **Phase 0 feels like "Google Docs + ChatGPT" and fails to hold attention.** The Competitor Analyst named this directly. The Target Customer predicted it. Phase 0 is a basic chapter editor with basic AI. The question is whether the structural advantages (chapter organization, in-editor AI, one-click export, files in Drive) are enough to hold attention. | High | Critical | Three counters: (a) The chapter structure and sidebar navigation with word counts must feel meaningfully better than a long Google Doc. (b) AI rewrite with suggestion chips and streaming must be faster and more convenient than copy-pasting to ChatGPT -- the UX Lead's bottom sheet design eliminates the tab-switching tax. (c) The PDF export must create a "this is a real book" moment -- invest in export quality. If all three fail, Phase 0 fails. |
| 2 | **Prototype tests the wrong users or the wrong hypothesis.** We build Phase 0 and learn nothing because test users are not representative, or because the test scenario does not reflect real authoring behavior. The Target Customer's primary scenario -- organizing 200 pages of existing notes -- is precisely the scenario Phase 0 cannot serve. | High | Critical | Recruit test users who match Phase 0's realistic scenario: professionals who have a book topic and can write new content from knowledge. Design test tasks around "bring a topic you know well and start a chapter," not "bring your existing notes." If users with existing material fail but fresh-start users succeed, treat that as a product gap signal (Phase 1-2 should address it), not a kill signal. |
| 3 | **Editor is not good enough on iPad Safari.** Rich text editing in mobile browsers is notoriously fragile. Known issues: cursor positioning bugs, selection jumping with virtual keyboard, toolbar focus loss, inconsistent paste handling. | High | Critical | The editor library decision (ADR-001) is the highest-risk technical decision. Build prototypes with Tiptap and Lexical on a physical iPad in the first sprint. Test the UX Lead's specific interaction patterns (typing, formatting, text selection, floating toolbar, copy/paste, undo/redo, keyboard handling, orientation change). Score each candidate on a 1-5 scale. 2 days allocated. Decision from real-device testing only. |
| 4 | **Google Drive sync causes data loss or confusion.** Failure modes: network dropout, Drive API errors, browser crash, iPadOS background tab suspension. The `beforeunload` event is unreliable on iPad Safari. | Medium | Critical | The Technical Lead's three-tier save architecture mitigates most failure modes: IndexedDB on every keystroke (near-zero data loss within browser lifetime), Drive on 2s debounce, D1 metadata on Drive save. `visibilitychange` event triggers immediate save when the tab goes to background. Crash recovery: on editor mount, check IndexedDB for unsaved content newer than Drive version and prompt to restore or discard. Accept a 2-second maximum data loss window for hard OS kills. |
| 5 | **Scope creep kills velocity.** The Target Customer wants progress tracking dashboards, offline mode, existing-document organization, collaboration, and a voice sample feature. All reasonable. None belong in Phase 0. | High | High | The project instructions list explicit Phase 0 exclusions. The Business Analyst's user stories (US-001 through US-024) define the boundary. Any proposed addition must answer: "Does this prevent us from learning what we need to learn?" If not, it is post-Phase 0. |

### Medium Priority

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|-----------|
| 6 | **AI rewrite quality is poor without the Book Blueprint.** The Target Customer's primary fear: the AI "strips out everything that makes my frameworks mine." Without the Book Blueprint (Phase 1), the AI has no context about the author's voice. Phase 0's AI is a generic text transformation with surrounding-context signals. | High | High | Send surrounding context (500 chars before and after the selection, plus the chapter title) so the AI has tone signals. Offer specific modes (rewrite, expand, simplify) with suggestion chips and freeform instruction, not just a generic text box. This is not as good as the Book Blueprint, but it is better than ChatGPT because it eliminates the copy-paste workflow and provides in-context suggestions. If test users report that AI output is consistently unhelpful, this is data for Phase 1 prioritization, not a Phase 0 kill signal (unless users stop using AI entirely). |
| 7 | **PDF/EPUB export produces unprofessional output.** The Competitor Analyst established Atticus as the minimum bar, Vellum as the aspiration. Workers have no filesystem, no headless browser, 128 MB memory. Phase 0 will not match either competitor. | Medium | High | The Technical Lead's hybrid approach (EPUB in Worker, PDF via Browser Rendering or external fallback) needs validation via ADR-004. Design a single, well-crafted HTML+CSS book template (US Trade trim, serif font, chapter title pages, page numbers, table of contents, generous margins). If no PDF approach meets the quality bar, ship EPUB-only for Phase 0 rather than an ugly PDF. A bad PDF is worse than no PDF because it undermines user confidence at the critical "artifact moment." |
| 8 | **"Why not Atticus?" -- Atticus has years of head start on browser-based book editing.** The Competitor Analyst rated Atticus as MEDIUM-HIGH threat. Browser-based, chapter-organized, professional export, one-time $148 purchase, works offline. No AI, but no AI might be fine for many users. | Medium | High | Phase 0 cannot win against Atticus on features. The Competitor Analyst's revised assessment: Atticus's core user is at a later stage (has a finished manuscript, needs formatting), while DraftCrane's target user is at an earlier stage (has scattered expertise, needs to write and organize). The overlap is narrower than it appears. DraftCrane's Phase 0 advantages: in-editor AI (Atticus has none), Google Drive file ownership (Atticus stores files in its own system), and the Phase 1 roadmap. For Phase 0 validation, we are not trying to win Atticus customers. |
| 9 | **Users fear lock-in despite owning their files.** The Target Customer raised this sharply: if she cancels DraftCrane, she has "a bunch of Google Docs with no structure." The no-lock-in claim is technically true but emotionally incomplete. | Medium | Medium | Make file ownership visible: show the Book Folder path, provide "View in Drive" links after export. Store chapters as HTML files with meaningful names (`Chapter 1 - Introduction.html`). A user who opens their Book Folder in Google Drive should see a recognizable book structure. For later phases, consider exporting a project manifest file to Drive alongside chapters. |
| 10 | **The `drive.file` scope limits Phase 0 value for users with existing content.** Users cannot browse their existing Drive files through DraftCrane. The folder picker cannot show the user's full folder tree. The auto-create-folder approach means DraftCrane starts with an empty, isolated workspace. | Medium | Medium | This is an accepted limitation for Phase 0. The UX Lead's Option A (auto-create folder) is simpler and avoids scope issues. If user testing reveals strong demand for folder selection, the Google Picker API (Option B) can be added as a fast follow without changing the OAuth scope. Acknowledge to test users that their existing files are accessible in Drive but not yet through DraftCrane. |

### Lower Priority (Phase 1+ Concerns)

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|-----------|
| 11 | **Market is too small or too competitive.** The Competitor Analyst documented a crowded landscape. The niche (nonfiction, non-technical, iPad-first) may not support a standalone product. | Medium | Critical | This is exactly what the BVM methodology is designed to answer. Phase 0 and the market test will tell us. If the kill criteria are met, we kill the product. That is a successful outcome of the validation process. |
| 12 | **AI hallucinations in source-aware features (Phase 2+).** When Source Intelligence is added, the AI may fabricate citations or misattribute sources. | Medium | High | Not a Phase 0 risk. When we build it: source linking, explicit attribution, user verification of all AI-suggested citations. |

---

## 7. Open Decisions

The following architectural decisions are documented here so the PRD acknowledges them. The five ADRs come from the project instructions (Section 7). Below each, the product-level framing explains why the decision matters and what the tradeoffs are. The actual decision belongs in the ADR process, not this document.

### ADR-001: Editor Library

**Status:** Pending. Highest-priority decision. Blocks all editor-related development.

**Why it matters:** The editor is the product. DraftCrane's core experience is writing in a chapter-based editor on iPad Safari. If the editor is buggy, slow, or frustrating on iPad, nothing else matters. The rich text editing landscape in mobile Safari is notoriously fragile.

**Tradeoffs:** Tiptap (ProseMirror-based) has the strongest iPad Safari track record but a larger bundle size (~150 KB). Lexical (Meta) is smaller (~30 KB) and newer but less battle-tested on iPad. Plate (Slate-based) has known iOS issues.

**PM position:** The Technical Lead's recommendation (Tiptap, validated via a 2-day prototype spike on physical iPad) is sound. The decision must come from observed behavior on a real device, not from documentation review.

### ADR-002: Google Drive Sync Strategy

**Status:** Pending.

**Why it matters:** Auto-save reliability is trust infrastructure. If the user does not trust that their writing is saved, they will not trust the tool. The Target Customer's number one fear is losing work.

**Tradeoffs:** On-save (debounced 2s) is simplest and aligns with single-user Phase 0. Periodic background sync adds resilience but complexity. Real-time operational transforms are overkill for Phase 0.

**PM position:** On-save (debounced 2s) with IndexedDB as a write-ahead log. The three-tier architecture (IndexedDB -> Drive -> D1 metadata) handles all identified failure modes. Accept a 2-second data loss window for hard OS kills. Offline writing is not supported in Phase 0; the IndexedDB buffer provides crash protection and survives brief connectivity drops, but the user must be online for Drive persistence.

### ADR-003: AI Provider Integration

**Status:** Pending.

**Why it matters:** The AI rewrite feature is one of Phase 0's few differentiators against the status quo. Response quality and speed directly affect whether users engage with AI at all.

**Tradeoffs:** Direct Anthropic API is simplest with the best SDK support and SSE streaming control. Cloudflare AI Gateway adds observability but introduces latency and complexity. Workers AI has lower quality for writing tasks.

**PM position:** Direct Anthropic API for Phase 0. AI Gateway adds value at scale but is unnecessary for fewer than 100 users. Track cost via the `ai_interactions` D1 table. No per-user AI usage limits in Phase 0 -- track usage from day one but do not gate access. Phase 0 is about learning, not revenue protection. Rate limit: 10 requests/minute/user to prevent abuse.

### ADR-004: PDF/EPUB Generation

**Status:** Pending. Second-highest-priority decision.

**Why it matters:** Export quality determines whether the "artifact moment" succeeds or fails. The Competitor Analyst and Target Customer both indicate that a professional-looking export is disproportionately important to user confidence. If the PDF looks like a printed web page, the product promise ("publishing is a button") fails.

**Tradeoffs:** Cloudflare Browser Rendering can produce high-quality PDF but is beta. Client-side PDF (via browser) has variable quality on iPad. EPUB generation in a Worker is straightforward (ZIP of XHTML). An external service (DocRaptor, Prince) produces professional output but adds a dependency.

**PM position:** EPUB in Worker (low risk, tractable). For PDF, prototype Browser Rendering first with a well-designed HTML+CSS template. If quality is acceptable, use it. If not, try an external service. If no approach produces book-quality output, ship Phase 0 with EPUB-only and "Export as Google Doc" as a PDF workaround. Do not ship a bad PDF.

**Export quality bar:** Not "print-ready." The bar is: good enough that an author would share this with a trusted colleague or developmental editor without apologizing for how it looks. Specifically: US Trade page size (5.5" x 8.5"), readable serif body font, proper margins, chapter titles on new pages, page numbers, and a title page with book title and author name.

### ADR-005: Data Model -- What Lives Where

**Status:** Pending.

**Why it matters:** This decision is the architectural expression of Principle 2 (no lock-in). Where content lives determines whether the "your files, your cloud" promise is real or marketing.

**Tradeoffs:** Metadata-only in D1 (chapter body in Drive) is the cleanest expression of the principle but requires a Drive API call for every chapter open. Content cached in D1 is faster but creates a second source of truth and sync complexity. IndexedDB provides the local speed buffer without server-side content duplication.

**PM position:** Metadata-only in D1 with IndexedDB as the local buffer. Content flows: Editor -> IndexedDB (instant) -> Google Drive (2s debounce) -> D1 metadata update (on Drive save success). D1 never stores chapter body text. The performance cost of Drive API reads is acceptable at Phase 0 scale. If Drive read latency exceeds 2 seconds consistently, add KV caching (TTL: 5 minutes) as a read-through cache.

**PM decision on file format:** HTML files in Drive. Not Google Docs native format. HTML preserves formatting, is the natural output of browser editors, and avoids a Docs API dependency. The tradeoff is that users cannot edit chapters in Google Docs' native editing experience. This is acceptable for Phase 0 -- DraftCrane is the editing surface.

### ADR-006: AI Agent Architecture (from project instructions)

**Status:** Not yet needed for Phase 0. Relevant for Phase 1+.

**Why it matters:** The project instructions list this as a key decision: "Where Claude Code SDK agents fit in the stack (Craft Buttons, Source Intelligence, Consistency Engine are all candidates for purpose-built agents rather than raw API calls)."

**PM position:** Phase 0 uses direct Claude API calls for simple rewrite operations. When Phase 1 introduces the Book Blueprint and Craft Buttons, evaluate whether purpose-built agents (via Claude Code SDK) produce meaningfully better output than prompt-engineered API calls. The agent architecture decision can be deferred until Phase 1 without technical debt.

### Additional PM Decisions (from Business Analyst Open Questions)

| Question | Decision | Rationale |
|----------|----------|-----------|
| Session lifetime (OQ-1) | 30 days | Match typical SaaS for low-friction re-engagement. |
| Book Folder per-project or per-account (OQ-3) | Per-project | Different books may live in different folders. |
| Multiple projects per user (OQ-4) | Yes, supported in data model. Phase 0 UI supports multiple projects via a dropdown in the toolbar/sidebar, not a separate dashboard. | If a test user asks to create a second project, we should not block them. |
| Maximum chapters per project (OQ-5) | No artificial limit. Test at 50+. | Most nonfiction books have 10-20 chapters. |
| Maximum chapter title length (OQ-8) | 200 characters | Prevents sidebar layout issues. |
| Soft-delete for chapters (OQ-9) | Hard delete in D1. Drive file moved to trash (30-day Google retention). | Drive trash provides the recovery path. |
| Pre-Drive content (OQ-10) | IndexedDB-only. Prominent banner urging Drive connection. | No content in D1, consistent with Principle 2. |
| Export file naming (OQ-14) | `{Book Title} - YYYY-MM-DD.{format}` | Prevents accidental overwrites. |
| PDF page size (OQ-15) | US Trade (5.5" x 8.5") | Standard self-publishing trim size. |
| Paste formatting (OQ-17) | Silent strip of unsupported formatting. | Supported formatting (bold, italic, headings, lists, block quote) preserved. Everything else stripped without notification. |
| iPhone support (OQ-18) | Not in Phase 0. | Minimum viewport 768px (iPad portrait). |
| Account deletion (OQ-19) | Must be defined before beta launch. Not blocking for prototype testing. | Recommended approach: delete all D1 data, revoke OAuth tokens, leave Drive files untouched. |
| Project deletion (OQ-20) | Yes, with confirmation. Soft delete (status='archived'). Drive files preserved. | US-023 in Business Analyst's stories. |
| Dual OAuth (OQ-22) | Clerk handles auth-only Google OAuth. DraftCrane handles Drive OAuth separately with different scopes. | Verify no token/session conflicts in implementation. |
| Single-chapter export format (OQ-24) | Includes a title page (book title + chapter title) but no table of contents. | Keeps single-chapter export lightweight while still feeling like a "real" document. |
| AI streaming | Required in Phase 0 (SSE). | First token target < 2 seconds. Makes AI feel responsive rather than like a loading spinner. |
| Freeform AI instruction | In Phase 0 scope. | Single-line instruction field alongside suggestion chips. Not Ask Mode (Phase 1's multi-turn conversation). |
| Chapter reorder | In Phase 0 scope. | Long-press-and-drag in sidebar. US-012A in Business Analyst's stories. |
| Word count display | In Phase 0 scope. | Per-chapter in sidebar + total. US-024 in Business Analyst's stories. |
| Google sign-in | In Phase 0 scope (via Clerk). | "Continue with Google" is the primary sign-in method. |

---

## Unresolved Issues

The following are genuine disagreements or open questions that surfaced during the three rounds and require human decision-making. I am not papering over these.

### 1. Auto-save debounce interval: 2 seconds vs. 5 seconds

The Technical Lead specifies 2 seconds (changed from 5 in their Round 2, citing the Target Customer's anxiety about data loss). The Business Analyst's Round 2 specifies 5 seconds (their changelog says they aligned with the Technical Lead's 5-second spec, but the Technical Lead had already changed to 2). I have used 2 seconds throughout this document because the Technical Lead's analysis of the three-tier save architecture makes 2 seconds viable, and the Target Customer's data loss anxiety supports the shorter interval.

**However:** The Technical Lead's own analysis shows that 2-second debounce at 50 concurrent users generates ~90K D1 metadata writes per hour, which would exceed the free tier (100K writes/day) in just over an hour. The Technical Lead recommends budgeting for the D1 paid tier ($0.75/million writes). This is trivial cost but must be explicitly approved.

**Decision needed:** Confirm 2-second debounce and approve D1 paid tier. Or revert to 5 seconds for Phase 0 to stay on free tier during prototype testing.

### 2. Content storage when Drive is not connected ("Maybe later" flow)

The Technical Lead says IndexedDB-only (no server-side persistence without Drive). The UX Lead says "server-side buffer (D1 or R2 temporary storage)." I sided with the Technical Lead (IndexedDB-only) because it keeps content out of D1 and is consistent with Principle 2. But this means a user who writes 5,000 words before connecting Drive has that content only on their specific browser on their specific device. If they clear browser data or switch devices, it is gone.

**Decision needed:** Is IndexedDB-only acceptable for the pre-Drive-connection state? Or should we add temporary server-side storage (contradicting the "no content in D1" principle) to protect users who delay Drive connection?

### 3. The Target Customer's "voice sample" request

Dr. Chen suggested that during project setup, the tool ask for a page of existing writing as a "voice sample" so the AI can better match the author's tone. This is compelling and technically simple (one extra field, one extra prompt prefix). Multiple team members noted it would significantly improve Phase 0's AI quality.

I excluded it from Phase 0 scope because it moves the AI from stateless to stateful-per-project, which is functionally a lightweight Book Blueprint. Including it would expand Phase 0 scope beyond what the project instructions specify.

**Decision needed:** Is the voice sample field a reasonable Phase 0 addition that improves validation quality? Or does it violate the "build Phase 0, validate Phase 0, then decide" principle?

### 4. Export-only PDF vs. EPUB-only fallback

I stated that if no PDF approach meets the quality bar, we ship EPUB-only. The Target Customer said she would prefer "a beautiful PDF export and no EPUB than mediocre versions of both." But PDF is the harder technical challenge (Workers constraints), while EPUB is tractable.

**Decision needed:** If ADR-004 spikes show that no PDF approach produces acceptable quality within Phase 0 timeline, do we ship EPUB-only? Or do we allocate additional time/budget for an external PDF service to ensure both formats?

### 5. The UX Lead's folder picker approach

The UX Lead recommends Option A (DraftCrane auto-creates a Book Folder) as the Phase 0 default, with Option B (Google Picker API for selecting existing folders) as a fast follow. This is pragmatic but means Marcus Chen -- who has an existing "Book Project" folder in Drive -- cannot select it. His existing files remain in a separate folder from DraftCrane's chapters.

**Decision needed:** Is auto-create-only acceptable for Phase 0? Or should the Google Picker API be included to let users select existing folders, even though it adds implementation complexity and a different visual style?

---

*End of Product Manager contribution, Round 3 (FINAL). This document incorporates feedback from all team members across three rounds: Technical Lead, Business Analyst, UX Lead, Target Customer, and Competitor Analyst. It does not represent final decisions on architecture, design, or engineering approach -- those belong in the ADR process and in the respective team members' domains. The five Unresolved Issues above require human decision-making before development begins.*
