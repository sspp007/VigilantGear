import { HardHat } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { PpeSelector } from '@/components/settings/PpeSelector';
import { SettingsSection } from '@/components/settings/SettingsSection';

export function PpeSection({ draft, errors, onChange }) {
    return (
        <SettingsSection
            icon={HardHat}
            title="PPE Configuration"
            description="Choose which PPE types are checked for compliance"
        >
            <Card title="PPE to Detect" subtitle="Only enabled types are included in compliance checks.">
                <PpeSelector variant="cards" value={draft.ppe} onChange={(next) => onChange('ppe', next)} error={errors.ppe} />
            </Card>
        </SettingsSection>
    );
}