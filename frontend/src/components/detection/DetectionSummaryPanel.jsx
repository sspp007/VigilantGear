import { Check, CircleHelp, Percent, Users, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { SafeImage } from '@/components/common/SafeImage';
import { StatRow } from '@/components/common/StatRow';
import { StatusBadge } from '@/components/common/StatusBadge';
import { getPanelId, getTabId, Tabs } from '@/components/common/Tabs';
import { getPpeLabel } from '@/lib/constants/ppe';
import { DETECTION_STATUS } from '@/lib/constants/status';
import { formatDateTime, formatPercent } from '@/lib/utils/format';

const TAB_PREFIX = 'detection-results';

function SummaryStats({ summary }) {
    return (
        <div className="space-y-2">
            <StatRow icon={Users} label="Total Detections" value={summary.total} />
            <StatRow icon={Check} tone="success" label="Compliant" value={summary.compliant} />
            <StatRow icon={X} tone="danger" label="Violations" value={summary.violations} />
            <StatRow icon={CircleHelp} tone="warning" label="Uncertain" value={summary.uncertain} />
            <StatRow icon={Percent} tone="success" label="Compliance Rate" value={formatPercent(summary.complianceRate)} />
        </div>
    );
}

function DetectionList({ rows, onSelect }) {
    if (rows.length === 0) {
        return <EmptyState title="Nothing to show" description="No detections match this tab." className="py-6" />;
    }

    return (
        <ul className="max-h-80 divide-y divide-line overflow-y-auto">
            {rows.map((row) => (
                <li key={row.id}>
                    <button
                        type="button"
                        onClick={() => onSelect(row)}
                        className="flex w-full items-center gap-3 rounded-xl py-2.5 text-left transition hover:bg-slate-50"
                    >
                        <SafeImage src={row.snapshot} alt={`Snapshot of ${row.personId}`} variant="snapshot" className="h-10 w-10 shrink-0 rounded-lg" />
                        <span className="min-w-0 flex-1">
                            <span className="block text-sm font-bold text-ink">{row.personId}</span>
                            <span className="block truncate text-xs text-ink-muted">
                                {row.missingPpe.length > 0
                                    ? `Missing: ${row.missingPpe.map(getPpeLabel).join(', ')}`
                                    : formatDateTime(row.timestamp)}
                            </span>
                        </span>
                        <StatusBadge status={row.status} />
                    </button>
                </li>
            ))}
        </ul>
    );
}

export function DetectionSummaryPanel({ summary, rows, onSelectRow }) {
    const [activeTab, setActiveTab] = useState('summary');
    const violationRows = useMemo(() => rows.filter((row) => row.status === DETECTION_STATUS.VIOLATION), [rows]);

    const tabs = [
        { id: 'summary', label: 'Summary' },
        { id: 'detections', label: `Detections (${rows.length})` },
        { id: 'violations', label: `Violations (${violationRows.length})` },
    ];

    return (
        <Card padded={false} className="self-start">
            <Tabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} idPrefix={TAB_PREFIX} className="px-4 pt-2" />
            <div role="tabpanel" id={getPanelId(TAB_PREFIX)} aria-labelledby={getTabId(TAB_PREFIX, activeTab)} className="p-4">
                {activeTab === 'summary' && <SummaryStats summary={summary} />}
                {activeTab === 'detections' && <DetectionList rows={rows} onSelect={onSelectRow} />}
                {activeTab === 'violations' && <DetectionList rows={violationRows} onSelect={onSelectRow} />}
            </div>
        </Card>
    );
}
