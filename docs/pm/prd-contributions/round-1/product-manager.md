# Product Manager Contribution — PRD Rewrite Round 1

**Author:** Product Manager
**Date:** February 6, 2026
**Scope:** Phase 0 focus. Project instructions override original PRD where they conflict.

---

## 1. Executive Summary

DraftCrane is a browser-based writing environment that helps non-technical professionals — consultants, coaches, academics, founders — turn their scattered expertise into a publishable nonfiction book. It connects to the author's own Google Drive, provides a chapter-based editor with basic AI rewriting, and exports directly to PDF and EPUB. Phase 0 delivers a functional writing-and-export tool: sign in, connect your Drive, write chapters, get AI help rewriting passages, and generate a book file. That is the entire scope. Everything beyond that is post-validation.

---

## 2. Product Vision & Identity

### What DraftCrane Is

DraftCrane is a guided writing environment for nonfiction authors who have expertise but not a manuscript. It is a source-to-manuscript pipeline that works with the author's existing cloud storage. It is an AI writing partner that respects the author's voice, sources, and ownership.

The core problem: writing a professional book today requires stitching together word processors, note apps, research folders, AI chat tools, and formatting software. This fragmented workflow creates cognitive overload, lost materials, structural confusion, and technical barriers to publishing. DraftCrane replaces that patchwork with a single guided environment.

### What DraftCrane Is Not

- **Not a general-purpose word processor.** Google Docs already exists. DraftCrane is purpose-built for book-length nonfiction.
- **Not a fiction or creative writing tool.** Scrivener owns that space. DraftCrane is for experts turning knowledge into books.
- **Not an AI ghostwriter.** The author writes. The AI assists. Every AI action requires explicit user approval. No silent rewrites.
- **Not a publishing house.** DraftCrane produces export-ready files (PDF, EPUB). It does not print, distribute, or sell books.

### The Test

Every feature must pass one question: **does this reduce the author's cognitive overhead, or move the manuscript closer to publishable?** If it does neither, it gets cut. This test applies to Phase 0 and every phase after it.

### Target User

Non-technical professionals who want to write a nonfiction book but feel overwhelmed by tools and process. They work primarily on an iPad or in a browser. They are comfortable with Google Docs but not with technical software. They have existing notes and materials in Google Drive. They value ownership of their intellectual property. They want guidance and structure, not a blank page.

The usability bar: a management consultant should be able to figure out any screen in 10 seconds without instructions.

---

## 3. Product Principles

Each principle below is a decision-making rule. When we face a tradeoff, these resolve it.

### Principle 1: Browser-First, iPad-Native

DraftCrane works in Safari, Chrome, or any modern browser. No desktop app. No Electron. No "download our app." Safari on iPad is the primary test target. If it works there, it works everywhere.

**Implication for Phase 0:** Every UI element must be tested on iPad Safari before it ships. Touch targets, keyboard behavior, and viewport handling are first-class concerns, not afterthoughts.

### Principle 2: No Lock-In — The User's Files Are Sacred

All manuscript content lives in the author's Google Drive. DraftCrane indexes and caches, but the user's Drive is the canonical store. If DraftCrane disappears tomorrow, the author still has their book in a standard format in their own cloud account.

**Implication for Phase 0:** The data model must be designed so that a user who stops using DraftCrane has a complete, readable manuscript in their Google Drive. No proprietary formats. No content that exists only in our database.

### Principle 3: AI as Partner, Not Replacement

The author writes. The AI assists. Every AI-generated change requires the author's explicit approval before it is applied. No silent rewrites. No ghost-generated content presented as the author's work. Source attribution is non-negotiable.

**Implication for Phase 0:** The simple AI rewrite feature must show the proposed change and let the author accept or reject it. There is no "auto-apply" mode. The author always has the final word.

### Principle 4: Structure Reduces Overwhelm

A blank page is the enemy. DraftCrane gives authors a chapter-based structure that breaks the overwhelming task of "write a book" into manageable pieces. The interface communicates progress and next steps, not open-ended possibility.

**Implication for Phase 0:** The editor is chapter-based from day one. The user creates chapters, sees them in a navigation sidebar, and works on one chapter at a time. Even without the Book Blueprint or outline generation (those are Phase 1), the structure of "your book is a list of chapters" reduces cognitive load.

### Principle 5: Publishing Is a Button, Not a Project

Generating a professional book file should take one click. No wrestling with formatting software. No learning LaTeX. No hiring a designer for a first draft. Select a format, click export, get a file in your Book Folder.

**Implication for Phase 0:** PDF and EPUB export must work reliably with sensible defaults. The user should not need to configure margins, fonts, or layout to get a decent-looking output. Good defaults now; customization later.

---

## 4. Phased Development Plan

DraftCrane follows the Business Validation Machine methodology. We are entering Design to Prototype. The goal is to reach a functional tool, put it in front of real users, and learn whether this product deserves to exist. Speed matters more than polish. Validated learning matters more than feature count.

### Phase 0 — Foundations (Current Phase)

Phase 0 delivers the minimum tool that lets an author write and export a book.

| Feature | What It Delivers |
|---------|-----------------|
| **Auth system** | User can sign in and have a persistent account |
| **Google Drive integration** | Connect via OAuth, select a Book Folder, read/write files |
| **Basic editor** | Chapter-based manuscript writing with auto-save |
| **Simple AI rewrite** | Select text, ask AI to rewrite, expand, or simplify with accept/reject |
| **PDF/EPUB export** | One-click generation of book files saved to Book Folder |

**Explicitly NOT in Phase 0:**
Book Blueprint, outline generation, Craft buttons, Idea Inbox, Source Intelligence, collaboration, cover toolkit, structural guidance, consistency engine, or any feature from Phases 1-4.

**Phase 0 Outcome:** A user can sign in, connect their Google Drive, write chapters in a structured editor, get AI help rewriting passages, and export a PDF or EPUB. That is the entire deliverable.

#### Gate Criteria: Phase 0 to Phase 1

All of the following must be true before Phase 1 development begins:

1. **Prototype completion.** All five Phase 0 features are deployed and functional in production.
2. **Chapter completion signal.** At least one test user completes a full chapter in their first session. If zero users complete a chapter, we investigate why before building more features. (This is a kill criterion — see Section 5.)
3. **Export validation.** At least one test user successfully exports a PDF or EPUB and confirms the output is usable.
4. **No critical usability blockers.** No test user is unable to complete the core flow (sign in, connect Drive, write, export) due to a UI or technical problem.
5. **Product decision.** An explicit go/no-go decision is made based on the data above. This is not automatic.

### Phase 1 — Guided Writing (Post-Validation)

High-level scope: Book Blueprint, outline generation, Craft buttons (one-tap AI transformations), Idea Inbox, chapter organization tools.

**Outcome:** Structured, AI-assisted authoring that goes beyond basic rewriting.

#### Gate Criteria: Phase 1 to Phase 2

1. Beta cohort of at least 10 users has used the product for at least two sessions each.
2. At least 3 of 10 beta users return for a second session unprompted. (This is a kill criterion.)
3. Qualitative signal that guided writing features (Blueprint, outline) reduce time-to-first-chapter vs. Phase 0 baseline.
4. Explicit go/no-go decision.

### Phase 2 — Source Intelligence (Post-Validation)

High-level scope: Import and index source materials from Drive, searchable source panel, AI-suggested sources for current section, insert quotes with attribution.

**Outcome:** A pipeline from the author's existing knowledge artifacts to their manuscript.

#### Gate Criteria: Phase 2 to Phase 3

1. Signal of willingness to pay from at least a subset of active users. (This is a kill criterion — the 90-day mark.)
2. Source integration is used by at least half of active users.
3. Explicit go/no-go decision.

### Phase 3 — Publishing Polish (Post-Validation)

High-level scope: Professional templates, layout tuning, cover dimension guidance, ISBN walkthrough, distribution checklists (KDP, Apple Books).

**Outcome:** End-to-end publishing readiness.

### Phase 4 — Advanced AI & Ecosystem (Post-Validation)

High-level scope: Consistency engine, developmental editing feedback, multi-book memory, audiobook prep.

**Outcome:** DraftCrane becomes the default environment for knowledge-to-book publishing.

**Note:** Phases 3 and 4 are directional. Their scope will be reshaped by what we learn in earlier phases. Do not plan detailed work for these phases now.

---

## 5. Success Metrics & Kill Criteria

### Kill Criteria

These are non-negotiable. If we hit a kill criterion, we stop building and assess whether to pivot or shut down. No heroics, no "one more feature."

| Trigger Point | Kill Criterion | How Measured |
|--------------|---------------|-------------|
| After prototype (Phase 0 complete) | No user completes a full chapter in their first session | Observe 5-10 test users in moderated or unmoderated sessions. Track chapter completion via application data (D1 project/chapter records). |
| After market test (Phase 1 beta) | Fewer than 3 of 10 beta users return for a second session | Track unique user logins by date in D1. A "return" = a session on a different calendar day from the first session. |
| After 90 days of beta availability | No signal of willingness to pay | Direct user interviews or survey. "Would you pay for this? How much?" Acceptable signals: explicit "yes" with a price, or unprompted complaint about losing access. |

### Phase 0 Metrics

These are the metrics we can actually measure during Phase 0 with the infrastructure we will have.

| Metric | Target | Data Source | Measurable in Phase 0? |
|--------|--------|-------------|----------------------|
| Core flow completion rate | 80%+ of test users complete sign-in through export | Moderated test sessions (observed) | Yes |
| Time to first chapter draft | Under 2 hours from sign-in to a chapter with 500+ words | Session observation + D1 chapter metadata | Yes |
| Export success rate | 100% of export attempts produce a valid file | Application logs | Yes |
| iPad Safari usability | No critical blockers on iPad Safari | Manual QA testing | Yes |
| User-reported confusion points | Fewer than 3 per test session | Session notes from moderated testing | Yes |

### Post-Validation Metrics (Phase 1+)

These metrics matter but cannot be reliably measured until we have a real user base.

| Metric | Target | Data Source | Earliest Phase |
|--------|--------|-------------|---------------|
| Monthly active writing users | 60%+ retention month-over-month | D1 session/login data | Phase 1 (beta cohort) |
| % of users who export at least one book file | 40%+ | D1 export records | Phase 1 |
| Average chapters completed per user | 6+ | D1 chapter records | Phase 1 |
| Net Promoter Score | 40+ | User survey | Phase 1 |
| Willingness to pay | 3+ of 10 beta users express willingness | User interviews | Phase 2 (90-day mark) |

### What We Are Not Measuring in Phase 0

- Revenue, conversion rates, or pricing sensitivity. We do not have a pricing model yet.
- Organic growth or virality. We do not have a distribution channel yet.
- Long-term retention. We will not have enough users or enough time.

Being honest about measurement boundaries prevents us from making decisions based on data we do not have.

---

## 6. Risks & Mitigations

Risks are ordered by a combination of likelihood and impact. The first four risks are the ones most likely to actually threaten Phase 0 success.

### High Priority

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|-----------|
| 1 | **Prototype tests the wrong hypothesis.** We build Phase 0 and learn nothing because the test users are not representative of real target users, or because the test scenario does not reflect real authoring behavior. | High | Critical | Recruit test users who match the target profile (non-technical professionals with existing expertise and a desire to write a book). Design test scenarios around realistic tasks ("bring your actual notes and start a chapter"), not synthetic demos. Define what we want to learn before building. |
| 2 | **Editor is not good enough on iPad Safari.** Rich text editing in mobile browsers is notoriously fragile. We pick an editor library that does not work well on iPad, and the core writing experience is broken. | High | Critical | The editor library decision (ADR-001) is the highest-risk technical decision in Phase 0. Evaluate candidates specifically on iPad Safari behavior before committing. Build a throwaway editor spike early to validate. |
| 3 | **Google Drive sync causes data loss or confusion.** The sync strategy between DraftCrane and Drive introduces bugs where content is overwritten, duplicated, or lost. Users lose trust in the tool. | Medium | Critical | The Drive sync strategy (ADR-002) must be decided early and tested extensively. Start with the simplest possible approach (likely save-on-demand rather than real-time sync). Make the sync state visible to the user. Never silently overwrite. |
| 4 | **Scope creep kills velocity.** We start adding "just one more small thing" to Phase 0 and never ship. | High | High | Phase 0 scope is locked to exactly five features (auth, Drive, editor, AI rewrite, export). The project instructions list explicit exclusions. Any proposed addition must be challenged: "Does this prevent us from learning what we need to learn?" |

### Medium Priority

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|-----------|
| 5 | **AI rewrite quality is poor.** The simple AI rewrite produces output that authors find unhelpful, generic, or off-voice. Users reject most suggestions. | Medium | High | Start with a narrow, high-quality set of rewrite operations (rewrite, expand, simplify) rather than a broad set of mediocre ones. Use Claude API with well-crafted prompts. Measure acceptance/rejection rate in testing. Prompt engineering is cheaper than architecture changes. |
| 6 | **PDF/EPUB export produces unprofessional output.** The generated files look amateurish, and users do not trust them for real publishing. | Medium | Medium | "Professional" in Phase 0 means "good enough that a user would share it with an editor or beta reader." It does not mean "ready for Amazon KDP." Set expectations with test users. Choose an export library that produces clean, standard output. Defer advanced formatting to Phase 3. |
| 7 | **Google Drive API rate limits or quota issues.** The Drive API has per-user and per-project quotas that could throttle the application under normal use. | Low | Medium | Design Drive access to minimize API calls (cache aggressively, batch reads). Monitor quota usage during testing. Cloudflare R2 serves as a caching layer. This is unlikely to be a problem at Phase 0 scale but should be designed for. |
| 8 | **Users fear lock-in despite owning their files.** Even though files live in the user's Drive, users do not feel confident about this and hesitate to commit content. | Medium | Medium | Make file ownership visible in the UI. Show the user where their files live in Drive. Let them browse their Book Folder directly. The "no lock-in" principle must be experienced, not just claimed. |

### Lower Priority (Phase 1+ Concerns)

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|-----------|
| 9 | **AI hallucinations in source-aware features.** When Source Intelligence is added in Phase 2, the AI may fabricate citations or misrepresent source material. | Medium | High | Not a Phase 0 risk (no source intelligence in Phase 0). When we build it: source linking, explicit attribution, and user verification before insertion. Never present AI-generated citations as verified. |
| 10 | **Market is too small or too competitive.** The nonfiction-author-who-is-not-technical niche may not support a standalone product. | Medium | Critical | This is exactly what the BVM methodology is designed to answer. Phase 0 and the market test will tell us. If the kill criteria are met, we kill the product. That is a successful outcome of the validation process, not a failure. |

---

## 7. Open Decisions

The following five decisions are listed in the project instructions as requiring Architecture Decision Records (ADRs). Each needs a structured evaluation before Phase 0 development proceeds. These are documented here so the PRD acknowledges them; the actual decisions belong in the ADR process.

### ADR-001: Editor Library

**Decision:** Which rich text editor library to use? Candidates include Tiptap, ProseMirror, Lexical, and Plate.

**Why it matters:** The editor is the core of the product. Authors will spend most of their time in it. A poor choice here means a poor writing experience, and switching editors later is extremely expensive (it touches every feature). iPad Safari compatibility is the make-or-break factor.

**Key tradeoffs:**
- Tiptap: Higher-level API, good community, built on ProseMirror. May abstract away control we need later.
- ProseMirror: Battle-tested, maximum control. Steep learning curve, more code to write.
- Lexical: Meta-backed, modern architecture. Younger ecosystem, less proven on iPad.
- Plate: Built on Slate, React-native. Plugin ecosystem. Slate has had historical stability issues.

**Recommendation process:** Build a throwaway spike with the top 2 candidates. Test on iPad Safari with touch interactions, auto-save, and chapter switching. Decide based on observed behavior, not documentation claims.

### ADR-002: Google Drive Sync Strategy

**Decision:** How and when does DraftCrane sync content with Google Drive? Options include real-time sync, periodic sync, and save-on-demand.

**Why it matters:** This directly affects data integrity (Principle 2: the user's files are sacred) and perceived reliability. Get it wrong and users lose content or lose trust. Get it right and users never think about it.

**Key tradeoffs:**
- Real-time sync: Best UX when it works. Hard to build reliably. Conflict resolution is complex. Higher API usage.
- Periodic sync (e.g., every 30 seconds): Simpler than real-time. Risk of losing up to 30 seconds of work. Still needs conflict handling.
- Save-on-demand (explicit save or auto-save on pause): Simplest to build. Familiar mental model (like Google Docs auto-save). Lowest API usage. Requires clear save-state indicator.

**Phase 0 bias:** Start with the simplest approach that preserves trust. We can add more aggressive syncing later.

### ADR-003: AI Provider Integration

**Decision:** Should DraftCrane call the Anthropic Claude API directly, or route through Cloudflare AI Gateway?

**Why it matters:** This affects cost visibility, rate limiting, caching, and the ability to swap models later. AI Gateway adds observability but also adds a dependency and potential latency.

**Key tradeoffs:**
- Direct Anthropic API: Simpler architecture. Full control over prompts and responses. No middleware latency. Harder to monitor usage and costs at scale.
- Cloudflare AI Gateway: Built-in logging, caching, rate limiting, and analytics. Adds a hop. Ties us to Cloudflare's gateway implementation. May limit prompt/response flexibility.

**Phase 0 bias:** At Phase 0 scale (5-10 test users), the observability benefits of AI Gateway are less important than simplicity. But if the team is already on Cloudflare, Gateway may be trivial to add.

### ADR-004: PDF/EPUB Generation

**Decision:** Should book files be generated server-side (in a Cloudflare Worker) or client-side (in the browser)? Which library?

**Why it matters:** Export quality is the payoff moment for the user. If the exported file looks bad or the generation fails, the entire product promise is broken. The choice also affects architecture — server-side generation has different constraints (Worker memory/CPU limits) than client-side (browser compatibility, large file handling).

**Key tradeoffs:**
- Server-side: Consistent output regardless of browser. Can use Node-based libraries. Subject to Worker resource limits (CPU time, memory). Easier to iterate on templates without client updates.
- Client-side: No server cost. Works offline (post-validation concern). Limited library options in the browser. Output may vary by browser.
- Library options: Need specific evaluation. EPUB is relatively straightforward (it is zipped HTML). PDF is harder (layout engine needed).

### ADR-005: Data Model — What Lives Where

**Decision:** What data lives in D1 (our database) vs. what lives in Google Drive (the user's storage)?

**Why it matters:** This is the architectural expression of Principle 2 (no lock-in). The answer determines what happens when a user stops using DraftCrane, what happens if our database fails, and how we handle the boundary between "our data" and "their data."

**Key tradeoffs:**
- Maximally in Drive: The manuscript, chapter files, and project metadata all live as files in Google Drive. D1 stores only indexes, caches, and session data. Pro: strongest no-lock-in story. Con: more API calls, slower reads, harder to query.
- Hybrid: Manuscript content lives in Drive. Project structure, AI interaction history, and settings live in D1. Pro: good performance, reasonable lock-in story. Con: some user data is in our database.
- Minimally in Drive: Drive is used only for final exports. Working content lives in D1. Pro: fastest, simplest development. Con: contradicts the core "your files, your cloud" promise.

**Phase 0 bias:** The hybrid approach likely balances the no-lock-in principle with development speed. But the exact boundary matters — the ADR should specify which fields go where and why.

---

*End of Product Manager contribution. This document is one input to the PRD rewrite. It does not represent final decisions on architecture, design, or engineering approach.*
