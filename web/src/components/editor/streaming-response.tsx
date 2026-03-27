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
        <div>
          <span className="text-[var(--dc-color-status-error)] text-xs">{errorMessage}</span>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className={`block mt-1 text-xs ${styles.retry}`}
            >
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
            <div className="mt-3">
              <span className="text-[var(--dc-color-status-error)] text-xs">{errorMessage}</span>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className={`block mt-1 text-xs ${styles.retry}`}
                >
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
