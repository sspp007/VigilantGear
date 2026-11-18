import { useEffect, useState } from 'react';
import { fetchLiveDetections } from '@/lib/api/detectionService';

const REFRESH_INTERVAL_MS = 1500;
const CONFIDENCE_JITTER = 0.02;
const POSITION_JITTER = 0.6;
const MIN_CONFIDENCE = 0.8;
const MAX_CONFIDENCE = 0.99;

function jitter(detection) {
    const confidence = detection.confidence + (Math.random() - 0.5) * CONFIDENCE_JITTER;
    const shift = (Math.random() - 0.5) * POSITION_JITTER;

    return {
        ...detection,
        confidence: Number(Math.min(MAX_CONFIDENCE, Math.max(MIN_CONFIDENCE, confidence)).toFixed(2)),
        box: { ...detection.box, left: detection.box.left + shift },
    };
}

export function useLiveDetections(isLive) {
    const [detections, setDetections] = useState([]);

    useEffect(() => {
        if (!isLive) {
            setDetections((current) => (current.length > 0 ? [] : current));
            return undefined;
        }

        let isActive = true;
        let timer;

        fetchLiveDetections().then((baseDetections) => {
            if (!isActive) return;
            setDetections(baseDetections);
            timer = setInterval(() => setDetections(baseDetections.map(jitter)), REFRESH_INTERVAL_MS);
        });

        return () => {
            isActive = false;
            clearInterval(timer);
        };
    }, [isLive]);

    return detections;
}