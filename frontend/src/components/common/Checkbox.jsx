import { Check } from 'lucide-react';
import { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils/cn';

export const Checkbox = forwardRef(function Checkbox({ id, label, error, className, ...props }, ref) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
        <div className={className}>
            <label htmlFor={inputId} className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-ink">
                <input ref={ref} id={inputId} type="checkbox" className="peer sr-only" {...props} />
                <span
                    className={cn(
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-slate-300 bg-white text-transparent transition',
                        'peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white',
                        'peer-focus-visible:ring-2 peer-focus-visible:ring-brand/40 peer-disabled:opacity-50',
                        error && 'border-red-400',
                    )}
                >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                {label}
            </label>
            {error && (
                <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
});