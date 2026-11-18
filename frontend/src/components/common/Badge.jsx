import { cn } from '@/lib/utils/cn';

export function Badge({ className, children }) {
    return (
        <span
            className={cn(
                'inline-flex items-center whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold',
                className,
            )}
        >
            {children}
        </span>
    );
}