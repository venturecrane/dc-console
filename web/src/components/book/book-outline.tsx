'use client'

import { useCallback, useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { SortableChapterCard, ChapterCard, type ChapterCardData } from './chapter-card'

interface BookOutlineProps {
  chapters: ChapterCardData[]
  onChapterReorder: (chapterIds: string[]) => void
  onChapterSelect: (chapterId: string) => void
  onViewModeChange: (mode: 'chapter' | 'book') => void
}

/**
 * BookOutline - Full chapter list rendered in the center area when viewMode === 'book'.
 *
 * Uses @dnd-kit for drag-to-reorder following the same pattern as the sidebar.
 * Sensors: PointerSensor (distance:8), TouchSensor (delay:250), KeyboardSensor.
 * On card click, switches to chapter view and selects that chapter.
 */
export function BookOutline({
  chapters,
  onChapterReorder,
  onChapterSelect,
  onViewModeChange,
}: BookOutlineProps) {
  const sortedChapters = [...chapters].sort((a, b) => a.sortOrder - b.sortOrder)
  const [dragActiveId, setDragActiveId] = useState<string | null>(null)

  // DnD sensors — same config as sidebar
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

      const reordered = [...sortedChapters]
      const [moved] = reordered.splice(oldIndex, 1)
      reordered.splice(newIndex, 0, moved)

      onChapterReorder(reordered.map((ch) => ch.id))
    },
    [sortedChapters, onChapterReorder]
  )

  const handleDragCancel = useCallback(() => {
    setDragActiveId(null)
  }, [])

  const handleCardSelect = useCallback(
    (chapterId: string) => {
      onViewModeChange('chapter')
      onChapterSelect(chapterId)
    },
    [onViewModeChange, onChapterSelect]
  )

  const draggedChapter = dragActiveId ? sortedChapters.find((ch) => ch.id === dragActiveId) : null

  return (
    <div
      className="flex-1 overflow-auto"
      id="writing-area"
      tabIndex={-1}
      style={{ outline: 'none' }}
    >
      <div className="max-w-[700px] mx-auto px-6 py-8">
        <h2 className="font-[var(--dc-font-serif)] text-[var(--dc-text-2xl)] font-semibold text-[var(--dc-color-text-primary)] mb-6">
          Book Outline
        </h2>

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
            <div role="listbox" aria-label="Chapter list" className="flex flex-col gap-3">
              {sortedChapters.map((chapter) => (
                <SortableChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  onSelect={() => handleCardSelect(chapter.id)}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {draggedChapter ? (
              <ChapterCard chapter={draggedChapter} onSelect={() => {}} isDragOverlay />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}
