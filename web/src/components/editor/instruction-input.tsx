'use client'

import { useCallback, type RefObject } from 'react'

type InputVariant = 'escalation' | 'primary'

interface InstructionInputProps {
  /** HTML id for the textarea (links to external label) */
  id: string
  /** Current instruction text */
  value: string
  /** Called when the user types */
  onChange: (value: string) => void
  /** Called when the user submits (Enter key or send button) */
  onSubmit: () => void
  /** Disable interaction during streaming */
  disabled?: boolean
  /** Accent color variant */
  variant?: InputVariant
  /** Placeholder text */
  placeholder?: string
  /** Number of visible rows */
  rows?: number
  /** Label text shown above the input */
  label?: string
  /** Ref forwarded to the underlying textarea */
  textareaRef?: RefObject<HTMLTextAreaElement | null>
}

const ringColors: Record<InputVariant, string> = {
  escalation: 'focus:ring-[var(--dc-color-interactive-escalation)]',
  primary: 'focus:ring-[var(--dc-color-interactive-primary)]',
}

const buttonColors: Record<InputVariant, string> = {
  escalation:
    'bg-[var(--dc-color-interactive-escalation)] hover:bg-[var(--dc-color-interactive-escalation-hover)]',
  primary:
    'bg-[var(--dc-color-interactive-primary)] hover:bg-[var(--dc-color-interactive-primary-hover)]',
}

/**
 * InstructionInput — Shared textarea + arrow-send-button for AI Assist panels.
 *
 * Used by Chapter Editor and Book Editor panels where Enter submits
 * (Shift+Enter inserts newline). The send button provides a 44px touch
 * target for iPad interaction.
 *
 * **Not for Desk Tab.** Desk Tab uses a decoupled instruction/action pattern:
 * its textarea allows multiline input without Enter-to-submit, and the submit
 * action is a separate "Analyze" button in the action bar.
 */
export function InstructionInput({
  id,
  value,
  onChange,
  onSubmit,
  disabled = false,
  variant = 'escalation',
  placeholder = 'Type an instruction...',
  rows = 2,
  label = 'Or write your own',
  textareaRef,
}: InstructionInputProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        onSubmit()
      }
    },
    [onSubmit]
  )

  return (
    <div>
      <label
        htmlFor={id}
        className="text-xs font-medium text-[var(--dc-color-text-muted)] mb-1.5 block"
      >
        {label}
      </label>
      <div className="flex gap-2">
        <textarea
          id={id}
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`flex-1 p-2.5 text-sm border border-[var(--dc-color-border-strong)] rounded-[var(--dc-radius-md)] resize-none
                     focus:outline-none focus:ring-2 ${ringColors[variant]} focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed
                     placeholder:text-[var(--dc-color-text-placeholder)]`}
          rows={rows}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className={`self-end shrink-0 flex items-center justify-center rounded-[var(--dc-radius-md)]
                     ${buttonColors[variant]} text-[var(--dc-color-text-inverse)]
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors min-h-[44px] min-w-[44px]`}
          aria-label="Send instruction"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
