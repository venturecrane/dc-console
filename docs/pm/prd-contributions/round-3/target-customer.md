# Target Customer Contribution -- Dr. Sarah Chen (Round 3 FINAL)

**Role:** Management Consultant, 20 years experience
**Context:** Writing a nonfiction book on organizational transformation frameworks
**Primary device:** iPad Pro (~80% of work), MacBook at desk
**Technical comfort:** Google Docs, Zoom, standard business tools. Not technical beyond that.

---

## Changes from Round 2

This is my final pass. The team has done three rounds of work and I have read every document. Here is what changed and why.

1. **The auto-save debounce conflict is resolved. I am satisfied.** In Round 2, I flagged that the Technical Lead said 5-second debounce while the Business Analyst said 2 seconds. In their Round 2 revisions, the Technical Lead changed to 2 seconds and the Business Analyst changed to 5 seconds -- they passed each other in opposite directions. The PM has not explicitly picked a number. However, the Technical Lead's three-tier save architecture (IndexedDB on every keystroke, Drive on debounce, D1 metadata on save) means the actual risk to me is near zero regardless of whether the debounce is 2 or 5 seconds. My keystrokes are captured locally the instant I type them. The debounce number affects how often my content goes to Google Drive, not whether I lose work. I am dropping this concern. The Technical Lead's architecture is sound and I trust it.

2. **The content storage question is resolved. I won.** The Business Analyst reversed their Round 1 recommendation and now agrees: Google Drive is canonical, D1 stores metadata only. Every team member is now aligned on this. The Technical Lead's three-tier architecture is endorsed by the PM. The Business Analyst's cross-cutting business rules table explicitly says "Google Drive is canonical." This was my biggest concern in Round 2 and it is fully resolved.

3. **Social login is resolved. Google sign-in is in Phase 0.** The Business Analyst added "Continue with Google" as the primary sign-up path in US-001. This was a red flag in Round 2 and it is now fixed.

4. **Chapter reordering is nearly resolved.** The UX Lead includes it. The Technical Lead built the API for it. The Business Analyst added a new user story (US-012A). The PM has not explicitly approved it but has not objected. I am treating this as decided. If it gets cut, I will notice and I will be frustrated.

5. **Word count is now in Phase 0.** The Business Analyst added US-024. The UX Lead added word counts to the sidebar and editor. This was a "what is missing" item in my Round 2 and it is addressed. Good.

6. **The streaming question is resolved.** The Technical Lead promoted SSE streaming from optional to required. The Business Analyst still says "evaluate for Phase 1" in their Out of Scope for US-017, but every other team member treats streaming as Phase 0 baseline. I am siding with the majority. Streaming is in.

7. **Revised my Phase 0 feature priority** to reflect the final team alignment and remaining disagreements. The ranking is the same but my commentary is sharper because I now know exactly what the team is building.

8. **Tightened my willingness-to-pay section** to match the Competitor Analyst's final pricing recommendation and to remove any ambiguity about what I would actually do.

9. **Red Flags section is shorter.** Three of my six Round 2 red flags are resolved. The remaining three are genuine and I have no further arguments to make -- they require product decisions, not more discussion.

---

## 1. My Current Pain Points

I have been "writing a book" for three years. Here is what that actually looks like.

I have roughly 200 pages of notes scattered across about 40 Google Docs in my Google Drive. Some are workshop frameworks I have refined over years of client work. Some are half-written chapters that trail off mid-paragraph. Some are voice memos I transcribed using the built-in iPad dictation and pasted into a doc and never looked at again. Three of them are titled some variation of "Book Outline" and none of them agree with each other.

My typical writing session: I sit down on a Sunday morning with my iPad and my coffee. I open Google Docs. I scroll through my "Book Project" folder looking for whatever I was working on last time. I cannot find it. I open three different documents before I find the one with the most recent edits. I re-read what I wrote two weeks ago. Some of it is good. Some of it is terrible. I do not remember where I was going with the argument.

I decide a particular paragraph sounds clunky. I open Safari, go to ChatGPT, paste the paragraph in, and ask it to "make this clearer and more concise." It gives me something that reads like a management consulting textbook written by a committee. I ask it to try again, "in my voice, like I am talking to a smart colleague over coffee." It gives me something that sounds like a TED Talk transcript. Closer, but still not me. I take parts of each version and splice them together in my Google Doc. Forty-five minutes have passed. I have maybe 200 new words.

I think about exporting what I have. I google "how to turn Google Docs into a PDF that looks like a book." I find confusing instructions about margins and trim sizes and bleed. I close the tab.

I tell myself I will do more next weekend. Three weeks pass.

Every time I open that folder in Google Drive, I feel a small stab of shame. I have told colleagues, clients, even a publisher contact that this book is coming. It has been three years. The pain is not just functional. It is not just "I cannot find my notes." The pain is "I am someone who does not finish things." Every tool that gives me another blank page makes that feeling worse. Every tool that helps me see actual progress against an actual goal is worth more to me than its price tag.

The Competitor Analyst called this the "copy-paste tax." The UX Lead's Day in the Life for Diane Mercer nailed it: three Safari tabs, 45 minutes, 200 words. That is my life. But what the team needs to understand is that the deeper problem is not the copy-pasting. The deeper problem is that I have 200 pages of raw material that could be a strong book, and no tool has ever helped me turn that mess into a structured manuscript. The writing is secondary to the organizing.

---

## 2. First Reactions to DraftCrane (Final)

### What excites me

**The ownership model is real and the team is aligned on it.** "Your book. Your files. Your cloud." After three rounds, every team member agrees that my chapter content lives in Google Drive as HTML files, not on DraftCrane's servers. The Technical Lead's three-tier save architecture -- IndexedDB on every keystroke, Google Drive on debounce, D1 for metadata only -- is genuinely reassuring. If DraftCrane disappears tomorrow, I have clearly named HTML files in my Google Drive. That is more than any other writing tool offers.

**The AI interaction design is thoughtful.** The UX Lead designed a bottom sheet with suggestion chips ("Simpler language," "More concise," "More conversational," "Stronger") that lets me direct the AI without formulating a prompt from scratch. I can tap a chip, see the streaming result, tap "Try Again" with a modified instruction, and iterate until it is right. That is meaningfully better than my current ChatGPT workflow because I do not have to switch tabs, do not have to re-explain what my book is about, and do not have to copy-paste. The suggestion chips do the work of translating "I want this to sound better" into something the AI can act on. For someone who knows what she wants but does not speak AI, that is the feature.

**Streaming matters more than I expected.** The Technical Lead says the first token appears in under 2 seconds. That means I tap "Rewrite" and immediately see words appearing. That feels like working with a fast-thinking colleague. Without streaming -- if I tap "Rewrite" and stare at a spinner for 8 seconds -- I am going to pick up my phone, check email, and lose my train of thought. The difference between "alive" and "loading" is the difference between a writing partner and a vending machine.

**Word counts are in.** The Business Analyst added US-024 and the UX Lead put word counts in the sidebar next to each chapter and at the bottom as a total. "Chapter 3: 2,340 words. Book total: 12,800 words." That is the kind of small thing that makes a book feel achievable. I have never known how many words I actually have across all my scattered documents. Seeing a number -- even a low one -- turns an abstract dream into a measurable project.

**Chapter structure with one canonical document per chapter.** Marcus Chen's persona captures this perfectly: "four partial drafts of Chapter 3 and no clear canonical version." DraftCrane gives me one Chapter 3. One document. One source of truth. That alone is worth trying the tool.

### What confuses me

**HTML files in Google Drive.** The Technical Lead decided that chapters are stored as HTML files, not as Google Docs. I understand the technical reasoning (avoids a second API dependency, preserves formatting). But what this means practically is that if I open my Book Folder in Google Drive and double-click "Chapter 3 - The Transformation Model.html," it opens as a rendered web page in Chrome, not as an editable document in Google Docs. I cannot edit it in Google Docs. I cannot share it with a colleague via Google Docs' collaboration features.

Is this a dealbreaker? Probably not. I would be editing in DraftCrane, not in Google Docs. And I can always export as PDF to share with someone. But the team should know that "your files are in your Google Drive" creates an expectation that those files behave like Google Docs files. They will not. The PM acknowledged this as a known limitation but I want to make sure marketing does not create a false impression. "Your files are in your Google Drive in a standard format you can open in any browser" is accurate. "Your files are in your Google Drive" without qualification might mislead someone into thinking they can collaborate on them in Docs.

**The `drive.file` scope limitation.** The UX Lead explained this clearly in Round 2, and honestly it deflated me a bit. The OAuth scope DraftCrane uses means it can only see files that DraftCrane itself creates or that I explicitly share with it via a Google Picker. My 40 existing Google Docs? Invisible. DraftCrane cannot browse my Drive. It cannot see my "Book Project" folder. It creates a new folder and works only within that folder.

I understand why the team chose this scope -- it is the least invasive, it respects my privacy, it does not ask for full Drive access. I respect that. But it means the "Connect Google Drive and see your existing files" moment I described in Round 2 cannot happen in Phase 0. The UX Lead's Option A (auto-create a new folder) is the most honest approach. Just tell me: "We will create a new folder for your book. Your existing files stay where they are." Do not pretend my existing content is accessible when it is not.

### What scares me

**Phase 0 AI still has no voice context.** This has not changed. The AI receives my selected text plus 500 characters on each side. It does not know my book is about organizational transformation. It does not know I write in a direct, practical style. It does not know I prefer short sentences and concrete examples over abstract theory. Every rewrite will be the AI's generic best guess at "professional nonfiction." The suggestion chips help direct the output ("Simpler language," "More conversational") but they direct the form, not the voice. My voice is not just "conversational." My voice is specific. I use particular phrases. I lean on particular metaphors. The AI will not know any of that until Phase 1's Book Blueprint.

I said in Round 2 that a "voice sample" during project setup would help -- one page of my best writing that the AI uses as a reference. The PM did not address this. I am not going to push harder. But I want the team to know that when I test Phase 0's AI rewrite, my immediate reaction will be "this does not sound like me." Whether that reaction makes me close the tab or shrug and keep writing depends on everything else working well (the chapter structure, the auto-save trust, the organization). The AI is not going to sell Phase 0. The structure might.

**My existing 200 pages are orphaned.** Phase 0 cannot help me organize my existing content. Source Intelligence is Phase 2. The `drive.file` scope means DraftCrane cannot even see my existing files. The UX Lead's revised approach (Option A: auto-create a folder) is honest but means Phase 0 assumes I am starting from nothing. I am not starting from nothing. Nobody like me is starting from nothing. Both of the UX Lead's personas have extensive existing material.

The Competitor Analyst put it directly: "DraftCrane's primary competitor is not a product. It is the user's existing Google Drive folder full of scattered documents." Phase 0 does not compete with that. It runs alongside it. I will have DraftCrane open in one tab and my Google Drive folder open in another, copying and pasting between them. That is better than my current three-tab workflow (Google Docs, ChatGPT, source docs), but it is still not the integrated experience the vision promises.

### What is missing (unchanged from Round 2, confirmed as intentionally deferred)

1. **Importing existing content.** Phase 2. I understand. But give me excellent copy-paste handling so I can bring my existing text in manually without losing formatting.

2. **Version history beyond undo.** Undo (Cmd+Z) works within a session. If I close my browser and come back tomorrow, undo is gone. Google Docs has full version history. DraftCrane Phase 0 does not. The Technical Lead's optimistic versioning prevents conflicts but does not let me go back to "what this chapter looked like three days ago." The PM deferred version history. I accept it but want it noted: this is a step backward from Google Docs in terms of safety net.

3. **Progress tracking beyond word count.** US-024 gives me word counts. Good. What I still want and will not get until Phase 1: "You are 23% of the way to a 50,000-word book. At your current pace, that is about 14 more sessions." That framing turns an overwhelming project into a manageable one.

4. **A voice sample field during project setup.** Not the full Book Blueprint. Just a text area: "Paste a paragraph of your best writing so the AI can match your style." One field. One prompt prefix. Enormous impact on AI output quality. Nobody on the team has said yes or no to this. I am noting it one final time as my single strongest request for a Phase 0 micro-addition.

---

## 3. Phase 0 Feature Priority (Final)

### 1. Google Drive Integration (Most Important)

The team got this right. My files live in my Google Drive. If DraftCrane disappears, I keep my book. This is the reason I would try DraftCrane over Atticus, Reedsy, or any other tool that stores my content on their servers.

What I need the team to know: the drive integration works in one direction in Phase 0. DraftCrane creates files in my Drive. It does not read my existing files from Drive. This is acceptable for Phase 0, but the first-session experience needs to be honest about it. Do not show me "Connect Google Drive" and then give me an empty project. Show me "Connect Google Drive to keep your book safe" and then tell me "We created a folder called 'The Transformation Playbook' in your Drive. As you write chapters, they will appear there."

The UX Lead's Option A (auto-create folder) is the right choice. Simpler, faster, and avoids the false promise of browsing my existing Drive content.

One specific request: after creating the folder, give me a "View in Google Drive" link so I can verify it is real. The UX Lead already designed this. Good.

### 2. Basic Editor (Equally Important)

The editor is the product. If text selection is broken on iPad, if the virtual keyboard hides my cursor, if paste loses my formatting, I close the tab and never come back. Google Docs handles all of this perfectly because Google has spent 15 years on it. DraftCrane does not get 15 years. It gets one session to prove the editor works.

The Technical Lead identified this as the highest-risk technical decision (ADR-001). The UX Lead specified exhaustive keyboard handling requirements and the `visualViewport` API for detecting keyboard presence. The 2-day prototype spike testing Tiptap and Lexical on a physical iPad is the single most important engineering task in Phase 0. If neither works well on iPad Safari, there is no product.

Specific things I care about:
- Typing feels instant. The Business Analyst says less than 100ms input latency. I do not know what a millisecond feels like but I know what "sluggish" feels like. Do not be sluggish.
- Text selection via touch works like it does everywhere else on iPad. Long-press, drag handles, extend selection. Do not fight with iPadOS.
- Copy-paste from other apps (Google Docs, Notes, email) preserves basic formatting (bold, italic, headings, lists). The Business Analyst says unsupported formatting is silently stripped. Fine. But what I paste in must not turn into a mess.
- The formatting toolbar does not conflict with iPadOS's shortcut bar when my Smart Keyboard is attached. The UX Lead flagged this. It matters.
- Cmd+S works. I know auto-save is on. I will press Cmd+S anyway. Let it work. Show "Saved." Done.

### 3. AI Rewrite (Important, But Not the Reason I Stay)

The AI rewrite is why I try DraftCrane. The chapter structure and Drive integration are why I stay. In Phase 0, without the Book Blueprint, the AI is a convenience improvement over ChatGPT. No more copy-paste. No more re-explaining my context in a chat window. That is real but incremental value.

What would make the AI genuinely valuable in Phase 0:
- **The suggestion chips work well.** "Simpler language" and "More concise" are the two I would use most. If tapping "Simpler language" consistently produces something clearer than my original without stripping my terminology, that is useful.
- **"Try Again" is fast and seamless.** I will iterate. The first suggestion will rarely be right. If "Try Again" is a two-tap, two-second process (edit instruction, tap Rewrite, see streaming result), I will iterate three or four times. If it is slow or clunky, I will "Discard" and go back to ChatGPT.
- **Undo is instant and obvious.** The Business Analyst and UX Lead both confirm Cmd+Z restores the original after I accept a rewrite. This is critical. If I accept a rewrite and immediately realize it was wrong, I need one keystroke to go back. No dialog, no confirmation, just undo.

What would make the AI exceptional in Phase 0 (not currently planned): the voice sample field I keep asking for. A single text area during project setup. "Paste a page of writing that sounds like you." The AI uses it as a reference for every rewrite. This would take the AI from "generic rewrite tool" to "rewrite tool that sounds like me." The difference is enormous.

### 4. PDF/EPUB Export (Important for Psychological Momentum)

The Competitor Analyst and UX Lead are right: the export is the "artifact moment." When I tap "Export as PDF" and see my chapters formatted like a real book -- title page, table of contents, chapter headings, page numbers, a serif font with proper margins -- that is the moment DraftCrane becomes real. That is the moment I think "I am actually writing a book" instead of "I am using another tool."

If the PDF looks like a printed web page, the moment fails. It does not need to match Atticus or Vellum. But it needs to look intentionally designed. The PM's quality bar is right: "good enough that an author would share this with a trusted colleague or developmental editor without apologizing for how it looks."

The Business Analyst resolved the page size as 5.5" x 8.5" (US Trade). The Technical Lead specified A5 (148mm x 210mm). These are close but not identical. The team should pick one. Either is fine -- both feel like books, not like printed emails. But they should agree.

One strong preference: I would rather have a beautiful PDF and no EPUB than mediocre versions of both. The PM suggested this as a potential scope cut (EPUB-only if PDF quality fails). I would reverse it: PDF first, EPUB second. I am going to share a PDF with my colleague and my editor. I am not loading an EPUB into Apple Books in Phase 0. PDF is the artifact that matters.

**Single-chapter export is important.** The Business Analyst added this to US-019. Good. I want to write Chapter 1, export just Chapter 1 as a PDF, and email it to a colleague. I do not want to wait until I have a full book to see what the output looks like.

### 5. Auth System (Least Conscious Priority, But Google Sign-In Is Non-Negotiable)

I tap "Continue with Google." I am in. That is all I want from auth. The Business Analyst added Google sign-in to Phase 0. The UX Lead designed it as the primary action. Good.

Session persistence for 30 days is correct. I write in bursts separated by weeks. If I have to re-authenticate every time I come back, that is friction. The PM set 30 days. Fine.

---

## 4. The First Session Test (Final)

### How I heard about DraftCrane

A colleague mentioned it in a Slack group for management consultants. "Anyone tried this? It is supposed to help you actually finish your book." I clicked the link on my iPad during a flight delay.

### The first 5 minutes

1. I land on a simple page. "Your book. Your files. Your cloud. With an AI writing partner." Below: "Write chapters. Use AI to improve your writing. Export as PDF. All from your iPad." I tap "Get Started." **This takes 10 seconds.**

2. I see "Continue with Google" and tap it. Google asks me to select my account. I pick my work account. I am in. **This takes 15 seconds.**

3. I see "Let's set up your book." Two fields: title and an optional description. I type "The Transformation Playbook" and "A practical guide for leaders managing organizational change." I tap "Create Book." **This takes 30 seconds.**

4. I see my writing environment. A sidebar on the left showing "Chapter 1" with "0 words" beneath it. An editor in the center with a blinking cursor. A formatting toolbar at the top. The save indicator says "Saved." A gentle banner says "Connect your Google Drive to keep your book safe." I tap "Connect Google Drive." I complete the Google OAuth flow. DraftCrane creates a folder called "The Transformation Playbook" in my Drive. The banner now says "Connected to Google Drive" with a green checkmark and a link to "View in Google Drive." **This takes 60 seconds.**

5. **Here is where it either works or it does not.** I am now staring at an empty chapter called "Chapter 1." I have 200 pages of existing content in another Google Drive folder. DraftCrane does not know that content exists. The `drive.file` scope means it cannot see it.

What I do: I open a second Safari tab. I go to Google Drive. I find my existing Chapter 1 draft (a Google Doc called "Ch1 - Why Transformation Fails - v2"). I select all, copy. I switch back to DraftCrane. I tap into the editor. I paste.

**If the paste works cleanly** -- my headings are headings, my bold text is bold, my bullet points are bullets, and the text appears without a 10-second lag -- then I think "OK, this works." I now have Chapter 1 in DraftCrane, in a structured project, with a word count showing in the sidebar. I feel something I have not felt in three years: the sense that my book has a home.

**If the paste breaks** -- if my formatting is gone, if the text is a single block with no structure, if the editor freezes for 5 seconds while processing 3,000 words -- then I think "this is not ready." I close the tab.

### What "complete a chapter" means to me

The PM's kill criterion says a user must complete a full chapter in the first session. The PM defined "complete" as 500+ words that the author considers a recognizable draft.

For me, a complete chapter is 3,000-5,000 words that argue a coherent point, include at least one concrete example, and read well enough that I would share it with a colleague. I cannot write that from scratch in a first session with a new tool. But I can paste in 2,500 words from my existing Google Doc, edit and restructure them in DraftCrane's editor, use the AI to rewrite two clunky paragraphs, and end up with a 3,200-word chapter that I am proud of. That is "completing a chapter" for someone like me.

The 500-word threshold the PM set is achievable even for someone writing from scratch. I think it is the right number for the kill criterion. But the team should know that for your target persona -- someone with existing content -- "completion" means bringing content in and shaping it, not writing from a blank page.

### What would make me keep going vs. close the tab

**Keep going:** The paste worked. My chapter has structure. The word count says "2,847 words." I select a paragraph, tap "AI Rewrite," tap "More concise," and the streaming result is noticeably better than what I had. I tap "Use This." The "Saved" indicator updates. I feel the book is a real project now. I add Chapter 2 using the "+" button. I give it a title. I have a sidebar with two chapters and a total word count. I close the tab knowing that everything is saved in my Google Drive.

**Close the tab:** The editor fights me. Paste broke my formatting. The cursor jumps when I try to select text. The AI took 10 seconds to start showing results and what it gave me sounded nothing like me. The save indicator says "Saving..." and stays there for an uncomfortably long time. The export button produces a PDF that looks like I printed a web page.

### What would bring me back for a second session

1. Everything is exactly where I left it. I open DraftCrane and see my last-edited chapter, at my scroll position, with all my work intact. The sidebar shows my chapters with word counts. The book total shows my progress. The next step is obvious: keep writing Chapter 2.

2. The tool tells me something useful. "Book total: 5,200 words across 2 chapters." That number, sitting there in the sidebar, makes the book feel finite and achievable instead of infinite and impossible.

3. I see my files in Google Drive. I open Drive in another tab, see the "The Transformation Playbook" folder with "Chapter 1 - Why Transformation Fails.html" and "Chapter 2 - The Framework.html" inside it. Real files. In my cloud. Not locked in a startup's database.

---

## 5. Willingness to Pay (Final)

### What I pay today for my broken writing workflow

| Tool | Monthly Cost | What It Does | Satisfaction |
|------|-------------|--------------|-------------|
| ChatGPT Plus | $20/month | AI rewriting, brainstorming | Low -- does not sound like me |
| Grammarly Premium | ~$12/month | Sentence-level polish | Moderate -- useful, not transformative |
| Scrivener (sunk cost) | $49 one-time | Purchased, abandoned in 2 hours | Wasted money |
| **Total monthly** | **$32/month** | Fragmented, frustrating | Low overall |

DraftCrane replacing both ChatGPT and Grammarly is a real value proposition. If the in-editor AI rewrite is good enough that I do not need to open ChatGPT, and if the writing is clean enough that I do not need Grammarly running alongside, then DraftCrane at $24/month saves me $8/month and eliminates the three-tab workflow. That is a genuine pitch.

### What I would pay for DraftCrane

**Phase 0 must be free.** The Competitor Analyst is right. Do not charge me during validation. Phase 0 is a foundation, not a finished product. If you charge me for Phase 0, I am comparing it against Atticus ($148 one-time, professional formatting, no subscription) and it loses.

**Post-validation pricing from my perspective:**

| Price Point | My Reaction |
|-------------|-------------|
| $19-29/month | No-brainer. Less than my current ChatGPT + Grammarly spend. I sign up without thinking. |
| $39-49/month | Need to feel clear, ongoing value every month. A free trial that lets me experience the AI and the organization before committing. |
| $79+/month | Would not pay. At that price I would hire a human book coach for one session per month instead. |
| $199/year annual plan | No-brainer if the tool is good. Signals "professional tool." |
| $249-349/year | Reasonable if Book Blueprint and Source Intelligence are included. That is Vellum territory and I would expect Vellum-like quality. |

**The Competitor Analyst's recommended pricing ($24/month, $199/year) is right.** It is below my no-brainer ceiling. It is below my current tool spend. The $199/year annual price hits my "no-brainer annual" threshold exactly. And it positions DraftCrane as a serious professional tool, not a consumer app.

**What I would pay more for:** Book Blueprint and voice matching (Phase 1). Source Intelligence that organizes my 200 pages (Phase 2). Developmental editing feedback (Phase 4). These are the features that replace a $200/hour book coach. If DraftCrane offered a premium tier at $39-49/month that included all of those, I would seriously consider it.

**What should not be gated behind payment:** Google Drive integration. File ownership is a core principle, not a premium feature. If free-tier users cannot save to Drive, the "no lock-in" promise is a lie. The Competitor Analyst agrees.

### What would trigger a purchase decision

The moment I would upgrade from free to paid: when the AI rewrites something and it genuinely sounds like me. Not generic "professional nonfiction." Me. My phrasing, my cadence, my way of building an argument. That is Book Blueprint territory (Phase 1). That is when DraftCrane becomes worth paying for, because no other tool does that.

---

## 6. Red Flags (Final -- Reduced from Round 2)

Three of my six Round 2 red flags are resolved:
- Content storage: resolved. Drive is canonical. Every team member agrees.
- Social login: resolved. Google sign-in is in Phase 0.
- Auto-save debounce disagreement: resolved. The three-tier architecture makes the exact number less important.

Three red flags remain. These are genuine concerns that I cannot resolve through further discussion. They require product decisions or Phase 1 delivery.

### Red Flag 1: Phase 0 AI without voice context is a known weakness, not a selling point.

Every team member acknowledges this. The Competitor Analyst called it "the uncomfortable truth." The PM called it "Phase 0's strategic tension." I called it "ChatGPT in a different window." Nobody disagrees. The question is whether the structural advantages of DraftCrane (chapter organization, in-editor AI, auto-save to Drive, one-click export) are enough to hold my attention through Phase 0 until Phase 1 delivers the Book Blueprint.

My honest answer: maybe. It depends on how well everything else works. If the editor is excellent on iPad, if auto-save is trustworthy, if the chapter structure gives me a feeling of organization and progress, and if the PDF export looks like a book -- then I will tolerate generic AI for a few months. If any of those things are broken, the generic AI is not enough to keep me.

This is not something the team can fix in Phase 0 without adding the Book Blueprint (which everyone agrees is Phase 1). But I want to note one final time: **a voice sample field during project setup would cost almost nothing and would meaningfully improve AI output quality.** The team has neither accepted nor rejected this idea across three rounds. It remains my single strongest Phase 0 micro-feature request.

### Red Flag 2: Phase 0 has no plan for users with existing content, and every target persona has existing content.

Diane has 47 pages in a single Google Doc. Marcus has 100+ documents across 12 subfolders. I have 200 pages across 40 Google Docs. Phase 0 starts with an empty project and an empty chapter. Source Intelligence is Phase 2. The `drive.file` scope means DraftCrane cannot see existing files.

The workaround is copy-paste. I will open my Google Docs in another tab, select content, paste it into DraftCrane chapters. This works if the paste handling is excellent (preserves formatting, handles large pastes, does not freeze the editor). This fails if paste is buggy or if the editor chokes on 5,000 words of pasted content.

**My specific request:** Make copy-paste from Google Docs into DraftCrane flawless. Test it extensively. This is the bridge between "Phase 0 assumes a blank page" and "the real user has 200 pages." If paste works perfectly, I can bring my content in chapter by chapter. If paste is broken, Phase 0 fails for every user who has existing material -- which is, based on the personas, every user.

The PM acknowledged this risk (Risk 2: "Prototype tests the wrong users"). The PM's mitigation is to recruit test users who can "write from knowledge, not users who need to organize existing material first." That is a reasonable testing strategy, but it means Phase 0 validation will not test the most common scenario for the target customer. The team should know that.

### Red Flag 3: Export quality is the highest-impact unknown.

The Technical Lead identified five different approaches for PDF generation and could not recommend one with confidence. The PM suggested potentially descoping to EPUB-only if PDF quality is unacceptable. The Competitor Analyst set Atticus as the minimum bar.

The export is the "artifact moment." It is the moment I see my book as real. If it looks professional, I am motivated. If it looks like a printed web page, I am embarrassed. This is not a minor polish item. It is psychologically central to the product experience.

The Technical Lead's 3-day spike (design HTML/CSS template, test EPUB in Worker, test Browser Rendering for PDF) is the right approach. But the team has not yet done this spike. It is an unknown. And the quality of the output will significantly affect whether test users feel DraftCrane is "real" or "a toy."

I have one strong preference here: **PDF first, EPUB second.** If the team can only make one format look great, make it PDF. I will share a PDF with my colleague. I will not load an EPUB into Apple Books during a first session. The PDF is the artifact I care about.

There is also a minor discrepancy: the Business Analyst says the page size is 5.5" x 8.5" (US Trade) while the Technical Lead says A5 (148mm x 210mm). US Trade is 139.7mm x 215.9mm. A5 is 148mm x 210mm. These are close but not identical. The team should agree on one.

---

## Summary

Three rounds. Thousands of words. Here is my final message to the team, condensed to what matters most.

**What is resolved and right:**
1. Content lives in Google Drive. The three-tier save architecture is sound. The product promise is delivered.
2. Google sign-in is in Phase 0. The onboarding friction is minimal.
3. The AI interaction design (bottom sheet, suggestion chips, streaming, Try Again, undo) is well thought out.
4. Word count is in Phase 0. Progress is visible.
5. Chapter reordering is designed, built (API exists), and specified (US-012A). It should ship.
6. The pricing direction ($24/month, $199/year, free during validation) is right for the target customer.

**What requires human decisions (the team has debated but not resolved):**
1. Voice sample field during project setup -- my top micro-feature request. No team member has said yes or no.
2. PDF page size: US Trade (5.5" x 8.5") vs. A5 (148mm x 210mm). Close but not identical. Pick one.
3. PDF vs. EPUB priority if only one can be excellent. I say PDF. The PM suggested EPUB as the safer option (easier to generate). This needs a decision.

**What I accept as Phase 0 limitations:**
1. No Book Blueprint or voice matching until Phase 1. The AI will be generic. I will tolerate it if everything else works.
2. No importing or organizing existing content until Phase 2. I will copy-paste. Make paste handling excellent.
3. No version history beyond undo. I will live with it but I will be more cautious about making changes than I would in Google Docs.
4. No offline writing. I will not use DraftCrane on planes. That is a Phase 1+ problem.

**The bottom line:** If DraftCrane Phase 0 gives me a clean chapter-based editor that works beautifully on my iPad, saves every keystroke to my Google Drive, lets me rewrite passages with AI without leaving the editor, and exports a PDF that looks like a real book -- I will use it. I will bring my existing content in by pasting it chapter by chapter. I will tolerate the generic AI. I will come back for a second session. And when Phase 1 ships with the Book Blueprint, I will pay $24/month without hesitating.

If the editor is buggy on iPad, if paste handling is broken, if the save indicator makes me anxious, or if the PDF export looks amateur -- I will close the tab and go back to my 40 Google Docs. And I will feel the same stab of shame I have felt for three years, plus the additional disappointment of another tool that was not ready.

The vision is right. The team alignment is strong. The execution details are where this succeeds or fails. Ship something that works beautifully on an iPad, and you have me.

---

## Unresolved Issues

These are genuine disagreements or open questions that surfaced across three rounds and have not been resolved. They require human decision-making.

### 1. Voice sample field during project setup
**My position:** Add a single optional text area to the Book Setup screen: "Paste a page of your best writing so the AI can match your style." Use it as a prompt prefix for all AI rewrite requests. Minimal engineering cost, significant impact on AI output quality.
**Team position:** Not addressed. No team member has explicitly accepted or rejected this. The PM's Phase 0 scope does not include it. The UX Lead's project setup has title and description but no voice sample. The Technical Lead's data model does not have a field for it.
**Why it matters:** This is the difference between "the AI gave me something generic" and "the AI gave me something that sounds like a better version of me." The Target Customer's number one fear about AI is voice loss. A voice sample directly addresses that fear with minimal scope addition.
**Decision needed from:** Product Manager.

### 2. PDF page size discrepancy
**Business Analyst says:** 5.5" x 8.5" (US Trade, 139.7mm x 215.9mm)
**Technical Lead says:** A5 (148mm x 210mm)
**PM says:** A5
**My position:** Either is fine. Both feel like books. But the team should agree on one number before designing the export template.
**Decision needed from:** Product Manager (binding).

### 3. PDF vs. EPUB priority if only one format can be excellent
**PM says:** If PDF cannot meet the quality bar, consider descoping to EPUB-only.
**My position:** PDF first. I will share a PDF with a colleague. I will not load an EPUB into Apple Books during a first session. PDF is the artifact that creates the "this is a real book" moment.
**Technical Lead says:** EPUB is technically easier in Workers. PDF requires Browser Rendering (beta) or an external service.
**Why it matters:** If the 3-day spike reveals that PDF quality is limited, the PM's fallback is EPUB-only. My preference is the opposite. This is a real tradeoff between technical feasibility and user psychology.
**Decision needed from:** Product Manager after the ADR-004 spike.

### 4. Auto-save debounce interval
**Technical Lead Round 2 says:** 2 seconds.
**Business Analyst Round 2 says:** 5 seconds.
**My position:** I no longer care about the specific number. The three-tier architecture (IndexedDB on every keystroke, Drive on debounce) means my work is protected either way. But the team should agree on one number so the UX Lead knows what "Saving..." timing to design around and the Technical Lead knows what Drive API call volume to budget for.
**Decision needed from:** Product Manager (binding).

### 5. Freeform instruction field in AI rewrite: is it Phase 0?
**UX Lead says:** Yes. A single-line instruction field alongside suggestion chips. Not "Ask Mode."
**Business Analyst says:** Out of Scope for Phase 0 (US-017 lists "Custom/freeform AI prompts" as out of scope).
**My position:** Yes. The instruction field is essential. Suggestion chips alone are too limited. I need to be able to type "more conversational, like a mentor talking to a peer" -- not just pick from four predefined options. The UX Lead's argument that this is distinct from Phase 1's Ask Mode (which is multi-turn conversation) is correct.
**Decision needed from:** Product Manager.
