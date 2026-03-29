'use client'

import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

/**
 * App header — conditionally rendered based on route.
 *
 * Hidden on /editor/* routes where the editor has its own toolbar.
 * Visible on dashboard, help, setup, and other pages.
 */
export function AppHeader() {
  const pathname = usePathname()

  if (pathname.startsWith('/editor/')) return null

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--dc-color-border-default)] px-4 pt-[env(safe-area-inset-top)]">
      <Link
        href="/dashboard"
        className="flex h-11 items-center font-serif text-xl font-semibold text-[var(--dc-color-text-primary)]"
      >
        DraftCrane
      </Link>

      <div className="flex items-center gap-2">
        <Link
          href="/help"
          className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-[var(--dc-color-surface-tertiary)] transition-colors"
          aria-label="Help"
        >
          <svg
            className="h-5 w-5 text-[var(--dc-color-text-muted)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </Link>
        <div className="flex h-11 w-11 items-center justify-center">
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'h-9 w-9',
                userButtonTrigger: 'h-11 w-11 flex items-center justify-center',
              },
            }}
          />
        </div>
      </div>
    </header>
  )
}
