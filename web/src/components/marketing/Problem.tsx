export function Problem() {
  return (
    <section className="bg-[var(--dc-color-surface-secondary)] py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl font-medium text-[var(--dc-color-interactive-primary)] mb-12">
          You have the expertise. You have the material. You do not have a system.
        </h2>
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-[var(--dc-color-text-placeholder)] mb-5">
              What you are doing now
            </h3>
            <ul className="space-y-4 text-[var(--dc-color-text-secondary)]">
              <li className="flex gap-3">
                <span
                  className="shrink-0 mt-1 text-[var(--dc-color-text-placeholder)]"
                  aria-hidden="true"
                >
                  ×
                </span>
                <span>
                  Forty-seven Google Docs with names like &ldquo;Book Draft v3 FINAL (2).&rdquo;
                </span>
              </li>
              <li className="flex gap-3">
                <span
                  className="shrink-0 mt-1 text-[var(--dc-color-text-placeholder)]"
                  aria-hidden="true"
                >
                  ×
                </span>
                <span>
                  Switching between ChatGPT and your manuscript, copy-pasting back and forth.
                </span>
              </li>
              <li className="flex gap-3">
                <span
                  className="shrink-0 mt-1 text-[var(--dc-color-text-placeholder)]"
                  aria-hidden="true"
                >
                  ×
                </span>
                <span>
                  Telling people &ldquo;I am working on a book&rdquo; for the third year running.
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-[var(--dc-color-interactive-primary)] mb-5">
              What changes with DraftCrane
            </h3>
            <ul className="space-y-4 text-[var(--dc-color-text-primary)]">
              <li className="flex gap-3">
                <span
                  className="shrink-0 mt-1 text-[var(--dc-color-interactive-primary)]"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span>One place for your entire manuscript, organized by chapter.</span>
              </li>
              <li className="flex gap-3">
                <span
                  className="shrink-0 mt-1 text-[var(--dc-color-interactive-primary)]"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span>
                  An AI writing partner that reads your chapter before suggesting changes.
                </span>
              </li>
              <li className="flex gap-3">
                <span
                  className="shrink-0 mt-1 text-[var(--dc-color-interactive-primary)]"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span>
                  Everything saved to your own Google Drive. If DraftCrane disappears, your book
                  does not.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
