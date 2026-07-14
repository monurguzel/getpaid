import { FlaskConical, Leaf, Pill, Sparkles, Dice5, Globe, Landmark, Layers } from 'lucide-react'

const industries = [
  { icon: FlaskConical, label: 'Peptides & research chemicals' },
  { icon: Leaf, label: 'CBD, kratom & botanicals' },
  { icon: Pill, label: 'Nutraceuticals & supplements' },
  { icon: Sparkles, label: 'Adult & dating' },
  { icon: Dice5, label: 'Gaming & sweepstakes' },
  { icon: Globe, label: 'Offshore & cross-border' },
  { icon: Landmark, label: 'Coaching & info products' },
  { icon: Layers, label: 'Anything banks decline' },
]

export function Industries() {
  return (
    <section id="industries" className="border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="mb-12 flex flex-col gap-3">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Built for high-risk
          </p>
          <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            If Stripe banned you, you&apos;re in the right place
          </h2>
          <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            Traditional processors drop entire industries overnight. We were built for the
            businesses everyone else refuses to serve.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry) => (
            <li
              key={industry.label}
              className="flex items-center gap-3 rounded-lg border border-border/60 bg-card px-4 py-4"
            >
              <industry.icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium">{industry.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
