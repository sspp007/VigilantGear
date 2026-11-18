import { useId } from 'react';
import { cn } from '@/lib/utils/cn';

export function Toggle({ checked, onChange, label, disabled = false, id, className, ...props }) {
    const generatedId = useId();
    const toggleId = id ?? generatedId;

    return (
        <div className={cn('inline-flex items-center gap-3', className)}>
            <button
                id={toggleId}
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                className={cn(
                    'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
                    checked ? 'bg-brand' : 'bg-slate-300',
                )}
                {...props}
                onClick={() => onChange(!checked)}
            >
                <span
                    className={cn(
                        'inline-block h-5 w-5 rounded-full bg-white shadow transition-transform',
                        checked ? 'translate-x-6' : 'translate-x-1',
                    )}
                />
            </button>
            {label && (
                <label htmlFor={toggleId} className="cursor-pointer text-sm font-semibold text-ink">
                    {label}
                </label>
            )}
        </div>
    );
}