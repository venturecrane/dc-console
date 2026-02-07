import { cors } from "hono/cors";
import type { Env } from "../types/index.js";

/**
 * CORS middleware configured per PRD: production frontend origin only, no wildcards.
 * Reads FRONTEND_URL from environment.
 */
export function corsMiddleware() {
  return cors({
    origin: (origin, c) => {
      const frontendUrl = (c.env as Env).FRONTEND_URL;
      if (!frontendUrl) {
        // Development fallback
        return origin;
      }
      return origin === frontendUrl ? origin : "";
    },
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Chapter-Version"],
    exposeHeaders: ["X-Chapter-Version"],
    maxAge: 86400,
    credentials: true,
  });
}
