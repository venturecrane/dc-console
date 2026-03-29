interface EditorLayoutProps {
  children: React.ReactNode
}

/**
 * Editor layout — no header bar, full viewport height.
 *
 * The editor page manages its own toolbar and layout.
 * This layout just ensures the content fills the viewport
 * without the parent's flex/padding interfering.
 */
export default function EditorLayout({ children }: EditorLayoutProps) {
  return <div className="h-dvh overflow-hidden">{children}</div>
}
