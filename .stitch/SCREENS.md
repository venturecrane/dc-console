# Stitch Screen Registry

Stitch Project: **DraftCrane — Full Product Design** (`6819167765706387197`)

## How This File Works

Every Stitch screen gets an entry here. This is the single source of truth for what each screen is, whether it's aspirational or production-ready, and which version is current.

**Statuses:**

- `exploration` — Directional/aspirational. Useful for mood and vision, not meant to be coded pixel-for-pixel.
- `draft` — Work-in-progress toward production fidelity. Needs iteration.
- `review` — High-fidelity candidate ready for Captain review.
- `approved` — Captain-approved. Code from this screen.
- `shipped` — Coded and deployed. Keep as reference.
- `retired` — Superseded or no longer relevant. May delete later.

**Naming convention for new screens:** `{Page} - {Variant} ({Viewport})`
Examples: `Setup - New Book (Tablet)`, `Dashboard - Empty State (Mobile)`, `Editor - AI Panel Open (Tablet)`

---

## Screen Index

### Dashboard

| Screen ID                          | Title                                   | Viewport | Status      | Notes                                                                                                                       |
| ---------------------------------- | --------------------------------------- | -------- | ----------- | --------------------------------------------------------------------------------------------------------------------------- |
| `4fb43593955e4ad388282e04abb3530b` | DraftCrane Dashboard (Empty State)      | Mobile   | exploration | Empty state with hero, feature cards, bottom tabs. Aspirational — includes social proof and tab bar that won't ship as-is.  |
| `e4b30f2a9fdc4866b51561e6561bae73` | DraftCrane Dashboard (Tablet)           | Desktop  | retired     | Original populated dashboard. Superseded by warm literary version.                                                          |
| `49f6f747de8e40449d032fc42425f684` | DraftCrane Populated Dashboard (Tablet) | Desktop  | retired     | V1 warm literary dashboard — had extra nav tabs and icons. Superseded by cleaned-up version.                                |
| `4329b26f1ba94c84850d44be6548466f` | DraftCrane Product Dashboard            | Desktop  | approved    | **CURRENT** — Cleaned-up populated dashboard. Minimal header, Newsreader titles, warm cards with subtle borders, no extras. |

### Setup / New Book

| Screen ID                          | Title                               | Viewport | Status      | Notes                                                                                                            |
| ---------------------------------- | ----------------------------------- | -------- | ----------- | ---------------------------------------------------------------------------------------------------------------- |
| `97cb2c7ab4754e669884d367f5eedaa8` | New Book Setup                      | Tablet   | exploration | Original setup screen. Has dark banner and decorative elements that won't ship.                                  |
| `a63df46009d24a51a549452527be9f03` | New Book Setup Mockup               | Tablet   | retired     | Superseded by v3. Had Cancel button (wrong for new users).                                                       |
| `8e40cdf0105d4baf8a34d6b4e59fba78` | New Book Setup — Initial Experience | Tablet   | draft       | **CURRENT** — First-time user flow. No Cancel (no dashboard to return to). Logo-only header, form, Drive prompt. |

### Editor

| Screen ID                          | Title                             | Viewport | Status      | Notes                                     |
| ---------------------------------- | --------------------------------- | -------- | ----------- | ----------------------------------------- |
| `fddce469903b4561978f9303bdae9731` | Three-Zone Spatial Editor         | Tablet   | exploration | Shows the 3-panel spatial layout concept. |
| `2f2ed738c1584183a40ec487fbd152d1` | DraftCrane AI Editor (Tablet)     | Desktop  | exploration | Editor with AI panel open.                |
| `d4eae21887f040ef9588624dc6b1dcb8` | DraftCrane Editor - Library Panel | Desktop  | exploration | Editor with Library panel open.           |
| `c3e60cbf2fed460089f6788c2ce6c1e9` | DraftCrane Editor (Portrait)      | Mobile   | exploration | Portrait/mobile editor layout.            |
| `4461403c8d514047a275c6d0b7a73b9b` | DraftCrane Immersive Editor       | Tablet   | exploration | Full immersive writing mode.              |

### Landing Page

| Screen ID                          | Title                            | Viewport | Status  | Notes                                               |
| ---------------------------------- | -------------------------------- | -------- | ------- | --------------------------------------------------- |
| `1c4b120fe4ed4b3091bf56e8678ba3a2` | DraftCrane Landing Page (Tablet) | Mobile   | shipped | Used as reference for PR #482 landing page rebuild. |

### Export

| Screen ID                          | Title                           | Viewport | Status      | Notes                |
| ---------------------------------- | ------------------------------- | -------- | ----------- | -------------------- |
| `fa4099cf93324d1697bd4f1a8283ecbc` | DraftCrane Export Flow (Tablet) | Tablet   | exploration | Export flow concept. |

### Other

| Screen ID                          | Title                          | Viewport | Status      | Notes                                                                  |
| ---------------------------------- | ------------------------------ | -------- | ----------- | ---------------------------------------------------------------------- |
| `b56536746f554f919eda750ba4ed7b40` | DraftCrane AI Writing Platform | Mobile   | exploration | Unclear purpose — possibly an early concept. Candidate for retirement. |
