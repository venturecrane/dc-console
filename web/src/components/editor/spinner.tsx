/**
 * Spinner — Shared animated loading indicator for AI Assist panels.
 *
 * Renders a spinning circle SVG with reduced-motion support.
 * Used in status headers during streaming state.
 */

const sizeClasses = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
} as const

interface SpinnerProps {
  size?: 'sm' | 'md'
  className?: string
}

export function Spinner({ size = 'sm', className = '' }: SpinnerProps) {
  return (
    <svg
      className={`animate-spin motion-reduce:animate-none ${sizeClasses[size]} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}
