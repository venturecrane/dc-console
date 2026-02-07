export interface Env {
  // Cloudflare Bindings
  DB: D1Database;
  EXPORTS_BUCKET: R2Bucket;
  CACHE: KVNamespace;

  // Clerk
  CLERK_PUBLISHABLE_KEY: string;
  CLERK_SECRET_KEY: string;
  CLERK_WEBHOOK_SECRET: string;

  // Google OAuth
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REDIRECT_URI: string;

  // Anthropic
  ANTHROPIC_API_KEY: string;

  // App
  FRONTEND_URL: string;
  ENCRYPTION_KEY: string;
}
