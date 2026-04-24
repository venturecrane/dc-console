export interface Env {
  // Cloudflare Bindings
  DB: D1Database
  EXPORTS_BUCKET: R2Bucket
  CACHE: KVNamespace
  AI: Ai

  // Clerk
  CLERK_PUBLISHABLE_KEY: string
  CLERK_SECRET_KEY: string
  CLERK_WEBHOOK_SECRET: string
  CLERK_ISSUER_URL: string // e.g. https://<instance>.clerk.accounts.dev

  // Google OAuth
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  GOOGLE_REDIRECT_URI: string

  // AI Provider
  AI_API_KEY: string
  AI_MODEL?: string // Default: gpt-4o
  AI_DEFAULT_TIER?: string // "edge" | "frontier", default: "frontier"
  DEEP_ANALYSIS_TOKEN_THRESHOLD?: string // Token threshold for async deep analysis (default: 40000)

  // Cloudflare Browser Rendering (PDF export)
  CF_ACCOUNT_ID: string
  CF_API_TOKEN: string

  // App
  FRONTEND_URL: string
  API_BASE_URL?: string // Base URL for API (used in export download URLs)
  ENCRYPTION_KEY: string
  ALLOW_TEST_AUTH?: string

  // Waitlist (public POST /waitlist endpoint)
  RESEND_API_KEY: string // Resend transactional email API key
  RESEND_FROM_EMAIL?: string // Sender, default: "DraftCrane <hello@mail.draftcrane.app>"
  WAITLIST_NOTIFY_EMAIL?: string // Where to notify on signup, default: smdurgan@venturecrane.com
  TURNSTILE_SECRET_KEY: string // Cloudflare Turnstile server-side verification secret
}
