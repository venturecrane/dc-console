'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        opts: {
          sitekey: string
          callback?: (token: string) => void
          'expired-callback'?: () => void
          'error-callback'?: () => void
          theme?: 'light' | 'dark' | 'auto'
        }
      ) => string
      reset: (id?: string) => void
    }
  }
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA' // dev fallback (always-pass)

type State = 'idle' | 'submitting' | 'success' | 'duplicate' | 'error'

export function WaitlistCTA() {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [state, setState] = useState<State>('idle')
  const [error, setError] = useState<string | null>(null)
  const turnstileContainer = useRef<HTMLDivElement | null>(null)
  const turnstileWidgetId = useRef<string | null>(null)

  useEffect(() => {
    if (!turnstileContainer.current || turnstileWidgetId.current) return
    const tryRender = () => {
      if (window.turnstile && turnstileContainer.current && !turnstileWidgetId.current) {
        turnstileWidgetId.current = window.turnstile.render(turnstileContainer.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: 'light',
          callback: (t: string) => setToken(t),
          'expired-callback': () => setToken(null),
          'error-callback': () => setToken(null),
        })
      }
    }
    tryRender()
    const interval = window.setInterval(() => {
      if (turnstileWidgetId.current) {
        window.clearInterval(interval)
      } else {
        tryRender()
      }
    }, 250)
    return () => window.clearInterval(interval)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (state === 'submitting') return
    setState('submitting')
    setError(null)

    if (!token) {
      setState('error')
      setError('Please complete the verification before submitting.')
      return
    }

    try {
      const params = new URLSearchParams(window.location.search)
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          turnstileToken: token,
          utm_source: params.get('utm_source') ?? undefined,
          utm_medium: params.get('utm_medium') ?? undefined,
          utm_campaign: params.get('utm_campaign') ?? undefined,
          utm_content: params.get('utm_content') ?? undefined,
          referrer: document.referrer || undefined,
          landing_path: window.location.pathname,
        }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string; code?: string }
        setState('error')
        setError(data.error ?? 'Something went wrong. Please try again.')
        if (window.turnstile && turnstileWidgetId.current) {
          window.turnstile.reset(turnstileWidgetId.current)
        }
        setToken(null)
        return
      }
      const data = (await res.json()) as { status?: string }
      setState(data.status === 'already_signed_up' ? 'duplicate' : 'success')
    } catch {
      setState('error')
      setError('Network error. Please try again.')
    }
  }

  return (
    <section
      id="waitlist"
      className="py-20 px-6 bg-[var(--dc-color-interactive-primary)] text-[var(--dc-color-text-inverse)] relative overflow-hidden"
    >
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
        async
        defer
      />
      <div
        className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -ml-32 -mb-32"
        aria-hidden
      />
      <div className="relative max-w-2xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-medium mb-5">
          Join the early-access list.
        </h2>
        <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          DraftCrane is in private alpha. Drop your email to hold a place. We invite writers in
          small batches as we build.
        </p>

        {state === 'success' ? (
          <div className="bg-white/10 border border-white/20 rounded-2xl p-8 text-left max-w-md mx-auto">
            <p className="font-serif text-2xl mb-3">You are on the list.</p>
            <p className="text-white/80 text-base leading-relaxed">
              Watch your inbox for a confirmation. We will be in touch when your spot opens.
            </p>
          </div>
        ) : state === 'duplicate' ? (
          <div className="bg-white/10 border border-white/20 rounded-2xl p-8 text-left max-w-md mx-auto">
            <p className="font-serif text-2xl mb-3">You are already on the list.</p>
            <p className="text-white/80 text-base leading-relaxed">
              No need to sign up again — we have you. Watch your inbox.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-4 max-w-md mx-auto"
          >
            <label htmlFor="waitlist-email" className="sr-only">
              Email address
            </label>
            <input
              id="waitlist-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-5 py-4 rounded-xl bg-white text-[var(--dc-color-text-primary)] placeholder:text-[var(--dc-color-text-placeholder)] focus:outline-none focus:ring-2 focus:ring-white/40 min-h-[48px]"
              disabled={state === 'submitting'}
            />

            <div ref={turnstileContainer} className="min-h-[65px]" />

            <button
              type="submit"
              disabled={state === 'submitting' || !token}
              className="w-full sm:w-auto px-10 py-4 bg-white text-[var(--dc-color-interactive-primary)] rounded-xl font-bold text-base hover:bg-[var(--dc-color-surface-tertiary)] transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
            >
              {state === 'submitting' ? 'Joining...' : 'Request access'}
            </button>

            {error && (
              <p className="text-white/90 text-sm bg-white/10 border border-white/20 rounded-lg px-4 py-2">
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  )
}
