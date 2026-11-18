import { cn } from '@/lib/utils/cn';

export function FormField({ id, label, required = false, error, hint, className, children }) {
    return (
        <div className={cn('flex flex-col gap-1.5', className)}>
            {label && (
                <label htmlFor={id} className="text-sm font-semibold text-ink">
                    {label}
                    {required && (
                        <span className="ml-0.5 text-red-500" aria-hidden="true">
                            *
                        </span>
                    )}
                </label>
            )}
            {children}
            {error && (
                <p id={`${id}-error`} role="alert" className="text-xs font-medium text-red-600">
                    {error}
                </p>
            )}
            {!error && hint && (
                <p id={`${id}-hint`} className="text-xs text-ink-muted">
                    {hint}
                </p>
            )}
        </div>
    );
}