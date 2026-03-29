import Link from 'next/link'

/**
 * Landing Page for DraftCrane.
 * Built to match Stitch "DraftCrane — Full Product Design" landing screen.
 * Warm literary aesthetic with product showcase and benefit cards.
 */
export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-[var(--dc-color-surface-primary)]">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 max-w-7xl mx-auto bg-[var(--dc-color-surface-primary)] border-b border-[var(--dc-color-border-default)]/50">
        <div className="flex items-center gap-2">
          <svg
            className="w-6 h-6 text-[var(--dc-color-interactive-primary)]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zM21 18.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
          </svg>
          <span className="text-xl font-semibold text-[var(--dc-color-interactive-primary)] font-serif tracking-tight">
            DraftCrane
          </span>
        </div>
        <Link
          href="/sign-up"
          className="px-5 py-2 bg-[var(--dc-color-interactive-primary)] text-[var(--dc-color-text-inverse)] rounded-lg font-medium text-sm transition-all hover:opacity-90 active:opacity-80 min-h-[44px] flex items-center"
        >
          Get Started
        </Link>
      </nav>

      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="text-center py-16 md:py-24 max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-7xl font-medium tracking-tight text-[var(--dc-color-interactive-primary)] leading-[1.1] mb-8">
            Your book. Your files. Your cloud. With an AI writing partner.
          </h1>
          <p className="text-lg md:text-xl text-[var(--dc-color-interactive-primary)]/80 leading-relaxed mb-10 max-w-2xl mx-auto">
            Craft your expertise into a compelling book with a writing environment that respects
            your ideas and your privacy. Designed specifically for consultants and coaches who want
            to write, organize, and publish with ease.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto px-10 py-4 bg-[var(--dc-color-interactive-primary)] text-[var(--dc-color-text-inverse)] rounded-xl font-semibold text-lg hover:shadow-lg transition-all active:scale-[0.98] min-h-[44px] flex items-center justify-center"
            >
              Get Started
            </Link>
            <a
              href="#product-visual"
              className="w-full sm:w-auto px-10 py-4 text-[var(--dc-color-interactive-primary)] font-medium hover:underline decoration-[var(--dc-color-interactive-primary)]/30 underline-offset-8 transition-all min-h-[44px] flex items-center justify-center"
            >
              Learn More
            </a>
          </div>
        </section>

        {/* Product Visual: The Editor Interface */}
        <section id="product-visual" className="relative mb-32 group">
          <div className="absolute -inset-4 bg-[var(--dc-color-interactive-primary)]/5 rounded-[2rem] blur-3xl group-hover:bg-[var(--dc-color-interactive-primary)]/10 transition-colors duration-700" />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-[var(--dc-color-border-default)] overflow-hidden aspect-[4/3] md:aspect-[16/10] flex flex-col">
            {/* Editor Toolbar */}
            <div className="h-14 border-b border-[var(--dc-color-border-subtle)] flex items-center justify-between px-4 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-[var(--dc-color-text-placeholder)]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                </svg>
                <div className="h-4 w-px bg-[var(--dc-color-border-default)]" />
                <span className="text-sm font-medium text-[var(--dc-color-text-muted)]">
                  The Modern Leader › Chapter 4: Authentic Presence
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-[var(--dc-color-text-placeholder)] italic">
                  Saved to Google Drive
                </span>
                <svg
                  className="w-5 h-5 text-[var(--dc-color-text-placeholder)]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                </svg>
              </div>
            </div>
            {/* Three-Zone Spatial Layout */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Panel: Chapters */}
              <aside className="w-64 border-r border-[var(--dc-color-border-subtle)] bg-[var(--dc-color-surface-secondary)]/50 p-6 hidden md:block">
                <h3 className="text-[10px] uppercase tracking-widest text-[var(--dc-color-text-placeholder)] font-bold mb-6">
                  Manuscript
                </h3>
                <div className="space-y-5">
                  <div className="flex items-center gap-3 text-[var(--dc-color-text-placeholder)]">
                    <span className="text-xs font-serif italic">01</span>
                    <span className="text-sm">Introduction</span>
                  </div>
                  <div className="flex items-center gap-3 text-[var(--dc-color-text-placeholder)]">
                    <span className="text-xs font-serif italic">02</span>
                    <span className="text-sm">The Expertise Gap</span>
                  </div>
                  <div className="flex items-center gap-3 text-[var(--dc-color-interactive-primary)] font-medium">
                    <span className="text-xs font-serif italic">04</span>
                    <span className="text-sm">Authentic Presence</span>
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--dc-color-interactive-primary)]/40" />
                  </div>
                  <div className="flex items-center gap-3 text-[var(--dc-color-text-placeholder)]">
                    <span className="text-xs font-serif italic">05</span>
                    <span className="text-sm">Building Trust</span>
                  </div>
                </div>
              </aside>
              {/* Center Panel: Writing Surface */}
              <section className="flex-1 bg-white p-8 md:p-16 overflow-y-auto">
                <div className="max-w-2xl mx-auto space-y-8">
                  <h2 className="font-serif text-4xl text-[var(--dc-color-interactive-primary)] mb-12">
                    Authentic Presence
                  </h2>
                  <p className="font-serif text-xl leading-relaxed text-[var(--dc-color-text-primary)]">
                    Leadership is not about being the loudest person in the room. It is about
                    creating a space where the truth can be spoken without fear. For most
                    consultants, the transition from expert to author requires a shift in how they
                    view their own authority.
                  </p>
                  <p className="font-serif text-xl leading-relaxed text-[var(--dc-color-text-primary)]">
                    When we sit down to write, we often feel the need to sound like an
                    &ldquo;Author.&rdquo; We adopt a formal tone, we use academic structures, and we
                    inadvertently distance ourselves from the very people we are trying to help.
                  </p>
                  <div className="h-2 w-12 bg-[var(--dc-color-surface-tertiary)] rounded-full" />
                </div>
              </section>
              {/* Right Panel: AI Editor Assistance */}
              <aside className="w-80 border-l border-[var(--dc-color-border-subtle)] bg-[var(--dc-color-surface-secondary)]/30 p-6 hidden lg:block">
                <div className="space-y-6">
                  <div className="p-4 bg-white rounded-xl shadow-sm border border-[var(--dc-color-border-subtle)]">
                    <div className="flex items-center gap-2 mb-3">
                      <svg
                        className="w-4 h-4 text-[var(--dc-color-interactive-primary)]"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" />
                      </svg>
                      <span className="text-xs font-semibold text-[var(--dc-color-interactive-primary)] uppercase tracking-tighter">
                        Editor&apos;s Note
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-[var(--dc-color-text-muted)] mb-4">
                      &ldquo;Your transition here is strong, but you could lean more into the
                      specific &lsquo;Leadership&rsquo; anecdote from your Google Drive research
                      folder.&rdquo;
                    </p>
                    <button className="text-[10px] font-bold text-[var(--dc-color-interactive-primary)] uppercase tracking-wider border-b border-[var(--dc-color-interactive-primary)]/20 pb-0.5">
                      Show Research
                    </button>
                  </div>
                  <div className="p-4 bg-[var(--dc-color-interactive-primary)]/5 rounded-xl border border-[var(--dc-color-interactive-primary)]/10">
                    <p className="text-[10px] text-[var(--dc-color-interactive-primary)]/60 font-medium mb-2 uppercase">
                      Suggested Refinement
                    </p>
                    <p className="text-xs italic text-[var(--dc-color-text-secondary)] leading-relaxed">
                      &ldquo;Consider simplifying this paragraph to maintain the conversational
                      warmth of your coaching sessions.&rdquo;
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
          <div className="mt-8 flex justify-center items-center gap-8 text-[var(--dc-color-text-placeholder)]">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
              </svg>
              <span className="text-xs font-medium">Syncing with Google Drive</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
              <span className="text-xs font-medium">End-to-End Privacy</span>
            </div>
          </div>
        </section>

        {/* Benefit Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          <div className="bg-[var(--dc-color-surface-secondary)]/50 p-8 rounded-2xl border border-[var(--dc-color-border-default)]/50 hover:bg-white hover:shadow-xl hover:shadow-[var(--dc-color-interactive-primary)]/5 transition-all duration-500">
            <div className="w-12 h-12 bg-[var(--dc-color-interactive-primary)]/10 rounded-xl flex items-center justify-center mb-6">
              <svg
                className="w-6 h-6 text-[var(--dc-color-interactive-primary)]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22 11V3h-7v3H9V3H2v8h7V8h2v10h4v3h7v-8h-7v3h-2V8h2v3h7zM7 9H4V5h3v4zm10 6h3v4h-3v-4zm0-10h3v4h-3V5z" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl text-[var(--dc-color-interactive-primary)] mb-4">
              Organized Chapters
            </h3>
            <p className="text-[var(--dc-color-text-muted)] leading-relaxed">
              Build your book structure visually, moving chapters and sections as your ideas grow.
              Never lose track of where a story belongs.
            </p>
          </div>
          <div className="bg-[var(--dc-color-surface-secondary)]/50 p-8 rounded-2xl border border-[var(--dc-color-border-default)]/50 hover:bg-white hover:shadow-xl hover:shadow-[var(--dc-color-interactive-primary)]/5 transition-all duration-500">
            <div className="w-12 h-12 bg-[var(--dc-color-interactive-primary)]/10 rounded-xl flex items-center justify-center mb-6">
              <svg
                className="w-6 h-6 text-[var(--dc-color-interactive-primary)]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl text-[var(--dc-color-interactive-primary)] mb-4">
              AI Writing Partner
            </h3>
            <p className="text-[var(--dc-color-text-muted)] leading-relaxed">
              An intelligent assistant that helps you brainstorm and refine your draft while always
              honoring your unique author voice.
            </p>
          </div>
          <div className="bg-[var(--dc-color-surface-secondary)]/50 p-8 rounded-2xl border border-[var(--dc-color-border-default)]/50 hover:bg-white hover:shadow-xl hover:shadow-[var(--dc-color-interactive-primary)]/5 transition-all duration-500">
            <div className="w-12 h-12 bg-[var(--dc-color-interactive-primary)]/10 rounded-xl flex items-center justify-center mb-6">
              <svg
                className="w-6 h-6 text-[var(--dc-color-interactive-primary)]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM10 17l-3.5-3.5 1.41-1.41L10 14.17l4.59-4.58L16 11l-6 6z" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl text-[var(--dc-color-interactive-primary)] mb-4">
              Your Files, Your Control
            </h3>
            <p className="text-[var(--dc-color-text-muted)] leading-relaxed">
              DraftCrane connects directly to your Google Drive, so your manuscript always stays in
              your own cloud. No data silos, no locking in.
            </p>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="mt-24 mb-12 bg-[var(--dc-color-interactive-primary)] text-[var(--dc-color-text-inverse)] rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -ml-32 -mb-32" />
          <h2 className="font-serif text-4xl md:text-5xl mb-6 relative z-10">
            Start your writing journey today.
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto relative z-10">
            Join hundreds of experts who are turning their knowledge into published works with the
            calmest writing tool ever made.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center bg-[var(--dc-color-surface-primary)] text-[var(--dc-color-interactive-primary)] px-12 py-4 rounded-xl font-bold text-lg hover:bg-[var(--dc-color-surface-tertiary)] transition-colors relative z-10 min-h-[44px]"
          >
            Create Your Free Manuscript
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-6 flex flex-col md:flex-row justify-between items-center gap-8 bg-[var(--dc-color-surface-primary)] border-t border-[var(--dc-color-border-default)]">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-lg font-bold text-[var(--dc-color-interactive-primary)] font-serif tracking-tight">
            DraftCrane
          </span>
          <p className="text-[var(--dc-color-text-muted)] text-sm tracking-wide uppercase">
            © 2024 DraftCrane. Built for authors.
          </p>
        </div>
        <div className="flex gap-8">
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
        </div>
      </footer>
    </div>
  )
}
