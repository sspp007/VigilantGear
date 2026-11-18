import { cn } from '@/lib/utils/cn';

const VARIANTS = {
    subtle: 'bg-slate-100 text-ink hover:bg-slate-200',
    plain: 'text-ink hover:bg-slate-100',
    dark: 'bg-navy/70 text-white hover:bg-navy',
};

const SIZES = {
    sm: 'h-9 w-9',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
};

export function IconButton({
    icon: Icon,
    label,
    variant = 'subtle',
    size = 'md',
    type = 'button',
    className,
    ...props
}) {
    return (
        <button
            type={type}
            aria-label={label}
            title={label}
            className={cn(
                'inline-flex shrink-0 items-center justify-center rounded-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 disabled:cursor-not-allowed disabled:opacity-60',
                VARIANTS[variant],
                SIZES[size],
                className,
            )}
            {...props}
        >
            <Icon className="h-5 w-5" aria-hidden="true" />
        </button>
    );
}