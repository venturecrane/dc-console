const steps = [
  {
    number: '01',
    title: 'Connect your Google Drive',
    body: 'Sign in and choose where your book lives. DraftCrane works with the files you already have.',
  },
  {
    number: '02',
    title: 'Write chapter by chapter with AI',
    body: 'Structure your book into chapters. When you need help, the AI reads your chapter before suggesting rewrites — so the result sounds like you.',
  },
  {
    number: '03',
    title: 'Export a real book file',
    body: 'One click to generate a formatted PDF or EPUB, saved straight to your Google Drive.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl font-medium text-[var(--dc-color-interactive-primary)] mb-16 text-center">
          How it works
        </h2>
        <div className="grid gap-12 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="text-left">
              <div className="font-serif italic text-3xl text-[var(--dc-color-interactive-primary)]/40 mb-4">
                {step.number}
              </div>
              <h3 className="font-serif text-2xl text-[var(--dc-color-interactive-primary)] mb-3">
                {step.title}
              </h3>
              <p className="text-[var(--dc-color-text-secondary)] leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
