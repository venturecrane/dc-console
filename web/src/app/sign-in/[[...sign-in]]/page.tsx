import { SignIn } from "@clerk/nextjs";

/**
 * Sign In page using Clerk's hosted authentication.
 * Per PRD Section 7 Step 2: Clean Clerk-hosted authentication.
 * "Continue with Google" is primary, email/password is secondary.
 * Redirect-based OAuth only (Safari popup blocker mitigation).
 */
export default function SignInPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gray-50 px-4 py-12">
      <SignIn
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
