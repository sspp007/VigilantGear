import { ProgressRing } from '@/components/common/ProgressRing';
import { cn } from '@/lib/utils/cn';
import { formatPercent } from '@/lib/utils/format';

export function ComplianceRateCard({ rate, className }) {
    const displayRate = formatPercent(rate);

    return (
        <div className={cn('flex items-center justify-between gap-3 rounded-2xl bg-surface-success p-4', className)}>
            <div className="min-w-0">
                <p className="text-sm font-semibold text-green-800">Compliance Rate</p>
                <p className="text-3xl font-extrabold leading-tight text-ink">{displayRate}</p>
            </div>
            <ProgressRing value={rate} size={64} label={`Compliance rate ${displayRate}`} />
        </div>
    );
}