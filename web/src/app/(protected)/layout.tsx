import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { AppHeader } from '@/components/layout/app-header'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

/**
 * Protected layout that requires authentication.
 *
 * The AppHeader is a client component that conditionally renders
 * based on pathname — hidden on /editor/* routes where the editor
 * has its own toolbar, visible everywhere else.
 */
export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader />
      <main className="flex-1 pb-[env(safe-area-inset-bottom)]">{children}</main>
    </div>
  )
}
