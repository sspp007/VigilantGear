import { cn } from '@/lib/utils/cn';

export function Card({
    as: Component = 'section',
    title,
    subtitle,
    action,
    padded = true,
    className,
    bodyClassName,
    children,
}) {
    const hasHeader = Boolean(title || action);

    return (
        <Component className={cn('card', className)}>
            {hasHeader && (
                <header className="flex items-start justify-between gap-3 px-5 pt-5">
                    <div className="min-w-0">
                        {title && <h2 className="text-lg font-bold text-ink">{title}</h2>}
                        {subtitle && <p className="mt-0.5 text-sm text-ink-muted">{subtitle}</p>}
                    </div>
                    {action}
                </header>
            )}
            <div className={cn(padded && (hasHeader ? 'px-5 pb-5 pt-3' : 'p-5'), bodyClassName)}>{children}</div>
        </Component>
    );
}