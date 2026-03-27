'use client'

import type { ReactNode, ButtonHTMLAttributes } from 'react'

type ActionVariant = 'escalation' | 'primary'
type ButtonTier = 'primary' | 'secondary' | 'ghost'

interface PanelActionBarProps {
  children: ReactNode
  className?: string
}

interface PanelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tier: ButtonTier
  variant?: ActionVariant
  children: ReactNode
}

/**
 * PanelActionBar — Pinned-bottom container for panel action buttons.
 *
 * Shared across Chapter Editor, Desk Tab, and Book Editor panels.
 * Provides consistent border-top separator, padding, and flex layout.
 */
export function PanelActionBar({ children, className = '' }: PanelActionBarProps) {
  return (
    <div
      className={`px-4 py-3 border-t border-[var(--dc-color-border-default)] flex gap-2 shrink-0 ${className}`}
    >
      {children}
    </div>
  )
}

const primaryStyles: Record<ActionVariant, string> = {
  escalation:
    'bg-[var(--dc-color-interactive-escalation)] hover:bg-[var(--dc-color-interactive-escalation-hover)] text-[var(--dc-color-text-inverse)] border-none',
  primary:
    'bg-[var(--dc-color-interactive-primary)] hover:bg-[var(--dc-color-interactive-primary-hover)] text-[var(--dc-color-text-inverse)] border-none',
}

const secondaryStyles: Record<ActionVariant, string> = {
  escalation:
    'border border-[var(--dc-color-interactive-escalation-border)] text-[var(--dc-color-interactive-escalation)] hover:bg-[var(--dc-color-interactive-escalation-subtle)] bg-transparent',
  primary:
    'border border-[var(--dc-color-interactive-primary-border)] text-[var(--dc-color-interactive-primary)] hover:bg-[var(--dc-color-interactive-primary-subtle)] bg-transparent',
}

const ghostStyle =
  'border border-[var(--dc-color-border-strong)] text-[var(--dc-color-text-secondary)] hover:bg-[var(--dc-color-surface-secondary)] bg-transparent'

/**
 * PanelButton — Action button for use inside PanelActionBar.
 *
 * Three tiers:
 * - primary: accent fill, white text (e.g., "Use This", "Insert into Chapter")
 * - secondary: accent border, accent text (e.g., "Try Again", "Go Deeper")
 * - ghost: neutral border, neutral text (e.g., "Discard", "Copy", "Cancel")
 *
 * Variant controls accent color: "escalation" (violet) or "primary" (blue).
 * Ghost tier ignores variant.
 */
export function PanelButton({
  tier,
  variant = 'escalation',
  children,
  className = '',
  disabled,
  ...rest
}: PanelButtonProps) {
  const tierStyle =
    tier === 'primary'
      ? primaryStyles[variant]
      : tier === 'secondary'
        ? secondaryStyles[variant]
        : ghostStyle

  return (
    <button
      type="button"
      disabled={disabled}
      className={`flex-1 min-h-[44px] rounded-[var(--dc-radius-md)] text-sm font-medium
                  flex items-center justify-center transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${tierStyle} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
