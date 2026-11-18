import { Check, CircleHelp, Users, X } from 'lucide-react';
import { ComplianceRateCard } from '@/components/common/ComplianceRateCard';
import { KpiCard } from '@/components/common/KpiCard';
import { cn } from '@/lib/utils/cn';

export function KpiSummaryRow({ summary, className }) {
    return (
        <div className={cn('grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5', className)}>
            <KpiCard icon={Users} tone="info" value={summary.total} label="Total Detections" />
            <KpiCard icon={Check} tone="success" value={summary.compliant} label="Compliant" />
            <KpiCard icon={X} tone="danger" value={summary.violations} label="Violations" />
            <KpiCard icon={CircleHelp} tone="warning" value={summary.uncertain} label="Uncertain" />
            <ComplianceRateCard rate={summary.complianceRate} />
        </div>
    );
}