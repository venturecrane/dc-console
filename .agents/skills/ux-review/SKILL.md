---
name: ux-review
description: >
  Multi-perspective UI/UX review panel. Spawns three specialist agents
  (UI/UX Designer, Product Manager, User Representative) to critique and
  refine a UI design, navigation system, component layout, or interaction
  pattern. Use when: reviewing a UI proposal or design direction, evaluating
  navigation or information architecture, critiquing wireframes or screen
  designs, refining interaction patterns, or when the user runs /ux-review.
---

# /ux-review - UI/UX Design Review Panel

Spawn three specialist agents to critique a UI/UX proposal, then synthesize and revise. Repeat for the requested number of rounds.

## Arguments

```
/ux-review [rounds]
```

- `rounds` — number of review rounds (default: **1**). Each round runs all 3 agents, synthesizes, and revises.

Parse the argument: if `$ARGUMENTS` is empty or not a number, default to 1.

## The Panel

Three fixed perspectives, always run in parallel:

| Role                    | Focus                                                                                                                                                                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **UI/UX Designer**      | Visual hierarchy, spatial logic, interaction affordances, consistency, gestalt principles, accessibility (WCAG), touch targets, animation/transitions, design system coherence. Thinks in patterns, grids, and visual rhythm.                             |
| **Product Manager**     | User goals, feature priority, discoverability, onboarding friction, scope, whether the UI serves the core job-to-be-done. Asks "does this make the product simpler or more complex?" and "will a new user understand this in 5 seconds?"                  |
| **User Representative** | Real usage patterns, muscle memory, confusion points, first impressions, emotional response, error recovery. Speaks as a real user would — "I keep hitting the wrong button", "I don't understand what this does", "this feels cluttered." Not technical. |

## Execution

### Step 1: Identify the Subject

Scan the conversation for the most recent UI/UX proposal, design, navigation system, or interaction pattern. This could be:

- A navigation redesign proposal
- A component or screen design
- A wireframe or layout description
- Screenshots with discussion
- An information architecture plan

If nothing is identifiable, stop:

> No UI/UX proposal found in the conversation. Describe your design first, then run `/ux-review`.

If found, confirm briefly:

```
Reviewing: {one-line summary}
Round: 1 of {ROUNDS}
Panel: UI/UX Designer · Product Manager · User Representative
```

Proceed immediately — no confirmation pause.

### Step 2: Spawn Review Agents

Launch all 3 agents **in a single message** for true parallel execution.

Each agent receives:

- The full design proposal (`DESIGN_TEXT`)
- Their assigned role and focus
- Product context summary from the conversation
- Any screenshots or visual references described

Agent prompt template:

```
You are a {ROLE} reviewing a UI/UX design proposal. Provide honest, specific feedback from your perspective.

## Design Being Reviewed

{DESIGN_TEXT}

## Product Context

{CONTEXT_SUMMARY}

## Your Role: {ROLE}

{ROLE_DESCRIPTION}

## Instructions

1. Start with `## {ROLE} Review`
2. **What Works** (2-3 bullets): Acknowledge what's good. Be genuine, not perfunctory.
3. **Issues** (numbered list, max 5): Each must include:
   - **The problem**: Be specific — "the Library button is too close to Export" not "navigation is confusing"
   - **Why it matters**: Impact on the user experience
   - **Suggested improvement**: A concrete alternative, not "consider improving this"
4. **Key Recommendation**: Your single most important suggestion if only one thing could change.
5. **Verdict**: "Ship as-is", "Iterate then ship", or "Rethink this"

CONSTRAINTS:
- Be specific and visual. Reference exact elements, positions, and interactions.
- Every issue MUST have a concrete suggested improvement.
- Prioritize ruthlessly. Lead with what matters most.
- The User Representative should write in first person as a real user, not as an analyst.
- Do NOT write files. Return your review as your final response message.
```

Wait for all 3 agents to complete.

### Step 3: Synthesize

Read all three reviews and produce:

```
## Review Synthesis (Round {N} of {ROUNDS})

### Consensus (raised by 2+ reviewers)
- {issue and suggested direction}

### Unique Insights
- {Designer}: {insight}
- {PM}: {insight}
- {User}: {insight}

### Tensions
- {where reviewers disagree and the tradeoff}

### Verdicts
- Designer: {verdict}
- PM: {verdict}
- User: {verdict}
```

### Step 4: Revise

Produce a revised design proposal that incorporates the feedback:

```
## Revised Design (Round {N})

{THE_REVISED_PROPOSAL}

### Changes Made
1. {what changed, which reviewer triggered it}

### Feedback Noted but Not Adopted
1. {what was raised, why it wasn't adopted}
```

### Step 5: Next Round or Done

If `current_round < ROUNDS`:

- Use the revised proposal as input
- Return to Step 2 with `Round {N+1} of {ROUNDS}`
- Fresh agents for each round — they see only the latest revision, not prior rounds

If final round, ask:

**"Review complete. Want to proceed with this design, run another round, or adjust something specific?"**

Do NOT start implementing. Wait for the user.
