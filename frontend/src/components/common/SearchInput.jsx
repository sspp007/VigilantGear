import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function SearchInput({ value, onChange, placeholder = 'Search…', ariaLabel, className }) {
    return (
        <div className={cn('relative', className)}>
            <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted"
                aria-hidden="true"
            />
            <input
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                aria-label={ariaLabel ?? placeholder}
                className="field-input appearance-none pl-11 pr-10 [&::-webkit-search-cancel-button]:hidden"
            />
            {value && (
                <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => onChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-muted transition hover:bg-slate-100 hover:text-ink"
                >
                    <X className="h-4 w-4" aria-hidden="true" />
                </button>
            )}
        </div>
    );
}