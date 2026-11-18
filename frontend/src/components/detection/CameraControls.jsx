import { Camera, Square, Video } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Select } from '@/components/common/Select';
import { WEBCAM_STATUS } from '@/hooks/useWebcam';

const DEFAULT_CAMERA_OPTIONS = [{ value: '', label: 'Default camera' }];

export function CameraControls({
    status,
    devices,
    selectedDeviceId,
    onStart,
    onStop,
    onCapture,
    onSelectDevice,
}) {
    const isLive = status === WEBCAM_STATUS.LIVE;
    const isStarting = status === WEBCAM_STATUS.STARTING;

    const options = devices.length
        ? devices.map((device, index) => ({ value: device.deviceId, label: device.label || `Camera ${index + 1}` }))
        : DEFAULT_CAMERA_OPTIONS;
    const selectedValue = options.some((option) => option.value === selectedDeviceId)
        ? selectedDeviceId
        : options[0].value;

    return (
        <div className="flex flex-wrap items-center gap-3 p-4">
            <Button variant="info" icon={Video} isLoading={isStarting} disabled={isLive} onClick={onStart}>
                Start Camera
            </Button>
            <Button variant="danger" icon={Square} disabled={!isLive && !isStarting} onClick={onStop}>
                Stop Camera
            </Button>
            <Button variant="violet" icon={Camera} disabled={!isLive} onClick={onCapture}>
                Capture Frame
            </Button>

            <span className="hidden h-8 w-px bg-line sm:block" aria-hidden="true" />

            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-ink-muted" aria-hidden="true">
                    Camera:
                </span>
                <Select
                    aria-label="Camera"
                    options={options}
                    value={selectedValue}
                    onChange={onSelectDevice}
                    disabled={isStarting}
                    className="w-52"
                />
            </div>
        </div>
    );
}