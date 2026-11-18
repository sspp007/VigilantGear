import { KEY_FEATURES } from '@/lib/constants/landing';

export function KeyFeatures() {
    return (
        <section id="features" className="scroll-mt-20 bg-white py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <p className="inline-flex items-center gap-3 text-base font-bold text-brand">
                        <span className="h-0.5 w-8 bg-brand" aria-hidden="true" />
                        Key Features
                        <span className="h-0.5 w-8 bg-brand" aria-hidden="true" />
                    </p>
                    <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">Everything You Need for PPE Compliance</h2>
                    <p className="mx-auto mt-3 max-w-2xl text-lg text-ink-muted">
                        A complete, easy-to-use platform to monitor, analyze and manage workplace safety.
                    </p>
                </div>

                <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {KEY_FEATURES.map(({ icon: Icon, title, description }) => (
                        <li key={title} className="card p-6 transition hover:-translate-y-1 hover:shadow-xl">
                            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-brand">
                                <Icon className="h-6 w-6" aria-hidden="true" />
                            </span>
                            <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
                            <p className="mt-2 text-sm text-ink-muted">{description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}