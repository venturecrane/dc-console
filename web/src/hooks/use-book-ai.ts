'use client'

import { useState, useCallback, useRef } from 'react'

export type BookAnalysisState = 'idle' | 'streaming' | 'complete'

export interface BookAnalysisResult {
  /** The analysis text (grows during streaming, final on complete) */
  text: string
  /** The instruction used for this analysis */
  instruction: string
}

interface UseBookAIOptions {
  getToken: () => Promise<string | null>
  apiUrl: string
  projectId: string
}

interface UseBookAIReturn {
  state: BookAnalysisState
  result: BookAnalysisResult | null
  errorMessage: string | null
  analyze: (instruction: string) => void
  reset: () => void
}

/**
 * useBookAI - Hook for book-level AI analysis via SSE streaming.
 *
 * Manages the state machine: idle -> streaming -> complete (with error branch).
 * Sends full manuscript context to POST /ai/book-analyze and streams the response.
 */
export function useBookAI({ getToken, apiUrl, projectId }: UseBookAIOptions): UseBookAIReturn {
  const [state, setState] = useState<BookAnalysisState>('idle')
  const [result, setResult] = useState<BookAnalysisResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const analyze = useCallback(
    async (instruction: string) => {
      // Abort any in-flight request
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setErrorMessage(null)
      setResult({ text: '', instruction })
      setState('streaming')

      try {
        const token = await getToken()
        if (!token) {
          setErrorMessage('Not authenticated')
          setState('idle')
          return
        }

        const res = await fetch(`${apiUrl}/ai/book-analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ projectId, instruction }),
          signal: controller.signal,
        })

        if (!res.ok) {
          const body = await res.text().catch(() => '')
          setErrorMessage(body || `Analysis failed (${res.status})`)
          setState('complete')
          return
        }

        if (!res.body) {
          setErrorMessage('No response stream')
          setState('complete')
          return
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let accumulated = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })

          // Parse SSE events from buffer
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6).trim()
            if (!data || data === '[DONE]') continue

            try {
              const event = JSON.parse(data) as
                | { type: 'token'; text: string }
                | { type: 'done' }
                | { type: 'error'; message: string }

              if (event.type === 'token') {
                accumulated += event.text
                setResult((prev) =>
                  prev ? { ...prev, text: accumulated } : { text: accumulated, instruction }
                )
              } else if (event.type === 'done') {
                setState('complete')
              } else if (event.type === 'error') {
                setErrorMessage(event.message)
                setState('complete')
              }
            } catch {
              // Ignore malformed JSON lines
            }
          }
        }

        // If we finished reading without a 'done' event, mark complete
        if (state === 'streaming') {
          setState('complete')
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setErrorMessage((err as Error).message || 'Analysis failed')
        setState('complete')
      }
    },
    [getToken, apiUrl, projectId, state]
  )

  const reset = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setState('idle')
    setResult(null)
    setErrorMessage(null)
  }, [])

  return { state, result, errorMessage, analyze, reset }
}
