import { cn } from '@/lib/utils/cn';

export function RadioGroup({ legend, name, options, value, onChange, className }) {
    return (
        <fieldset className={cn('flex flex-col', className)}>
            <legend className="mb-1.5 text-sm font-semibold text-ink">{legend}</legend>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
                {options.map((option) => {
                    const inputId = `${name}-${option.value}`;
                    const isChecked = option.value === value;

                    return (
                        <label
                            key={option.value}
                            htmlFor={inputId}
                            className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-ink"
                        >
                            <input
                                id={inputId}
                                type="radio"
                                name={name}
                                value={option.value}
                                checked={isChecked}
                                onChange={() => onChange(option.value)}
                                className="peer sr-only"
                            />
                            <span
                                className={cn(
                                    'flex h-5 w-5 items-center justify-center rounded-full border-2 bg-white transition peer-focus-visible:ring-2 peer-focus-visible:ring-brand/40',
                                    isChecked ? 'border-brand' : 'border-slate-300',
                                )}
                            >
                                {isChecked && <span className="h-2.5 w-2.5 rounded-full bg-brand" />}
                            </span>
                            {option.label}
                        </label>
                    );
                })}
            </div>
        </fieldset>
    );
}