import { cn } from '@/lib/utils/cn';

export function SettingsSection({ icon: Icon, title, description, className, children }) {
    return (
        <section className={cn('space-y-5', className)}>
            <header className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-ink">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                    <h2 className="text-xl font-extrabold text-ink">{title}</h2>
                    <p className="text-sm font-medium text-blue-900">{description}</p>
                </div>
            </header>
            {children}
        </section>
    );
}