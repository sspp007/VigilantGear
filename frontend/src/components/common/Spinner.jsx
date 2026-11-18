import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function Spinner({ className, label }) {
    const accessibility = label ? { role: 'status', 'aria-label': label } : { 'aria-hidden': true };
    return <Loader2 className={cn('h-5 w-5 animate-spin', className)} {...accessibility} />;
}

export function LoadingState({ label = 'Loading…', className }) {
    return (
        <div
            role="status"
            className={cn('flex items-center justify-center gap-2 py-12 text-sm font-medium text-ink-muted', className)}
        >
            <Spinner className="text-brand" />
            <span>{label}</span>
        </div>
    );
}