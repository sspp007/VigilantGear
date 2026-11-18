import { format } from 'date-fns';
import { Info } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/common/Card';
import { CameraControls } from '@/components/detection/CameraControls';
import { LiveCounters } from '@/components/detection/LiveCounters';
import { LiveVideoStage } from '@/components/detection/LiveVideoStage';
import { RealtimeDetections } from '@/components/detection/RealtimeDetections';
import { useLiveDetections } from '@/hooks/useLiveDetections';
import { useWebcam } from '@/hooks/useWebcam';
import { downloadBlob } from '@/lib/utils/download';
import { captureVideoFrame } from '@/lib/utils/overlay';

export function LiveDetectionPage() {
    const { videoRef, status, error, devices, selectedDeviceId, isLive, start, stop, selectDevice } = useWebcam();
    const detections = useLiveDetections(isLive);

    async function handleCapture() {
        try {
            const blob = await captureVideoFrame({ video: videoRef.current, detections });
            downloadBlob(`vigilantgear_frame_${format(new Date(), 'yyyyMMdd_HHmmss')}.png`, blob);
            toast.success('Frame captured and saved.');
        } catch (captureError) {
            toast.error(captureError.message);
        }
    }

    return (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_21rem]">
            <Card padded={false} className="self-start">
                <div className="p-4 pb-0">
                    <LiveVideoStage
                        videoRef={videoRef}
                        status={status}
                        error={error}
                        detections={detections}
                        onStart={() => start()}
                    />
                </div>
                <CameraControls
                    status={status}
                    devices={devices}
                    selectedDeviceId={selectedDeviceId}
                    onStart={() => start()}
                    onStop={stop}
                    onCapture={handleCapture}
                    onSelectDevice={selectDevice}
                />
                <p className="flex items-start gap-2 border-t border-line px-4 py-3 text-xs text-ink-muted">
                    <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    The camera feed is real, but the detection boxes and counters are simulated demo data. YOLO inference is
                    added in a later phase.
                </p>
            </Card>

            <div className="flex flex-col gap-5">
                <LiveCounters detections={detections} />
                <RealtimeDetections detections={detections} isLive={isLive} />
            </div>
        </div>
    );
}