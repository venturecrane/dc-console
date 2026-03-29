import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

/**
 * Sign In page using Clerk's hosted authentication.
 * Per PRD Section 7 Step 2 and Section 8:
 * - Clean Clerk-hosted authentication
 * - "Continue with Google" is primary and prominent
 * - Email/password is secondary
 * - Redirect-based OAuth only (Safari popup blocker mitigation)
 * - iPad Safari is primary target - use 100dvh not 100vh
 * - Touch targets minimum 44x44pt
 */
export default function SignInPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--dc-color-surface-secondary)] px-6 py-12">
      {/* Header with back to home */}
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="mb-4 inline-block text-sm text-[var(--dc-color-text-muted)] hover:text-[var(--dc-color-text-secondary)]"
        >
          Back to DraftCrane
        </Link>
        <h1 className="text-2xl font-semibold text-[var(--dc-color-text-primary)]">Welcome back</h1>
        <p className="mt-2 text-[var(--dc-color-text-muted)]">
          Sign in to continue writing your book
        </p>
      </div>

      {/* Clerk SignIn component with enhanced styling */}
      <SignIn
        appearance={{
          elements: {
            rootBox: 'mx-auto w-full max-w-md',
            card: 'shadow-lg rounded-xl border border-[var(--dc-color-border-subtle)] bg-[var(--dc-color-surface-primary)]',
            headerTitle: 'hidden',
            headerSubtitle: 'hidden',
            socialButtonsBlockButton:
              'h-12 text-base font-medium border-[var(--dc-color-border-default)] hover:bg-[var(--dc-color-surface-secondary)]',
            socialButtonsBlockButtonText: 'text-[var(--dc-color-text-secondary)]',
            dividerLine: 'bg-[var(--dc-color-border-default)]',
            dividerText: 'text-[var(--dc-color-text-muted)] text-sm',
            formFieldLabel: 'text-[var(--dc-color-text-secondary)] font-medium',
            formFieldInput:
              'h-12 rounded-lg border-[var(--dc-color-border-default)] focus:border-[var(--dc-color-border-strong)] focus:ring-[var(--dc-color-border-strong)]',
            formButtonPrimary:
              'h-12 bg-[var(--dc-color-text-primary)] hover:bg-[var(--dc-color-text-secondary)] text-base font-medium rounded-lg',
            footerActionLink:
              'text-[var(--dc-color-text-secondary)] font-medium hover:text-[var(--dc-color-text-primary)]',
            identityPreviewEditButton:
              'text-[var(--dc-color-text-secondary)] hover:text-[var(--dc-color-text-primary)]',
          },
          layout: {
            socialButtonsPlacement: 'top',
            socialButtonsVariant: 'blockButton',
          },
        }}
        forceRedirectUrl="/dashboard"
      />
    </div>
  )
}
