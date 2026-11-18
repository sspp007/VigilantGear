import { useState } from 'react';
import { CategoryDonut } from '@/components/charts/CategoryDonut';
import { TrendChart } from '@/components/charts/TrendChart';
import { Card } from '@/components/common/Card';
import { DateRangeSelect } from '@/components/common/DateRangeSelect';
import { ErrorState } from '@/components/common/ErrorState';
import { KpiSummaryRow } from '@/components/common/KpiSummaryRow';
import { LoadingState } from '@/components/common/Spinner';
import { RecentViolations } from '@/components/dashboard/RecentViolations';
import { useAsyncData } from '@/hooks/useAsyncData';
import { fetchDashboard } from '@/lib/api/dashboardService';
import { DASHBOARD_RANGES, DEFAULT_DASHBOARD_RANGE, findRange } from '@/lib/constants/dateRanges';
import { DETECTION_STATUS, STATUS_META } from '@/lib/constants/status';
import { cn } from '@/lib/utils/cn';

const TREND_SERIES = [
    { key: 'compliant', label: 'Compliant', color: STATUS_META[DETECTION_STATUS.COMPLIANT].color },
    { key: 'violations', label: 'Violation', color: '#EF4444' },
];

export function DashboardPage() {
    const [rangeId, setRangeId] = useState(DEFAULT_DASHBOARD_RANGE.id);
    const range = findRange(DASHBOARD_RANGES, rangeId);
    const { data, isLoading, error, reload } = useAsyncData(() => fetchDashboard(range), [range.id]);

    return (
        <div className="space-y-5">
            <div className="flex justify-end">
                <DateRangeSelect ranges={DASHBOARD_RANGES} value={range.id} onChange={setRangeId} />
            </div>

            {error && <ErrorState message={error.message} onRetry={reload} />}
            {!error && !data && <LoadingState label="Loading dashboard…" />}

            {data && (
                <div className={cn('space-y-5 transition-opacity', isLoading && 'opacity-60')}>
                    <KpiSummaryRow summary={data.summary} />

                    <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr_0.9fr]">
                        <Card title="Compliance Trend">
                            <TrendChart data={data.trend} series={TREND_SERIES} />
                        </Card>
                        <Card title="Violations by Category">
                            <CategoryDonut
                                categories={data.summary.categories}
                                total={data.summary.violations}
                                className="sm:flex-col sm:items-start xl:flex-row"
                            />
                        </Card>
                        <RecentViolations records={data.recentViolations} />
                    </div>
                </div>
            )}
        </div>
    );
}