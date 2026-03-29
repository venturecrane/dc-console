import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

/**
 * Protected layout that requires authentication.
 *
 * Auth-only — no visual chrome. Visual headers are handled by
 * nested route group layouts:
 * - (with-header): DraftCrane header bar for dashboard, help, setup
 * - (editor): No header — the editor has its own toolbar
 */
export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <main className="flex-1 pb-[env(safe-area-inset-bottom)]">{children}</main>
    </div>
  )
}
