import { Database, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Select } from '@/components/common/Select';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { clearDemoData, getStorageBreakdown } from '@/lib/api/demoDataService';
import { RETENTION_OPTIONS } from '@/lib/constants/settings';
import { formatBytes } from '@/lib/utils/format';

export function StorageSection({ draft, onChange, onDemoDataCleared }) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const breakdown = getStorageBreakdown();
    const totalBytes = breakdown.reduce((total, item) => total + item.bytes, 0);

    function handleDelete() {
        clearDemoData();
        onDemoDataCleared();
        setIsConfirmOpen(false);
        toast.success('Demo data was reset.');
    }

    return (
        <SettingsSection
            icon={Database}
            title="Storage & Retention"
            description="Review demo storage use and set retention preferences"
        >
            <Card title="Retention">
                <Select
                    label="Keep detection data for"
                    options={RETENTION_OPTIONS}
                    value={draft.storage.retentionDays}
                    onChange={(retentionDays) => onChange('storage', { retentionDays })}
                    hint="Saved as a preference. Automatic deletion needs the backend (Phase 2)."
                    className="max-w-sm"
                />
            </Card>

            <Card title="Demo Storage Use">
                <dl className="divide-y divide-line">
                    {breakdown.map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-2.5 text-sm">
                            <dt className="text-ink-muted">{item.label}</dt>
                            <dd className="font-bold text-ink">{formatBytes(item.bytes)}</dd>
                        </div>
                    ))}
                    <div className="flex items-center justify-between py-2.5 text-sm">
                        <dt className="font-bold text-ink">Total</dt>
                        <dd className="font-extrabold text-ink">{formatBytes(totalBytes)}</dd>
                    </div>
                </dl>
                <p className="mt-2 text-xs text-ink-muted">Sizes are estimated from the demonstration data.</p>
            </Card>

            <Card title="Demonstration Data" subtitle="Resets settings, notifications, analysis jobs and generated reports.">
                <Button variant="danger" icon={Trash2} onClick={() => setIsConfirmOpen(true)}>
                    Delete Demo Data
                </Button>
                <p className="mt-2 text-xs text-ink-muted">Your account and sign-in session are kept.</p>
            </Card>

            <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Delete demo data?"
                description="This resets the demonstration data stored in this browser. It cannot be undone."
                confirmLabel="Delete"
                tone="danger"
            />
        </SettingsSection>
    );
}