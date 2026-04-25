'use client'

import { useEffect, useRef } from 'react'

/**
 * StreamingResponse — Reusable streaming text display with blinking cursor.
 *
 * Supports two accent variants:
 * - "escalation" (violet) — Editor zone (Chapter Editor, Book Editor)
 * - "primary" (blue) — Author zone (Desk Tab)
 *
 * ARIA: Uses aria-busy during streaming, aria-live="polite" for screen reader
 * announcements when content changes.
 */

type StreamingVariant = 'escalation' | 'primary'

interface StreamingResponseProps {
  /** The text content to display (grows during streaming) */
  text: string
  /** Whether content is currently streaming */
  isStreaming: boolean
  /** Error message to display instead of or alongside content */
  errorMessage?: string | null
  /** Color variant: "escalation" (violet) or "primary" (blue) */
  variant?: StreamingVariant
  /** Called when user taps the retry link in error state */
  onRetry?: () => void
  /** ARIA label for the container */
  ariaLabel?: string
  /** Optional className for the container */
  className?: string
}

const variantStyles: Record<
  StreamingVariant,
  { container: string; cursor: string; retry: string }
> = {
  escalation: {
    container:
      'bg-[var(--dc-color-interactive-escalation-subtle)] border-[var(--dc-color-interactive-escalation-border)]',
    cursor: 'bg-[var(--dc-color-interactive-escalation)]',
    retry: 'text-[var(--dc-color-interactive-escalation)]',
  },
  primary: {
    container:
      'bg-[var(--dc-color-interactive-primary-subtle)] border-[var(--dc-color-interactive-primary-border)]',
    cursor: 'bg-[var(--dc-color-interactive-primary)]',
    retry: 'text-[var(--dc-color-interactive-primary)]',
  },
}

export function StreamingResponse({
  text,
  isStreaming,
  errorMessage,
  variant = 'escalation',
  onRetry,
  ariaLabel = 'Result',
  className = '',
}: StreamingResponseProps) {
  const endRef = useRef<HTMLSpanElement>(null)
  const styles = variantStyles[variant]

  // Auto-scroll to bottom during streaming
  useEffect(() => {
    if (isStreaming && endRef.current?.scrollIntoView) {
      endRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [isStreaming, text])

  const hasText = text.length > 0
  const showErrorOnly = errorMessage && !hasText
  const showErrorInline = errorMessage && hasText

  return (
    <div
      className={`p-3 rounded-[var(--dc-radius-md)] text-sm leading-relaxed whitespace-pre-wrap min-h-[60px]
                  border ${styles.container}
                  text-[var(--dc-color-text-secondary)] ${className}`}
      role="region"
      aria-label={ariaLabel}
      aria-busy={isStreaming}
      aria-live="polite"
    >
      {showErrorOnly ? (
        <div className="bg-[var(--dc-color-status-error-bg)] border border-[var(--dc-color-status-error)]/20 rounded-[var(--dc-radius-md)] p-3 -m-0.5">
          <span className="text-[var(--dc-color-status-error)] text-xs leading-relaxed">
            {errorMessage}
          </span>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className={`mt-2 text-xs font-medium ${styles.retry} flex items-center gap-1 min-h-[32px]`}
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Tap to retry
            </button>
          )}
        </div>
      ) : (
        <>
          {text}
          {isStreaming && (
            <span
              ref={endRef}
              className={`inline-block w-0.5 h-4 ml-0.5 align-text-bottom editor-cursor-blink ${styles.cursor}`}
              aria-hidden="true"
            />
          )}
          {showErrorInline && (
            <div className="mt-3 bg-[var(--dc-color-status-error-bg)] border border-[var(--dc-color-status-error)]/20 rounded-[var(--dc-radius-md)] p-3">
              <span className="text-[var(--dc-color-status-error)] text-xs leading-relaxed">
                {errorMessage}
              </span>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className={`mt-2 text-xs font-medium ${styles.retry} flex items-center gap-1 min-h-[32px]`}
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Tap to retry
                </button>
              )}
            </div>
          )}
        </>
      )}
      {isStreaming && !hasText && !errorMessage && (
        <span
          ref={endRef}
          className={`inline-block w-0.5 h-4 editor-cursor-blink ${styles.cursor}`}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
