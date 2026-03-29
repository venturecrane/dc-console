'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDropdown } from '@/hooks/use-dropdown'
import type { ViewMode } from './workspace-toggle'

interface Chapter {
  id: string
  title: string
  wordCount?: number
}

interface Project {
  id: string
  title: string
  wordCount: number
}

interface BreadcrumbNavProps {
  /** Current project */
  currentProject: Project
  /** All available projects for switching */
  projects: Project[]
  /** Chapters in the current project */
  chapters: Chapter[]
  /** Currently active chapter ID */
  activeChapterId: string | null
  /** Current view mode */
  viewMode: ViewMode
  /** Switch to a chapter or book view */
  onChapterSelect: (chapterId: string) => void
  /** Switch view mode */
  onViewModeChange: (mode: ViewMode) => void
}

/**
 * BreadcrumbNav — Hierarchical navigation showing Book > Chapter.
 *
 * Replaces ProjectSwitcher + WorkspaceToggle with a single breadcrumb
 * that makes the book→chapter hierarchy visible and tappable.
 *
 * Tap the book title → popover with chapter list + project switcher.
 * Tap a chapter → drills into that chapter.
 */
export function BreadcrumbNav({
  currentProject,
  projects,
  chapters,
  activeChapterId,
  viewMode,
  onChapterSelect,
  onViewModeChange,
}: BreadcrumbNavProps) {
  const router = useRouter()
  const { isOpen, ref: dropdownRef, toggle, close } = useDropdown()

  const activeChapter = chapters.find((ch) => ch.id === activeChapterId)

  function handleChapterSelect(chapterId: string) {
    close()
    onChapterSelect(chapterId)
    onViewModeChange('chapter')
  }

  function handleBookView() {
    close()
    onViewModeChange('book')
  }

  function handleProjectSwitch(projectId: string) {
    close()
    if (projectId !== currentProject.id) {
      router.push(`/editor/${projectId}`)
    }
  }

  return (
    <div className="relative flex items-center min-w-0" ref={dropdownRef}>
      {/* Breadcrumb trigger — book title with chevron */}
      <button
        onClick={toggle}
        className="flex items-center gap-1.5 h-11 px-2 rounded-lg hover:bg-[var(--dc-color-surface-tertiary)] transition-colors min-w-0"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Book navigation"
      >
        {/* Book title */}
        <span className="text-sm font-semibold text-[var(--dc-color-text-primary)] truncate max-w-[200px]">
          {currentProject.title}
        </span>

        {/* Chevron */}
        <svg
          className={`w-3 h-3 text-[var(--dc-color-text-muted)] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Separator + chapter name */}
      {viewMode === 'chapter' && activeChapter ? (
        <div className="flex items-center gap-1.5 min-w-0 ml-0.5">
          <span className="text-sm text-[var(--dc-color-text-placeholder)]" aria-hidden="true">
            /
          </span>
          <span className="text-sm text-[var(--dc-color-text-secondary)] truncate max-w-[240px]">
            {activeChapter.title}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 min-w-0 ml-0.5">
          <span className="text-sm text-[var(--dc-color-text-placeholder)]" aria-hidden="true">
            /
          </span>
          <span className="text-sm text-[var(--dc-color-text-placeholder)] italic">
            Book Outline
          </span>
        </div>
      )}

      {/* Popover */}
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 w-72 bg-[var(--dc-color-surface-primary)] border border-[var(--dc-color-border-default)] rounded-lg shadow-lg z-50 py-1 max-h-[70vh] overflow-y-auto"
          role="menu"
          aria-label="Book navigation"
        >
          {/* Book outline (zoom out) */}
          <button
            onClick={handleBookView}
            className={`w-full px-4 py-2.5 text-left flex items-center gap-2 min-h-[44px]
                       hover:bg-[var(--dc-color-surface-secondary)] transition-colors
                       ${viewMode === 'book' ? 'bg-[var(--dc-color-interactive-primary-subtle)]' : ''}`}
            role="menuitem"
          >
            <svg
              className="w-4 h-4 text-[var(--dc-color-text-muted)] shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
            <span className="text-sm font-medium text-[var(--dc-color-text-primary)]">
              Book Outline
            </span>
            {viewMode === 'book' && (
              <svg
                className="ml-auto w-4 h-4 text-[var(--dc-color-interactive-primary)] shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>

          {/* Chapter list */}
          {chapters.length > 0 && (
            <>
              <div className="px-4 py-1.5">
                <span className="text-[10px] font-medium text-[var(--dc-color-text-placeholder)] uppercase tracking-wider">
                  Chapters
                </span>
              </div>
              {chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => handleChapterSelect(chapter.id)}
                  className={`w-full px-4 py-2 text-left flex items-center gap-2 min-h-[44px]
                             hover:bg-[var(--dc-color-surface-secondary)] transition-colors
                             ${chapter.id === activeChapterId && viewMode === 'chapter' ? 'bg-[var(--dc-color-interactive-primary-subtle)]' : ''}`}
                  role="menuitem"
                >
                  <span className="text-sm text-[var(--dc-color-text-secondary)] truncate flex-1">
                    {chapter.title}
                  </span>
                  {chapter.wordCount !== undefined && (
                    <span className="text-[10px] text-[var(--dc-color-text-placeholder)] tabular-nums shrink-0">
                      {chapter.wordCount.toLocaleString()}w
                    </span>
                  )}
                  {chapter.id === activeChapterId && viewMode === 'chapter' && (
                    <svg
                      className="w-4 h-4 text-[var(--dc-color-interactive-primary)] shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </>
          )}

          {/* Other projects */}
          {projects.length > 1 && (
            <>
              <div
                className="my-1 border-t border-[var(--dc-color-border-default)]"
                role="separator"
              />
              <div className="px-4 py-1.5">
                <span className="text-[10px] font-medium text-[var(--dc-color-text-placeholder)] uppercase tracking-wider">
                  Other Books
                </span>
              </div>
              {projects
                .filter((p) => p.id !== currentProject.id)
                .map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleProjectSwitch(project.id)}
                    className="w-full px-4 py-2 text-left flex items-center gap-2 min-h-[44px]
                               hover:bg-[var(--dc-color-surface-secondary)] transition-colors"
                    role="menuitem"
                  >
                    <span className="text-sm text-[var(--dc-color-text-muted)] truncate flex-1">
                      {project.title}
                    </span>
                    <span className="text-[10px] text-[var(--dc-color-text-placeholder)] tabular-nums shrink-0">
                      {project.wordCount.toLocaleString()}w
                    </span>
                  </button>
                ))}
            </>
          )}

          {/* New Book link */}
          <div className="my-1 border-t border-[var(--dc-color-border-default)]" role="separator" />
          <Link
            href="/setup"
            onClick={close}
            className="w-full px-4 py-2.5 text-left flex items-center gap-2 min-h-[44px]
                       hover:bg-[var(--dc-color-surface-secondary)] transition-colors text-[var(--dc-color-interactive-primary)]"
            role="menuitem"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-sm font-medium">New Book</span>
          </Link>
        </div>
      )}
    </div>
  )
}
