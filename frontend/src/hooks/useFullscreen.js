import { useCallback, useEffect, useState } from 'react';

export function useFullscreen(targetRef) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        function handleChange() {
            setIsFullscreen(document.fullscreenElement === targetRef.current);
        }

        document.addEventListener('fullscreenchange', handleChange);
        return () => document.removeEventListener('fullscreenchange', handleChange);
    }, [targetRef]);

    const toggle = useCallback(async () => {
        const element = targetRef.current;
        if (!element) return;

        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            } else {
                await element.requestFullscreen();
            }
        } catch (error) {
            console.warn('Fullscreen is not available.', error);
        }
    }, [targetRef]);

    return { isFullscreen, isSupported: Boolean(document.fullscreenEnabled), toggle };
}