'use client'

import type { DraggableSyntheticListeners } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export interface ChapterCardData {
  id: string
  title: string
  wordCount: number
  sortOrder: number
  status: string
}

interface ChapterCardProps {
  chapter: ChapterCardData
  onSelect: () => void
  isDragOverlay?: boolean
  dragListeners?: DraggableSyntheticListeners
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-[var(--dc-color-status-warning)]',
  review: 'bg-[var(--dc-color-interactive-primary)]',
  complete: 'bg-emerald-400',
  'needs-work': 'bg-[var(--dc-color-status-error)]',
}

/**
 * ChapterCard - Individual card in the Book Outline view.
 *
 * Displays chapter title (Lora serif, 20px, weight 600), word count
 * with tabular-nums, and a status dot. Cards are 88px min-height
 * and use design tokens from globals.css.
 */
function ChapterCard({
  chapter,
  onSelect,
  isDragOverlay = false,
  dragListeners,
}: ChapterCardProps) {
  const statusColor = STATUS_COLORS[chapter.status] ?? STATUS_COLORS.draft

  return (
    <div
      className={`group flex items-stretch min-h-[88px] rounded-lg border
                 transition-shadow
                 ${isDragOverlay ? 'shadow-lg border-[var(--dc-color-interactive-primary-border)] bg-[var(--dc-color-surface-primary)]' : 'border-[var(--dc-color-border-default)] bg-[var(--dc-color-surface-primary)] hover:shadow-[var(--dc-shadow-md)]'}`}
      role="option"
      aria-selected={false}
      aria-label={`${chapter.title || 'Untitled Chapter'}, ${chapter.wordCount.toLocaleString()} words, ${chapter.status}`}
    >
      {/* Drag handle */}
      <button
        className="flex items-center justify-center w-10 shrink-0 cursor-grab
                   text-[var(--dc-color-text-muted)] hover:text-[var(--dc-color-text-secondary)]
                   transition-colors touch-none select-none rounded-l-lg"
        aria-label={`Drag to reorder ${chapter.title || 'Untitled Chapter'}`}
        tabIndex={-1}
        {...dragListeners}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <circle cx="9" cy="5" r="2" />
          <circle cx="15" cy="5" r="2" />
          <circle cx="9" cy="12" r="2" />
          <circle cx="15" cy="12" r="2" />
          <circle cx="9" cy="19" r="2" />
          <circle cx="15" cy="19" r="2" />
        </svg>
      </button>

      {/* Card content — clickable to navigate */}
      <button
        onClick={onSelect}
        className="flex-1 min-w-0 px-4 py-3 text-left
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dc-color-border-focus)] focus-visible:ring-inset
                   rounded-r-lg"
      >
        <div className="flex items-start justify-between gap-3">
          <h3
            className="font-[var(--dc-font-serif)] text-[var(--dc-text-xl)] font-semibold leading-[var(--dc-leading-snug)]
                       text-[var(--dc-color-text-primary)] truncate"
          >
            {chapter.title || 'Untitled Chapter'}
          </h3>

          {/* Status dot */}
          <span
            className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${statusColor}`}
            aria-label={`Status: ${chapter.status}`}
          />
        </div>

        <div className="mt-1 text-[var(--dc-text-sm)] text-[var(--dc-color-text-muted)] tabular-nums">
          {chapter.wordCount.toLocaleString()} words
        </div>
      </button>
    </div>
  )
}

/**
 * SortableChapterCard — wraps ChapterCard with @dnd-kit/sortable for drag-to-reorder.
 */
export function SortableChapterCard({
  chapter,
  onSelect,
}: {
  chapter: ChapterCardData
  onSelect: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: chapter.id,
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <ChapterCard chapter={chapter} onSelect={onSelect} dragListeners={listeners} />
    </div>
  )
}

export { ChapterCard }
