import { Camera } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Select } from '@/components/common/Select';
import { ConfidenceSlider } from '@/components/settings/ConfidenceSlider';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { FRAME_INTERVAL_OPTIONS } from '@/lib/constants/settings';

export function DetectionSection({ draft, onChange }) {
    const { detection } = draft;

    return (
        <SettingsSection
            icon={Camera}
            title="Detection Settings"
            description="Tune how detections are scored and sampled"
        >
            <Card title="Confidence Threshold">
                <ConfidenceSlider
                    value={detection.confidenceThreshold}
                    onChange={(confidenceThreshold) => onChange('detection', { confidenceThreshold })}
                />
            </Card>
            <Card title="Video Frame Sampling">
                <Select
                    label="Video Frame Sampling Interval"
                    options={FRAME_INTERVAL_OPTIONS}
                    value={detection.frameSamplingInterval}
                    onChange={(frameSamplingInterval) => onChange('detection', { frameSamplingInterval })}
                    hint="Shorter intervals analyze more frames but take longer. Applied when real analysis is added."
                    className="max-w-sm"
                />
            </Card>
        </SettingsSection>
    );
}