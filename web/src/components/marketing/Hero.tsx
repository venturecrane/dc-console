export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="max-w-3xl">
        <p className="font-sans text-sm uppercase tracking-widest text-[var(--dc-color-interactive-primary)]/70 mb-6">
          Private alpha — invite only
        </p>
        <h1 className="font-serif text-5xl md:text-6xl font-medium tracking-tight text-[var(--dc-color-interactive-primary)] leading-[1.05] mb-8">
          Write the book you have been putting off.
        </h1>
        <p className="font-sans text-lg md:text-xl text-[var(--dc-color-text-secondary)] leading-relaxed mb-10 max-w-2xl">
          DraftCrane is a writing environment for consultants, coaches, and subject-matter experts
          who want to turn their expertise into a published nonfiction book. Organized chapter by
          chapter. AI that reads what you have written before it suggests anything. Saved to your
          own Google Drive.
        </p>
        <a
          href="#waitlist"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--dc-color-interactive-primary)] text-[var(--dc-color-text-inverse)] rounded-xl font-semibold text-base hover:shadow-lg transition-all active:scale-[0.98] min-h-[44px]"
        >
          Request access
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  )
}
