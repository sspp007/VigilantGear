import { useCallback, useEffect, useRef, useState } from 'react';

export const WEBCAM_STATUS = Object.freeze({
    IDLE: 'idle',
    STARTING: 'starting',
    LIVE: 'live',
    ERROR: 'error',
});

const ERROR_MESSAGES = {
    NotAllowedError: 'Camera permission was denied. Allow camera access in your browser settings and try again.',
    NotFoundError: 'No camera was found on this device.',
    NotReadableError: 'The camera is in use by another application.',
    OverconstrainedError: 'The selected camera is unavailable. Choose another camera.',
    SecurityError: 'Camera access requires a secure connection (HTTPS or localhost).',
};
const FALLBACK_ERROR = 'Unable to start the camera. Please try again.';
const UNSUPPORTED_ERROR = 'This browser does not support camera access.';
const DISCONNECTED_ERROR = 'The camera was disconnected.';

function releaseStream(stream) {
    stream?.getTracks().forEach((track) => track.stop());
}

export function useWebcam() {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const requestRef = useRef(0);
    const [status, setStatus] = useState(WEBCAM_STATUS.IDLE);
    const [error, setError] = useState(null);
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState('');

    const refreshDevices = useCallback(async () => {
        if (!navigator.mediaDevices?.enumerateDevices) return;
        try {
            const allDevices = await navigator.mediaDevices.enumerateDevices();
            setDevices(allDevices.filter((device) => device.kind === 'videoinput'));
        } catch (caught) {
            console.warn('Unable to list cameras.', caught);
        }
    }, []);

    const release = useCallback(() => {
        requestRef.current += 1;
        releaseStream(streamRef.current);
        streamRef.current = null;
        if (videoRef.current) videoRef.current.srcObject = null;
    }, []);

    const stop = useCallback(() => {
        release();
        setError(null);
        setStatus(WEBCAM_STATUS.IDLE);
    }, [release]);

    const start = useCallback(
        async (deviceId) => {
            if (!navigator.mediaDevices?.getUserMedia) {
                setError(UNSUPPORTED_ERROR);
                setStatus(WEBCAM_STATUS.ERROR);
                return;
            }

            release();
            const requestId = requestRef.current;
            const targetDeviceId = deviceId ?? selectedDeviceId;
            setError(null);
            setStatus(WEBCAM_STATUS.STARTING);

            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: targetDeviceId ? { deviceId: { exact: targetDeviceId } } : true,
                    audio: false,
                });

                if (requestId !== requestRef.current) {
                    releaseStream(stream);
                    return;
                }

                streamRef.current = stream;
                const [track] = stream.getVideoTracks();
                track.addEventListener('ended', () => {
                    if (streamRef.current !== stream) return;
                    release();
                    setError(DISCONNECTED_ERROR);
                    setStatus(WEBCAM_STATUS.ERROR);
                });

                setSelectedDeviceId(track.getSettings().deviceId ?? targetDeviceId ?? '');
                if (videoRef.current) videoRef.current.srcObject = stream;
                setStatus(WEBCAM_STATUS.LIVE);
                await refreshDevices();
            } catch (caught) {
                if (requestId !== requestRef.current) return;
                setError(ERROR_MESSAGES[caught.name] ?? FALLBACK_ERROR);
                setStatus(WEBCAM_STATUS.ERROR);
            }
        },
        [release, refreshDevices, selectedDeviceId],
    );

    const selectDevice = useCallback(
        (deviceId) => {
            setSelectedDeviceId(deviceId);
            if (status === WEBCAM_STATUS.LIVE) start(deviceId);
        },
        [status, start],
    );

    useEffect(() => release, [release]);

    useEffect(() => {
        refreshDevices();
        const mediaDevices = navigator.mediaDevices;
        mediaDevices?.addEventListener?.('devicechange', refreshDevices);
        return () => mediaDevices?.removeEventListener?.('devicechange', refreshDevices);
    }, [refreshDevices]);

    return {
        videoRef,
        status,
        error,
        devices,
        selectedDeviceId,
        isLive: status === WEBCAM_STATUS.LIVE,
        start,
        stop,
        selectDevice,
    };
}