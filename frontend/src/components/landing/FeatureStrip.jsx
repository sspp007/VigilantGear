import { FEATURE_STRIP } from '@/lib/constants/landing';
import { cn } from '@/lib/utils/cn';

export function FeatureStrip() {
    return (
        <section aria-label="Platform highlights" className="bg-white">
            <ul className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
                {FEATURE_STRIP.map(({ icon: Icon, title, description, tile }) => (
                    <li key={title} className="flex items-center gap-4">
                        <span className={cn('flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl', tile)}>
                            <Icon className="h-8 w-8" aria-hidden="true" />
                        </span>
                        <div>
                            <h2 className="text-base font-bold text-ink">{title}</h2>
                            <p className="text-sm text-ink-muted">{description}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}