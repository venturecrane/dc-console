import Link from 'next/link'

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--dc-color-surface-primary)]/90 backdrop-blur-sm border-b border-[var(--dc-color-border-default)]/50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <svg
            className="w-6 h-6 text-[var(--dc-color-interactive-primary)]"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zM21 18.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
          </svg>
          <span className="text-xl font-semibold text-[var(--dc-color-interactive-primary)] font-serif tracking-tight">
            DraftCrane
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <a
            href="#waitlist"
            className="hidden sm:inline text-sm text-[var(--dc-color-text-muted)] hover:text-[var(--dc-color-interactive-primary)] transition-colors"
          >
            Join the list
          </a>
          <Link
            href="/sign-in"
            className="text-sm font-medium text-[var(--dc-color-interactive-primary)] hover:text-[var(--dc-color-interactive-primary-hover)] transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </nav>
  )
}
