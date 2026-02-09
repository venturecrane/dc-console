import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

/**
 * Protected layout that requires authentication.
 * Per PRD Section 8:
 * - US-002: Returning user signs in and is taken directly to Writing Environment
 * - US-004: 30-day session lifetime
 *
 * This layout wraps all authenticated routes and redirects to sign-in if not authenticated.
 */
export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}
