import { useCallback, useEffect, useState } from 'react';

const TICK_MS = 250;

export function useSimulatedPlayback({ durationSeconds, initialPosition = 0 }) {
    const [position, setPosition] = useState(initialPosition);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!isPlaying) return undefined;

        const timer = setInterval(() => {
            setPosition((current) => Math.min(durationSeconds, current + TICK_MS / 1000));
        }, TICK_MS);

        return () => clearInterval(timer);
    }, [isPlaying, durationSeconds]);

    useEffect(() => {
        if (isPlaying && position >= durationSeconds) setIsPlaying(false);
    }, [isPlaying, position, durationSeconds]);

    const toggle = useCallback(() => {
        if (position >= durationSeconds) setPosition(0);
        setIsPlaying((current) => !current);
    }, [position, durationSeconds]);

    const seek = useCallback(
        (seconds) => setPosition(Math.min(durationSeconds, Math.max(0, seconds))),
        [durationSeconds],
    );

    return { position, isPlaying, toggle, seek };
}