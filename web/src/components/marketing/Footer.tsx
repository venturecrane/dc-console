import Link from 'next/link'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-[var(--dc-color-surface-primary)] border-t border-[var(--dc-color-border-default)] py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-lg font-semibold text-[var(--dc-color-interactive-primary)] font-serif tracking-tight">
            DraftCrane
          </span>
          <p className="text-[var(--dc-color-text-muted)] text-xs tracking-wide uppercase">
            © {year} DraftCrane. Built for authors.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-6">
          <a
            href="#waitlist"
            className="text-sm tracking-wide uppercase text-[var(--dc-color-text-muted)] hover:text-[var(--dc-color-interactive-primary)] transition-colors"
          >
            Join the list
          </a>
          <Link
            href="/privacy"
            className="text-sm tracking-wide uppercase text-[var(--dc-color-text-muted)] hover:text-[var(--dc-color-interactive-primary)] transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-sm tracking-wide uppercase text-[var(--dc-color-text-muted)] hover:text-[var(--dc-color-interactive-primary)] transition-colors"
          >
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  )
}
