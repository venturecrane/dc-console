import { Hono } from 'hono'
import type { Env } from '../types/index.js'
import { validationError } from '../middleware/error-handler.js'
import { aiRateLimit } from '../middleware/rate-limit.js'
import { AIRewriteService, type RewriteInput } from '../services/ai-rewrite.js'
import { AIInteractionService } from '../services/ai-interaction.js'
import { OpenAIProvider, WorkersAIProvider } from '../services/ai-provider.js'
import type { AIStreamEvent } from '../services/ai-provider.js'
import type { ChapterRow } from '../services/chapter.js'

const ai = new Hono<{ Bindings: Env }>()

// Auth is enforced globally in index.ts
// Rate limit: 10 req/min for AI endpoints (applied after auth)
ai.use('/rewrite', aiRateLimit)
ai.use('/book-analyze', aiRateLimit)

/**
 * POST /ai/rewrite
 *
 * Request body:
 * - selectedText: string (required) - The text to rewrite
 * - instruction: string (required) - How to rewrite it
 * - contextBefore: string (optional) - Up to 500 chars before selection
 * - contextAfter: string (optional) - Up to 500 chars after selection
 * - chapterTitle: string (optional) - Chapter title for context
 * - projectDescription: string (optional) - Project description for context
 * - chapterId: string (required) - Chapter ID for logging
 * - tier: "edge" | "frontier" (optional) - AI tier to use (default from env)
 *
 * Response: SSE stream with events:
 * - { type: "start", interactionId: string, attemptNumber: number } - Stream started
 * - { type: "token", text: string } - Each token as it arrives
 * - { type: "done", interactionId: string } - Stream complete
 * - { type: "error", message: string } - Error occurred
 */
ai.post('/rewrite', async (c) => {
  const { userId } = c.get('auth')

  const body = (await c.req.json().catch(() => ({}))) as Partial<RewriteInput> & {
    tier?: 'edge' | 'frontier'
  }

  const defaultTier = (c.env.AI_DEFAULT_TIER as 'edge' | 'frontier') || 'frontier'
  const tier = body.tier === 'edge' || body.tier === 'frontier' ? body.tier : defaultTier

  const provider =
    tier === 'edge'
      ? new WorkersAIProvider(c.env.AI)
      : new OpenAIProvider(c.env.AI_API_KEY, c.env.AI_MODEL)

  const service = new AIRewriteService(c.env.DB, provider)

  const input: RewriteInput = {
    selectedText: body.selectedText ?? '',
    instruction: body.instruction ?? '',
    contextBefore: body.contextBefore ?? '',
    contextAfter: body.contextAfter ?? '',
    chapterTitle: body.chapterTitle ?? '',
    projectDescription: body.projectDescription ?? '',
    chapterId: body.chapterId ?? '',
    parentInteractionId: body.parentInteractionId,
    tier,
  }

  const validationErr = service.validateInput(input)
  if (validationErr) {
    validationError(validationErr)
  }

  const { stream } = await service.streamRewrite(userId, input)

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
})

/**
 * POST /ai/interactions/:id/accept
 * Record that the user accepted the AI rewrite result.
 * Updates the interaction metadata (accepted = true).
 */
ai.post('/interactions/:id/accept', async (c) => {
  const { userId } = c.get('auth')
  const interactionId = c.req.param('id')

  const service = new AIInteractionService(c.env.DB)
  const interaction = await service.acceptInteraction(userId, interactionId)

  return c.json(interaction)
})

/**
 * POST /ai/interactions/:id/reject
 * Record that the user rejected/discarded the AI rewrite result.
 * Updates the interaction metadata (accepted = false).
 */
ai.post('/interactions/:id/reject', async (c) => {
  const { userId } = c.get('auth')
  const interactionId = c.req.param('id')

  const service = new AIInteractionService(c.env.DB)
  const interaction = await service.rejectInteraction(userId, interactionId)

  return c.json(interaction)
})

/**
 * POST /ai/book-analyze
 *
 * Analyzes the full manuscript (all chapters) with a user instruction.
 * Fetches all chapter content from R2 and streams the analysis via SSE.
 *
 * Request body:
 * - projectId: string (required) - Project to analyze
 * - instruction: string (required) - Analysis instruction
 *
 * Response: SSE stream with events:
 * - { type: "token", text: string } - Each token as it arrives
 * - { type: "done" } - Stream complete
 * - { type: "error", message: string } - Error occurred
 */
ai.post('/book-analyze', async (c) => {
  const { userId } = c.get('auth')

  const body = (await c.req.json().catch(() => ({}))) as {
    projectId?: string
    instruction?: string
  }

  if (!body.projectId?.trim()) {
    return validationError('Project ID is required')
  }
  if (!body.instruction?.trim()) {
    return validationError('Instruction is required')
  }
  if (body.instruction.length > 2000) {
    return validationError('Instruction must be at most 2000 characters')
  }

  // Verify project ownership
  const project = await c.env.DB.prepare(
    'SELECT id, title, description FROM projects WHERE id = ? AND user_id = ?'
  )
    .bind(body.projectId, userId)
    .first<{ id: string; title: string; description: string | null }>()

  if (!project) {
    return validationError('Project not found')
  }

  // Fetch all chapters in order
  const { results: chapters } = await c.env.DB.prepare(
    'SELECT id, title, sort_order, r2_key, word_count FROM chapters WHERE project_id = ? ORDER BY sort_order ASC'
  )
    .bind(body.projectId)
    .all<Pick<ChapterRow, 'id' | 'title' | 'sort_order' | 'r2_key' | 'word_count'>>()

  if (!chapters.length) {
    return validationError('No chapters found in this project')
  }

  // Fetch chapter content from R2 (skip chapters with no R2 key or no content)
  const manuscriptParts: string[] = []
  for (const ch of chapters) {
    if (!ch.r2_key) continue
    const obj = await c.env.EXPORTS_BUCKET.get(ch.r2_key)
    if (!obj) continue
    const html = await obj.text()
    // Strip HTML tags for plain text analysis
    const text = html.replace(/<[^>]+>/g, '').trim()
    if (text) {
      manuscriptParts.push(`## ${ch.title}\n\n${text}`)
    }
  }

  if (!manuscriptParts.length) {
    return validationError('No chapter content available for analysis')
  }

  const manuscriptText = manuscriptParts.join('\n\n---\n\n')

  // Build prompt
  const systemPrompt = [
    'You are an expert manuscript analyst helping a nonfiction author understand their book.',
    "Analyze the full manuscript according to the author's instruction.",
    'Be specific, actionable, and reference particular chapters or sections when relevant.',
    'Use a professional, constructive tone. Do not pad your response.',
    '',
    project.description ? `Book description: ${project.description}` : '',
    `Book title: ${project.title}`,
    `Chapters: ${chapters.length}`,
  ]
    .filter(Boolean)
    .join('\n')

  const userMessage = `<manuscript>\n${manuscriptText}\n</manuscript>\n\n<instruction>\n${body.instruction}\n</instruction>\n\nAnalyze the manuscript according to the instruction above. Be specific and reference chapter titles when relevant.`

  // Use frontier tier for book analysis (needs large context window)
  const provider = new OpenAIProvider(c.env.AI_API_KEY, c.env.AI_MODEL)

  const aiStream = await provider.streamCompletion(systemPrompt, userMessage, {
    maxTokens: 4096,
  })

  // Transform to SSE
  const encoder = new TextEncoder()
  const sseTransform = new TransformStream<AIStreamEvent, Uint8Array>({
    transform(event, controller) {
      switch (event.type) {
        case 'token':
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'token', text: event.text })}\n\n`)
          )
          break
        case 'done':
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`))
          break
        case 'error':
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'error', message: event.message })}\n\n`)
          )
          break
      }
    },
  })

  const stream = aiStream.pipeThrough(sseTransform)

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
})

export { ai }
