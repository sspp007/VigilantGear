import { ChevronDown } from 'lucide-react';
import { useId } from 'react';
import { FormField } from '@/components/common/FormField';
import { cn } from '@/lib/utils/cn';

export function Select({
    id,
    label,
    options,
    value,
    onChange,
    error,
    hint,
    required = false,
    icon: Icon,
    className,
    selectClassName,
    ...props
}) {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    function handleChange(event) {
        const selected = options.find((option) => String(option.value) === event.target.value);
        if (selected) onChange?.(selected.value);
    }

    return (
        <FormField id={selectId} label={label} required={required} error={error} hint={hint} className={className}>
            <div className="relative">
                {Icon && (
                    <Icon
                        className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted"
                        aria-hidden="true"
                    />
                )}
                <select
                    id={selectId}
                    value={String(value)}
                    onChange={handleChange}
                    aria-invalid={Boolean(error)}
                    className={cn(
                        'field-input cursor-pointer appearance-none pr-10 font-medium',
                        Icon && 'pl-11',
                        error && 'border-red-400 focus:border-red-500 focus:ring-red-200',
                        selectClassName,
                    )}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={String(option.value)} value={String(option.value)}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink"
                    aria-hidden="true"
                />
            </div>
        </FormField>
    );
}