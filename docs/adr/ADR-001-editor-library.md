# ADR-001: Editor Library Selection

## Status

**Accepted** - 2025-02-10

## Context

DraftCrane requires a rich text editor for chapter content editing. The PRD identifies this as Risk 3 (High Likelihood, Critical Impact): "Editor fails on iPad Safari. Rich text editing in mobile Safari is fragile."

**Key constraints:**

- iPad Safari is the primary test target (PRD Principle 1)
- Input latency under 100ms required
- Must work with virtual keyboard (40-50% screen consumption)
- Paste from Google Docs must preserve formatting
- Bundle budget: ~200KB lazy-loaded acceptable

**Options evaluated:**

1. **Tiptap** - ProseMirror-based, ~150KB, best iPad Safari track record
2. **Lexical** - Meta, ~30KB, less iPad battle-tested
3. **Plate** - Slate-based, known iOS issues

## Decision

**Use Tiptap (ProseMirror-based).**

### Rationale

1. **iPad Safari reliability is non-negotiable.** ProseMirror has a decade of mobile Safari battle-testing. Tiptap's changelogs show active iPad/iPadOS detection fixes through 2024-2025.

2. **Lexical has disqualifying Safari issues:**
   - Input latency problems persisting after standard fixes (GitHub #5683)
   - Zoom-level rendering bugs
   - iOS native version is "pre-release with no guarantee of support"

3. **Slate/Plate is eliminated:**
   - September 2024 bug: holding backspace on iOS Safari breaks editor entirely (GitHub #5711)
   - FAQ explicitly states iOS is "not regularly tested"

4. **Bundle size tradeoff is acceptable.** Lexical saves ~30-50KB gzipped, but reliability on the primary platform outweighs bundle savings.

## Consequences

### Positive

- Battle-tested iPad Safari support
- Rich extension ecosystem for future features
- Active maintenance and community
- Excellent TypeScript support
- Built-in collaborative editing primitives (Phase 2+)

### Negative

- Larger bundle (~150KB vs ~30KB for Lexical)
- ProseMirror learning curve for deep customization
- Must implement custom paste handler for Google Docs

### Known Issues & Mitigations

| Issue                                               | Mitigation                                                                    |
| --------------------------------------------------- | ----------------------------------------------------------------------------- |
| Virtual keyboard toolbar positioning (Tiptap #6571) | Use `visualViewport` API + `interactive-widget=resizes-content` viewport meta |
| Google Docs paste uses inline styles                | Custom paste handler transforms to semantic marks                             |

## Implementation Notes

### Package Installation

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
```

### Required Extensions

```typescript
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

// StarterKit includes: Bold, Italic, Heading, BulletList, OrderedList, Blockquote, History
```

### Viewport Meta Tag

Add to `app/layout.tsx`:

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, interactive-widget=resizes-content"
/>
```

### Virtual Keyboard Handling

```typescript
useEffect(() => {
  if (typeof window !== "undefined" && window.visualViewport) {
    const viewport = window.visualViewport;
    const handleResize = () => {
      const keyboardHeight = window.innerHeight - viewport.height;
      document.documentElement.style.setProperty("--keyboard-height", `${keyboardHeight}px`);
    };
    viewport.addEventListener("resize", handleResize);
    return () => viewport.removeEventListener("resize", handleResize);
  }
}, []);
```

### Google Docs Paste Handler

Google Docs wraps content in `<b id="docs-internal-guid-...">` with inline styles. Implement a custom paste handler:

```typescript
const handlePaste = (view: EditorView, event: ClipboardEvent) => {
  const html = event.clipboardData?.getData("text/html");
  if (html?.includes("docs-internal-guid")) {
    // Transform Google Docs HTML to semantic marks
    // See implementation in editor component
  }
  return false; // Let Tiptap handle normal paste
};
```

### 8-Point iPad Safari Test Protocol

Before shipping, verify on physical iPad (Air 5th gen+, iPadOS 17+):

1. [ ] Type 500 words without cursor jumping
2. [ ] Apply/remove all formatting (bold, italic, headings, lists, blockquote)
3. [ ] Undo/redo 10+ operations
4. [ ] Paste from Google Docs, verify formatting preserved
5. [ ] Virtual keyboard: cursor stays visible when typing at bottom
6. [ ] Portrait → landscape → portrait: no content loss
7. [ ] Background tab for 30s, return: no state corruption
8. [ ] Input latency feels instant (< 100ms perceived)

Score each 1-5. Minimum passing: no item below 3, average >= 4.

## References

- [Tiptap Documentation](https://tiptap.dev/docs)
- [Tiptap GitHub #6571 - Virtual Keyboard](https://github.com/ueberdosis/tiptap/issues/6571)
- [Lexical GitHub #5683 - Safari Performance](https://github.com/facebook/lexical/issues/5683)
- [Slate GitHub #5711 - iOS Backspace](https://github.com/ianstormtaylor/slate/issues/5711)
- PRD Section 14: iPad-First Design Constraints
- PRD Section 17: Risk 3
