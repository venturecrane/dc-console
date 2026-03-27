import type { ReactNode } from 'react'

type StatusVariant = 'escalation' | 'primary'

interface PanelStatusHeaderProps {
  /** Pre-computed label (e.g. "Rewriting...", "Analysis complete.") */
  label: string
  /** Show error styling (red text) instead of variant color */
  isError?: boolean
  /** Accent color variant */
  variant: StatusVariant
  /** Optional right-side content (spinner during streaming, attempt counter, etc.) */
  right?: ReactNode
}

const variantColors: Record<StatusVariant, string> = {
  escalation: 'text-[var(--dc-color-interactive-escalation)]',
  primary: 'text-[var(--dc-color-interactive-primary)]',
}

/**
 * PanelStatusHeader — Shared status header for AI Assist streaming/complete/error states.
 *
 * Layout: label on left, optional content on right. Consumer owns all label
 * logic (attempt-aware text, contextual messages). This component is a
 * layout primitive, not a state machine.
 */
export function PanelStatusHeader({
  label,
  isError = false,
  variant,
  right,
}: PanelStatusHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-2">
      <h3
        className={`text-xs font-medium ${
          isError ? 'text-[var(--dc-color-status-error)]' : variantColors[variant]
        }`}
      >
        {label}
      </h3>
      {right}
    </div>
  )
}
