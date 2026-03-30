'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { useDriveAccounts } from '@/hooks/use-drive-accounts'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

/**
 * Book Setup Screen — "Start Your New Book"
 *
 * Matches Stitch screen "New Book Setup — Initial Experience"
 * (8e40cdf0105d4baf8a34d6b4e59fba78).
 *
 * Two variants:
 * - First-time user (0 books): Logo-only header, no Cancel
 * - Returning user (1+ books): Logo + Cancel → /dashboard
 *
 * Below the form, a Google Drive connection prompt appears
 * if the user hasn't connected Drive yet.
 */
export default function SetupPage() {
  const router = useRouter()
  const { getToken } = useAuth()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasProjects, setHasProjects] = useState(false)
  const [driveDismissed, setDriveDismissed] = useState(false)

  const {
    connected: driveConnected,
    connect: connectDrive,
    isLoading: driveLoading,
  } = useDriveAccounts()

  const titleLength = title.length
  const descriptionLength = description.length
  const isValid = title.trim().length > 0 && titleLength <= 500 && descriptionLength <= 1000

  // Check if user has existing projects (for conditional Cancel)
  useEffect(() => {
    async function check() {
      try {
        const token = await getToken()
        const res = await fetch(`${API_URL}/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          const list = data?.projects ?? data
          setHasProjects(Array.isArray(list) && list.length > 0)
        }
      } catch {
        // Silently fail — just don't show Cancel
      }
    }
    check()
  }, [getToken])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!isValid || isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    try {
      const token = await getToken()

      const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
        }),
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string
          requestId?: string
        } | null
        const base = data?.error || 'Failed to create project'
        const withRequest = data?.requestId ? `${base} (request ${data.requestId})` : base
        throw new Error(withRequest)
      }

      const project = await response.json()
      router.push(`/editor/${project.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const showDrivePrompt = !driveLoading && !driveConnected && !driveDismissed

  return (
    <div className="min-h-dvh bg-[var(--dc-color-surface-primary)]">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--dc-color-border-default)] bg-[var(--dc-color-surface-primary)] px-4 pt-[env(safe-area-inset-top)]">
        <div className="flex items-center gap-2">
          <svg
            className="h-6 w-6 text-[var(--dc-color-interactive-primary)]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zM21 18.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
          </svg>
          <span className="text-xl font-semibold text-[var(--dc-color-interactive-primary)] font-serif tracking-tight">
            DraftCrane
          </span>
        </div>
        {hasProjects && (
          <Link
            href="/dashboard"
            className="flex h-11 items-center text-sm font-medium text-[var(--dc-color-text-secondary)] hover:text-[var(--dc-color-text-primary)] transition-colors"
          >
            Cancel
          </Link>
        )}
      </header>

      {/* Main content */}
      <div className="mx-auto w-full max-w-lg px-4 pt-12 pb-12">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-semibold text-[var(--dc-color-text-primary)]">
            Start Your New Book
          </h1>
          <p className="mt-2 font-serif italic text-[var(--dc-color-text-muted)]">
            Every great manuscript begins with a single title.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title field */}
          <div>
            <label
              htmlFor="title"
              className="block text-xs font-medium uppercase tracking-widest text-[var(--dc-color-text-secondary)] mb-2"
            >
              Book Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your working title?"
              className="w-full px-4 py-3 rounded-lg border border-[var(--dc-color-border-default)] bg-[var(--dc-color-surface-primary)] text-[var(--dc-color-text-primary)]
                         placeholder:text-[var(--dc-color-text-placeholder)]
                         focus:outline-none focus:ring-2 focus:ring-[var(--dc-color-border-focus)] focus:border-transparent
                         transition-all"
              maxLength={500}
              autoFocus
              aria-describedby="title-help"
            />
            <div className="flex justify-between items-center mt-1">
              <p id="title-help" className="text-sm text-[var(--dc-color-text-muted)]">
                This is a working title. You can change it anytime.
              </p>
              {titleLength > 400 && (
                <span
                  className={`text-sm tabular-nums ${titleLength > 500 ? 'text-[var(--dc-color-status-error)]' : 'text-[var(--dc-color-status-warning)]'}`}
                >
                  {titleLength}/500
                </span>
              )}
            </div>
          </div>

          {/* Description field */}
          <div>
            <label
              htmlFor="description"
              className="block text-xs font-medium uppercase tracking-widest text-[var(--dc-color-text-secondary)] mb-2"
            >
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A sentence or two about your book (optional)."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-[var(--dc-color-border-default)] bg-[var(--dc-color-surface-primary)] text-[var(--dc-color-text-primary)]
                         placeholder:text-[var(--dc-color-text-placeholder)]
                         focus:outline-none focus:ring-2 focus:ring-[var(--dc-color-border-focus)] focus:border-transparent
                         transition-all resize-none"
              maxLength={1000}
            />
            {descriptionLength > 800 && (
              <div className="flex justify-end mt-1">
                <span
                  className={`text-sm tabular-nums ${descriptionLength > 1000 ? 'text-[var(--dc-color-status-error)]' : 'text-[var(--dc-color-status-warning)]'}`}
                >
                  {descriptionLength}/1000
                </span>
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="p-3 rounded-lg bg-[var(--dc-color-interactive-destructive-subtle)] border border-[var(--dc-color-interactive-destructive-subtle)] text-[var(--dc-color-interactive-destructive)] text-sm"
            >
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full h-12 rounded-lg bg-[var(--dc-color-interactive-primary)] text-[var(--dc-color-text-inverse)] font-medium
                       hover:bg-[var(--dc-color-interactive-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--dc-color-border-focus)] focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all"
          >
            {isSubmitting ? 'Creating...' : 'Create Book \u2192'}
          </button>
        </form>

        {/* Decorative divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--dc-color-border-default)]" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[var(--dc-color-surface-primary)] px-3">
              <svg
                className="h-5 w-5 text-[var(--dc-color-text-placeholder)]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zM21 18.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
              </svg>
            </span>
          </div>
        </div>

        {/* Google Drive connection prompt */}
        {showDrivePrompt && (
          <div className="border border-[var(--dc-color-border-default)] rounded-xl p-5">
            <div className="flex items-start gap-4">
              <svg
                className="h-7 w-7 shrink-0 text-[var(--dc-color-interactive-primary)] mt-0.5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[var(--dc-color-text-primary)]">
                  Keep your book safe
                </p>
                <p className="text-sm text-[var(--dc-color-text-muted)] mt-0.5">
                  Connect your Google Drive to auto-save every draft and source material in
                  real-time.
                </p>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <button
                  type="button"
                  onClick={() => connectDrive()}
                  className="px-5 py-2 rounded-lg border border-[var(--dc-color-border-strong)] text-sm font-medium text-[var(--dc-color-text-secondary)]
                             hover:bg-[var(--dc-color-surface-tertiary)] transition-colors min-h-[36px]"
                >
                  Connect
                </button>
                <button
                  type="button"
                  onClick={() => setDriveDismissed(true)}
                  className="text-xs text-[var(--dc-color-text-placeholder)] underline mt-2 hover:text-[var(--dc-color-text-muted)] transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
