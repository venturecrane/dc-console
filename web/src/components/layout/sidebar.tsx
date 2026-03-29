'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useFocusTrap } from '@/hooks/use-focus-trap'
import { useDelayedUnmount } from '@/hooks/use-delayed-unmount'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DraggableSyntheticListeners,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

/**
 * Chapter data structure
 */
export interface ChapterData {
  id: string
  title: string
  wordCount: number
  sortOrder: number
}

/**
 * Sidebar props
 */
export interface SidebarProps {
  /** List of chapters */
  chapters: ChapterData[]
  /** Currently active chapter ID */
  activeChapterId?: string
  /** Callback when a chapter is selected */
  onChapterSelect?: (chapterId: string) => void
  /** Callback when "+" button is clicked to add a new chapter */
  onAddChapter?: () => void
  /** Callback when delete is requested for a chapter */
  onDeleteChapter?: (chapterId: string) => void
  /** Callback when a chapter is renamed via double-tap inline editing (US-013) */
  onChapterRename?: (chapterId: string, newTitle: string) => void
  /** Callback when chapters are reordered via drag-and-drop (US-012A) */
  onChapterReorder?: (chapterIds: string[]) => void
  /** Total word count across all chapters */
  totalWordCount?: number
  /** Real-time word count for the active chapter (overrides stored value) */
  activeChapterWordCount?: number
  /** Whether the sidebar is collapsed (for responsive) */
  collapsed?: boolean
  /** Callback to toggle collapsed state */
  onToggleCollapsed?: () => void
}

/**
 * Sidebar Component - Basic Shell
 *
 * Per PRD Section 9 (Writing Environment Layout):
 * - Chapter list with titles
 * - Word counts per chapter (muted text)
 * - "+" button for new chapter
 * - Total word count at bottom
 *
 * Per PRD Section 14 (iPad-First Design):
 * - Touch targets minimum 44x44pt
 * - Chapter list items: full-width, min 48pt tall
 *
 * Per PRD Section 9 (Sidebar Responsive Behavior):
 * - iPad Landscape (1024pt+): Persistent, 240-280pt wide, collapsible
 * - iPad Portrait (768pt): Hidden by default (breadcrumb nav handles chapter switching)
 * - Desktop (1200pt+): Persistent
 *
 * Per PRD US-013 (Rename Chapter):
 * - Double-tap on chapter title enables inline editing
 * - Max 200 characters
 * - Empty title reverts to "Untitled Chapter"
 *
 * Per PRD US-012A (Reorder Chapters):
 * - Long-press-and-drag to reorder chapters
 * - Visual feedback during drag (ghost/placeholder)
 * - Keyboard alternative: Ctrl+Up / Ctrl+Down
 * - Works with touch on iPad Safari
 */
export function Sidebar({
  chapters,
  activeChapterId,
  onChapterSelect,
  onAddChapter,
  onDeleteChapter,
  onChapterRename,
  onChapterReorder,
  totalWordCount = 0,
  activeChapterWordCount,
  collapsed = false,
  onToggleCollapsed,
}: SidebarProps) {
  const sortedChapters = [...chapters].sort((a, b) => a.sortOrder - b.sortOrder)

  // Track which chapter is being renamed inline
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null)

  // Track the currently dragged chapter for DragOverlay
  const [dragActiveId, setDragActiveId] = useState<string | null>(null)

  // Compute the effective total word count using the real-time active chapter word count
  const effectiveTotalWordCount =
    activeChapterWordCount !== undefined && activeChapterId
      ? totalWordCount -
        (chapters.find((ch) => ch.id === activeChapterId)?.wordCount ?? 0) +
        activeChapterWordCount
      : totalWordCount

  // Format word count with comma separators
  const formatWordCount = (count: number): string => {
    return count.toLocaleString()
  }

  const handleRenameStart = useCallback((chapterId: string) => {
    setEditingChapterId(chapterId)
  }, [])

  const handleRenameEnd = useCallback(
    (chapterId: string, newTitle: string) => {
      setEditingChapterId(null)
      const trimmed = newTitle.trim()
      const finalTitle = trimmed || 'Untitled Chapter'
      // Find original title to avoid no-op API calls
      const chapter = chapters.find((ch) => ch.id === chapterId)
      if (chapter && finalTitle !== chapter.title) {
        onChapterRename?.(chapterId, finalTitle)
      }
    },
    [chapters, onChapterRename]
  )

  const handleRenameCancel = useCallback(() => {
    setEditingChapterId(null)
  }, [])

  // DnD sensors: touch (long press for iPad) + pointer (desktop) + keyboard
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 5 },
  })
  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
  const sensors = useSensors(pointerSensor, touchSensor, keyboardSensor)

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setDragActiveId(event.active.id as string)
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setDragActiveId(null)
      const { active, over } = event
      if (!over || active.id === over.id) return

      const oldIndex = sortedChapters.findIndex((ch) => ch.id === active.id)
      const newIndex = sortedChapters.findIndex((ch) => ch.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return

      // Compute the new order
      const reordered = [...sortedChapters]
      const [moved] = reordered.splice(oldIndex, 1)
      reordered.splice(newIndex, 0, moved)

      onChapterReorder?.(reordered.map((ch) => ch.id))
    },
    [sortedChapters, onChapterReorder]
  )

  const handleDragCancel = useCallback(() => {
    setDragActiveId(null)
  }, [])

  // Keyboard shortcut: Ctrl+ArrowUp / Ctrl+ArrowDown to move the active chapter
  useEffect(() => {
    if (!onChapterReorder || !activeChapterId) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) return
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return

      // Only respond when focus is within the sidebar or the body
      const target = e.target as HTMLElement
      const sidebar = target.closest('[aria-label="Chapter navigation"]')
      if (!sidebar) return

      e.preventDefault()

      const currentIndex = sortedChapters.findIndex((ch) => ch.id === activeChapterId)
      if (currentIndex === -1) return

      const newIndex = e.key === 'ArrowUp' ? currentIndex - 1 : currentIndex + 1
      if (newIndex < 0 || newIndex >= sortedChapters.length) return

      const reordered = [...sortedChapters]
      const [moved] = reordered.splice(currentIndex, 1)
      reordered.splice(newIndex, 0, moved)

      onChapterReorder(reordered.map((ch) => ch.id))
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onChapterReorder, activeChapterId, sortedChapters])

  if (collapsed) {
    // Breadcrumb nav in the toolbar now handles chapter indication and switching.
    // No pill needed — return nothing when collapsed.
    return null
  }

  // Find the dragged chapter for overlay rendering
  const draggedChapter = dragActiveId ? sortedChapters.find((ch) => ch.id === dragActiveId) : null

  return (
    <aside
      className="flex flex-col h-full w-[260px] min-w-[240px] max-w-[280px]
                 bg-[var(--dc-color-surface-secondary)] border-r border-[var(--dc-color-border-default)]"
      role="navigation"
      aria-label="Chapter navigation"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--dc-color-border-default)]">
        <h2 className="text-sm font-semibold text-[var(--dc-color-text-primary)]">Chapters</h2>
        <button
          onClick={onToggleCollapsed}
          className="p-2 rounded-lg hover:bg-[var(--dc-color-surface-tertiary)]
                     focus:outline-none focus:ring-2 focus:ring-[var(--dc-color-border-focus)]
                     transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Collapse sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[var(--dc-color-text-muted)]"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      {/* Chapter list with drag-and-drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={sortedChapters.map((ch) => ch.id)}
          strategy={verticalListSortingStrategy}
        >
          <nav className="flex-1 overflow-y-auto py-2" role="list" aria-label="Chapter list">
            {sortedChapters.map((chapter) => {
              const isActive = chapter.id === activeChapterId
              const displayWordCount =
                isActive && activeChapterWordCount !== undefined
                  ? activeChapterWordCount
                  : chapter.wordCount
              const isEditing = editingChapterId === chapter.id
              const canDelete = sortedChapters.length > 1

              return (
                <SortableChapterItem
                  key={chapter.id}
                  chapter={chapter}
                  isActive={isActive}
                  isEditing={isEditing}
                  canDelete={canDelete}
                  displayWordCount={displayWordCount}
                  formatWordCount={formatWordCount}
                  onSelect={() => onChapterSelect?.(chapter.id)}
                  onRenameStart={() => handleRenameStart(chapter.id)}
                  onRenameEnd={(newTitle) => handleRenameEnd(chapter.id, newTitle)}
                  onRenameCancel={handleRenameCancel}
                  onDelete={onDeleteChapter ? () => onDeleteChapter(chapter.id) : undefined}
                  isDragOverlay={false}
                />
              )
            })}
          </nav>
        </SortableContext>

        {/* Drag overlay - rendered outside the list for smooth visual feedback */}
        <DragOverlay>
          {draggedChapter ? (
            <ChapterListItem
              chapter={draggedChapter}
              isActive={draggedChapter.id === activeChapterId}
              isEditing={false}
              canDelete={false}
              displayWordCount={
                draggedChapter.id === activeChapterId && activeChapterWordCount !== undefined
                  ? activeChapterWordCount
                  : draggedChapter.wordCount
              }
              formatWordCount={formatWordCount}
              onSelect={() => {}}
              onRenameStart={() => {}}
              onRenameEnd={() => {}}
              onRenameCancel={() => {}}
              isDragOverlay={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Add chapter button */}
      <div className="px-4 py-2 border-t border-[var(--dc-color-border-default)]">
        <button
          onClick={onAddChapter}
          className="w-full py-3 px-4 rounded-lg border border-dashed border-[var(--dc-color-border-strong)]
                     text-[var(--dc-color-text-muted)] hover:border-[var(--dc-color-interactive-primary)] hover:text-[var(--dc-color-interactive-primary)]
                     focus:outline-none focus:ring-2 focus:ring-[var(--dc-color-border-focus)]
                     transition-colors flex items-center justify-center gap-2
                     min-h-[48px]"
          aria-label="Add new chapter"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="text-sm">Add Chapter</span>
        </button>
      </div>

      {/* Total word count */}
      <div className="px-4 py-3 border-t border-[var(--dc-color-border-default)] bg-[var(--dc-color-surface-tertiary)]">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--dc-color-text-muted)]">Total</span>
          <span className="font-medium text-[var(--dc-color-text-primary)] tabular-nums">
            {formatWordCount(effectiveTotalWordCount)} words
          </span>
        </div>
      </div>
    </aside>
  )
}

/**
 * Sortable wrapper for ChapterListItem using @dnd-kit/sortable.
 * Provides transform/transition styles and drag handle attributes.
 */
function SortableChapterItem(props: ChapterListItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props.chapter.id,
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <ChapterListItem {...props} dragListeners={listeners} />
    </div>
  )
}

/**
 * Props for ChapterListItem (extracted for reuse in SortableChapterItem)
 */
interface ChapterListItemProps {
  chapter: ChapterData
  isActive: boolean
  isEditing: boolean
  canDelete: boolean
  displayWordCount: number
  formatWordCount: (count: number) => string
  onSelect: () => void
  onRenameStart: () => void
  onRenameEnd: (newTitle: string) => void
  onRenameCancel: () => void
  onDelete?: () => void
  isDragOverlay: boolean
  dragListeners?: DraggableSyntheticListeners
}

/**
 * Individual chapter list item with double-tap rename support.
 *
 * Per PRD US-013:
 * - Double-tap (double-click) on a chapter title enables inline editing
 * - Single tap selects the chapter
 * - Max 200 characters for title
 * - Empty title reverts to "Untitled Chapter"
 * - Enter commits the rename, Escape cancels
 *
 * Per PRD US-012A:
 * - Drag handle (grip dots) for reorder via drag-and-drop
 * - Visual feedback: shadow and slight scale on drag overlay
 */
function ChapterListItem({
  chapter,
  isActive,
  isEditing,
  canDelete,
  displayWordCount,
  formatWordCount,
  onSelect,
  onRenameStart,
  onRenameEnd,
  onRenameCancel,
  onDelete,
  isDragOverlay,
  dragListeners,
}: ChapterListItemProps) {
  if (isEditing) {
    return (
      <InlineRenameInput
        initialTitle={chapter.title}
        isActive={isActive}
        displayWordCount={displayWordCount}
        formatWordCount={formatWordCount}
        onCommit={onRenameEnd}
        onCancel={onRenameCancel}
      />
    )
  }

  return (
    <div
      className={`group w-full flex items-center min-h-[48px] transition-colors
                 ${isActive ? 'bg-[var(--dc-color-interactive-primary-subtle)] text-[var(--dc-color-interactive-primary-on-subtle)]' : 'hover:bg-[var(--dc-color-surface-tertiary)] text-[var(--dc-color-text-primary)]'}
                 ${isDragOverlay ? 'shadow-lg rounded-lg bg-[var(--dc-color-surface-primary)] border border-[var(--dc-color-interactive-primary-border)]' : ''}`}
      role="listitem"
    >
      {/* Drag handle */}
      <button
        className="flex items-center justify-center w-6 shrink-0 ml-1 cursor-grab
                   text-[var(--dc-color-text-muted)] hover:text-[var(--dc-color-text-primary)] transition-colors
                   touch-none select-none"
        aria-label={`Drag to reorder ${chapter.title || 'Untitled Chapter'}`}
        tabIndex={-1}
        {...dragListeners}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="9" cy="5" r="2" />
          <circle cx="15" cy="5" r="2" />
          <circle cx="9" cy="12" r="2" />
          <circle cx="15" cy="12" r="2" />
          <circle cx="9" cy="19" r="2" />
          <circle cx="15" cy="19" r="2" />
        </svg>
      </button>

      <button
        onClick={onSelect}
        onDoubleClick={(e) => {
          e.preventDefault()
          onRenameStart()
        }}
        className="flex-1 px-2 py-3 text-left flex items-center justify-between min-w-0
                   focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--dc-color-border-focus)]"
        aria-current={isActive ? 'page' : undefined}
        aria-label={`${chapter.title || 'Untitled Chapter'}, ${formatWordCount(displayWordCount)} words. Double-tap to rename.`}
      >
        <div className="flex-1 min-w-0">
          <span className="block truncate text-sm font-medium">
            {chapter.title || 'Untitled Chapter'}
          </span>
        </div>
        <span
          className={`ml-2 text-xs tabular-nums ${
            isActive
              ? 'text-[var(--dc-color-interactive-primary-hover)]'
              : 'text-[var(--dc-color-text-muted)]'
          }`}
        >
          {formatWordCount(displayWordCount)}w
        </span>
      </button>

      {/* Delete button - visible on hover/focus, only when more than 1 chapter */}
      {canDelete && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="mr-2 p-1.5 rounded opacity-0 group-hover:opacity-100 focus:opacity-100
                     hover:bg-[var(--dc-color-interactive-destructive-subtle)] text-[var(--dc-color-text-muted)]
                     hover:text-[var(--dc-color-interactive-destructive)] transition-all
                     focus:outline-none focus:ring-2 focus:ring-[var(--dc-color-interactive-destructive)]
                     min-w-[32px] min-h-[32px] flex items-center justify-center shrink-0"
          aria-label={`Delete ${chapter.title || 'Untitled Chapter'}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      )}
    </div>
  )
}

/**
 * Inline rename input for chapter titles in the sidebar.
 * Mounted only when editing, so initial state is naturally correct.
 * Auto-focuses and selects all text on mount.
 */
function InlineRenameInput({
  initialTitle,
  isActive,
  displayWordCount,
  formatWordCount,
  onCommit,
  onCancel,
}: {
  initialTitle: string
  isActive: boolean
  displayWordCount: number
  formatWordCount: (count: number) => string
  onCommit: (newTitle: string) => void
  onCancel: () => void
}) {
  const [editValue, setEditValue] = useState(initialTitle)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus and select on mount
  useEffect(() => {
    requestAnimationFrame(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    })
  }, [])

  const handleCommit = useCallback(() => {
    onCommit(editValue)
  }, [editValue, onCommit])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleCommit()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onCancel()
      }
    },
    [handleCommit, onCancel]
  )

  return (
    <div
      className={`w-full px-4 py-3 flex items-center justify-between
                 min-h-[48px] transition-colors
                 ${isActive ? 'bg-[var(--dc-color-interactive-primary-subtle)] text-[var(--dc-color-interactive-primary-on-subtle)]' : 'bg-[var(--dc-color-surface-tertiary)] text-[var(--dc-color-text-primary)]'}`}
      role="listitem"
    >
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleCommit}
        onKeyDown={handleKeyDown}
        maxLength={200}
        className="flex-1 min-w-0 text-sm font-medium bg-[var(--dc-color-surface-primary)]
                   border border-[var(--dc-color-interactive-primary)] rounded px-2 py-1 outline-none
                   focus:ring-2 focus:ring-[var(--dc-color-border-focus)]"
        aria-label="Chapter title"
      />
      <span
        className={`ml-2 text-xs tabular-nums shrink-0 ${
          isActive
            ? 'text-[var(--dc-color-interactive-primary-hover)]'
            : 'text-[var(--dc-color-text-muted)]'
        }`}
      >
        {formatWordCount(displayWordCount)}w
      </span>
    </div>
  )
}

/**
 * Mobile sidebar overlay component
 * Used when sidebar is shown as overlay in portrait mode
 *
 * Accessibility:
 * - role="dialog" + aria-modal for screen reader announcement
 * - Escape key closes the overlay
 * - Focus moves into the panel on open
 * - Focus returns to the trigger element on close
 * - Focus is trapped within the dialog while open
 */
export function SidebarOverlay({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  const panelRef = useFocusTrap({ isOpen, onEscape: onClose })
  const { shouldRender, isClosing } = useDelayedUnmount(isOpen, 200)

  if (!shouldRender) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-[var(--dc-color-surface-overlay)] ${isClosing ? 'sidebar-backdrop-fade-out' : 'sidebar-backdrop-fade-in'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar container */}
      <div
        ref={panelRef}
        className={`absolute left-0 top-0 bottom-0 w-[280px] max-w-[85vw] ${isClosing ? 'sidebar-overlay-slide-out' : 'sidebar-overlay-slide-in'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Chapter navigation"
      >
        {children}
      </div>
    </div>
  )
}

export default Sidebar
