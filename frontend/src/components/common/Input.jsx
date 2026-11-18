import { forwardRef, useId } from 'react';
import { FormField } from '@/components/common/FormField';
import { cn } from '@/lib/utils/cn';

export const Input = forwardRef(function Input(
    { id, label, error, hint, required = false, icon: Icon, endAdornment, className, inputClassName, ...props },
    ref,
) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    let describedBy;
    if (error) describedBy = `${inputId}-error`;
    else if (hint) describedBy = `${inputId}-hint`;

    return (
        <FormField id={inputId} label={label} required={required} error={error} hint={hint} className={className}>
            <div className="relative">
                {Icon && (
                    <Icon
                        className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                        aria-hidden="true"
                    />
                )}
                <input
                    ref={ref}
                    id={inputId}
                    aria-invalid={Boolean(error)}
                    aria-required={required || undefined}
                    aria-describedby={describedBy}
                    className={cn(
                        'field-input',
                        Icon && 'pl-11',
                        endAdornment && 'pr-12',
                        error && 'border-red-400 focus:border-red-500 focus:ring-red-200',
                        inputClassName,
                    )}
                    {...props}
                />
                {endAdornment && <div className="absolute right-2 top-1/2 -translate-y-1/2">{endAdornment}</div>}
            </div>
        </FormField>
    );
});