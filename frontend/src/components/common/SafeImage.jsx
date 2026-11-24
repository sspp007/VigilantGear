import { useState } from 'react';
import { SafetyVisual } from '@/components/common/SafetyVisual';
import { cn } from '@/lib/utils/cn';

export function SafeImage({
    src,
    alt,
    className,
    variant,
    loading = 'lazy',
    ...props
}) {
    const [failedSrc, setFailedSrc] = useState(null);

    if (!src || failedSrc === src) {
        const visualVariant = variant ?? (src?.includes('thumb') || src?.includes('construction') ? 'video' : src?.includes('live') ? 'live' : 'snapshot');
        return (
            <SafetyVisual variant={visualVariant} label={alt} className={className} />
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            loading={loading}
            onError={() => setFailedSrc(src)}
            className={cn('object-cover', className)}
            {...props}
        />
    );
}
