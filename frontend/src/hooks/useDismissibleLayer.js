import { useEffect, useRef } from 'react';

export function useDismissibleLayer(isOpen, onDismiss) {
    const containerRef = useRef(null);
    const onDismissRef = useRef(onDismiss);

    useEffect(() => {
        onDismissRef.current = onDismiss;
    }, [onDismiss]);

    useEffect(() => {
        if (!isOpen) return undefined;

        function handlePointerDown(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                onDismissRef.current();
            }
        }

        function handleKeyDown(event) {
            if (event.key === 'Escape') onDismissRef.current();
        }

        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    return containerRef;
}