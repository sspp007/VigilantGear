import { AlertTriangle, Ellipsis, Glasses, Hand, Shirt, Users } from 'lucide-react';
import { KpiCard } from '@/components/common/KpiCard';

const CATEGORY_KPI = {
    helmet: { icon: AlertTriangle, tone: 'danger' },
    safety_vest: { icon: Shirt, tone: 'warning' },
    goggles: { icon: Glasses, tone: 'info' },
    gloves: { icon: Hand, tone: 'accent' },
    others: { icon: Ellipsis, tone: 'neutral' },
};

export function ViolationKpiRow({ summary }) {
    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <KpiCard icon={Users} tone="info" value={summary.violations} label="Total Violations" />
            {summary.categories.map((category) => {
                const { icon, tone } = CATEGORY_KPI[category.id];
                return <KpiCard key={category.id} icon={icon} tone={tone} value={category.count} label={category.label} />;
            })}
        </div>
    );
}