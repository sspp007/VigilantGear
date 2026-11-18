import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useWebcam, WEBCAM_STATUS } from '@/hooks/useWebcam';
import { captureVideoFrame, drawDetections } from '@/lib/utils/overlay';

let track;

function installMediaDevices(overrides = {}) {
    track = { stop: vi.fn(), addEventListener: vi.fn(), getSettings: () => ({ deviceId: 'cam-1' }) };
    const stream = { getTracks: () => [track], getVideoTracks: () => [track] };

    Object.defineProperty(navigator, 'mediaDevices', {
        configurable: true,
        value: {
            getUserMedia: vi.fn().mockResolvedValue(stream),
            enumerateDevices: vi.fn().mockResolvedValue([{ kind: 'videoinput', deviceId: 'cam-1', label: 'Webcam' }]),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            ...overrides,
        },
    });
}

async function renderWebcam() {
    let utils;
    await act(async () => {
        utils = renderHook(() => useWebcam());
    });
    return utils;
}

beforeEach(() => {
    installMediaDevices();
});

afterEach(() => {
    delete navigator.mediaDevices;
});

describe('useWebcam', () => {
    it('starts the camera and lists devices', async () => {
        const { result } = await renderWebcam();

        await act(async () => {
            await result.current.start();
        });

        expect(result.current.status).toBe(WEBCAM_STATUS.LIVE);
        expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ video: true, audio: false });
        expect(result.current.devices).toHaveLength(1);
        expect(result.current.selectedDeviceId).toBe('cam-1');
    });

    it('stops every track when the camera is stopped', async () => {
        const { result } = await renderWebcam();
        await act(async () => {
            await result.current.start();
        });

        act(() => result.current.stop());

        expect(track.stop).toHaveBeenCalledTimes(1);
        expect(result.current.status).toBe(WEBCAM_STATUS.IDLE);
    });

    it('stops every track when the page is left', async () => {
        const { result, unmount } = await renderWebcam();
        await act(async () => {
            await result.current.start();
        });

        unmount();

        expect(track.stop).toHaveBeenCalledTimes(1);
    });

    it('reports a friendly message when permission is denied', async () => {
        navigator.mediaDevices.getUserMedia.mockRejectedValue(
            Object.assign(new Error('denied'), { name: 'NotAllowedError' }),
        );
        const { result } = await renderWebcam();

        await act(async () => {
            await result.current.start();
        });

        expect(result.current.status).toBe(WEBCAM_STATUS.ERROR);
        expect(result.current.error).toMatch(/permission was denied/i);
    });

    it('reports unsupported browsers', async () => {
        installMediaDevices({ getUserMedia: undefined });
        const { result } = await renderWebcam();

        await act(async () => {
            await result.current.start();
        });

        expect(result.current.status).toBe(WEBCAM_STATUS.ERROR);
        expect(result.current.error).toMatch(/does not support/i);
    });
});

describe('overlay helpers', () => {
    const detections = [
        { status: 'compliant', label: 'Compliant', confidence: 0.98, box: { left: 10, top: 30, width: 20, height: 60 } },
        { status: 'violation', label: 'Violation (No Helmet)', box: { left: 50, top: 30, width: 20, height: 60 } },
    ];

    it('draws one box and one label per detection', () => {
        const context = {
            strokeRect: vi.fn(),
            fillRect: vi.fn(),
            fillText: vi.fn(),
            measureText: () => ({ width: 80 }),
        };

        drawDetections(context, 800, 450, detections);

        expect(context.strokeRect).toHaveBeenCalledTimes(2);
        expect(context.fillText).toHaveBeenCalledWith('Compliant (0.98)', expect.any(Number), expect.any(Number));
        expect(context.fillText).toHaveBeenCalledWith('Violation (No Helmet)', expect.any(Number), expect.any(Number));
    });

    it('refuses to capture before the video has a frame', async () => {
        await expect(captureVideoFrame({ video: { videoWidth: 0, videoHeight: 0 }, detections })).rejects.toThrow(
            'not ready',
        );
    });
});