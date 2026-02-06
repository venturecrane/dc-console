# Product Manager Contribution -- PRD Rewrite Round 2

**Author:** Product Manager
**Date:** February 6, 2026
**Scope:** Phase 0 focus. Project instructions override original PRD where they conflict.

---

## Changes from Round 1

### Key Revisions

1. **Executive Summary rewritten to acknowledge Phase 0's strategic weakness.** The Competitor Analyst's honest assessment that Phase 0 is "a basic chapter editor with simple AI rewrite and basic export" forced me to confront a gap: my Round 1 summary described Phase 0 as if it were self-evidently compelling. It is not. Phase 0 is a validation vehicle, not a differentiated product. The summary now names this directly and frames the real question Phase 0 must answer.

2. **Added "What DraftCrane Is Not Solving in Phase 0" to Product Vision.** The Target Customer (Dr. Sarah Chen) made clear that her most urgent need is organizing 200 pages of existing notes, not writing in a new editor. The UX Lead's persona Diane Mercer paints the same picture: 47 pages of mixed content in a single Google Doc. Phase 0 does not address this. My Round 1 framing glossed over this gap. The revised vision section explicitly names what Phase 0 leaves on the table and why that is a risk.

3. **Product Principles now reference specific UX patterns and technical constraints.** Round 1 principles were correct but abstract. The Technical Lead's analysis of iPad Safari limitations (Risk 1: editor, Risk 3: auto-save reliability), the UX Lead's detailed keyboard handling and bottom sheet patterns, and the Business Analyst's edge cases (US-015 auto-save, concurrent tabs) all gave me concrete detail to ground each principle in actual implementation implications.

4. **Phased Development Plan revised with sharper gate criteria and a new "Phase 0 Strategic Tension" section.** The Competitor Analyst identified that Phase 0's real differentiator does not arrive until Phase 1 (Book Blueprint + contextual AI). This creates a retention problem: Phase 0 must be good enough to keep users until Phase 1 ships. I had gate criteria in Round 1, but they did not address this tension. The revised plan names it and adjusts the gate criteria to include a "potential signal" -- do users articulate what they wish the tool did?

5. **Success Metrics revised with input from Business Analyst's open questions and Target Customer's redefinition of "complete a chapter."** Dr. Chen pointed out that "complete a chapter in the first session" means something different for someone reorganizing existing notes versus someone writing from scratch. Since Phase 0 does not support importing existing notes, the kill criterion still applies, but I have added a measurement note about what "completion" means for test users. The Business Analyst's OQ-10 (where manuscript content lives) also affects how we measure -- I now reference the Technical Lead's proposed data model.

6. **Risks section reorganized to integrate Technical Lead's risk framing and Competitor Analyst's market risk.** Round 1 had good risks but did not account for the Competitor Analyst's finding that Atticus is the closest existing product and is a one-time $148 purchase with no AI. The "why not just use Atticus?" question is now an explicit risk. Also added a new risk about Phase 0 AI quality based on the Target Customer's fear that basic AI rewrite without the Book Blueprint will feel like "ChatGPT in a different window."

7. **Open Decisions now reference the Technical Lead's ADR framing directly and incorporate the Business Analyst's open questions that require PM decisions.** Round 1 listed the five ADRs from the project instructions. Round 2 adds my product-level answers to the questions the Technical Lead and Business Analyst raised (file format, export quality bar, multi-project support, content storage, AI usage limits).

---

## 1. Executive Summary

DraftCrane is a browser-based writing environment that helps non-technical professionals turn their scattered expertise into a publishable nonfiction book. It connects to the author's own Google Drive, provides a chapter-based editor with basic AI rewriting, and exports directly to PDF and EPUB.

Phase 0 delivers the minimum tool needed to test one hypothesis: will a non-technical professional use a chapter-based browser editor with integrated AI to write and export at least one complete chapter? The five Phase 0 features are: sign in, connect Google Drive, write in a structured editor, get AI help rewriting passages, and export a book file. That is the entire scope.

**What Phase 0 is not.** Phase 0 is not a differentiated product. As the Competitor Analyst documented, what we ship in Phase 0 is a basic chapter editor with simple AI rewrite and basic export. Atticus already offers browser-based, chapter-organized writing with professional export for a one-time $148 fee -- without AI, but with years of polish. Reedsy offers something similar for free. Google Docs plus ChatGPT is free and already the workflow our target users employ. Phase 0 does not win on features. It wins on learning.

The strategic bet is this: Phase 0 validates whether the foundation is sound enough to build Phase 1, which is where the real differentiation lives -- the Book Blueprint, contextual AI that knows the author's voice, and guided writing structure. No competitor offers that. But it does not exist yet. Phase 0's job is to prove the foundation deserves it.

---

## 2. Product Vision & Identity

### What DraftCrane Is

DraftCrane is a guided writing environment for nonfiction authors who have expertise but not a manuscript. It is a source-to-manuscript pipeline that works with the author's existing cloud storage. It is an AI writing partner that respects the author's voice, sources, and ownership.

The core problem: writing a professional book today requires stitching together word processors, note apps, research folders, AI chat tools, and formatting software. As the UX Lead's persona Diane Mercer illustrates, this looks like a 47-page Google Doc titled "Book Draft v3 - REAL ONE," three Safari tabs open for source material and ChatGPT, and 45 minutes of work that produces 200 net-new words. As Marcus Chen's persona shows, even an organized professional ends up with four partial drafts of Chapter 3 and no canonical version. DraftCrane replaces that patchwork with a single guided environment.

### What DraftCrane Is Not

- **Not a general-purpose word processor.** Google Docs already exists. DraftCrane is purpose-built for book-length nonfiction.
- **Not a fiction or creative writing tool.** Scrivener owns that space. The Competitor Analyst confirmed that fiction-focused tools (Sudowrite, Novelcrafter, Dabble) serve a different audience with different needs.
- **Not an AI ghostwriter.** The author writes. The AI assists. Every AI action requires explicit user approval. No silent rewrites. As the Target Customer (Dr. Chen) put it: she wants AI that sounds like "a better version of me," not like ChatGPT.
- **Not a publishing house.** DraftCrane produces export-ready files (PDF, EPUB). It does not print, distribute, or sell books.

### What DraftCrane Is Not Solving in Phase 0

This section exists because the Target Customer and UX Lead exposed a gap between what Phase 0 delivers and what the target user most urgently needs.

Dr. Chen's number one request: "Look at my 40 documents and tell me which ones go in Chapter 1 versus Chapter 7 versus the trash." Marcus Chen's core pain: "I have four partial drafts of Chapter 3 and no canonical version." Both users have extensive existing material. Both are blocked on organization, not on writing from a blank page.

Phase 0 does not help with this. Phase 0 gives authors a new empty project with a new empty chapter. Source Intelligence (importing and organizing existing materials) is Phase 2. The Book Blueprint (teaching the AI about the author's voice and terminology) is Phase 1.

This means Phase 0's first experience is the thing Dr. Chen explicitly called a red flag: "If it shows me a blank project with an empty outline, I feel deflated." We must design the Phase 0 onboarding to acknowledge this honestly. The author is not starting from zero -- they are choosing to use a new tool for new writing while their existing material lives in Google Drive. The Google Drive connection in Phase 0 at least lets them see their files. But we are not yet the tool that helps them make sense of their existing chaos. That is a Phase 1-2 capability.

**Risk acknowledgment:** If every test user's reaction to Phase 0 is "but what about my existing notes?", that is a signal that Phase 0 cannot validate anything useful because it is testing the wrong starting point. See Risk 2 in Section 6.

### The Test

Every feature must pass one question: **does this reduce the author's cognitive overhead, or move the manuscript closer to publishable?** If it does neither, it gets cut. This test applies to Phase 0 and every phase after it.

### Target User

Non-technical professionals who want to write a nonfiction book but feel overwhelmed by tools and process. The UX Lead defined two detailed personas:

- **Diane Mercer** (Leadership Consultant, 52): works primarily on iPad Pro, lives in Google Workspace, tried Notion and abandoned it in 20 minutes, has scattered Google Docs, writes in bursts between client work. She represents the user who needs structure and simplicity above all.

- **Marcus Chen** (Executive Coach, 44): more organized than Diane (has a folder-per-chapter system in Google Drive), but still drowning in fragments and versions. He represents the user who has abundant source material but no way to turn it into a coherent manuscript.

Both personas work on iPad as their primary device. Both are comfortable with Google Docs but not with technical software. Both have existing notes and materials in Google Drive. Both value ownership of their intellectual property.

The usability bar, per the project instructions: a management consultant should be able to figure out any screen in 10 seconds without instructions. The UX Lead operationalized this as a "10-second test" at each step of the user journey, which is the right way to enforce this principle.

---

## 3. Product Principles

Each principle below is a decision-making rule. When we face a tradeoff, these resolve it. Revised from Round 1 to include specific implementation implications surfaced by the Technical Lead, UX Lead, and Business Analyst.

### Principle 1: Browser-First, iPad-Native

DraftCrane works in Safari, Chrome, or any modern browser. No desktop app. No Electron. Safari on iPad is the primary test target. If it works there, it works everywhere.

**Phase 0 implications:**
- Every UI element must be tested on iPad Safari before it ships. Touch targets of 44x44pt minimum per Apple HIG, as the UX Lead specified.
- The Technical Lead's Risk 1 (rich text editing on iPad Safari) is the highest-priority technical risk. The editor library decision (ADR-001) must be validated on a physical iPad, not based on documentation claims.
- The UX Lead's keyboard handling constraints are binding: the virtual keyboard consumes 40-50% of the screen in portrait mode, the editor must keep the cursor visible above the keyboard using the `visualViewport` API, and `100vh` does not mean what you think it means in Safari (use `100dvh`).
- Split View and Slide Over: not actively supported in Phase 0, but the app must not break in these modes (per UX Lead recommendation).
- The Business Analyst's US-011 (Edit Chapter Content) specifies < 100ms input latency and full functionality with virtual keyboard. These are hard requirements.

### Principle 2: No Lock-In -- The User's Files Are Sacred

All manuscript content lives in the author's Google Drive. DraftCrane indexes and caches, but the user's Drive is the canonical store. If DraftCrane disappears tomorrow, the author still has their book in a standard format in their own cloud account.

**Phase 0 implications:**
- The Technical Lead's proposed data model puts this into practice: chapter body content lives in Google Drive as HTML files. D1 stores only metadata (project structure, chapter ordering, word counts, AI interaction logs). This is the right split -- see ADR-005 in Section 7.
- The Business Analyst raised OQ-10: where does manuscript content live? The Technical Lead answered this: metadata in D1, content in Drive. I endorse this approach for Phase 0. The tradeoff (every chapter open requires a Drive API call) is acceptable at Phase 0 scale.
- OAuth tokens are stored server-side only, never exposed to the client. The Technical Lead specifies `drive.file` scope -- access only to files DraftCrane creates or the user explicitly opens with DraftCrane. This is the narrowest useful scope and addresses Dr. Chen's concern about granting too much access.
- The Competitor Analyst noted that cloud file ownership is a genuine differentiator: Atticus, Reedsy, and Notion all store content in their own systems. This is worth communicating clearly in the product, not just claiming in marketing. The UX Lead's design shows the Book Folder connection status and a "View in Drive" link after export. That visibility matters.
- Dr. Chen raised a deeper concern: "What about my Book Blueprint? What about my chapter organization?" If DraftCrane disappears, the user has HTML files in Drive but not the project structure. This is an honest limitation. In Phase 0, it is acceptable because the structure is simple (an ordered list of chapters). In later phases, we should consider exporting a project manifest file to Drive alongside the chapters.

### Principle 3: AI as Partner, Not Replacement

The author writes. The AI assists. Every AI-generated change requires the author's explicit approval before it is applied. No silent rewrites. No ghost-generated content presented as the author's work.

**Phase 0 implications:**
- The UX Lead designed the accept/reject flow as a bottom sheet with "Use This" / "Try Again" / "Discard" buttons, showing original and rewritten text simultaneously. This is the right pattern. The Business Analyst's US-018 adds that acceptance must be undoable (Cmd+Z restores original text). Both constraints are binding.
- The Technical Lead's Flow C specifies that AI never modifies content directly -- the user always sees a preview and explicitly accepts or rejects. The AI interaction is logged (metadata only, not content) for analytics.
- Dr. Chen's core fear: "If the AI rewrites a paragraph and I do not like it, can I go back?" The answer must be yes, immediately and obviously. Undo after accept is a hard requirement, not a nice-to-have.
- The Competitor Analyst noted that Sudowrite's approach (contextual, specific transformations) is better than generic "rewrite this." Phase 0 offers three specific modes -- rewrite, expand, simplify -- which is a good start. The UX Lead added suggestion chips ("Simpler language," "More concise," "More conversational," "Stronger") so users do not have to formulate prompts from scratch. These chips are Phase 0's lightweight version of Phase 1's Craft Buttons.

### Principle 4: Structure Reduces Overwhelm

A blank page is the enemy. DraftCrane gives authors a chapter-based structure that breaks the overwhelming task of "write a book" into manageable pieces.

**Phase 0 implications:**
- The editor is chapter-based from day one. The UX Lead's information architecture specifies exactly four screens (landing, auth, book setup, writing environment), with the writing environment being where users spend 95% of their time. No dashboard, no project picker in Phase 0. Opening DraftCrane takes the user directly to their last-edited chapter.
- The Business Analyst's US-009 through US-014 define the chapter management stories: create, edit, navigate, rename, delete. Chapter reordering via drag in the sidebar is included in the UX Lead's design (long-press and drag on iPad). The Business Analyst flagged this as out of scope for Phase 0 (US-010: "drag-to-reorder out of scope"), while the UX Lead includes it in the writing flow (Step 6). **Decision needed:** I recommend including basic reorder in Phase 0. Without it, an author who creates chapters in the wrong order has no recourse except deleting and recreating them, which is hostile. The Technical Lead's API surface already includes `PATCH /projects/:projectId/chapters/reorder`.
- The UX Lead's first-run tooltip (three steps: "This is your chapter," "Use the sidebar for chapters," "Select text for AI") is the right level of onboarding. No tutorials, no feature tours, no onboarding wizards.

### Principle 5: Publishing Is a Button, Not a Project

Generating a professional book file should take one click. No wrestling with formatting software.

**Phase 0 implications:**
- PDF and EPUB export must work with sensible defaults. The Competitor Analyst warned that export quality sets user confidence: "If the export looks like a printed web page, the user will lose confidence." The UX Lead echoed this: the PDF is the "artifact moment" where the author sees their work as a real book for the first time.
- The Technical Lead's Risk 5 (PDF/EPUB generation in Workers) is the second-highest technical risk. Workers have no filesystem, no headless browser, and a 128 MB memory limit. The Technical Lead proposed a hybrid approach: EPUB in the Worker (tractable -- it is a ZIP of XHTML), PDF via Cloudflare Browser Rendering or client-side fallback. This needs resolution via ADR-004.
- The Competitor Analyst established the quality bar: Atticus is the minimum, Vellum is the aspiration. Phase 0 will not match either, but it must produce output that an author would share with a colleague or editor without embarrassment. Specifically: proper margins, readable typography, chapter title pages, page numbers, a title page. Not "printed web page."
- The Business Analyst's US-019 raised OQ-15: PDF page size. **Decision:** A5 (standard book trim size) as the default. This makes the export feel like a book, not a document. US Letter can be offered as an alternative if feasible without scope creep.
- Export file naming (BA's OQ-14): append date to filename (`{Book Title} - 2026-02-06.pdf`) to prevent accidental overwriting. This is the safe default.

---

## 4. Phased Development Plan

DraftCrane follows the Business Validation Machine methodology. We are entering Design to Prototype. The goal is to reach a functional tool, put it in front of real users, and learn whether this product deserves to exist.

### Phase 0 Strategic Tension

The Competitor Analyst identified a critical issue: Phase 0's real differentiator does not arrive until Phase 1. The Book Blueprint (AI that knows the author's voice and terminology) is what makes DraftCrane meaningfully different from Google Docs plus ChatGPT. But the Book Blueprint is Phase 1.

This means Phase 0 must thread a needle:
- It must be good enough that test users complete the core flow (write a chapter, export a file) and come back.
- It must give us learning about whether the foundation (chapter-based editor, integrated AI, Drive-based file storage) is worth building on.
- It must not be so thin that users conclude "this is just Google Docs with a worse editor and a basic AI rewrite."

Dr. Chen predicted this reaction: "My first experience with DraftCrane will feel like 'a slightly nicer Google Doc with ChatGPT bolted on' rather than 'the tool that finally helps me finish my book.'" She may be right. The question is whether the structural advantages (chapter organization, in-editor AI, one-click export, files in Drive) are enough to hold attention through Phase 0 validation.

**What we are testing in Phase 0:**
1. Can a non-technical professional complete the core flow on iPad Safari without getting stuck?
2. Does the chapter-based structure feel meaningfully better than a long Google Doc?
3. Is the integrated AI rewrite (even without the Book Blueprint) useful enough that authors use it?
4. Does seeing their manuscript as a PDF/EPUB create an emotional "this is real" moment?
5. Do users articulate what they wish the tool did next? (This tells us whether they see potential beyond Phase 0.)

### Phase 0 -- Foundations (Current Phase)

Phase 0 delivers the minimum tool that lets an author write and export a book.

| Feature | What It Delivers | Key User Stories (BA) |
|---------|------------------|-----------------------|
| **Auth system** | User can sign in and have a persistent account | US-001 through US-004 |
| **Google Drive integration** | Connect via OAuth, select a Book Folder, read/write files | US-005 through US-008 |
| **Basic editor** | Chapter-based manuscript writing with auto-save | US-009 through US-015 |
| **Simple AI rewrite** | Select text, ask AI to rewrite/expand/simplify with accept/reject | US-016 through US-018 |
| **PDF/EPUB export** | One-click generation of book files saved to Book Folder | US-019 through US-022 |

**Explicitly NOT in Phase 0:**
Book Blueprint, outline generation, Craft buttons (beyond the three basic modes), Idea Inbox, Source Intelligence, collaboration, cover toolkit, structural guidance, consistency engine, voice dictation, progress tracking dashboard, or any feature from Phases 1-4. Also not in Phase 0: importing/organizing existing documents from Drive (Source Intelligence is Phase 2), offline writing mode, and version history beyond undo.

**Phase 0 Outcome:** A user can sign in, connect their Google Drive, write chapters in a structured editor, get AI help rewriting passages, and export a PDF or EPUB. That is the entire deliverable.

#### Gate Criteria: Phase 0 to Phase 1

All of the following must be true before Phase 1 development begins:

1. **Prototype completion.** All five Phase 0 features are deployed and functional in production.
2. **Chapter completion signal.** At least one test user completes a full chapter in their first session. "Complete" means at least 500 words of coherent content that the author considers a recognizable draft (not polished, not final -- a solid draft). If zero users complete a chapter, we investigate why before building more features. (This is a kill criterion -- see Section 5.)
3. **Export validation.** At least one test user successfully exports a PDF or EPUB and confirms the output is usable -- meaning they would share it with a colleague or editor without embarrassment.
4. **No critical usability blockers.** No test user is unable to complete the core flow (sign in, connect Drive, write, export) due to a UI or technical problem on iPad Safari.
5. **Potential signal.** At least one test user articulates an unprompted wish for a feature that maps to Phase 1 or Phase 2 (e.g., "I wish it knew my writing style," "I wish I could bring in my existing notes"). This tells us the user sees the product as a platform worth building on, not a dead end.
6. **Product decision.** An explicit go/no-go decision is made based on the data above. This is not automatic.

### Phase 1 -- Guided Writing (Post-Validation)

High-level scope: Book Blueprint (voice rules, terminology, key claims -- the feature the Target Customer most wants), outline generation, Craft buttons (one-tap AI transformations beyond rewrite/expand/simplify), Idea Inbox, chapter organization tools.

**Outcome:** Structured, AI-assisted authoring where the AI understands the author's book. This is where the Competitor Analyst's "wedge" arrives -- no competitor offers AI that knows the author's voice, terminology, and manuscript context.

#### Gate Criteria: Phase 1 to Phase 2

1. Beta cohort of at least 10 users has used the product for at least two sessions each.
2. At least 3 of 10 beta users return for a second session unprompted. (This is a kill criterion.)
3. Qualitative signal that guided writing features (Blueprint, outline) reduce time-to-first-chapter vs. Phase 0 baseline.
4. Explicit go/no-go decision.

### Phase 2 -- Source Intelligence (Post-Validation)

High-level scope: Import and index source materials from Drive, searchable source panel, AI-suggested sources for current section, insert quotes with attribution. This is the phase that would finally address Dr. Chen's "help me organize my 200 pages of notes" need.

**Outcome:** A pipeline from the author's existing knowledge artifacts to their manuscript.

#### Gate Criteria: Phase 2 to Phase 3

1. Signal of willingness to pay from at least a subset of active users. (This is a kill criterion -- the 90-day mark.)
2. Source integration is used by at least half of active users.
3. Explicit go/no-go decision.

### Phase 3 -- Publishing Polish (Post-Validation)

High-level scope: Professional templates, layout tuning, cover dimension guidance, ISBN walkthrough, distribution checklists (KDP, Apple Books).

**Outcome:** End-to-end publishing readiness. This is where export quality approaches Atticus/Vellum standards.

### Phase 4 -- Advanced AI & Ecosystem (Post-Validation)

High-level scope: Consistency engine, developmental editing feedback, multi-book memory, audiobook prep.

**Outcome:** DraftCrane becomes the default environment for knowledge-to-book publishing.

**Note:** Phases 3 and 4 are directional. Their scope will be reshaped by what we learn in earlier phases. Do not plan detailed work for these phases now.

---

## 5. Success Metrics & Kill Criteria

### Kill Criteria

These are non-negotiable. If we hit a kill criterion, we stop building and assess whether to pivot or shut down. No heroics, no "one more feature." As the project instructions state: "These are real. No heroics, no 'one more feature.'"

| Trigger Point | Kill Criterion | How Measured | Notes |
|--------------|---------------|-------------|-------|
| After prototype (Phase 0 complete) | No user completes a full chapter in their first session | Observe 5-10 test users in moderated or unmoderated sessions. Track chapter completion via D1 chapter records (word_count field, per the Technical Lead's schema). "Complete" = 500+ words that the author considers a recognizable draft. | Dr. Chen noted that "complete a chapter" means different things for different users. Since Phase 0 does not support importing existing notes, test users will be writing new content. Recruit users who have a topic in mind and can write from knowledge, not users who need to organize existing material first. |
| After market test (Phase 1 beta) | Fewer than 3 of 10 beta users return for a second session | Track unique user logins by date in D1. A "return" = a session on a different calendar day from the first session. | Dr. Chen said what brings her back is "the feeling that my book is now a real project, not a pipe dream." If users do not return, the product has not created that feeling. |
| After 90 days of beta availability | No signal of willingness to pay | Direct user interviews or survey. "Would you pay for this? How much?" Acceptable signals: explicit "yes" with a price, or unprompted complaint about losing access. | The Competitor Analyst recommends Phase 0 be free with clear future pricing signals. The Target Customer's pricing comfort zone: $19-29/month is a no-brainer, $49+ requires demonstrated value. |

### Phase 0 Metrics

These are the metrics we can actually measure during Phase 0 with the infrastructure we will have. The Technical Lead's data model gives us D1 tables for projects, chapters, ai_interactions, and export_jobs -- these are our measurement instruments.

| Metric | Target | Data Source | Why It Matters |
|--------|--------|-------------|----------------|
| Core flow completion rate | 80%+ of test users complete sign-in through export | Moderated test sessions (observed) | If users cannot complete the flow, nothing else matters. The Business Analyst's US-001 through US-022 define every step. |
| Time to first chapter draft | Under 2 hours from sign-in to a chapter with 500+ words | Session observation + D1 chapter metadata (word_count, created_at) | Dr. Chen considers this aggressive for writing from scratch but reasonable if the tool is intuitive. The UX Lead's journey map targets this as the arc of Steps 1-8. |
| Export success rate | 100% of export attempts produce a valid, usable file | D1 export_jobs table (status field) + user confirmation | The Technical Lead's Risk 5 makes this a genuine concern. If export fails, the product promise is broken. |
| AI rewrite usage and acceptance rate | At least 50% of test users try AI rewrite; at least 40% acceptance rate on suggestions | D1 ai_interactions table (accepted field) | If users do not try the AI, it is not discoverable enough or not trusted. If they try it and reject most suggestions, the AI quality is too low. |
| iPad Safari usability | No critical blockers on iPad Safari | Manual QA testing on physical device | Per the Technical Lead, iPad Safari is the make-or-break platform. The UX Lead specifies iPadOS 17+ as the minimum target. |
| User-reported confusion points | Fewer than 3 per test session | Session notes from moderated testing | The UX Lead's "10-second test" at each journey step is the design-level version of this metric. |
| Unprompted feature requests | At least 1 user articulates a Phase 1-2 feature wish | Session observation and post-session interview | This is the "potential signal" from the gate criteria. If users see DraftCrane as a dead end rather than a promising start, Phase 1 will not matter. |

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

- Revenue, conversion rates, or pricing sensitivity. We do not have a pricing model yet. The Competitor Analyst recommends free during Phase 0 with clear pricing signals, which I endorse.
- Organic growth or virality. We do not have a distribution channel yet. Dr. Chen suggested LinkedIn posts and consultant Slack communities as discovery channels -- worth noting but not actionable in Phase 0.
- Long-term retention. We will not have enough users or enough time.

Being honest about measurement boundaries prevents us from making decisions based on data we do not have.

---

## 6. Risks & Mitigations

Risks are ordered by a combination of likelihood and impact. Revised from Round 1 to integrate findings from the Technical Lead, Competitor Analyst, and Target Customer.

### High Priority

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|-----------|
| 1 | **Phase 0 feels like "Google Docs + ChatGPT" and fails to hold attention.** The Competitor Analyst named this directly: Phase 0 is a basic chapter editor with basic AI. Dr. Chen predicted: "My first experience will feel like a slightly nicer Google Doc with ChatGPT bolted on." If test users reach this conclusion, they will not return. | High | Critical | Three specific counters: (a) The chapter structure and sidebar navigation must feel meaningfully better than a long Google Doc -- the UX Lead's design makes this the primary differentiator of the writing experience. (b) AI rewrite must be faster and more convenient than switching to ChatGPT -- the bottom sheet with suggestion chips, as the UX Lead designed, eliminates the copy-paste tax. (c) The PDF export must create an emotional "this is a real book" moment -- invest in export quality per the Competitor Analyst's guidance. If all three fail, Phase 0 fails. |
| 2 | **Prototype tests the wrong users.** We build Phase 0 and learn nothing because the test users are not representative of real target users, or because the test scenario does not reflect real authoring behavior. Dr. Chen's profile -- someone with 200 pages of existing notes who needs help organizing them -- is precisely the user Phase 0 does not serve well. | High | Critical | Recruit test users who match Phase 0's realistic scenario: professionals who have a book topic and can write new content from knowledge, not users whose primary need is organizing existing material. The UX Lead's personas (Diane and Marcus) provide the recruiting profile. Design test tasks around "bring a topic you know well and start a chapter," not "bring your existing notes." Be honest that this narrows our validation to one user type. |
| 3 | **Editor is not good enough on iPad Safari.** Rich text editing in mobile browsers is notoriously fragile. The Technical Lead's Risk 1 details specific concerns: cursor positioning bugs, selection jumping with virtual keyboard, toolbar focus loss, inconsistent paste handling. | High | Critical | The editor library decision (ADR-001) is the highest-risk technical decision in Phase 0. The Technical Lead recommends Tiptap (ProseMirror-based) as the preliminary choice based on iPad Safari maturity, with a prototype spike to validate. The UX Lead specified exhaustive keyboard handling requirements. Build the editor spike in the first sprint, test on a physical iPad, and make the decision from observed behavior. |
| 4 | **Google Drive sync causes data loss or confusion.** The Technical Lead's Risk 3 details failure modes: network dropout, Drive API errors, browser crash, version conflicts. iPad Safari aggressively suspends background tabs. The `beforeunload` event is unreliable on iPad Safari. | Medium | Critical | The Technical Lead recommends on-save (debounced) as the sync strategy, with IndexedDB as a local write-ahead log for crash protection. The `visibilitychange` event (more reliable than `beforeunload` on iOS) triggers an immediate save when the tab backgrounds. The UX Lead and Business Analyst both emphasize that visible save state ("Saving..." / "Saved" / "Save failed") is critical for user trust. Accept a 5-second maximum data loss window and document it. |
| 5 | **Scope creep kills velocity.** Phase 0 scope is exactly five features. The Target Customer wants progress tracking, offline mode, existing-document organization, and collaboration. These are all reasonable. None belong in Phase 0. | High | High | The project instructions list explicit Phase 0 exclusions. Any proposed addition must be challenged: "Does this prevent us from learning what we need to learn?" The Business Analyst's user stories define the boundary. If a story is not in US-001 through US-022, it is not in Phase 0. |

### Medium Priority

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|-----------|
| 6 | **AI rewrite quality is poor without the Book Blueprint.** Dr. Chen's primary fear: the AI "strips out everything that makes my frameworks mine." Without the Book Blueprint (Phase 1), the AI has no context about the author's voice, terminology, or style. Phase 0's AI rewrite is a generic text transformation. The Competitor Analyst noted that "basic rewrite only in Phase 0" is "less useful than opening ChatGPT or Claude directly and having a full conversation." | High | High | Mitigate in two ways: (a) Send surrounding context (the paragraph before and after the selection, plus the chapter title) so the AI has tone signals. The Technical Lead's Flow C specifies 500 characters of context on each side. (b) Offer specific modes (rewrite, expand, simplify) with suggestion chips, not just a generic text box. The UX Lead's chip design ("Simpler language," "More concise," "More conversational") gives users vocabulary for their intent. This is not as good as the Book Blueprint, but it is better than ChatGPT because it eliminates the copy-paste workflow and provides some context. |
| 7 | **PDF/EPUB export produces unprofessional output.** The Competitor Analyst established the stakes: Atticus's export quality is the minimum bar, Vellum is the aspiration. Phase 0 will not match either. But if the output looks like a printed web page, the "this is a real book" moment fails. | Medium | High | The Technical Lead's Risk 5 identifies the architectural constraint: Workers have no filesystem and 128 MB memory. The hybrid approach (EPUB in Worker, PDF via Browser Rendering or client-side) needs validation via ADR-004 spikes. Define the minimum quality bar explicitly: readable serif font, proper margins, chapter title pages, page numbers, a title page with book title. Not configurable in Phase 0 -- good defaults only. If the PDF approach does not meet this bar, consider descoping to EPUB-only for Phase 0 and adding PDF once a solution is validated. |
| 8 | **"Why not Atticus?" -- Atticus is the closest competitor and has years of head start.** The Competitor Analyst rated Atticus as VERY HIGH threat. Browser-based, chapter-organized, professional export, one-time $148 purchase, works offline. No AI, but no AI might be fine for many users. | Medium | High | Phase 0 cannot win against Atticus on features. The answer is: (a) in-editor AI is something Atticus does not have, (b) Google Drive file ownership is something Atticus does not offer, and (c) the Phase 1 roadmap (Book Blueprint, contextual AI) is something Atticus cannot easily replicate. For Phase 0 validation, we are not trying to win Atticus customers. We are trying to validate whether our foundation and direction justify continued investment. |
| 9 | **Users fear lock-in despite owning their files.** Dr. Chen raised this sharply: if she cancels DraftCrane, she has "a bunch of Google Docs with no structure." The no-lock-in claim is technically true (HTML files in Drive) but emotionally incomplete. | Medium | Medium | Make file ownership visible in the UI, as the UX Lead designed: show the Book Folder path, provide "View in Drive" links after export. Additionally, store chapters as HTML files with meaningful names in Drive (the Technical Lead's proposed structure: `Chapter 1 - Introduction.html`). A user who opens their Book Folder in Google Drive should see a recognizable book structure, not opaque file IDs. |

### Lower Priority (Phase 1+ Concerns)

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|-----------|
| 10 | **Market is too small or too competitive.** The Competitor Analyst documented a crowded landscape. The niche (nonfiction, non-technical, iPad-first) may not support a standalone product. | Medium | Critical | This is exactly what the BVM methodology is designed to answer. Phase 0 and the market test will tell us. If the kill criteria are met, we kill the product. That is a successful outcome of the validation process. |
| 11 | **AI hallucinations in source-aware features.** When Source Intelligence is added in Phase 2, the AI may fabricate citations. | Medium | High | Not a Phase 0 risk. When we build it: source linking, explicit attribution, user verification. |

---

## 7. Open Decisions

The following decisions are documented here so the PRD acknowledges them. The five ADRs come from the project instructions. Below each, I have added product-level answers to questions raised by the Technical Lead and Business Analyst that require PM input.

### ADR-001: Editor Library

**Status:** Pending. Highest-priority decision.

**What the Technical Lead proposed:** Tiptap (ProseMirror-based) as preliminary recommendation. iPad Safari maturity is the deciding factor. Prototype spike with Tiptap and Lexical, tested on a physical iPad, scored on typing, formatting, selection, copy/paste, undo/redo, and virtual keyboard behavior. Allocate 2 days.

**PM position:** Agreed. The editor is the product. This decision cannot be made from documentation or blog posts. The UX Lead's interaction patterns (text selection for AI rewrite, chapter switching, sidebar navigation) define the requirements the editor must meet.

### ADR-002: Google Drive Sync Strategy

**Status:** Pending.

**What the Technical Lead proposed:** On-save (debounced at 5 seconds of inactivity). Simplest approach for single-user Phase 0. IndexedDB as local write-ahead log. `visibilitychange` event for tab-background saves.

**PM position:** Agreed. On-save is the right starting point. The Technical Lead's auto-save reliability spec (Section 3.3 of their contribution) -- three visible states ("Saving...", "Saved [timestamp]", "Save failed"), exponential backoff retry, crash recovery from IndexedDB -- should be treated as a hard requirement. The Business Analyst's US-015 acceptance criteria align.

**PM answer to Technical Lead's open question 3 (offline writing):** Phase 0 does not support meaningful offline writing. "Offline indicator + local buffer" is sufficient. The local buffer (IndexedDB) provides crash protection and survives brief connectivity drops, but the user must be online to save to Drive. The Target Customer wants offline mode, but building it for Phase 0 would require significant additional sync logic. Flag for Phase 1+ if user feedback indicates it is blocking adoption.

### ADR-003: AI Provider Integration

**Status:** Pending.

**What the Technical Lead proposed:** Direct Anthropic API for Phase 0. Simplest integration, best SDK support. AI Gateway adds value at scale but is unnecessary for < 100 users.

**PM position:** Agreed. Direct API for Phase 0.

**PM answer to Technical Lead's open question 5 (AI cost controls):** No per-user AI usage limits in Phase 0. Track usage from day one (the Technical Lead's ai_interactions table captures this), but do not gate access. Phase 0 is about learning, not revenue protection. The Competitor Analyst recommends setting limits before paid launch, which I endorse. If a single test user generates unexpected costs, we handle it case-by-case.

### ADR-004: PDF/EPUB Generation

**Status:** Pending. Second-highest-priority decision.

**What the Technical Lead proposed:** Hybrid approach. EPUB in Worker (ZIP of XHTML -- tractable). PDF via Cloudflare Browser Rendering if stable, client-side fallback otherwise. Three spikes, 1 day each: EPUB in Worker, Browser Rendering for PDF, client-side PDF.

**PM position:** Agreed on the spike approach. If no PDF approach meets the quality bar (readable serif font, proper margins, chapter title pages, page numbers), consider shipping Phase 0 with EPUB-only and adding PDF once a solution is validated. EPUB-only is a less painful scope cut than shipping an ugly PDF that undermines user confidence.

**PM answer to Technical Lead's open question 2 (export quality bar):** "Print-ready" is the wrong word for Phase 0. The bar is: "good enough that an author would share this with a trusted colleague or developmental editor without apologizing for how it looks." Specifically: A5 page size for PDF, readable serif body font (e.g., Georgia or Libre Baskerville), 0.75-1" margins, chapter titles on new pages with larger font, page numbers, and a title page with book title. No headers, no footers, no custom layout. Two or three reference books to match: any well-formatted self-published nonfiction on Amazon with clean, simple interior design.

### ADR-005: Data Model -- What Lives Where

**Status:** Pending.

**What the Technical Lead proposed:** Metadata-only in D1 (Option 1). Chapter body content in Google Drive as HTML files. D1 stores project structure, chapter ordering, word counts, AI logs, OAuth tokens. Drive is always authoritative.

**PM position:** Endorsed. This is the right split for Phase 0. It is the cleanest expression of Principle 2 (no lock-in) and the Technical Lead's reasoning is sound: the performance cost of Drive API reads is acceptable at Phase 0 scale.

**PM answer to Technical Lead's open question 1 (file format):** HTML files in Drive, as proposed. Not Google Docs native format. Rationale: HTML preserves formatting, is the natural output of browser editors, avoids a Docs API dependency, and the user can open HTML in any browser. The tradeoff is that users cannot edit their chapters in Google Docs directly. This is acceptable for Phase 0 -- DraftCrane is the editing surface.

**PM answer to Technical Lead's open question 4 (multi-device):** Phase 0 assumes single-device usage. The Technical Lead's conflict detection (optimistic versioning with 409 response) plus the Business Analyst's recommended "block second tab" approach (BA OQ-16) is acceptable. Basic conflict detection and a user-facing prompt is sufficient.

### Additional PM Decisions (from Business Analyst Open Questions)

These decisions were surfaced by the Business Analyst and need PM resolution:

| OQ# | Question | Decision | Rationale |
|-----|----------|----------|-----------|
| OQ-1 | Session lifetime | 30 days | Match typical SaaS for low-friction re-engagement. Dr. Chen should never have to re-authenticate when she returns after a week away from her book. |
| OQ-3 | Book Folder per-project or per-account? | Per-project | Different books may live in different folders. The Technical Lead's schema already stores `drive_folder_id` on the projects table. |
| OQ-4 | Multiple projects per user? | Yes | The UX Lead's IA shows one book per user in Phase 0 (no project picker, go straight to writing environment). I lean toward supporting multiple projects in the data model but showing a single-project experience in the UI for Phase 0. If a test user asks to create a second project, we should not block them. |
| OQ-5 | Maximum chapters per project? | No artificial limit | Test at 50+ for performance. Most nonfiction books have 10-20 chapters. |
| OQ-8 | Maximum chapter title length | 200 characters | Prevents sidebar layout issues, per the BA's recommendation. |
| OQ-9 | Soft-delete for chapters? | Hard delete in Phase 0 | The BA recommended this, and I agree. Confirmation dialog is required (BA US-014). Soft-delete with recovery is Phase 1. |
| OQ-14 | Export file naming | Append date: `{Book Title} - 2026-02-06.pdf` | Prevents accidental overwrites. |
| OQ-15 | PDF page size | A5 default | Book-like feel per the Competitor Analyst's guidance. |
| OQ-17 | Notify when pasted formatting is stripped? | Silent strip in Phase 0 | Supported formatting (bold, italic, headings, lists) is preserved. Everything else is stripped without notification. Simpler to implement, and users rarely paste content expecting table formatting to survive a new editor. |
| OQ-18 | iPhone support? | Not in Phase 0 | iPad is the primary target. The writing experience requires a minimum viewport of 768px (iPad portrait). iPhone screens are too small for a chapter editor with sidebar. |
| OQ-19 | Account deletion | Define before beta launch | Required for GDPR compliance. The BA's recommendation (delete all D1 data, revoke OAuth tokens, leave Drive files untouched) is correct. Not blocking for Phase 0 prototype testing with a small group, but must exist before any broader beta. |
| OQ-20 | Can a user delete a project? | Yes, with confirmation dialog | Deferred to Phase 0 only if time permits. If not, add as a known limitation. |

---

*End of Product Manager contribution, Round 2. This document incorporates feedback from the Technical Lead, Business Analyst, UX Lead, Target Customer, and Competitor Analyst. It does not represent final decisions on architecture, design, or engineering approach -- those belong in the ADR process and in the respective team members' domains.*
