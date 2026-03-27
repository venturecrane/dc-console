'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { useSourcesContext } from '@/contexts/sources-context'
import { InstructionList } from '@/components/instruction-list'
import { StreamingResponse } from '@/components/editor/streaming-response'
import { PanelActionBar, PanelButton } from '@/components/editor/panel-action-bar'
import { PanelStatusHeader } from '@/components/editor/panel-status-header'
import { Spinner } from '@/components/editor/spinner'
import { EmptyState } from './empty-state'
import { useToast } from '@/components/toast'

/**
 * Desk tab — tagged documents workspace with multi-select AI analysis.
 *
 * Layout (Three-zone, blue accent):
 *   Zone A: Instruction controls (fixed top, capped 50%)
 *   Zone B: Document list + analysis results (flex-grows)
 *   Zone C: Action bar (pinned bottom via PanelActionBar)
 *
 * Instruction controls sit at the top for spatial stability and
 * predictable virtual keyboard behavior on iPad.
 */
export function DeskTab() {
  const {
    sources,
    removeSource,
    analyze,
    analysisText,
    isAnalyzing,
    isAnalysisComplete,
    analysisError,
    resetAnalysis,
    abortAnalysis,
    deskInstructions,
    isLoadingInstructions,
    createInstruction,
    updateInstruction,
    removeInstruction,
    touchInstructionLastUsed,
    editorRef,
    projectId,
    isPanelOpen,
    closePanel,
    deepAnalysis,
  } = useSourcesContext()

  const { showToast } = useToast()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [instruction, setInstruction] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const analysisRef = useRef<HTMLDivElement>(null)
  const hasScrolledToResults = useRef(false)
  // Store the instruction at analysis time so retry uses the correct value
  const lastAnalysisInstruction = useRef('')

  // Merge inline + deep analysis state
  const isDeepProcessing = deepAnalysis.status === 'pending' || deepAnalysis.status === 'processing'
  const isAnyAnalyzing = isAnalyzing || isDeepProcessing
  const effectiveText = analysisText || deepAnalysis.resultText || ''
  const effectiveComplete = isAnalysisComplete || deepAnalysis.status === 'completed'
  const effectiveError = analysisError || deepAnalysis.error

  // Only active (tagged) sources appear on the desk
  const deskSources = useMemo(() => sources.filter((s) => s.status === 'active'), [sources])

  const allSelected = deskSources.length > 0 && selectedIds.size === deskSources.length
  const someSelected = selectedIds.size > 0 && selectedIds.size < deskSources.length

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const toggleSelectAll = useCallback(() => {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(deskSources.map((s) => s.id)))
    }
  }, [allSelected, deskSources])

  // Reset scroll flag when analysis resets
  useEffect(() => {
    if (!isAnalyzing && !isDeepProcessing && !effectiveText) {
      hasScrolledToResults.current = false
    }
  }, [isAnalyzing, isDeepProcessing, effectiveText])

  // Scroll to results on first content chunk
  useEffect(() => {
    if (effectiveText && !hasScrolledToResults.current && analysisRef.current) {
      hasScrolledToResults.current = true
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      analysisRef.current.scrollIntoView({
        behavior: prefersReducedMotion ? 'instant' : 'smooth',
        block: 'nearest',
      })
    }
  }, [effectiveText])

  const handleUntag = useCallback(
    async (sourceId: string, title: string) => {
      try {
        await removeSource(sourceId)
        setSelectedIds((prev) => {
          const next = new Set(prev)
          next.delete(sourceId)
          return next
        })
        showToast(`Removed "${title}" from desk`)
      } catch (err) {
        console.error('Failed to remove from desk:', err)
      }
    },
    [removeSource, showToast]
  )

  const handleAnalyze = useCallback(() => {
    const ids = Array.from(selectedIds)
    if (ids.length === 0 || !instruction.trim()) return
    lastAnalysisInstruction.current = instruction.trim()
    analyze(projectId, ids, instruction)
  }, [selectedIds, instruction, projectId, analyze])

  const handleCancel = useCallback(() => {
    abortAnalysis()
    deepAnalysis.reset()
  }, [abortAnalysis, deepAnalysis])

  const handleStartOver = useCallback(() => {
    // Clears analysis results only — preserves instruction text and document selections
    resetAnalysis()
    deepAnalysis.reset()
  }, [resetAnalysis, deepAnalysis])

  const handleRetry = useCallback(() => {
    resetAnalysis()
    deepAnalysis.reset()
    // Use the instruction captured at analysis time, not current textarea state
    const retryInstruction = lastAnalysisInstruction.current
    if (!retryInstruction) return
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return
    analyze(projectId, ids, retryInstruction)
  }, [resetAnalysis, deepAnalysis, selectedIds, projectId, analyze])

  const handleCopy = useCallback(async () => {
    if (!effectiveText) return
    try {
      await navigator.clipboard.writeText(effectiveText)
      showToast('Copied to clipboard')
    } catch {
      showToast('Failed to copy')
    }
  }, [effectiveText, showToast])

  const handleInsert = useCallback(() => {
    if (!effectiveText) return
    const editor = editorRef.current?.getEditor()
    if (!editor) return

    const { from, to } = editor.state.selection
    const hasCursor = from === to && from > 0

    if (hasCursor) {
      editor.chain().focus().insertContent(`<p>${effectiveText}</p>`).run()
      showToast('Inserted at cursor')
    } else {
      editor.chain().focus('end').insertContent(`<p>${effectiveText}</p>`).run()
      showToast('Added to end of chapter')
    }

    const isPortrait = window.matchMedia('(max-width: 1023px)').matches
    if (isPortrait && isPanelOpen) {
      closePanel()
    }
  }, [effectiveText, editorRef, showToast, isPanelOpen, closePanel])

  const hasAnalysisContent = !!effectiveText

  // Status header label
  const statusLabel = isAnyAnalyzing
    ? 'Analyzing...'
    : effectiveError
      ? 'Could not finish the analysis.'
      : 'Analysis complete.'

  // Empty desk
  if (deskSources.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7M4 7c0-2 1-3 3-3h10c2 0 3 1 3 3M4 7h16"
            />
          </svg>
        }
        message="Tag documents from the Library to work with them here."
      />
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Zone A: Instruction controls - fixed at top, capped at 50% */}
      <div className="shrink-0 max-h-[50%] overflow-y-auto border-b border-[var(--dc-color-border-default)]">
        <div className="px-4 pt-4">
          <label className="text-xs font-medium text-[var(--dc-color-text-muted)] mb-1.5 block">
            Instruction
          </label>

          {/* Instruction list */}
          <div className="mb-3">
            <InstructionList
              instructions={deskInstructions}
              type="desk"
              onSelect={(inst) => {
                setInstruction(inst.instructionText)
              }}
              onCreate={createInstruction}
              onUpdate={updateInstruction}
              onDelete={removeInstruction}
              onTouch={touchInstructionLastUsed}
              isLoading={isLoadingInstructions}
              disabled={isAnyAnalyzing}
              variant="primary"
            />
          </div>

          {/* Freeform instruction textarea (no Enter-to-submit — decoupled from Analyze button) */}
          <div className="pb-3">
            <label
              htmlFor="desk-instruction-textarea"
              className="text-xs font-medium text-[var(--dc-color-text-muted)] mb-1.5 block"
            >
              Or write your own
            </label>
            <textarea
              ref={textareaRef}
              id="desk-instruction-textarea"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              disabled={isAnyAnalyzing}
              className="w-full p-3 text-sm border border-[var(--dc-color-border-strong)] rounded-[var(--dc-radius-md)] resize-none
                         focus:outline-none focus:ring-2 focus:ring-[var(--dc-color-interactive-primary)] focus:border-transparent
                         disabled:opacity-50 disabled:cursor-not-allowed
                         placeholder:text-[var(--dc-color-text-placeholder)]"
              rows={3}
              placeholder="Type a custom instruction..."
              maxLength={2000}
            />
          </div>
        </div>
      </div>

      {/* Zone B: Document list + analysis results - flex-grows to fill remaining space */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Document list header */}
        <div className="px-4 py-2 border-b border-[var(--dc-color-border-subtle)] flex items-center gap-2 sticky top-0 bg-[var(--dc-color-surface-primary)] z-10">
          <button
            onClick={toggleSelectAll}
            role="checkbox"
            aria-checked={allSelected ? 'true' : someSelected ? 'mixed' : 'false'}
            className="flex items-center gap-2 text-xs text-[var(--dc-color-text-muted)] hover:text-[var(--dc-color-text-secondary)]
                       transition-colors min-h-[var(--dc-touch-target-min)]"
          >
            <span
              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                allSelected || someSelected
                  ? 'bg-[var(--dc-color-interactive-primary)] border-[var(--dc-color-interactive-primary)]'
                  : 'border-[var(--dc-color-border-strong)]'
              }`}
            >
              {allSelected && (
                <svg
                  className="w-3 h-3 text-[var(--dc-color-text-inverse)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              {someSelected && !allSelected && (
                <svg
                  className="w-3 h-3 text-[var(--dc-color-text-inverse)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14" />
                </svg>
              )}
            </span>
            {allSelected ? 'Deselect all' : 'Select all'}
          </button>
          <span className="text-[10px] text-[var(--dc-color-text-placeholder)] ml-auto">
            {selectedIds.size > 0
              ? `${selectedIds.size} selected`
              : `${deskSources.length} on desk`}
          </span>
        </div>

        {/* SR-only status for document/selection count */}
        <div className="sr-only" aria-live="polite" role="status">
          {selectedIds.size > 0
            ? `${selectedIds.size} of ${deskSources.length} documents selected`
            : `${deskSources.length} documents on desk`}
        </div>

        {/* Document rows */}
        <div>
          {deskSources.map((source) => {
            const isSelected = selectedIds.has(source.id)
            return (
              <div
                key={source.id}
                className="flex items-center w-full border-b border-[var(--dc-color-border-subtle)] hover:bg-[var(--dc-color-surface-secondary)]"
              >
                {/* Checkbox + title (tap to select) */}
                <button
                  onClick={() => toggleSelect(source.id)}
                  role="checkbox"
                  aria-checked={isSelected}
                  className="flex items-center gap-2 flex-1 min-w-0 px-4 min-h-[44px] cursor-pointer"
                >
                  <span
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[var(--dc-color-interactive-primary)] border-[var(--dc-color-interactive-primary)]'
                        : 'border-[var(--dc-color-border-strong)]'
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="w-3 h-3 text-[var(--dc-color-text-inverse)]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>
                  <svg
                    className="w-4 h-4 text-[var(--dc-color-interactive-primary-border)] shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-sm text-[var(--dc-color-text-primary)] truncate flex-1 text-left">
                    {source.title}
                  </span>
                </button>

                {/* Untag (remove from desk) */}
                <button
                  onClick={() => handleUntag(source.id, source.title)}
                  className="p-2 mr-1 shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center
                             text-[var(--dc-color-interactive-primary)] hover:text-[var(--dc-color-text-placeholder)] transition-colors"
                  aria-label="Remove from desk"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </button>
              </div>
            )
          })}
        </div>

        {/* Deep analysis progress */}
        {isDeepProcessing && deepAnalysis.totalBatches > 0 && (
          <div className="px-4 py-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-[var(--dc-color-text-muted)]">
              <span>
                Analyzing{' '}
                {deepAnalysis.totalBatches > 1
                  ? `${deepAnalysis.totalBatches} batches`
                  : 'documents'}
                ...
              </span>
              <span>
                {deepAnalysis.completedBatches} of {deepAnalysis.totalBatches}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[var(--dc-color-surface-tertiary)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--dc-color-interactive-primary)] rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(5, (deepAnalysis.completedBatches / deepAnalysis.totalBatches) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Analysis result / streaming response */}
        {(effectiveText || isAnalyzing || effectiveError) && (
          <div ref={analysisRef} className="px-4 py-4 space-y-2">
            <PanelStatusHeader
              label={statusLabel}
              isError={!!effectiveError}
              variant="primary"
              right={
                isAnyAnalyzing ? (
                  <span className="text-xs text-[var(--dc-color-interactive-primary)] flex items-center gap-1">
                    <Spinner size="sm" />
                    Writing...
                  </span>
                ) : undefined
              }
            />
            <StreamingResponse
              text={effectiveText}
              isStreaming={isAnalyzing}
              errorMessage={effectiveError}
              variant="primary"
              onRetry={handleRetry}
              ariaLabel="Analysis result"
            />
          </div>
        )}

        {/* SR-only status announcement for analysis */}
        <div className="sr-only" aria-live="polite" role="status">
          {isAnyAnalyzing
            ? 'Analysis in progress.'
            : effectiveComplete && !effectiveError
              ? 'Analysis complete.'
              : effectiveError
                ? 'Analysis failed.'
                : null}
        </div>
      </div>

      {/* Zone C: Action bar - pinned at bottom, 4 branches */}
      <PanelActionBar>
        {isAnyAnalyzing ? (
          /* Streaming → Cancel */
          <PanelButton tier="ghost" onClick={handleCancel} aria-label="Cancel analysis">
            Cancel
          </PanelButton>
        ) : effectiveError ? (
          /* Error → Start Over + Try Again */
          <>
            <PanelButton tier="ghost" onClick={handleStartOver} aria-label="Start over">
              Start Over
            </PanelButton>
            <PanelButton
              tier="primary"
              variant="primary"
              onClick={handleRetry}
              aria-label="Try again"
            >
              Try Again
            </PanelButton>
          </>
        ) : effectiveComplete && hasAnalysisContent ? (
          /* Complete → Start Over + Copy + Insert */
          <>
            <PanelButton tier="ghost" onClick={handleStartOver} aria-label="Start over">
              Start Over
            </PanelButton>
            <PanelButton tier="ghost" onClick={handleCopy} aria-label="Copy analysis to clipboard">
              Copy
            </PanelButton>
            <PanelButton
              tier="primary"
              variant="primary"
              onClick={handleInsert}
              aria-label="Insert analysis into chapter"
            >
              Insert into Chapter
            </PanelButton>
          </>
        ) : (
          /* Idle → Analyze button */
          <PanelButton
            tier="primary"
            variant="primary"
            onClick={handleAnalyze}
            disabled={selectedIds.size === 0 || !instruction.trim()}
            aria-label={
              selectedIds.size === 0
                ? 'Select documents to analyze'
                : `Analyze ${selectedIds.size} document${selectedIds.size !== 1 ? 's' : ''}`
            }
          >
            {selectedIds.size === 0
              ? 'Select documents to analyze'
              : `Analyze ${selectedIds.size} document${selectedIds.size !== 1 ? 's' : ''}`}
          </PanelButton>
        )}
      </PanelActionBar>
    </div>
  )
}
