import { CameraOff, Maximize, Minimize, Video } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/common/Button';
import { IconButton } from '@/components/common/IconButton';
import { SafeImage } from '@/components/common/SafeImage';
import { Spinner } from '@/components/common/Spinner';
import { DetectionOverlay } from '@/components/detection/DetectionOverlay';
import { useFullscreen } from '@/hooks/useFullscreen';
import { WEBCAM_STATUS } from '@/hooks/useWebcam';
import { IMAGES } from '@/lib/constants/images';
import { cn } from '@/lib/utils/cn';

function StageMessage({ status, error, onStart }) {
    if (status === WEBCAM_STATUS.STARTING) {
        return (
            <>
                <Spinner className="h-8 w-8 text-white" label="Starting camera" />
                <p className="font-semibold">Starting camera…</p>
                <p className="text-sm text-slate-200">Allow camera access if your browser asks.</p>
            </>
        );
    }

    if (status === WEBCAM_STATUS.ERROR) {
        return (
            <>
                <CameraOff className="h-10 w-10" aria-hidden="true" />
                <p className="max-w-md font-semibold">{error}</p>
                <Button variant="info" icon={Video} onClick={onStart}>
                    Try again
                </Button>
            </>
        );
    }

    return (
        <>
            <Video className="h-10 w-10" aria-hidden="true" />
            <p className="text-lg font-bold">Camera is off</p>
            <p className="max-w-sm text-sm text-slate-200">
                Start the camera to see your live feed with simulated PPE detection overlays.
            </p>
            <Button variant="info" icon={Video} onClick={onStart}>
                Start Camera
            </Button>
        </>
    );
}

export function LiveVideoStage({ videoRef, status, error, detections, onStart }) {
    const containerRef = useRef(null);
    const { isFullscreen, isSupported, toggle } = useFullscreen(containerRef);
    const isLive = status === WEBCAM_STATUS.LIVE;

    return (
        <div
            ref={containerRef}
            className={cn('relative overflow-hidden bg-slate-900', isFullscreen ? 'flex items-center justify-center' : 'rounded-2xl')}
        >
            <div
                className={cn('relative aspect-video', isFullscreen ? 'w-[min(100vw,calc(100vh*16/9))]' : 'w-full')}
            >
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    aria-label="Live camera feed"
                    className={cn('h-full w-full object-cover', !isLive && 'hidden')}
                />

                {!isLive && (
                    <>
                        <SafeImage
                            src={IMAGES.liveFrame}
                            alt="Camera preview placeholder"
                            loading="eager"
                            variant="live"
                            className="absolute inset-0 h-full w-full opacity-50"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-navy/60 p-6 text-center text-white">
                            <StageMessage status={status} error={error} onStart={onStart} />
                        </div>
                    </>
                )}

                {isLive && <DetectionOverlay detections={detections} />}

                {isLive && (
                    <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-bold text-white shadow">
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" aria-hidden="true" />
                        LIVE
                    </span>
                )}

                {isSupported && (
                    <IconButton
                        icon={isFullscreen ? Minimize : Maximize}
                        label={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
                        variant="dark"
                        className="absolute right-4 top-4"
                        onClick={toggle}
                    />
                )}
            </div>
        </div>
    );
}
