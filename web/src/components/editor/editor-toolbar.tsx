'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ProjectData } from '@/types/editor'
import type { SaveStatus } from '@/hooks/use-auto-save'
import type { ProjectSummary } from '@/hooks/use-project-actions'
import { SaveIndicator } from './save-indicator'
import { ExportMenu } from '@/components/project/export-menu'
import { SettingsMenu } from '@/components/project/settings-menu'
import { useSourcesContext } from '@/contexts/sources-context'
import type { ViewMode } from './workspace-toggle'
import { PanelToggleButton } from './panel-toggle-button'
import { BreadcrumbNav } from './breadcrumb-nav'

interface EditorToolbarProps {
  projectData: ProjectData
  allProjects: ProjectSummary[]
  totalWordCount: number

  // Save
  saveStatus: SaveStatus
  onSaveRetry: () => void

  // View mode (#318)
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void

  // Editor Panel (#317)
  isEditorPanelOpen?: boolean
  onToggleEditorPanel?: () => void

  // Export
  projectId: string
  activeChapterId: string | null
  getToken: () => Promise<string | null>
  apiUrl: string

  // Settings
  onRenameBook: () => void
  onDuplicateBook: () => void
  isDuplicating: boolean
  onDeleteProject: () => void
  onSignOut: () => void
  isSigningOut: boolean

  // Chapter navigation (for breadcrumb)
  onChapterSelect?: (chapterId: string) => void
}

/**
 * EditorToolbar — Minimal top toolbar with spatial panel toggles and breadcrumb nav.
 *
 * Layout: [✏️ Editor] — [≡ Book Title ▾ / Chapter] — [SaveIndicator] [⚙️] [📚 Library]
 *
 * The Editor toggle sits far-left, Library far-right, reinforcing the
 * spatial metaphor: left = AI editor, right = research library.
 * The breadcrumb replaces both the ProjectSwitcher and the Chapter/Book toggle.
 */
export function EditorToolbar({
  projectData,
  allProjects,
  totalWordCount,
  saveStatus,
  onSaveRetry,
  viewMode,
  onViewModeChange,
  isEditorPanelOpen = false,
  onToggleEditorPanel,
  projectId,
  activeChapterId,
  getToken,
  apiUrl,
  onRenameBook,
  onDuplicateBook,
  isDuplicating,
  onDeleteProject,
  onSignOut,
  isSigningOut,
  onChapterSelect,
}: EditorToolbarProps) {
  const { isPanelOpen, togglePanel, connections } = useSourcesContext()
  const [announcement, setAnnouncement] = useState('')

  // Keyboard shortcuts (#394)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey
      if (!isMod || !e.shiftKey) return

      switch (e.key.toLowerCase()) {
        case 'e':
          e.preventDefault()
          onToggleEditorPanel?.()
          break
        case 'l':
          e.preventDefault()
          togglePanel()
          break
        case 'b':
          e.preventDefault()
          onViewModeChange(viewMode === 'chapter' ? 'book' : 'chapter')
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onToggleEditorPanel, togglePanel, viewMode, onViewModeChange])

  // aria-live announcements (#393)
  const announce = useCallback((msg: string) => {
    setAnnouncement('')
    requestAnimationFrame(() => setAnnouncement(msg))
  }, [])

  const handleToggleEditor = useCallback(() => {
    onToggleEditorPanel?.()
    announce(isEditorPanelOpen ? 'Editor panel closed' : 'Editor panel opened')
  }, [onToggleEditorPanel, isEditorPanelOpen, announce])

  const handleToggleLibrary = useCallback(() => {
    togglePanel()
    announce(isPanelOpen ? 'Library panel closed' : 'Library panel opened')
  }, [togglePanel, isPanelOpen, announce])

  const handleChapterSelect = useCallback(
    (chapterId: string) => {
      onChapterSelect?.(chapterId)
      onViewModeChange('chapter')
    },
    [onChapterSelect, onViewModeChange]
  )

  // Build chapter list for breadcrumb
  const chapters = projectData.chapters.map((ch) => ({
    id: ch.id,
    title: ch.title,
    wordCount: ch.wordCount,
  }))

  return (
    <div
      className="flex items-center h-12 px-2 border-b border-[var(--dc-color-border-default)] bg-[var(--dc-color-surface-primary)] shrink-0"
      role="toolbar"
      aria-label="Editor toolbar"
      aria-orientation="horizontal"
    >
      {/* Far left: Editor panel toggle (icon only) */}
      <div className="shrink-0">
        {onToggleEditorPanel && (
          <PanelToggleButton
            label="Editor"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            }
            isOpen={isEditorPanelOpen}
            onToggle={handleToggleEditor}
            zone="editor"
          />
        )}
      </div>

      {/* Center: Breadcrumb navigation */}
      <div className="flex-1 flex items-center min-w-0 px-2">
        <BreadcrumbNav
          currentProject={{
            id: projectData.id,
            title: projectData.title,
            wordCount: totalWordCount,
          }}
          projects={allProjects.map((p) => ({
            id: p.id,
            title: p.title,
            wordCount: p.wordCount,
          }))}
          chapters={chapters}
          activeChapterId={activeChapterId}
          viewMode={viewMode}
          onChapterSelect={handleChapterSelect}
          onViewModeChange={onViewModeChange}
        />
      </div>

      {/* Right cluster: Save + Export + Settings + Library toggle */}
      <div className="flex items-center gap-1 shrink-0">
        {viewMode !== 'book' && <SaveIndicator status={saveStatus} onRetry={onSaveRetry} />}

        {viewMode !== 'book' && (
          <ExportMenu
            projectId={projectId}
            projectTitle={projectData.title}
            activeChapterId={activeChapterId}
            getToken={getToken}
            apiUrl={apiUrl}
            connections={connections}
          />
        )}

        <SettingsMenu
          onRenameBook={onRenameBook}
          onDuplicateBook={onDuplicateBook}
          isDuplicating={isDuplicating}
          onDeleteProject={onDeleteProject}
          onSignOut={onSignOut}
          isSigningOut={isSigningOut}
        />

        <PanelToggleButton
          label="Library"
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          }
          isOpen={isPanelOpen}
          onToggle={handleToggleLibrary}
          zone="library"
        />
      </div>

      {/* Screen reader announcements (#393) */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
    </div>
  )
}
