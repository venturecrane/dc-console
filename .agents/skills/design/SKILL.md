---
name: design
description: >
  Design-to-code pipeline for UI features. Orchestrates the full process:
  problem definition → /ux-review (3-agent critique) → Stitch screen
  generation → visual review loop → Captain approval → implementation →
  visual QA → /ship. Use when: starting any UI/UX feature work, redesigning
  a component or layout, building a new screen, or when the user runs /design.
  This is the canonical process for all UI work — Stitch designs first,
  approval second, code third.
---

# /design - Design-to-Code Pipeline

The canonical process for UI feature work. Stitch is the designer. The Captain approves. Then code. Deviations from the approved design are bugs.

```
/design [feature description]
```

If no argument is provided, ask: **"What are we designing?"**

## The Pipeline

```
Problem → /ux-review → Stitch Design → Visual Review Loop → Captain Approval → Implement → Visual QA → /ship
```

## Step 1: Problem Definition

Establish the design problem from `$ARGUMENTS` and conversation context. Produce a brief:

```
## Design Brief

**Problem:** {what's broken or missing}
**Who it affects:** {user type and context}
**Current state:** {what exists today, if anything}
**Proposed direction:** {initial thinking, if any}
**Constraints:** {platform, tech, design system, scope}
```

Confirm with the Captain: **"Does this capture the problem? Anything to add before we run the review panel?"**

Wait for confirmation. Do NOT proceed without it.

## Step 2: /ux-review

Run `/ux-review` against the design brief. The 3-agent panel (UI/UX Designer, Product Manager, User Representative) critiques the problem and proposed direction.

The review output becomes the **design input for Stitch** — consensus issues, specific UI recommendations, and the revised proposal all feed into the Stitch prompt.

After the review completes, summarize the key design requirements that will inform the Stitch screens:

```
## Stitch Design Requirements (from /ux-review)

1. {requirement — e.g., "breadcrumb must show book→chapter hierarchy"}
2. {requirement — e.g., "44px touch targets, iPad-first"}
3. {requirement — e.g., "panel toggles should use spatial positioning"}
...
```

Proceed to Stitch immediately — no pause needed. The review has already produced the brief.

## Step 3: Stitch Design

Generate screens in Stitch MCP using the review output as the design brief. Each Stitch prompt must:

- Reference the specific requirements from Step 2
- Include product context (DraftCrane, iPad-first, nonfiction writing app)
- Specify the device type (TABLET for iPad, DESKTOP for landscape)
- Use the DraftCrane design system (project ID `13490927620236337931` or create a new project if the feature warrants it)
- Describe the EXACT elements, positions, colors, and states — not vague descriptions

Generate screens for all key states the feature requires (idle, active, loading, error, empty, etc.). List each generated screen:

```
## Stitch Screens Generated

| # | State | Screen ID | Description |
|---|-------|-----------|-------------|
| 1 | {state} | {id} | {what it shows} |
```

## Step 4: Visual Review Loop

Present the Stitch screens to the Captain:

**"Here are the designs. Review in Stitch and tell me what to change, or approve to proceed to implementation."**

This is an interactive loop:

- Captain says "change X" → edit or regenerate in Stitch → present again
- Captain says "approved" or "build this" → proceed to Step 5
- Captain wants another /ux-review round against the visuals → run it, revise in Stitch

**Do NOT start coding until the Captain explicitly approves.** This is a gate.

## Step 5: Implementation

The approved Stitch screens are now the spec. Implement in code:

- Reference the screen IDs as the source of truth
- Match the Stitch output: layout, spacing, typography, colors, states
- Use existing design tokens (`--dc-color-*`, `--dc-radius-*`, etc.)
- If something in the Stitch design can't be implemented exactly, flag it — don't silently deviate

After implementation, run `npm run verify` to confirm everything passes.

## Step 6: Visual QA

Compare the running product against the approved Stitch screens:

1. Identify discrepancies between implementation and design
2. Fix the CODE to match the DESIGN — not the other way around
3. If a discrepancy is intentional (technical constraint), document why

Present the QA results:

```
## Visual QA

| Element | Stitch Design | Implementation | Status |
|---------|---------------|----------------|--------|
| {element} | {what design shows} | {what code produces} | ✅ Match / ⚠️ Deviation |
```

## Step 7: Ship

Run `/ship` to commit, push, PR, CI, merge.

## Rules

- **Stitch goes first.** No coding UI without an approved Stitch design.
- **The Captain approves.** Step 4 is a hard gate. No implicit approval.
- **Design is the spec.** Implementation deviations are bugs, not "creative differences."
- **Fix code, not design.** During Visual QA, the design wins unless there's a technical impossibility.
- **/ux-review informs Stitch.** The review panel's output is the design brief. Don't skip it.
- **All states matter.** Generate Stitch screens for idle, active, loading, error, empty — not just the happy path.
