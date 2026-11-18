import { cn } from '@/lib/utils/cn';

export function PageHeader({ icon: Icon, title, subtitle, className }) {
    return (
        <div className={cn('flex min-w-0 items-center gap-3', className)}>
            {Icon && (
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-ink shadow-soft">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
            )}
            <div className="min-w-0">
                <h1 className="truncate text-xl font-extrabold leading-tight text-ink sm:text-2xl">{title}</h1>
                {subtitle && <p className="truncate text-sm font-medium text-blue-900">{subtitle}</p>}
            </div>
        </div>
    );
}