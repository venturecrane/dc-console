'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { StreamingResponse } from './streaming-response'
import { PanelActionBar, PanelButton } from './panel-action-bar'
import { PanelStatusHeader } from './panel-status-header'
import { Spinner } from './spinner'
import { InstructionInput } from './instruction-input'
import { useSourcesContext } from '@/contexts/sources-context'
import { InstructionList } from '@/components/instruction-list'
import { useToast } from '@/components/toast'
import type { BookAnalysisState, BookAnalysisResult } from '@/hooks/use-book-ai'

interface BookEditorPanelProps {
  /** Current analysis state */
  analysisState: BookAnalysisState
  /** Current analysis result (text grows during streaming) */
  result: BookAnalysisResult | null
  /** Error message to display */
  errorMessage: string | null
  /** Trigger analysis with an instruction */
  onAnalyze: (instruction: string) => void
  /** Reset to idle state */
  onReset: () => void
  /** Number of chapters in the manuscript */
  chapterCount: number
  /** Total word count of the manuscript */
  totalWordCount: number
}

/**
 * BookEditorPanel - Book-mode content for the Editor Panel.
 *
 * State flow: Empty -> Ready -> Streaming -> Complete (Error branch)
 *
 * Unlike ChapterEditorPanel, this panel:
 * - Operates on the full manuscript (no text selection needed)
 * - Shows a manuscript context indicator
 * - Uses book-level instructions (structure, pacing, voice, synopsis, etc.)
 * - Output actions: Copy, Start Over (instead of Accept/Discard)
 *
 * Per Design Charter: "Editor" not "AI Assistant".
 */
export function BookEditorPanel({
  analysisState,
  result,
  errorMessage,
  onAnalyze,
  onReset,
  chapterCount,
  totalWordCount,
}: BookEditorPanelProps) {
  const {
    bookInstructions,
    isLoadingInstructions,
    createInstruction,
    updateInstruction,
    removeInstruction,
    touchInstructionLastUsed,
  } = useSourcesContext()

  const { showToast } = useToast()
  const [instruction, setInstruction] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isStreaming = analysisState === 'streaming'
  const isComplete = analysisState === 'complete'
  const isIdle = analysisState === 'idle'
  const hasResult = result !== null && result.text.length > 0
  const hasError = !!errorMessage

  // Show instructions in idle and complete states
  const showInstructions = isIdle || (isComplete && !hasError)

  const handleInstructionSelect = useCallback(
    (instructionText: string) => {
      setInstruction(instructionText)
      onAnalyze(instructionText)
    },
    [onAnalyze]
  )

  const handleSubmit = useCallback(() => {
    const trimmed = instruction.trim()
    if (!trimmed) return
    onAnalyze(trimmed)
  }, [instruction, onAnalyze])

  const handleCopy = useCallback(async () => {
    if (!result?.text) return
    try {
      await navigator.clipboard.writeText(result.text)
      showToast('Copied to clipboard')
    } catch {
      showToast('Failed to copy')
    }
  }, [result, showToast])

  const handleStartOver = useCallback(() => {
    setInstruction('')
    onReset()
  }, [onReset])

  // Focus textarea when idle
  useEffect(() => {
    if (isIdle && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isIdle])

  // Format word count for display
  const wordCountLabel =
    totalWordCount >= 1000
      ? `${(totalWordCount / 1000).toFixed(1)}k words`
      : `${totalWordCount} words`

  // Status header label
  const statusLabel = isStreaming
    ? 'Analyzing...'
    : hasError
      ? 'Could not finish the analysis.'
      : 'Analysis complete.'

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable content */}
      <div className="flex-1 overflow-auto px-4 py-3 space-y-4">
        {/* Manuscript context indicator */}
        <div className="flex items-center gap-2 px-3 py-2 bg-[var(--dc-color-interactive-escalation-subtle)] border border-[var(--dc-color-interactive-escalation-border)] rounded-[var(--dc-radius-md)] text-xs text-[var(--dc-color-interactive-escalation)]">
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
            />
          </svg>
          <div>
            <span className="font-medium">Full manuscript</span>
            <span className="text-[var(--dc-color-text-muted)] ml-1.5">
              {chapterCount} chapter{chapterCount !== 1 ? 's' : ''} - {wordCountLabel}
            </span>
          </div>
        </div>

        {/* Idle: instruction controls */}
        {showInstructions && (
          <>
            <div>
              <InstructionList
                instructions={bookInstructions}
                type="book"
                onSelect={(inst) => handleInstructionSelect(inst.instructionText)}
                onCreate={createInstruction}
                onUpdate={updateInstruction}
                onDelete={removeInstruction}
                onTouch={touchInstructionLastUsed}
                isLoading={isLoadingInstructions}
                disabled={isStreaming}
                variant="escalation"
              />
            </div>

            <InstructionInput
              id="book-panel-instruction"
              value={instruction}
              onChange={setInstruction}
              onSubmit={handleSubmit}
              disabled={isStreaming}
              variant="escalation"
              textareaRef={textareaRef}
            />
          </>
        )}

        {/* Streaming / complete: status header + response */}
        {result && (isStreaming || isComplete) && (
          <div>
            <PanelStatusHeader
              label={statusLabel}
              isError={hasError}
              variant="escalation"
              right={
                isStreaming ? (
                  <span className="text-xs text-[var(--dc-color-interactive-escalation)] flex items-center gap-1">
                    <Spinner size="sm" />
                    Writing...
                  </span>
                ) : undefined
              }
            />
            <StreamingResponse
              text={result.text}
              isStreaming={isStreaming}
              errorMessage={errorMessage}
              variant="escalation"
              onRetry={() => onAnalyze(result.instruction)}
              ariaLabel="Book analysis result"
            />
          </div>
        )}

        {/* Empty state - idle with no instructions yet */}
        {isIdle && !hasResult && !showInstructions && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg
              className="w-10 h-10 text-[var(--dc-color-interactive-escalation-border)] mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
            <p className="text-sm font-medium text-[var(--dc-color-text-secondary)] mb-1">
              Book-level analysis
            </p>
            <p className="text-sm text-[var(--dc-color-text-muted)]">
              Choose an instruction to analyze your full manuscript.
            </p>
          </div>
        )}

        {/* SR-only status announcement */}
        <div className="sr-only" aria-live="polite" role="status">
          {isStreaming
            ? 'Analysis in progress.'
            : isComplete && !hasError
              ? 'Analysis complete.'
              : hasError
                ? 'Analysis failed.'
                : null}
        </div>
      </div>

      {/* Action bar - pinned to bottom, consolidated into one block */}
      {(isStreaming || (isComplete && hasResult)) && (
        <PanelActionBar>
          {isStreaming ? (
            <PanelButton tier="ghost" onClick={onReset} aria-label="Cancel analysis">
              Cancel
            </PanelButton>
          ) : hasError ? (
            <>
              <PanelButton tier="ghost" onClick={handleStartOver} aria-label="Start over">
                Start Over
              </PanelButton>
              <PanelButton
                tier="primary"
                variant="escalation"
                onClick={() => result && onAnalyze(result.instruction)}
                aria-label="Try again"
              >
                Try Again
              </PanelButton>
            </>
          ) : (
            <>
              <PanelButton tier="ghost" onClick={handleStartOver} aria-label="Start over">
                Start Over
              </PanelButton>
              <PanelButton
                tier="primary"
                variant="escalation"
                onClick={handleCopy}
                aria-label="Copy analysis to clipboard"
              >
                Copy
              </PanelButton>
            </>
          )}
        </PanelActionBar>
      )}
    </div>
  )
}
