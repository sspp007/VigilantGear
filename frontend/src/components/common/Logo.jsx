import { cn } from '@/lib/utils/cn';

const MARK_SIZES = { md: 'h-8 w-8', lg: 'h-11 w-11' };
const TEXT_SIZES = { md: 'text-xl', lg: 'text-3xl' };

export function LogoMark({ className }) {
    return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
            <path d="M32 4 8 13v17c0 15 10 26 24 30 14-4 24-15 24-30V13L32 4Z" fill="#FF6900" />
            <path d="M19 33a13 13 0 0 1 26 0v3H19v-3Z" fill="#071D35" />
            <path d="M17 38h30v4H17z" fill="#071D35" />
            <path d="m25 46 7 5 7-5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function Logo({ variant = 'dark', size = 'md', className }) {
    return (
        <span className={cn('inline-flex items-center gap-2 font-extrabold tracking-tight', className)}>
            <LogoMark className={cn('shrink-0', MARK_SIZES[size])} />
            <span className={cn(TEXT_SIZES[size], variant === 'light' ? 'text-white' : 'text-ink')}>
                Vigilant<span className="text-brand">Gear</span>
                <sup className="ml-0.5 align-super text-[0.4em] font-semibold">®</sup>
            </span>
        </span>
    );
}