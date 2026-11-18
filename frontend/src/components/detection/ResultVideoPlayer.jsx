import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useRef, useState } from 'react';
import { IconButton } from '@/components/common/IconButton';
import { SafeImage } from '@/components/common/SafeImage';
import { DetectionOverlay } from '@/components/detection/DetectionOverlay';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useSimulatedPlayback } from '@/hooks/useSimulatedPlayback';
import { IMAGES } from '@/lib/constants/images';
import { cn } from '@/lib/utils/cn';
import { formatClock } from '@/lib/utils/format';

export function ResultVideoPlayer({ video, annotations }) {
    const containerRef = useRef(null);
    const [isMuted, setIsMuted] = useState(false);
    const { isFullscreen, isSupported, toggle: toggleFullscreen } = useFullscreen(containerRef);
    const {
        position,
        isPlaying,
        toggle: togglePlayback,
        seek,
    } = useSimulatedPlayback({
        durationSeconds: video.durationSeconds,
        initialPosition: video.positionSeconds,
    });

    const clock = `${formatClock(position)} / ${formatClock(video.durationSeconds)}`;

    return (
        <div>
            <div
                ref={containerRef}
                className={cn(
                    'relative overflow-hidden bg-slate-900',
                    isFullscreen ? 'flex items-center justify-center' : 'rounded-2xl',
                )}
            >
                <div className={cn('relative aspect-video', isFullscreen ? 'w-[min(100vw,calc(100vh*16/9))]' : 'w-full')}>
                    <SafeImage
                        src={IMAGES.constructionSite}
                        alt="Annotated construction site frame"
                        loading="eager"
                        className="absolute inset-0 h-full w-full"
                    />
                    <DetectionOverlay detections={annotations} />

                    <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-10 text-white sm:gap-3 sm:px-4">
                        <IconButton
                            icon={isPlaying ? Pause : Play}
                            label={isPlaying ? 'Pause video' : 'Play video'}
                            variant="dark"
                            size="sm"
                            onClick={togglePlayback}
                        />
                        <span className="whitespace-nowrap text-sm font-semibold tabular-nums">{clock}</span>
                        <input
                            type="range"
                            min={0}
                            max={video.durationSeconds}
                            step={1}
                            value={Math.floor(position)}
                            onChange={(event) => seek(Number(event.target.value))}
                            aria-label="Seek"
                            aria-valuetext={clock}
                            className="h-1.5 min-w-0 flex-1 cursor-pointer accent-brand"
                        />
                        <IconButton
                            icon={isMuted ? VolumeX : Volume2}
                            label={isMuted ? 'Unmute' : 'Mute'}
                            variant="dark"
                            size="sm"
                            aria-pressed={isMuted}
                            onClick={() => setIsMuted(!isMuted)}
                        />
                        {isSupported && (
                            <IconButton
                                icon={isFullscreen ? Minimize : Maximize}
                                label={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
                                variant="dark"
                                size="sm"
                                onClick={toggleFullscreen}
                            />
                        )}
                    </div>
                </div>
            </div>
            <p className="mt-2 text-xs text-ink-muted">
                {`${video.fileName} · Simulated playback with demo annotations. No real video is processed in this phase.`}
            </p>
        </div>
    );
}