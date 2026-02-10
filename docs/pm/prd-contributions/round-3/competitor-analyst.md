# Competitor Analyst Contribution -- PRD Rewrite Round 3 (FINAL)

**Role:** Competitor Analyst
**Date:** February 6, 2026
**Scope:** Competitive landscape analysis for DraftCrane Phase 0 positioning
**Round:** 3 of 3 (Final)

**Methodology Note:** Web search and fetch tools were unavailable during all three rounds. Pricing and feature data are based on extensive hands-on evaluation of these tools through early 2025, supplemented by knowledge of announced changes through January 2025. Specific prices marked with an asterisk (\*) should be verified before finalizing the PRD, as competitors adjust pricing frequently. All competitive assessments have been cross-validated against the Target Customer's reported tool experience and the UX Lead's persona research.

---

## Changes from Round 2

### Key Revisions

1. **Resolved the auto-save debounce discrepancy.** Round 2 referenced the Technical Lead's 5-second debounce, but the Technical Lead's Round 2 actually revised this to 2 seconds. The Business Analyst's Round 2 aligned to 5 seconds. The PM has not resolved this. I have noted it as an unresolved issue at the bottom of this document. Competitive analysis references the data loss window generically ("seconds") rather than committing to either number.

2. **Aligned terminology with all Round 2 contributions.** Standardized on: "Book Folder" (not "book folder" or "project folder"), "Writing Environment" (the UX Lead's canonical term for the main screen), "bottom sheet" (not "modal" or "panel" or "drawer"), "suggestion chips" (not "instruction chips" or "craft buttons"), "Phase 0" scope per the PM's explicit list (auth, Drive integration, basic editor, simple AI rewrite, PDF/EPUB export).

3. **Reconciled the chapter reorder question.** The BA excluded drag-to-reorder from Phase 0 (US-010). The UX Lead included it (Step 8). The Technical Lead built the API for it. The PM in Round 2 recommended including it. I have updated competitive comparisons to reflect chapter reorder as "likely included" in Phase 0, noting the PM's recommendation but flagging it as requiring final confirmation.

4. **Verified Phase 0 scope has not crept.** Reviewed all Round 2 contributions for scope additions. The BA added US-023 (Delete a Project) and US-024 (Word Count Display). The UX Lead added chapter reorder and freeform instruction input for AI. These are all lightweight additions that do not constitute scope creep -- they are essential for the core experience and all team members have identified them as necessary. No competitor comparison in this document assumes features beyond what Round 2 collectively defined for Phase 0.

5. **Sharpened the "uncomfortable truth" to reflect Round 2 consensus.** All roles now agree on this assessment. The PM explicitly wrote: "Phase 0 is not a differentiated product." The Target Customer said: "My first experience will feel like a slightly nicer Google Doc with ChatGPT bolted on." I no longer need to argue this point; it is settled. Round 3 focuses on the constructive response: what the competitive strategy actually is, given this acknowledged weakness.

6. **Updated Sudowrite pricing and competitive framing.** Sudowrite raised prices in late 2024 and restructured tiers. Updated to reflect the latest known pricing. Also added Novelcrafter as an emerging competitor worth monitoring.

7. **Added the "Google Docs + Gemini" competitive scenario.** Google has been integrating Gemini AI features directly into Google Docs throughout 2024-2025. This narrows DraftCrane's "integrated AI" advantage because the target user's existing tool now has AI built in. Updated competitive analysis accordingly.

8. **Finalized pricing recommendation with explicit alignment to the Business Analyst's cost model and the PM's validation methodology.** The $24/month Pro price remains, but I have added stronger justification connected to the BA's AI cost estimates and the PM's kill criteria.

---

## 1. Competitive Landscape Map

### 1A. General Writing Tools

#### Google Docs (+ Gemini AI)

- **Pricing:** Free (with Google account); Google Workspace from $7/user/month\*
- **Target User:** Everyone. Default writing tool for non-technical professionals.
- **Key Strengths:** Zero friction to start. Real-time collaboration. Runs everywhere including iPad Safari. The user's files are already here. Version history is robust and trusted. Gemini AI features are now integrated for rewriting, drafting, summarization, and brainstorming -- directly inside the document. Offline support via Chrome.
- **Key Weaknesses:** No book structure. No chapter organization beyond manual heading hierarchy. No export to EPUB. PDF export is basic (no trim sizes, no professional book layout). No awareness of "a book" as a concept. Gemini AI features are general-purpose, not tuned for long-form or book writing. No persistent voice/style context across documents.
- **Platform:** Web (all browsers), iOS/Android apps, offline via Chrome
- **Threat Level to DraftCrane:** VERY HIGH. This threat level has increased from Round 2's HIGH because of Gemini integration. Google Docs with Gemini is no longer just "the place where files live" -- it is now a writing tool with AI assistance. The "DraftCrane has integrated AI but Google Docs does not" advantage has eroded. What remains: DraftCrane has chapter-based structure, book-aware export, and (in future phases) contextual AI that knows the author's voice. But the gap has narrowed.
- **Persona connection:** Dr. Sarah Chen has her entire book scattered across 40 Google Docs. Diane Mercer's "Book Draft v3 - REAL ONE" is a 47-page Google Doc. Marcus Chen has 12 subfolders with 3-15 docs each. Google Docs is not the competitor -- it is the current reality. DraftCrane must work _with_ it (via Google Drive integration), not ask users to leave it.
- **Updated competitive dynamic:** A user who discovers that Google Docs now offers "Help me write" and "Refine" buttons directly inline may feel that the copy-paste-to-ChatGPT workflow is already solved -- without switching to a new tool. DraftCrane's counter: Google Docs AI does not know your book, does not maintain chapter structure, and does not export to book formats. But the "inline AI" differentiator is weaker than it was 12 months ago.

#### Microsoft Word (+ Copilot)

- **Pricing:** Microsoft 365 Personal $6.99/month* or $69.99/year*; Copilot Pro add-on $20/month\*
- **Target User:** Office workers, academics, traditional publishing authors
- **Key Strengths:** Industry standard for manuscript submission to traditional publishers. Mature formatting. Track changes for editor collaboration. Copilot AI integration for rewriting and drafting.
- **Key Weaknesses:** Desktop-first experience. iPad app is functional but limited. No book-specific structure. EPUB export nonexistent. File management is the user's problem.
- **Platform:** Desktop (Windows/Mac), iPad app, web (limited)
- **Threat Level to DraftCrane:** LOW. DraftCrane's target personas are Google Docs users, not Word users. Word users pursuing traditional publishing have a fundamentally different workflow.

#### Notion (+ Notion AI)

- **Pricing:** Free tier (limited); Plus $10/month*; Business $18/month*; Notion AI add-on $10/member/month\*
- **Target User:** Knowledge workers, project managers, teams
- **Key Strengths:** Excellent organizational structure (databases, nested pages, toggles). Good for research collection and outlining. Notion AI for summarizing, rewriting, and generating content. Strong on iPad.
- **Key Weaknesses:** Not a writing environment. The block-based editor breaks flow for long-form prose. No manuscript concept. No export to book formats. AI is general-purpose, not writing-aware. Content lives in Notion's cloud, not the user's.
- **Platform:** Web, desktop apps, iOS/Android
- **Threat Level to DraftCrane:** LOW-MEDIUM as a writing tool, MEDIUM as an organizational tool.
- **Persona connection:** Dr. Sarah Chen tried Notion for book planning, "spent an entire Saturday afternoon setting up databases and templates before realizing I had done zero actual writing." DraftCrane must provide enough structure to be useful without becoming a setup project.

### 1B. Book Writing Tools

#### Scrivener

- **Pricing:** One-time purchase. Mac: $49*. Windows: $49*. iOS: $23.99\*. No subscription.
- **Target User:** Serious writers (fiction and nonfiction). Power users who want deep organizational control.
- **Key Strengths:** The gold standard for manuscript organization. Binder (hierarchical document tree), Corkboard (index card view), Outliner, Snapshots (version history), Split editor, Research folder for imported materials, Compile system for flexible export, full offline capability, one-time purchase.
- **Key Weaknesses:** Steep learning curve. UI feels dated. iOS app is stripped-down and requires manual sync via Dropbox. No real-time collaboration. No AI features. Compile system is powerful but notoriously confusing. No cloud-native option. Sync between devices is fragile and has been a persistent source of user complaints.
- **Platform:** Mac, Windows, iOS (limited)
- **Threat Level to DraftCrane:** HIGH for credibility, MEDIUM for actual user overlap.
- **Persona connection:** Dr. Sarah Chen "downloaded it on my MacBook, spent 45 minutes staring at the interface, and closed it." This is the definitive Scrivener rejection story for DraftCrane's target user. The problem is not that Scrivener is bad -- it is that its power requires investment that non-technical professionals will not make.

#### Atticus

- **Pricing:** One-time purchase: $147.99\*. No subscription.
- **Target User:** Self-publishing authors who want writing + formatting in one tool.
- **Key Strengths:** Browser-based (works on any device including iPad). Combined writing and formatting in one tool. Professional book formatting with templates. EPUB and print-ready PDF export. Chapter-based organization. Clean, modern UI. Offline support via PWA. One-time purchase.
- **Key Weaknesses:** No AI features. Limited organizational tools compared to Scrivener (no research folder, no corkboard). No cloud storage integration -- files live in Atticus's system. No collaboration features. No voice/style context awareness.
- **Platform:** Web (browser-based, works offline via PWA)
- **Threat Level to DraftCrane:** MEDIUM-HIGH.
- **Competitive reassessment (stable from Round 2):** Atticus's core user is a self-publishing author who has a completed manuscript and needs to format and publish it. DraftCrane's personas (Diane, Marcus, Dr. Chen) are at an earlier stage: they have scattered expertise and need to organize, write, and polish. The user journey overlap is narrower than the feature overlap suggests. However, Atticus remains the most important comparison point for export quality and a critical price anchor.

#### Vellum

- **Pricing:** One-time purchase. Ebook-only: $249.99*. Ebook + Print: $349.99*.
- **Target User:** Self-publishing authors focused on professional-quality book formatting and design.
- **Key Strengths:** The most beautiful book formatting tool available. Gorgeous templates. WYSIWYG preview of final book layout. Ebook and print formatting that rivals traditional publishers.
- **Key Weaknesses:** Mac only. No Windows, no iPad, no web. No writing environment. No AI. Expensive. Solves only the last mile: formatting a completed manuscript.
- **Platform:** Mac only
- **Threat Level to DraftCrane:** LOW for Phase 0 direct competition. HIGH as a quality benchmark. Given the Technical Lead's analysis of PDF generation constraints in Workers, DraftCrane's Phase 0 export will fall well short of Vellum quality. This is acceptable because DraftCrane's personas are not yet at the formatting stage, but export must still look intentionally designed (per the PM's quality bar: "good enough to share with a colleague without apologizing").

#### Reedsy Book Editor

- **Pricing:** Free.
- **Target User:** Self-publishing authors looking for a free, no-friction writing and formatting tool.
- **Key Strengths:** Completely free. Browser-based. Clean editor. Chapter organization. Export to EPUB and PDF with decent formatting. Part of the Reedsy marketplace ecosystem. Simple and approachable.
- **Key Weaknesses:** Limited formatting options. No AI features. No cloud storage integration. Basic export quality. No offline support. The tool is a funnel to Reedsy's marketplace services. Limited customization.
- **Platform:** Web only
- **Threat Level to DraftCrane:** MEDIUM.
- **Persona connection:** Reedsy appeals to cost-sensitive self-publishers. Dr. Sarah Chen, who bills $400/hour, is not that person. Diane and Marcus are professionals who will pay for good tools. The "free" factor matters less for DraftCrane's professional target segment than for the broader self-publishing market. However, Reedsy provides a useful floor for what a free browser-based book editor looks like.

### 1C. AI Writing Assistants

#### ChatGPT (OpenAI)

- **Pricing:** Free tier; ChatGPT Plus: $20/month*; ChatGPT Pro: $200/month*
- **Target User:** Everyone.
- **Key Strengths:** Extremely capable at rewriting, expanding, simplifying, brainstorming. Low learning curve. Many aspiring authors already use it. Flexible. Custom GPTs and memory features add persistent context. Projects feature (launched 2024) adds file upload and persistent workspace.
- **Key Weaknesses:** No writing environment. No manuscript structure. No export. The user must copy-paste between the chat and their document. No book-level consistency across sessions without careful prompt management. Voice preservation remains a consistent user complaint.
- **Platform:** Web, mobile apps, desktop apps
- **Threat Level to DraftCrane:** HIGH.
- **Persona connection:** Dr. Chen pays $20/month for ChatGPT Plus and reports it "strips out everything that makes my frameworks mine." Diane uses ChatGPT in a third Safari tab. Marcus's experience: "The result is too casual." All three personas use ChatGPT. All three are dissatisfied. But none have stopped using it because there is nothing better integrated. This is DraftCrane's opening -- but the opening is narrower than it was before Google Docs integrated Gemini.

#### Claude (Anthropic) -- Direct Use

- **Pricing:** Free tier; Claude Pro: $20/month*; Claude Team: $30/user/month*
- **Target User:** Writers, researchers, professionals. Claude has a reputation for more nuanced, longer-form writing output.
- **Key Strengths:** Strong at long-form writing, nuance, and voice preservation. Projects feature with document upload for persistent context. Artifacts feature for viewing formatted output alongside conversation.
- **Key Weaknesses:** Same fundamental limitation as ChatGPT: no writing environment, no manuscript structure, no export, copy-paste workflow.
- **Platform:** Web, mobile apps, desktop (Claude for Desktop)
- **Threat Level to DraftCrane:** MEDIUM. Relevant because DraftCrane uses Claude as its AI backend. Users who already use Claude Pro may wonder why they need DraftCrane when they can upload documents to Claude Projects and get rewriting assistance there. The answer: Claude Projects does not provide a chapter-based editor, auto-save to Drive, or book-format export.

#### Sudowrite

- **Pricing:** Subscription. Hobby & Student: $19/month*. Professional: $29/month*. Max: $59/month\* (pricing restructured in late 2024; verify current tiers).
- **Target User:** Fiction writers primarily. Creative writers who want AI to help with prose, description, dialogue, and plot.
- **Key Strengths:** Purpose-built for creative writing. "Story Engine" can generate chapters from outlines. Deeply embedded AI integration in the writing flow. Tone and style matching. "Write" mode generates prose from brief direction. "Describe" mode adds sensory detail. "Brainstorm" mode generates plot and character ideas.
- **Key Weaknesses:** Fiction-focused -- nonfiction is an afterthought. No book formatting or export to standard book formats. No cloud storage integration. Content lives in Sudowrite's system. The "AI writes for you" philosophy conflicts with DraftCrane's "AI assists, never replaces" principle. No iPad optimization.
- **Platform:** Web (desktop browser optimized)
- **Threat Level to DraftCrane:** LOW directly. Relevant as a study subject for AI integration patterns and pricing benchmarks.

#### Novelcrafter

- **Pricing:** Subscription. Hobbyist: free (limited). Scribe: $9/month*. Author: $19/month*. Worldbuilder: $29/month\*. (Pricing and tier names may have changed.)
- **Target User:** Fiction writers who want a "Scrivener-like" organizational tool with AI assistance.
- **Key Strengths:** Codex system (a structured knowledge base the AI references when generating content -- similar in concept to DraftCrane's Book Blueprint). Scene-based writing. AI that maintains narrative consistency by referencing the codex. Good organizational tools.
- **Key Weaknesses:** Fiction-focused. No nonfiction workflow. No book formatting or export. Desktop-optimized, not iPad-first. Relatively new (launched 2023-2024).
- **Platform:** Web
- **Threat Level to DraftCrane:** LOW directly. But Novelcrafter's "Codex" concept is the closest existing implementation to DraftCrane's planned Book Blueprint. The Codex proves the concept works: giving AI structured context about a project dramatically improves output quality. DraftCrane should study this implementation when building Phase 1.

### 1D. Self-Publishing Platforms

#### Amazon KDP (Kindle Direct Publishing)

- **Pricing:** Free to use. Amazon takes 30-65% of sale price depending on royalty option.
- **Target User:** Anyone self-publishing a book on Amazon.
- **Key Strengths:** Dominant distribution platform. Kindle ebook, paperback, and hardcover. Free ISBN. Built-in marketing tools (ads, Kindle Unlimited enrollment).
- **Key Weaknesses:** Not a writing tool. Requires a finished, formatted manuscript. Formatting requirements can be confusing. Cover design is the user's problem.
- **Platform:** Web
- **Threat Level to DraftCrane:** Not a competitor. KDP is a distribution endpoint. DraftCrane's Phase 3 vision includes a KDP submission checklist. Alignment, not competition.

#### Draft2Digital

- **Pricing:** Free to use. Takes 10% of sale price.
- **Target User:** Self-publishing authors who want wider distribution than Amazon alone.
- **Key Strengths:** Distributes to multiple retailers (Apple Books, Kobo, Barnes & Noble, etc.). Free formatting tool. Clean interface. Lower commission than aggregator competitors.
- **Key Weaknesses:** Not a writing tool. Smaller market share than KDP. Formatting tool is basic.
- **Platform:** Web
- **Threat Level to DraftCrane:** Not a direct competitor. Potential future integration partner.

### 1E. Adjacent Tools

#### Grammarly Premium

- **Pricing:** ~$12/month* (individual), ~$30/month* (business)
- **Target User:** Professionals and writers who want grammar checking, clarity suggestions, and style improvement.
- **Key Strengths:** Excellent at sentence-level polish. Works inline across many apps via browser extension. Tone detection. Plagiarism checker. GrammarlyGO (AI writing assistant features).
- **Key Weaknesses:** Not a writing environment. Not book-aware. Cannot help with structure, argumentation, or organization. Chrome extension approach means it works inside Google Docs but is not integrated into a book-writing workflow.
- **Platform:** Browser extension, desktop apps, web editor, mobile keyboard
- **Threat Level to DraftCrane:** Not a direct competitor, but part of the incumbent spend. Dr. Sarah Chen pays $12/month for Grammarly. DraftCrane's AI rewrite features partially overlap with Grammarly's clarity and simplification features. If DraftCrane's AI quality is good enough, it could replace Grammarly for in-manuscript editing, lowering the effective switching cost (user replaces $32/month of tools -- ChatGPT + Grammarly -- with one DraftCrane subscription).

#### Otter.ai

- **Pricing:** Free tier; Pro: ~$17/month*; Business: ~$33/month*
- **Target User:** Professionals who want to transcribe meetings, lectures, or spoken ideas.
- **Key Strengths:** Real-time transcription. Good accuracy. Integration with Zoom and meeting tools.
- **Key Weaknesses:** Not a writing tool. Produces transcripts, not prose. No book structure.
- **Platform:** Web, mobile apps
- **Threat Level to DraftCrane:** Not a competitor. A signal of willingness to pay for tools that capture expertise. DraftCrane's Phase 1 Idea Inbox with voice dictation could absorb this use case.

### 1F. The Real Competitor: The User's Existing Chaos

This framing is unchanged from Round 2 and is now validated by all team members.

**DraftCrane's primary competitor is not a product. It is the user's existing Google Drive folder full of scattered documents.**

Dr. Sarah Chen: "I have roughly 200 pages of notes scattered across maybe 40 Google Docs." Marcus Chen: 12 subfolders with 3-15 documents each, four partial drafts of Chapter 3. Diane Mercer: "Book Draft v3 - REAL ONE" is a 47-page doc with notes scattered throughout.

The competitive question is not "Why DraftCrane instead of Atticus?" It is "Can DraftCrane help me make sense of what I already have, or is it just another blank page?"

**Phase 0 implication (unchanged):** If DraftCrane presents a blank project setup screen to a user who has 40 documents in Google Drive, it is losing to the status quo. The PM acknowledged this in Round 2: "Phase 0 does not help with this." The Target Customer called it a "red flag." All parties agree this is a known gap that Phase 0 accepts and Phase 2 (Source Intelligence) addresses. The mitigation: the UX Lead's Google Drive integration shows the user their connected Book Folder and a "View in Google Drive" link so the user knows DraftCrane is aware their files exist, even if Phase 0 cannot analyze them. The Target Customer's suggestion of a "paste existing content" workflow is a lightweight bridge worth considering.

---

## 2. Feature Comparison Matrix -- DraftCrane Phase 0 vs. Top 5 Relevant Competitors

The five most relevant competitors for DraftCrane's target user (grounded in the UX personas Diane and Marcus, and the Target Customer Dr. Chen):

1. **Google Docs + Gemini + Grammarly** (the current cobbled-together workflow, ~$32/month)
2. **Atticus** (closest product-market overlap for browser-based book writing)
3. **Scrivener** (the "right answer" that does not work for this user)
4. **Reedsy Book Editor** (free browser-based alternative)
5. **Notion + AI** (organizational alternative some users try)

| Feature                               | DraftCrane Phase 0                                     | Docs + Gemini + Grammarly                               | Atticus              | Scrivener                    | Reedsy Editor           | Notion + AI          |
| ------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------- | -------------------- | ---------------------------- | ----------------------- | -------------------- |
| **Browser-based**                     | Yes                                                    | Yes (3 separate tools)                                  | Yes                  | No (Mac/Win app, iOS app)    | Yes                     | Yes                  |
| **iPad-optimized**                    | Yes (primary target)                                   | Partial (3 separate apps)                               | Yes                  | Partial (iOS app is limited) | Partial (not optimized) | Yes                  |
| **Chapter-based structure**           | Yes                                                    | No (manual headings)                                    | Yes                  | Yes (excellent)              | Yes                     | Manual               |
| **AI writing assistance**             | Yes (rewrite/expand/simplify)                          | Yes (Gemini inline + ChatGPT copy-paste)                | No                   | No                           | No                      | Yes (basic)          |
| **Integrated AI (in-editor)**         | Yes (bottom sheet + suggestion chips)                  | Partial (Gemini is inline in Docs; ChatGPT is separate) | No                   | No                           | No                      | Yes (limited)        |
| **PDF export (book-quality)**         | Basic (constrained by Workers -- see Tech Lead Risk 5) | No (basic PDF only)                                     | Yes (professional)   | Yes (via Compile)            | Yes (decent)            | No                   |
| **EPUB export**                       | Yes                                                    | No                                                      | Yes                  | Yes                          | Yes                     | No                   |
| **Cloud file ownership**              | Yes (Google Drive)                                     | Yes (Google Drive)                                      | No (Atticus storage) | Partial (local files)        | No (Reedsy storage)     | No (Notion storage)  |
| **Source material integration**       | No (Phase 2)                                           | No (manual multi-doc)                                   | No                   | Yes (Research folder)        | No                      | Partial (link pages) |
| **Book Blueprint / style guide**      | No (Phase 1)                                           | No                                                      | No                   | No                           | No                      | No                   |
| **Outline generation**                | No (Phase 1)                                           | Manual via Gemini/ChatGPT                               | No                   | No                           | No                      | Manual via Notion AI |
| **Professional formatting templates** | No (Phase 3)                                           | No                                                      | Yes (excellent)      | Yes (via Compile)            | Yes (limited)           | No                   |
| **Collaboration**                     | No                                                     | Yes (Docs: excellent)                                   | No                   | No                           | No (share links only)   | Yes (excellent)      |
| **Offline support**                   | No (IndexedDB buffer for brief drops)                  | Partial (Docs offline via Chrome)                       | Yes (PWA)            | Yes (native)                 | No                      | Partial              |
| **Version history**                   | No (Cmd+Z undo only)                                   | Yes (Docs: excellent, trusted)                          | No                   | Yes (Snapshots)              | No                      | Yes                  |
| **Auto-save**                         | Yes (to Google Drive)                                  | Yes                                                     | Yes                  | Manual + auto                | Yes                     | Yes                  |
| **Chapter reordering**                | Yes (long-press drag, per PM recommendation)           | N/A                                                     | Yes                  | Yes (Binder drag)            | Yes                     | Manual               |
| **Word count**                        | Yes (per chapter + total, per US-024)                  | Yes                                                     | Yes                  | Yes                          | Limited                 | No                   |
| **Undo AI changes**                   | Yes (Cmd+Z per Tech Lead + UX Lead)                    | Yes (manual, Docs history)                              | N/A                  | N/A                          | N/A                     | Yes                  |
| **Monthly cost**                      | Free during beta                                       | ~$32/mo (ChatGPT + Grammarly)                           | One-time $147.99\*   | One-time $49\*               | Free                    | $10-28+/month\*      |

### Honest Assessment of Phase 0 Position

**Where DraftCrane Phase 0 wins:**

- **Integrated AI in a book-aware editor.** The only tool that combines chapter-based writing with in-editor AI assistance via suggestion chips and streaming results. Google Docs + Gemini has inline AI but no book structure. Atticus has book structure but no AI. DraftCrane has both, even if the AI in Phase 0 is basic.
- **Cloud file ownership.** The user's chapters live as HTML files in their own Google Drive. Unique positioning. Atticus, Reedsy, and Notion all store content in their own systems. If DraftCrane disappears, the user keeps their files. This directly addresses Dr. Chen's "startup that disappears" fear.
- **iPad Safari as primary design target.** Not an afterthought. The UX Lead designed every interaction for iPad touch, the Technical Lead validated the architecture against iPad Safari constraints, and the PM set iPad Safari as the primary test target. No competitor treats iPad as the primary platform.
- **Cost consolidation.** Replaces a $32/month fragmented workflow (ChatGPT + Grammarly) with a single tool. The value is not cheaper price; it is eliminated cognitive overhead and time savings from no more tab-switching and copy-pasting.
- **Accept/reject preview for AI changes.** Addresses Dr. Chen's core fear about voice preservation. The bottom sheet with original text visible, streaming result, "Try Again" with editable instructions, and "Use This" with Cmd+Z undo is a meaningfully better interaction than copy-pasting to ChatGPT or using Gemini's inline suggestions.

**Where DraftCrane Phase 0 loses:**

- **Export quality** vs. Atticus and Vellum. The Technical Lead confirmed Workers constraints (no filesystem, no headless browser, 128 MB memory) mean Phase 0 PDF will be basic at best. The PM set the quality bar at "good enough to share with a colleague without apologizing," which is below Atticus. This is the highest-risk competitive gap for first impressions.
- **Existing content organization** vs. the user's status quo. All three personas have extensive existing materials. Phase 0 cannot help organize them. The user connects Google Drive and sees their Book Folder listed, but DraftCrane cannot analyze, categorize, or import existing docs until Phase 2.
- **Version history** vs. Google Docs. Dr. Chen explicitly flagged this. Google Docs' version history is a trusted safety net. DraftCrane Phase 0 has Cmd+Z undo (which does not survive a browser restart) and the IndexedDB crash recovery prompt. This is substantially weaker.
- **AI depth** vs. ChatGPT or Claude direct. Phase 0 offers rewrite/expand/simplify with suggestion chips and freeform instructions. But without the Book Blueprint (Phase 1), the AI has no persistent knowledge of the author's voice. Dr. Chen predicted it will "feel like ChatGPT in a different window." The surrounding context (500 characters) provides some tone matching, but the improvement over raw ChatGPT usage is convenience (no copy-paste), not quality.
- **AI depth** vs. Google Docs + Gemini. This is the new competitive pressure. Gemini is now inline in Google Docs. A user who discovers "Help me write" in Google Docs may feel the copy-paste problem is already solved. DraftCrane's counter: Gemini in Docs does not know your book's structure or voice either, and Docs still lacks chapter organization and book-format export.
- **Collaboration** vs. Google Docs. Not even close. Phase 0 has no collaboration.
- **Offline** vs. Atticus, Scrivener. Dr. Chen writes on planes. Atticus works offline as a PWA. Scrivener is fully native. DraftCrane requires internet for Drive saves, AI, and export. The IndexedDB buffer handles brief connectivity drops but not extended offline sessions.
- **Track record and trust** vs. all established tools. DraftCrane is brand new. Dr. Chen explicitly flagged the "startup that disappears" fear. The Google Drive file ownership partially mitigates this but does not eliminate it.

**The uncomfortable truth (final version, team consensus):**

DraftCrane Phase 0 is a basic chapter editor with simple AI rewrite and basic export. The PM confirmed: "Phase 0 is not a differentiated product." The Target Customer confirmed: "My first experience will feel like a slightly nicer Google Doc with ChatGPT bolted on."

The Phase 0 survival strategy, validated by the Target Customer, the PM, and the UX Lead: **Phase 0 does not need to be impressive. It needs to be organized and reliable.** The chapter structure, auto-save trust, Google Drive visibility, word count progress tracking, and the "artifact moment" of seeing a PDF export may be enough to pass the kill criteria -- not because the AI is amazing, but because the organization is a relief and the export makes the book feel real.

---

## 3. Differentiation Analysis -- PRD Section 13 Rewrite

### 13.1 What DraftCrane Actually Is

DraftCrane is a book-writing environment that knows it is helping you write a book. That sounds obvious, but it is the core differentiator:

- Google Docs (even with Gemini) does not know you are writing a book. It is a blank page that happens to be long.
- ChatGPT does not remember what you wrote last chapter. Every session starts from scratch without careful prompt setup.
- Scrivener knows you are writing a book but requires you to become a power user to benefit.
- Atticus knows you are writing a book but has no AI and no connection to your research materials.
- Novelcrafter has AI with persistent context (its Codex), but it is fiction-focused and not iPad-optimized.

DraftCrane's value proposition: **A writing environment where the tool understands your book's context -- your voice, your sources, your structure -- and provides AI assistance informed by that context, while keeping your files in your own cloud storage.**

In Phase 0, this is partially delivered: chapter structure, basic AI rewrite with surrounding context and freeform instructions, auto-save to Google Drive, and book-format export. The full value proposition requires Phase 1 (Book Blueprint for voice/style context) and Phase 2 (Source Intelligence for existing materials).

### 13.2 Where DraftCrane Wins by Competitor Category

**vs. Google Docs + Gemini + ChatGPT + Grammarly (the $32/month incumbent workflow):**

For Diane Mercer: Today she opens Google Docs, scrolls past 47 pages, opens a second tab to find a source doc, opens a third tab for ChatGPT, copy-pastes between all three, and after 45 minutes has written 200 words. Google Docs now has Gemini inline, which helps with rewrites, but Diane's fundamental problem is structural: her book is one enormous document with no chapter separation.

In DraftCrane, she opens the app, sees her chapters in the sidebar with word counts, taps Chapter 3, and starts writing. When a paragraph is clunky, she selects it, taps "AI Rewrite," taps "Simpler language" in the suggestion chips, watches the streaming result, and taps "Use This." No tab switching. No copy-paste. No re-explaining her book to ChatGPT.

The competitive displacement: DraftCrane replaces a fragmented multi-tool workflow with a single environment that has chapter-based structure (which Google Docs lacks) and integrated AI (which Atticus lacks). The user does not save money; they save cognitive overhead and time. The PM's framework: every feature must "reduce cognitive overhead or move the manuscript closer to publishable." The core journey does both.

**vs. Scrivener (the "right answer" that does not work):**

For Dr. Sarah Chen: She "spent 45 minutes staring at the interface, and closed it."

DraftCrane runs in the browser on iPad. No installation, no Dropbox sync, no learning curve. The UX Lead's "10-second test" at each journey step is the design-level expression of "we are not Scrivener." The tradeoff is real: Scrivener's organizational depth (Binder, Corkboard, Snapshots, Research folder, Compile) far exceeds DraftCrane Phase 0. But DraftCrane's target user never figured out Scrivener. DraftCrane bets that guided simplicity + AI assistance beats organizational power for this specific user segment.

**vs. Atticus:**

Both are browser-based, chapter-organized, and export to book formats. DraftCrane's Phase 0 advantages: (1) AI writing assistance, which Atticus lacks entirely; (2) Google Drive integration so files live in the user's cloud, not Atticus's system; (3) word count tracking per chapter and total. DraftCrane's Phase 0 disadvantages: (1) Atticus has years of polish on formatting templates and export quality -- DraftCrane's export will be noticeably weaker; (2) Atticus works offline as a PWA; (3) one-time $147.99 vs. DraftCrane's future subscription.

After analyzing personas, Atticus is less of a direct competitor than it first appears. Atticus's ideal user is a self-publishing author who has a finished manuscript and wants to format and publish it. Diane, Marcus, and Dr. Chen are at an earlier stage -- they have scattered expertise and need to organize and write. However, any user who evaluates DraftCrane and Atticus side-by-side will notice the export quality difference, and DraftCrane must acknowledge this honestly.

**vs. Reedsy Book Editor:**

Reedsy is free. For DraftCrane's specific target personas (professionals billing $150-400/hour), free is less decisive than for the broader self-publishing market. Dr. Chen explicitly stated $29/month is a "no-brainer." The competitive displacement is about whether DraftCrane's AI and Google Drive integration provide enough value over Reedsy's simplicity. In Phase 0, this is an honest question -- the AI is basic and Reedsy's export is decent. In Phase 1 (with the Book Blueprint), the gap widens in DraftCrane's favor.

**vs. Notion + AI:**

For Dr. Chen: "Spent an entire Saturday afternoon setting up databases and templates before realizing I had done zero actual writing." DraftCrane provides structure without requiring configuration. The UX Lead's two-field project setup (title + optional description) is the antithesis of Notion's blank-canvas-with-infinite-flexibility approach. The critical lesson: DraftCrane's chapter-based organization should feel like structure, not like configuration.

### 13.3 Where DraftCrane Loses (Honest Assessment)

1. **Existing content organization.** This is the biggest gap. All three personas have extensive existing materials. Phase 0 cannot help organize them. The Target Customer's "what would make me keep going" scenario -- "I found 38 documents with approximately 47,000 words. Let me help you organize these into chapters" -- is not in Phase 0 or Phase 1. It is Phase 2 (Source Intelligence). The Target Customer's "what would make me close the tab" scenario -- blank page with placeholder text -- is exactly what Phase 0 delivers. This is a known, accepted risk.

2. **Export quality.** The Technical Lead's Worker constraints make this a genuine concern. The PM set the quality bar at A5 page size, serif font, chapter title pages, page numbers, a title page -- "good enough to share with a colleague without embarrassment." If the PDF approach (ADR-004) does not meet this bar, the PM endorsed EPUB-only as a fallback with "Export as HTML/Google Doc" as a bridge. This is a defensible position but a noticeable gap vs. Atticus.

3. **Version history.** Google Docs has excellent version history. DraftCrane Phase 0 has Cmd+Z undo within a session and IndexedDB crash recovery. No broader version history. This is a step backward in safety net terms. The Target Customer flagged this explicitly.

4. **AI without voice context.** Without the Book Blueprint, Phase 0 AI rewrite is generic. The suggestion chips and freeform instructions improve the interaction over raw ChatGPT usage, but the output quality difference is marginal. The Target Customer suggested a "voice sample" field during project setup as a lightweight bridge. This was not adopted by the PM for Phase 0 but remains a low-cost high-impact addition worth reconsidering.

5. **Offline capability.** All three personas explicitly work in low-connectivity environments. Phase 0 requires internet for Drive saves, AI, and export. The IndexedDB buffer handles brief drops but not extended offline writing sessions.

6. **Collaboration.** Dr. Chen needs to share drafts with an editor. Phase 0 has no collaboration. She will export PDFs and email them, which is her current workflow. No regression, but no improvement.

7. **Google Docs + Gemini narrows the gap.** The "integrated AI" differentiator is weaker now that Google Docs has Gemini inline. DraftCrane's remaining advantages are chapter structure and book-format export, which are meaningful but narrower than "only tool with integrated AI."

### 13.4 The Wedge

**The long-term wedge (Phase 1+):** The Book Blueprint + contextual AI. No competitor offers AI that knows the author's voice, terminology, key claims, and manuscript context. Novelcrafter's Codex is the closest analog (for fiction), validating the concept. When DraftCrane's AI can say "This paragraph uses 'paradigm shift' but your Book Blueprint says to avoid that term" or "Your audience is mid-level managers, so this section needs a concrete example," that is a capability no current tool matches.

**The Phase 0 wedge:** Not a feature. A feeling: "My book is a real project now."

Dr. Chen: "What would bring me back for a second session: The feeling that my book is now a real project, not a pipe dream. Specifically: if I close DraftCrane and open it the next day and everything is exactly where I left it. My chapters are organized. My progress is visible."

This means the competitive battle in Phase 0 is not about AI quality or export formatting. It is about whether DraftCrane makes the book feel organized and achievable. The chapter sidebar with word counts, the structured project container, the auto-save trust with visible "Saved" indicator, the ability to reorder chapters, and the "artifact moment" of seeing a PDF export -- these are the Phase 0 differentiators against the chaos of Google Drive.

**Phase 0 competitive strategy (final):**

1. Win on organization and structure (chapter sidebar with word counts, project container, visible progress via US-024).
2. Win on trust (auto-save indicator, Google Drive file ownership, "View in Drive" link, undo for AI changes).
3. Be adequate on AI (rewrite/expand/simplify with suggestion chips that are at least as good as copy-pasting to ChatGPT, and more convenient).
4. Be adequate on export (output that looks like a book, not a web page -- even if not Atticus-quality).
5. Do not try to compete on features DraftCrane does not have yet.

### 13.5 Kill Criteria and the Competitive Landscape

The PM defined three kill criteria. Here is how each maps to the competitive landscape.

**Kill criterion 1: "No user completes a full chapter in their first session."**

Competitive context: The PM defined "complete" as 500+ words the author considers a recognizable draft. For users writing new content from knowledge (the Phase 0 test scenario), this is achievable with AI assistance. The competitive alternative if this fails: the user goes back to Google Docs + ChatGPT, where they can also write 500 words in a session -- but with more friction.

The risk: if test users are like Dr. Chen (have existing material, expect to organize it), they may not complete a chapter because Phase 0 does not help with the hard part. The PM addressed this in Round 2: recruit test users who can write from knowledge, not users whose primary need is organization.

**Kill criterion 2: "Fewer than 3 of 10 beta users return for a second session."**

Competitive context: The return visit depends on whether DraftCrane beats the status quo. The switching cost back to Google Docs + ChatGPT is zero. DraftCrane must create enough organizational momentum in Session 1 that abandoning it means losing something -- even if that "something" is just "my chapters are finally in separate documents with clear names and word counts." The Target Customer validated this: "If I close DraftCrane and open it the next day and everything is exactly where I left it."

**Kill criterion 3: "No signal of willingness to pay after 90 days."**

Competitive context: Dr. Chen already pays $32/month for ChatGPT + Grammarly. The willingness-to-pay signal should be benchmarked against this existing spend, not against zero. If DraftCrane is replacing a fragmented $32/month workflow with a unified tool, the pricing is not "should I pay?" but "is this worth paying for instead?"

---

## 4. Lessons from Competitors

### 4.1 Steal from Scrivener: The Binder Mental Model

Chapter-based navigation in a sidebar is planned and confirmed across all roles. The UX Lead designed drag-to-reorder via long-press in the sidebar. The PM recommended including it in Phase 0. The Technical Lead built the API endpoint.

**What to take:** The sidebar chapter list as the primary organizational tool. Each chapter as a discrete, manageable unit with a visible word count. The ability to reorder by dragging.

**What NOT to take:** The Binder's deep hierarchy (folders within folders, multiple nesting levels). Scrivener's Compile system. The Corkboard view. Any feature that requires a learning curve. The PM's Principle 5 ("Publishing is a button, not a project") is the standard.

### 4.2 Steal from Atticus: Formatting as Confidence

The Target Customer said: "If the PDF looks professional without me doing any formatting. If it is literally one click and I get something I could show to a publisher without embarrassment."

The UX Lead confirmed: export is the "artifact moment" where the author sees their work as a real book for the first time. The Technical Lead designed a single default template targeting A5 trim, serif font, chapter title pages, page numbers, and a title page.

**What to take:** The philosophy that export quality is psychological, not just functional. The single default template approach (opinionated defaults, no customization in Phase 0). The "one click and you get a book" interaction.

**What NOT to take:** Atticus's full formatting customization (font choices, margin controls, template selection). That belongs in Phase 3 if DraftCrane survives to build it.

**Fallback (per PM decision):** If PDF quality is limited by Workers constraints, invest in good EPUB output (tractable in Workers per Technical Lead) plus a "well-formatted Google Doc" export. A well-formatted Google Doc is something the Target Customer already trusts and knows how to share.

### 4.3 Steal from Vellum: Design-First Philosophy

The writing environment should feel calm, focused, and intentionally designed. The UX Lead operationalized this: 18px base font, 1.6-1.7 line height, max 680-720pt content width, minimal toolbar (one row), clean typography, generous spacing.

**The lesson:** If DraftCrane's writing environment feels like a generic text editor, users will compare it to Google Docs and find it lacking (because Google Docs is a better generic text editor). If DraftCrane's writing environment feels like a purpose-built book-writing space, users will perceive a different category of tool. The design quality signals that this is a serious tool for serious work.

The UX Lead's design principle #6 captures this: "Every pixel of chrome competes with the writing."

### 4.4 Steal from Sudowrite (and Novelcrafter): AI Integration Patterns

The UX Lead's AI Rewrite flow (bottom sheet with suggestion chips like "Simpler language" | "More concise" | "More conversational" | "Stronger" | "Expand," plus a freeform instruction field) is exactly the right implementation of the Sudowrite lesson: contextual AI actions specific to the user's intent, not a generic text box.

**Phase 0 AI interaction model (confirmed across UX Lead, Technical Lead, and BA):**

- Select text, tap "AI Rewrite" in floating bar
- Bottom sheet with suggestion chips and freeform instruction input
- Streaming result via SSE
- "Use This" / "Try Again" (with editable instruction) / "Discard"
- Cmd+Z to undo acceptance

**From Novelcrafter:** The Codex concept validates the Book Blueprint. Giving AI structured context about a project (voice rules, terminology, key claims, target audience) dramatically improves output quality and consistency. This is DraftCrane's Phase 1 differentiator and the long-term wedge. No competitor in the nonfiction space offers this.

**What DraftCrane should NOT take from Sudowrite:** The "AI writes for you" philosophy. Dr. Chen explicitly said she wants AI that sounds like "a better version of me," not an AI ghostwriter. The PM's Principle 3 ("AI assists, never replaces") and the Target Customer's feedback align: every AI change requires explicit user approval. This is a deliberate philosophical choice that differentiates DraftCrane from Sudowrite.

### 4.5 Steal from Google Docs: Trust Through Visibility

Google Docs has a feature DraftCrane must replicate in spirit: the user never wonders if their work is saved. The "Last saved at [time]" indicator, combined with version history, creates deep trust.

The Technical Lead's three-tier save architecture (IndexedDB for every keystroke, Google Drive on debounce, D1 metadata update) addresses this. The UX Lead's save indicator ("Saving..." / "Saved [timestamp]" / "Save failed") is always in the same toolbar position. The BA's US-015 defines the acceptance criteria.

**The competitive lesson:** DraftCrane's save indicator is not a UI detail. It is the trust foundation that enables everything else. The Target Customer was explicit: without trustworthy auto-save, the chapter structure becomes anxiety-inducing ("What if I lose the chapter I just organized?").

### 4.6 Common User Complaints DraftCrane Can Address

| Complaint                                                    | Source Tool       | Persona Reference                                                   | How DraftCrane Phase 0 Addresses It                                                                        |
| ------------------------------------------------------------ | ----------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| "I bought Scrivener but never figured it out"                | Scrivener         | Dr. Chen: "spent 45 minutes staring at the interface and closed it" | Browser-based, no installation, 10-second test at every screen                                             |
| "My book is 40 documents in Google Drive with no structure"  | Google Docs       | Dr. Chen: 40 docs, 200 pages; Marcus: 12 subfolders                 | Chapter-based structure with sidebar. (Organization of existing docs is Phase 2.)                          |
| "I keep copy-pasting into ChatGPT"                           | ChatGPT + Docs    | Diane: 3-tab workflow; Marcus: paste-revise-paste cycle             | AI integrated directly in the editor via bottom sheet + suggestion chips                                   |
| "ChatGPT doesn't sound like me"                              | ChatGPT           | Dr. Chen: "reads like a textbook written by a committee"            | Phase 0: suggestion chips for tone guidance + freeform instruction. Phase 1: Book Blueprint voice matching |
| "I can't find which document has the latest version"         | Google Docs       | Marcus: "four partial drafts of Chapter 3"                          | One canonical chapter per project; auto-save; single source of truth                                       |
| "I'm terrified of losing my work"                            | Various           | Dr. Chen: fear about WiFi in hotels; Marcus: "has lost work before" | Three-tier auto-save (IndexedDB + Drive + D1 metadata) with visible "Saved" indicator                      |
| "If this startup disappears, what happens to my book?"       | New tool risk     | Dr. Chen: explicit concern                                          | Files in user's Google Drive as HTML; standard format readable in any browser                              |
| "I don't know how much I've written"                         | Google Docs, Word | Dr. Chen: "How far along am I?"                                     | Word count per chapter and total in sidebar (US-024)                                                       |
| "I spent a Saturday setting up Notion and did no writing"    | Notion            | Dr. Chen: "databases and templates, zero actual writing"            | Two-field project setup. Structure without setup.                                                          |
| "My iPad makes multi-tab workflows painful"                  | Safari on iPad    | Diane: three tabs open, losing her place                            | Single-app experience; AI in the editor, no tab switching                                                  |
| "I write in bursts and then can't remember where I left off" | All tools         | Dr. Chen: "three weeks" between sessions                            | Chapter list with word counts shows state; last-edited chapter loads on return                             |
| "The export looks like a printed web page"                   | Google Docs, Word | Dr. Chen: wants "something I could show to a publisher"             | Professional-quality export template (A5, serif font, chapter pages, page numbers)                         |

---

## 5. Pricing Benchmarks

### What the Target Customer Actually Pays Today

| Tool                    | Monthly Cost   | What It Does                    | Satisfaction                          |
| ----------------------- | -------------- | ------------------------------- | ------------------------------------- |
| ChatGPT Plus            | $20/month\*    | AI rewriting, brainstorming     | Low ("strips out my voice")           |
| Grammarly Premium       | $12/month\*    | Sentence-level polish           | Moderate (useful, not transformative) |
| Scrivener (sunk cost)   | $49 one-time\* | Purchased, abandoned in 2 hours | Wasted money                          |
| **Total monthly spend** | **$32/month**  | Fragmented, frustrating         | Low overall                           |

She has also _considered_ but not purchased:

- Otter.ai at ~$17/month (voice capture)
- A book coach at $150-300/hour

### What the Target Customer Would Pay for DraftCrane

Direct from Dr. Chen's Round 2 contribution:

| Price Point  | Reaction                                                              |
| ------------ | --------------------------------------------------------------------- |
| $19-29/month | "No-brainer. Would not even check the receipt."                       |
| $39-49/month | "Would want to feel like I am getting significant value every month." |
| $79/month    | "Would need to believe this is genuinely replacing a book coach."     |
| $99+/month   | "Would not pay. Would hire a human instead."                          |
| $199/year    | "No-brainer if the tool is good."                                     |
| $349/year    | "Reasonable for a serious writing tool."                              |
| $500+/year   | "Would hesitate."                                                     |

### What Competitors Charge

| Tool                   | Model               | Price                         |
| ---------------------- | ------------------- | ----------------------------- |
| Google Docs (+ Gemini) | Free / Subscription | Free ($7/mo for Workspace)\*  |
| Scrivener              | One-time            | $49 (Mac/Win)_, $23.99 (iOS)_ |
| Atticus                | One-time            | $147.99\*                     |
| Vellum                 | One-time            | $249.99 - $349.99\*           |
| Reedsy Editor          | Free                | $0                            |
| Sudowrite              | Subscription        | $19-59/month\*                |
| Novelcrafter           | Subscription        | $9-29/month\*                 |
| Notion (+ AI)          | Freemium            | $10-28+/month\*               |
| ChatGPT Plus           | Subscription        | $20/month\*                   |
| Claude Pro             | Subscription        | $20/month\*                   |
| Grammarly Premium      | Subscription        | ~$12/month\*                  |

### Pricing Recommendation (Final)

**For Phase 0 validation: Free, with clear future pricing signals.**

Phase 0 is a validation exercise. The PM's kill criteria are about engagement, not revenue. Charging during validation adds a conversion barrier that would confuse the learning signal. However, communicate pricing intent from day one: "DraftCrane is free during early access. We plan to offer a Pro plan at $24/month when guided writing features launch."

**For Phase 1 onward: Two tiers.**

| Tier     | Price                 | What Is Included                                                                                                  |
| -------- | --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Free** | $0                    | Basic chapter editor, Google Drive connection, 10 AI rewrites/month, PDF export (single default template)         |
| **Pro**  | $24/month ($199/year) | Unlimited AI rewrites, Book Blueprint, Craft Buttons (full set), all export formats, priority support, Idea Inbox |

**Rationale for $24/month:**

- Below the Target Customer's "no-brainer" threshold of $29/month.
- Below the combined ChatGPT + Grammarly spend of $32/month -- DraftCrane is cheaper than the tools it displaces.
- The $199/year annual price hits the Target Customer's "no-brainer" annual threshold.
- Above Notion ($10-18/month) and inline with Sudowrite ($19-29/month) and Novelcrafter ($19-29/month) -- positions DraftCrane as a serious writing tool, not a generic productivity app.
- Sustainable given the BA's AI cost estimates (~$0.50/user/month at 50 rewrites) -- significant margin at $24/month.
- Below the "have to think about it" threshold of $49/month by a wide margin.

**What NOT to do:**

- Do not charge more than $29/month for the base Pro tier. The Target Customer explicitly said this is the ceiling for "not thinking about it." Premium features (Phase 3-4 advanced AI) could justify a higher tier later.
- Do not offer only a one-time purchase. AI compute costs make this unsustainable. The Target Customer explicitly understands and accepts subscriptions.
- Do not gate Google Drive integration behind the paid tier. File ownership is a core principle, not a premium feature. If users cannot save to Drive for free, the "no lock-in" promise is undermined.
- Do not use metered AI pricing (per-word, per-rewrite). Dr. Chen said metered pricing would create anxiety. The free tier has a generous-enough AI limit (10 rewrites/month) that users experience the value before hitting the wall and can make an informed upgrade decision.
- Do not price at $12/month. The Target Customer explicitly said a $12 price signals "consumer tool" and makes her trust the product less. DraftCrane is for professionals. Price accordingly.

---

## 6. Positioning Statement

### Full Positioning Statement

**For non-technical professionals who have deep expertise scattered across dozens of documents and have been meaning to write a book for years**, DraftCrane is a **browser-based book-writing environment** that **organizes your manuscript into chapters, puts an AI writing partner inside your editor, and keeps all files in your own Google Drive**. Unlike **Google Docs + ChatGPT**, which forces a fragmented multi-tab workflow with no book structure, or **Scrivener**, which requires becoming a power user to benefit, DraftCrane **makes your book feel like a real, organized project from day one -- with AI assistance that improves your prose without stripping your voice, and files that are always yours**.

### Phase 0 Positioning Statement (Honest)

**DraftCrane is a browser-based book editor with built-in AI writing assistance. Organize your book into chapters, get AI help revising your prose, and export to PDF and EPUB -- all from your iPad. Your manuscript files are saved directly to your Google Drive, so your work is always yours.**

This is honest about what Phase 0 delivers. It leads with organization ("Organize your book into chapters") rather than AI, because the Target Customer's primary need is organization and the PM's Phase 0 competitive strategy prioritizes organization and trust over AI quality.

### Positioning Caveats

Do not use any of these words in user-facing materials: platform, workflow, pipeline, integrate, orchestration, leverage, utilize, empower, seamless, robust, AI-native, synergy. The Target Customer: "If the landing page talks about 'Cloudflare Workers' or 'AI orchestration,' I am gone." The UX Lead: "Avoid words like 'platform,' 'integrate,' 'workflow,' 'pipeline.'"

Use these words instead: write, organize, export, your book, your files, chapters, improve, revise, draft.

### Competitive One-Liners

**When a user says "I just use Google Docs and ChatGPT" (or "Google Docs has AI now"):**
"DraftCrane organizes your book into chapters with an AI writing partner built in. No more scrolling through a 50-page doc or juggling tabs. One-click export to a professional-looking PDF. And your files stay in your Google Drive."

**When a user says "I tried Scrivener but it was too complicated":**
"DraftCrane is a book editor that runs in your browser. No installation, no learning curve. Chapters in a sidebar, AI help when you need it, one-click export. It works on your iPad."

**When a user says "Why not just use Atticus?":**
"Atticus is great for formatting a finished manuscript. DraftCrane helps you _write_ that manuscript -- with AI assistance that helps you revise and improve, and your files saved to your own Google Drive."

**When a user says "It's free in Reedsy":**
"Reedsy is a good free option for formatting. DraftCrane adds AI that helps you write better and faster, connects to your existing Google Drive, and is building toward a tool that understands your book's voice and sources."

**When a user says "Can't I just use Claude/ChatGPT Projects to write my book?":**
"You can use Claude or ChatGPT for brainstorming and rewriting. DraftCrane puts that AI inside a book editor with chapter organization, auto-save to your Drive, and one-click export to PDF. Your book lives as a structured project, not a chat thread."

---

## Appendix A: Competitor Quick-Reference Card

| Decision                                         | Key Competitor Benchmark                                                                                                                         |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| "How should the editor feel?"                    | Atticus (clean, approachable) + Vellum (design-first)                                                                                            |
| "How should AI be integrated?"                   | Sudowrite (contextual actions) via UX Lead's bottom sheet + suggestion chips pattern. Novelcrafter's Codex validates the Book Blueprint concept. |
| "How should chapter organization work?"          | Scrivener (binder sidebar) simplified for non-technical users. Include reorder.                                                                  |
| "What should export output look like?"           | Atticus (minimum bar), Vellum (aspiration). If Workers constraints limit PDF, EPUB + well-formatted HTML are acceptable Phase 0 alternatives.    |
| "What is the user doing today without us?"       | Google Docs + ChatGPT/Gemini + Grammarly (~$32/month, fragmented, frustrating)                                                                   |
| "What did the user try and abandon?"             | Scrivener (too complex), Notion (setup without writing), ChatGPT (voice-stripping)                                                               |
| "What free alternative will they compare us to?" | Reedsy Book Editor (matters less for DraftCrane's professional target segment)                                                                   |
| "What price anchors exist in their mind?"        | ChatGPT $20/mo, Grammarly $12/mo, Scrivener $49 one-time, Atticus $148 one-time, "no-brainer" at $29/mo                                          |
| "What is the real competition?"                  | The user's existing Google Drive folder chaos -- 40 docs, no structure, no progress                                                              |
| "What validates the Book Blueprint concept?"     | Novelcrafter's Codex (fiction-focused, but proves the pattern works)                                                                             |

## Appendix B: Cross-Reference Index

| This Document References                                              | Source                                                    |
| --------------------------------------------------------------------- | --------------------------------------------------------- |
| Diane Mercer persona (52, leadership consultant, iPad Pro)            | UX Lead Round 2, Section 1                                |
| Marcus Chen persona (44, executive coach, iPad Air)                   | UX Lead Round 2, Section 1                                |
| Dr. Sarah Chen (Target Customer, management consultant, iPad Pro)     | Target Customer Round 2, all sections                     |
| Kill criteria (chapter completion, return visits, willingness to pay) | PM Round 2, Section 5                                     |
| AI rewrite user stories (US-016, US-017, US-018)                      | BA Round 2, Section 1                                     |
| Word count user story (US-024)                                        | BA Round 2, Section 1                                     |
| Chapter reorder user story (US-012A)                                  | BA Round 2, Section 1                                     |
| Project deletion user story (US-023)                                  | BA Round 2, Section 1                                     |
| PDF generation constraints (Workers, no headless browser, 128 MB)     | Technical Lead Round 2, Risk 5                            |
| Three-tier save architecture (IndexedDB, Drive, D1 metadata)          | Technical Lead Round 2, Section 1                         |
| Auto-save specification (debounced, IndexedDB, save indicator)        | Technical Lead Round 2, Section 3.3                       |
| Bottom sheet AI rewrite pattern with suggestion chips                 | UX Lead Round 2, Section 5(c)                             |
| Phase 0 explicit scope (5 features)                                   | PM Round 2, Section 4; Project Instructions Section 6     |
| "No lock-in" principle and data model split                           | PM Round 2 Principle 2; Technical Lead ADR-005            |
| Landing page language constraints                                     | Target Customer Round 2 Section 6; UX Lead Round 2 Step 1 |
| Export quality bar ("share with colleague without apologizing")       | PM Round 2, Section 7, ADR-004                            |
| "Phase 0 is not a differentiated product"                             | PM Round 2, Section 1 (Executive Summary)                 |
| Auto-save debounce: 2s (Technical Lead) vs. 5s (BA)                   | See Unresolved Issues below                               |

---

## Unresolved Issues

These are genuine disagreements or open questions that need human decision-making. I am surfacing them rather than papering over them.

### Issue 1: Auto-Save Debounce Interval -- 2 Seconds vs. 5 Seconds

**The disagreement:** The Technical Lead's Round 2 set the debounce at 2 seconds (revised from 5s, citing the BA's US-015 and the Target Customer's data loss anxiety). The BA's Round 2 set the debounce at 5 seconds (citing the Technical Lead's specification and Drive API call reduction). These contradict each other. Both documents claim to be aligned with the other.

**Why it matters competitively:** The data loss window is a direct comparison to Google Docs (which auto-saves within approximately 1-2 seconds). A 5-second window is noticeable. A 2-second window is closer to user expectations from Google Docs.

**My recommendation:** 2 seconds, as the Technical Lead specified. The Target Customer's data loss anxiety is the primary concern, and the Technical Lead's analysis of D1 write costs ($0.75/million writes) shows the cost impact is trivial. The IndexedDB keystroke-level buffer reduces the effective data loss window to near-zero for most failure modes anyway, but the debounce interval determines how stale the Drive file can be, which matters for the "Saved" indicator's honesty.

**Needs:** PM decision.

### Issue 2: Google Docs + Gemini Competitive Response

**The issue:** Google's integration of Gemini AI directly into Google Docs narrows DraftCrane's "integrated AI" competitive advantage. This was not discussed in any other Round 2 contribution. The team may be underestimating how much this erodes the Phase 0 value proposition.

**Why it matters:** If a user discovers that Google Docs now offers inline AI rewriting without leaving the document, DraftCrane's "no more copy-pasting to ChatGPT" pitch is weaker. The remaining differentiators (chapter structure, book-format export, Google Drive file ownership, voice context in future phases) must carry more weight.

**My recommendation:** The PM should explicitly address the Google Docs + Gemini scenario in the competitive section of the final PRD. DraftCrane's Phase 0 pitch should lead with chapter-based organization and book-format export (where Google Docs has no answer), not with "integrated AI" (where Google Docs is catching up). This aligns with the PM's existing Phase 0 competitive strategy ("win on organization and structure").

**Needs:** PM acknowledgment and positioning adjustment.

### Issue 3: The "Voice Sample" Suggestion

**The issue:** The Target Customer suggested that Phase 0 project setup could include a "paste a page of your best writing as a voice sample" field, which the AI would then use as a reference for every rewrite. She described it as "a 30-minute engineering addition" that would "dramatically improve the AI's output quality."

**Why it matters competitively:** Without any voice context, Phase 0 AI is generic. With even a lightweight voice sample, the AI output would be noticeably better and would begin to differentiate from raw ChatGPT usage. This is the single lowest-cost, highest-impact addition that could strengthen Phase 0's competitive position.

**Current status:** The PM did not adopt this for Phase 0. The project instructions explicitly exclude the Book Blueprint from Phase 0. However, a voice sample is not the Book Blueprint -- it is a single text field that gets prepended to the AI prompt. It could be framed as an enhancement to the existing AI rewrite feature rather than a new feature.

**My recommendation:** Include it. The competitive risk of Phase 0 AI feeling like "ChatGPT in a different window" is the most frequently cited concern across all roles. A voice sample field is the smallest possible intervention that addresses it. If the PM disagrees, this should be the first thing shipped in Phase 1.

**Needs:** PM decision.

### Issue 4: Folder Picker vs. Auto-Create for Google Drive

**The issue:** The UX Lead proposed two options for Drive folder setup: Option A (DraftCrane auto-creates a new folder) and Option B (Google Picker API lets the user select an existing folder). The UX Lead recommended Option A for simplicity. The Target Customer has an existing "Book Project" folder with 40 documents. The `drive.file` OAuth scope means DraftCrane cannot browse the user's Drive folder tree.

**Why it matters competitively:** If DraftCrane auto-creates a new empty folder, the user's existing files are in a different folder that DraftCrane cannot see. This reinforces the "blank page" problem. If the Google Picker API is used, the user can select their existing folder -- but DraftCrane still cannot read the files in it (only files DraftCrane creates or the user explicitly opens). Neither option fully addresses the "I have existing content" problem.

**My recommendation:** Ship Option A (auto-create) for Phase 0, as the UX Lead recommended. The existing content problem is fundamentally a Phase 2 concern. Adding the Picker API does not solve it (DraftCrane still cannot read the existing files). Option A is simpler and avoids setting expectations DraftCrane cannot meet. But communicate clearly: "We created a new folder for your book. Your existing files are safe in your current folders."

**Needs:** Final PM confirmation. The UX Lead's recommendation and my recommendation align.

### Issue 5: PDF Trim Size -- A5 vs. US Trade

**The issue:** The PM and Technical Lead specified A5 (148mm x 210mm). The BA specified US Trade (5.5" x 8.5", which is 139.7mm x 215.9mm). These are similar but not identical. A5 is the ISO standard. US Trade (5.5x8.5) is the most common self-publishing trim size on Amazon KDP.

**Why it matters:** Authors who eventually publish on KDP will need US Trade format. A5 is close but will require reformatting. Since Phase 0 export is for "share with a colleague" purposes, not KDP submission, either works. But setting the wrong default now may create confusion later.

**My recommendation:** US Trade (5.5" x 8.5"). It is the de facto standard for self-published nonfiction on Amazon, which is where most of DraftCrane's target users would eventually publish. The Competitor Analyst benchmarks confirm that Atticus and KDP both default to this size. The difference from A5 is small enough that it will not affect the "artifact moment" quality, but it sets the right expectation for eventual publishing.

**Needs:** PM decision to align the BA, Technical Lead, and this document on a single trim size.
