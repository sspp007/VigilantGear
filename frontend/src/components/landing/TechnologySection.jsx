import { Badge } from '@/components/common/Badge';
import { TECHNOLOGY_STACK } from '@/lib/constants/landing';

export function TechnologySection() {
    return (
        <section id="technology" className="scroll-mt-20 bg-white py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">Technology</h2>
                    <p className="mx-auto mt-3 max-w-2xl text-lg text-ink-muted">
                        The platform is built in layers. The frontend is live in this demo and the remaining layers are planned.
                    </p>
                </div>

                <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {TECHNOLOGY_STACK.map(({ name, description, isCurrent }) => (
                        <li key={name} className="card p-6">
                            <div className="flex items-center justify-between gap-3">
                                <h3 className="text-lg font-bold text-ink">{name}</h3>
                                <Badge className={isCurrent ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}>
                                    {isCurrent ? 'In this demo' : 'Planned'}
                                </Badge>
                            </div>
                            <p className="mt-2 text-sm text-ink-muted">{description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}