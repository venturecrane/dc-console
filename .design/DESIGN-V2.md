# Draft Crane — Stitch Design Spec V2

Design system derived from the "DraftCrane — Full Product Design" Stitch experiment
(project `6819167765706387197`, 2026-03-29). When values conflict with this file,
this file wins — it is the current design direction.

## Design System Overview

- **Brand:** Draft Crane — Book-writing environment for nonfiction authors
- **Audience:** Consultants, coaches, subject-matter experts writing nonfiction books
- **Platform:** iPad-first web app (Next.js 16, Tailwind v4, Vercel)
- **Theme:** Light-only (warm)
- **Voice:** Calm, knowledgeable, honest, warm, focused
- **Aesthetic:** "A quiet, well-lit writing desk in a good library"
- **Interaction Model:** Dual-zone — Author zone (Warm Brown/Primary) for content creation, Editor zone (Warm Plum/Escalation) for AI-powered review and feedback

## Color Palette

Derived from Stitch's TONAL_SPOT interpretation of seed `#6B5B4B`. Based on Tailwind Stone scale with warm brand accents.

### Text

| Token                         | Hex       | WCAG on Paper | Usage                            |
| ----------------------------- | --------- | ------------- | -------------------------------- |
| `--dc-color-text-primary`     | `#1C1917` | 16.5:1 ✓      | Headings, prominent labels       |
| `--dc-color-text-secondary`   | `#44403C` | 9.2:1 ✓       | Body text, descriptions          |
| `--dc-color-text-muted`       | `#78716C` | 4.6:1 ✓       | Captions, hints, idle labels     |
| `--dc-color-text-placeholder` | `#A8A29E` | 2.8:1 (lg)    | Input placeholders (large text)  |
| `--dc-color-text-inverse`     | `#FDFCFB` | —             | Text on dark/colored backgrounds |

### Surfaces

| Token                          | Hex                     | Usage                               |
| ------------------------------ | ----------------------- | ----------------------------------- |
| `--dc-color-surface-primary`   | `#FDFCFB`               | Writing surface, panel backgrounds  |
| `--dc-color-surface-secondary` | `#F5F5F4`               | Dashboard bg, subtle tint           |
| `--dc-color-surface-tertiary`  | `#E7E5E4`               | Toggle tracks, hover backgrounds    |
| `--dc-color-surface-overlay`   | `rgba(28, 25, 23, 0.5)` | Modal/dialog backdrops (warm black) |

### Borders

| Token                       | Hex       | Usage                              |
| --------------------------- | --------- | ---------------------------------- |
| `--dc-color-border-default` | `#E7E5E4` | Standard borders                   |
| `--dc-color-border-subtle`  | `#F5F5F4` | Dividers, separators               |
| `--dc-color-border-strong`  | `#D6D3D1` | Emphasized borders, input outlines |
| `--dc-color-border-focus`   | `#6B5B4B` | Focus rings (uses primary accent)  |

### Primary Interactive (Warm Brown — Author Zone)

| Token                                      | Hex       | Usage                       |
| ------------------------------------------ | --------- | --------------------------- |
| `--dc-color-interactive-primary`           | `#6B5B4B` | Primary actions, links      |
| `--dc-color-interactive-primary-subtle`    | `#F5F2ED` | Light warm tint backgrounds |
| `--dc-color-interactive-primary-on-subtle` | `#4A3F35` | Dark text on primary-subtle |
| `--dc-color-interactive-primary-hover`     | `#57534E` | Hover state                 |
| `--dc-color-interactive-primary-active`    | `#4A3F35` | Active/pressed state        |
| `--dc-color-interactive-primary-border`    | `#A8A29E` | Focus/selection borders     |

### Escalation Interactive (Warm Plum — Editor Zone)

Two-zone model restored. Stitch generated a unified brown palette; these plum
tones are manually derived to maintain the Author/Editor visual distinction
per PRD mandate. The plum sits in the same warm family as the brown primary.

| Token                                      | Hex       | Usage                         |
| ------------------------------------------ | --------- | ----------------------------- |
| `--dc-color-interactive-escalation`        | `#7B5B6B` | Editor actions, AI escalation |
| `--dc-color-interactive-escalation-subtle` | `#F5F0F3` | Light plum tint backgrounds   |
| `--dc-color-interactive-escalation-hover`  | `#6B4B5B` | Hover state                   |
| `--dc-color-interactive-escalation-border` | `#C4A8B8` | Focus/selection borders       |

### Highlight

| Token                  | Hex       | Usage                            |
| ---------------------- | --------- | -------------------------------- |
| `--dc-color-highlight` | `#FDE68A` | Text selection, AI rewrite focus |

### Destructive

| Token                                       | Hex       | Usage                               |
| ------------------------------------------- | --------- | ----------------------------------- |
| `--dc-color-interactive-destructive`        | `#B91C1C` | Delete buttons, destructive actions |
| `--dc-color-interactive-destructive-hover`  | `#991B1B` | Hover on destructive actions        |
| `--dc-color-interactive-destructive-subtle` | `#FEF2F2` | Light red tint backgrounds          |

### Status

| Token                          | Hex       | Usage                   |
| ------------------------------ | --------- | ----------------------- |
| `--dc-color-status-error`      | `#B91C1C` | Error states            |
| `--dc-color-error-bg`          | `#FEF2F2` | Error background tint   |
| `--dc-color-status-success`    | `#047857` | Success states          |
| `--dc-color-success-bg`        | `#ECFDF5` | Success background tint |
| `--dc-color-status-warning`    | `#B45309` | Warnings, cautions      |
| `--dc-color-status-warning-bg` | `#FFFBEB` | Warning background tint |

## Typography

### Font Stacks

| Role           | Stack                                                     |
| -------------- | --------------------------------------------------------- |
| Sans (UI)      | `var(--font-inter), ui-sans-serif, system-ui, sans-serif` |
| Serif (Editor) | `var(--font-newsreader), ui-serif, Georgia, serif`        |
| Mono (Code)    | `var(--font-geist-mono), ui-monospace, monospace`         |

Inter loaded via Next.js font optimization (variable weight). Newsreader loaded
with weights 400, 500, 600, 700. Geist Mono unchanged from V1.

### Size Scale (unchanged)

| Token            | Size            | Usage                  |
| ---------------- | --------------- | ---------------------- |
| `--dc-text-xs`   | 0.75rem (12px)  | Fine print, metadata   |
| `--dc-text-sm`   | 0.875rem (14px) | Captions, secondary UI |
| `--dc-text-base` | 1rem (16px)     | Body text (default)    |
| `--dc-text-lg`   | 1.125rem (18px) | Prominent body, editor |
| `--dc-text-xl`   | 1.25rem (20px)  | Small headings         |
| `--dc-text-2xl`  | 1.5rem (24px)   | Medium headings        |
| `--dc-text-3xl`  | 1.875rem (30px) | Large headings         |

## Spacing (unchanged)

**Base Unit:** 4px grid. All values unchanged from V1.

## Border Radius

| Token              | Value  | Usage                   |
| ------------------ | ------ | ----------------------- |
| `--dc-radius-sm`   | 4px    | Small elements, chips   |
| `--dc-radius-md`   | 8px    | Buttons, inputs, cards  |
| `--dc-radius-lg`   | 12px   | Panels, modals          |
| `--dc-radius-xl`   | 16px   | Large panels            |
| `--dc-radius-full` | 9999px | Pills, circular avatars |

## Shadows (warm-tinted)

| Level   | Value                                                                             |
| ------- | --------------------------------------------------------------------------------- |
| Small   | `0 1px 2px rgba(28, 25, 23, 0.05)`                                                |
| Medium  | `0 4px 6px -1px rgba(28, 25, 23, 0.08), 0 2px 4px -2px rgba(28, 25, 23, 0.05)`    |
| Large   | `0 10px 15px -3px rgba(28, 25, 23, 0.08), 0 4px 6px -4px rgba(28, 25, 23, 0.05)`  |
| XL      | `0 20px 25px -5px rgba(28, 25, 23, 0.08), 0 8px 10px -6px rgba(28, 25, 23, 0.05)` |
| Tooltip | `0 4px 12px rgba(28, 25, 23, 0.12)`                                               |
| AI Glow | `0 0 20px rgba(107, 91, 75, 0.05)`                                                |

## Motion (unchanged)

Maximum duration: 300ms. All animations respect `prefers-reduced-motion`.

## Interaction Model

### Author Zone (Warm Brown/Primary)

- All content creation actions use the warm brown palette
- `--dc-color-interactive-primary` (#6B5B4B) as the base
- Applied to: write, edit, save, format, navigate, Library panel

### Editor Zone (Warm Plum/Escalation)

- All AI-powered review and feedback actions use the warm plum palette
- `--dc-color-interactive-escalation` (#7B5B6B) as the base
- Applied to: AI suggestions, editor feedback, review panels, escalation controls

## Stitch Reference

- **Project:** DraftCrane — Full Product Design (`6819167765706387197`)
- **Design System Asset:** `assets/5418001215012068728`
- **Screens:** 10 (Landing, Dashboard empty/populated, Setup, Editor x4, Export, Portrait)
- **Date:** 2026-03-29
