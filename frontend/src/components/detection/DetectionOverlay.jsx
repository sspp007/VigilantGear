import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { drawDetections } from '@/lib/utils/overlay';

export function DetectionOverlay({ detections, className }) {
    const canvasRef = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const observer = new ResizeObserver(([entry]) => {
            setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
        });
        observer.observe(canvasRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context || size.width === 0) return;

        const ratio = window.devicePixelRatio || 1;
        canvas.width = Math.round(size.width * ratio);
        canvas.height = Math.round(size.height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        context.clearRect(0, 0, size.width, size.height);
        drawDetections(context, size.width, size.height, detections);
    }, [detections, size]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
        />
    );
}