import type { Context, MiddlewareHandler } from "hono";
import type { ErrorCode } from "../types/index.js";

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const errorHandler: MiddlewareHandler = async (c, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof AppError) {
      return c.json({ error: err.message, code: err.code }, err.statusCode as 400);
    }

    console.error("Unhandled error:", err);
    return c.json({ error: "Internal server error", code: "INTERNAL_ERROR" as ErrorCode }, 500);
  }
};

/** Helper to throw typed API errors */
export function notFound(message = "Resource not found"): never {
  throw new AppError(404, "NOT_FOUND", message);
}

export function forbidden(message = "Access denied"): never {
  throw new AppError(403, "FORBIDDEN", message);
}

export function conflict(message = "Version conflict"): never {
  throw new AppError(409, "CONFLICT", message);
}

export function validationError(message: string): never {
  throw new AppError(400, "VALIDATION_ERROR", message);
}

export function rateLimited(message = "Rate limit exceeded"): never {
  throw new AppError(429, "RATE_LIMITED", message);
}

export function authRequired(message = "Authentication required"): never {
  throw new AppError(401, "AUTH_REQUIRED", message);
}
