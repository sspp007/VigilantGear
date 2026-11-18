import { cn } from '@/lib/utils/cn';

export function ProgressRing({
    value,
    size = 64,
    strokeWidth = 8,
    label,
    className,
    trackClassName = 'stroke-green-100',
    indicatorClassName = 'stroke-green-500',
}) {
    const clamped = Math.min(100, Math.max(0, value));
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - clamped / 100);

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            role="img"
            aria-label={label ?? `${clamped}%`}
            className={cn('shrink-0 -rotate-90', className)}
        >
            <circle cx={center} cy={center} r={radius} fill="none" strokeWidth={strokeWidth} className={trackClassName} />
            <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className={cn('transition-[stroke-dashoffset] duration-700', indicatorClassName)}
            />
        </svg>
    );
}