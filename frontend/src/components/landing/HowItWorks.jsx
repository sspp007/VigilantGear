import { HOW_IT_WORKS_STEPS } from '@/lib/constants/landing';

export function HowItWorks() {
    return (
        <section id="how-it-works" className="scroll-mt-20 bg-canvas py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">How It Works</h2>
                    <p className="mx-auto mt-3 max-w-2xl text-lg text-ink-muted">
                        From footage to actionable safety insights in four steps.
                    </p>
                </div>

                <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {HOW_IT_WORKS_STEPS.map(({ icon: Icon, title, description }, index) => (
                        <li key={title} className="card relative p-6">
                            <span className="absolute right-5 top-4 text-4xl font-extrabold text-slate-100" aria-hidden="true">
                                {index + 1}
                            </span>
                            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white">
                                <Icon className="h-6 w-6" aria-hidden="true" />
                            </span>
                            <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
                            <p className="mt-2 text-sm text-ink-muted">{description}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}