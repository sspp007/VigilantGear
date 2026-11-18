import { Info } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { getSystemInfo } from '@/lib/api/settingsService';

export function SystemSection() {
    const items = getSystemInfo();

    return (
        <SettingsSection icon={Info} title="System Information" description="Version and connection status">
            <Card>
                <dl className="divide-y divide-line">
                    {items.map((item) => (
                        <div key={item.id} className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                            <dt className="text-ink-muted">{item.label}</dt>
                            <dd className="break-all font-bold text-ink">{item.value}</dd>
                        </div>
                    ))}
                </dl>
            </Card>
        </SettingsSection>
    );
}