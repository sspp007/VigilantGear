import { Settings as SettingsIcon } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Toggle } from '@/components/common/Toggle';
import { ConfidenceSlider } from '@/components/settings/ConfidenceSlider';
import { PpeSelector } from '@/components/settings/PpeSelector';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { TIME_ZONE_OPTIONS } from '@/lib/constants/settings';

export function GeneralSection({ draft, errors, onChange }) {
    const { general, ppe, detection, preferences } = draft;

    return (
        <SettingsSection
            icon={SettingsIcon}
            title="General Settings"
            description="Manage organization details and system preferences"
        >
            <Card title="Organization Information">
                <div className="grid gap-4 md:grid-cols-2">
                    <Input
                        label="Organization Name"
                        required
                        value={general.organizationName}
                        onChange={(event) => onChange('general', { organizationName: event.target.value })}
                        error={errors['general.organizationName']}
                    />
                    <Input
                        label="Site / Location"
                        value={general.siteLocation}
                        onChange={(event) => onChange('general', { siteLocation: event.target.value })}
                        error={errors['general.siteLocation']}
                    />
                    <Select
                        label="Time Zone"
                        required
                        options={TIME_ZONE_OPTIONS}
                        value={general.timeZone}
                        onChange={(timeZone) => onChange('general', { timeZone })}
                        error={errors['general.timeZone']}
                    />
                    <Input
                        label="Contact Email"
                        type="email"
                        value={general.contactEmail}
                        onChange={(event) => onChange('general', { contactEmail: event.target.value })}
                        error={errors['general.contactEmail']}
                    />
                </div>
            </Card>

            <Card title="Detection Configuration">
                <div className="space-y-5">
                    <PpeSelector value={ppe} onChange={(next) => onChange('ppe', next)} error={errors.ppe} />
                    <ConfidenceSlider
                        value={detection.confidenceThreshold}
                        onChange={(confidenceThreshold) => onChange('detection', { confidenceThreshold })}
                    />
                </div>
            </Card>

            <Card title="Other Preferences">
                <div className="flex flex-wrap gap-x-10 gap-y-4">
                    <Toggle
                        label="Save Detection Snapshots"
                        checked={preferences.saveSnapshots}
                        onChange={(saveSnapshots) => onChange('preferences', { saveSnapshots })}
                    />
                    <Toggle
                        label="Save Annotated Videos"
                        checked={preferences.saveAnnotatedVideos}
                        onChange={(saveAnnotatedVideos) => onChange('preferences', { saveAnnotatedVideos })}
                    />
                    <Toggle
                        label="Enable Email Notifications"
                        checked={preferences.emailNotifications}
                        onChange={(emailNotifications) => onChange('preferences', { emailNotifications })}
                    />
                </div>
            </Card>
        </SettingsSection>
    );
}