const differentiators = [
  {
    title: 'Your files stay in your Google Drive',
    body: 'Your manuscript is not locked in another app. Every chapter, every draft lives in your own Drive folder. You own your book.',
  },
  {
    title: 'AI that reads your chapter first',
    body: 'Other tools give you generic AI. DraftCrane reads the chapter you are working on before suggesting a rewrite. The result sounds like you, not a chatbot.',
  },
  {
    title: 'Built for your iPad',
    body: 'DraftCrane is a browser app designed for iPad Safari. Write on the couch, at a coffee shop, or between client calls. No desktop required.',
  },
]

export function WhyDifferent() {
  return (
    <section className="bg-[var(--dc-color-surface-secondary)] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl font-medium text-[var(--dc-color-interactive-primary)] mb-16 text-center">
          Why it is different
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {differentiators.map((item) => (
            <div
              key={item.title}
              className="bg-[var(--dc-color-surface-primary)] p-8 rounded-2xl border border-[var(--dc-color-border-default)]/50"
            >
              <h3 className="font-serif text-xl text-[var(--dc-color-interactive-primary)] mb-3">
                {item.title}
              </h3>
              <p className="text-[var(--dc-color-text-secondary)] leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
