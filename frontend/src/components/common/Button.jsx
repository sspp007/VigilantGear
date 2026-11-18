import { Spinner } from '@/components/common/Spinner';
import { cn } from '@/lib/utils/cn';

const BASE =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

const VARIANTS = {
    primary: 'bg-brand text-white shadow-soft hover:bg-brand-dark focus-visible:ring-brand/50',
    secondary: 'border border-line bg-white text-ink hover:bg-slate-50 focus-visible:ring-slate-300',
    outline: 'border border-white/70 text-white hover:bg-white/10 focus-visible:ring-white/60',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-400',
    info: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-400',
    violet: 'bg-violet-600 text-white hover:bg-violet-700 focus-visible:ring-violet-400',
    ghost: 'text-ink-muted hover:bg-slate-100 hover:text-ink focus-visible:ring-slate-300',
};

const SIZES = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-5 text-sm',
    lg: 'h-12 px-6 text-base',
};

export function Button({
    as: Component = 'button',
    variant = 'primary',
    size = 'md',
    icon: Icon,
    isLoading = false,
    fullWidth = false,
    disabled = false,
    type = 'button',
    className,
    children,
    ...props
}) {
    const buttonProps = Component === 'button' ? { type, disabled: disabled || isLoading } : {};

    let leading = null;
    if (isLoading) {
        leading = <Spinner className="h-4 w-4" />;
    } else if (Icon) {
        leading = <Icon className="h-4 w-4" aria-hidden="true" />;
    }

    return (
        <Component
            className={cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && 'w-full', className)}
            {...buttonProps}
            {...props}
        >
            {leading}
            {children}
        </Component>
    );
}