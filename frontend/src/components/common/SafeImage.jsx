import { ImageOff } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

export function SafeImage({
    src,
    alt,
    className,
    fallbackIcon: FallbackIcon = ImageOff,
    loading = 'lazy',
    ...props
}) {
    const [failedSrc, setFailedSrc] = useState(null);

    if (!src || failedSrc === src) {
        return (
            <div
                role="img"
                aria-label={alt}
                className={cn(
                    'flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 text-slate-400',
                    className,
                )}
            >
                <FallbackIcon className="h-1/3 w-1/3 min-h-4 min-w-4" aria-hidden="true" />
            </div>
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