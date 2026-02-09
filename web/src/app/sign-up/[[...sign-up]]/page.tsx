import { SignUp } from "@clerk/nextjs";

/**
 * Sign Up page using Clerk's hosted authentication.
 * Per PRD Section 8 US-001: New user creates an account via "Continue with Google" (primary)
 * or email/password (secondary). Clerk handles auth.
 * Redirect-based OAuth only (Safari popup blocker mitigation).
 */
export default function SignUpPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gray-50 px-4 py-12">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg",
          },
        }}
      />
    </div>
  );
}
