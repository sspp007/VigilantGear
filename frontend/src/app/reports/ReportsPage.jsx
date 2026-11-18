import { useState } from 'react';
import { toast } from 'sonner';
import { CategoryBarChart } from '@/components/charts/CategoryBarChart';
import { TrendChart } from '@/components/charts/TrendChart';
import { Card } from '@/components/common/Card';
import { DateRangeSelect } from '@/components/common/DateRangeSelect';
import { ErrorState } from '@/components/common/ErrorState';
import { KpiSummaryRow } from '@/components/common/KpiSummaryRow';
import { LoadingState } from '@/components/common/Spinner';
import { GenerateReportPanel } from '@/components/reports/GenerateReportPanel';
import { RecentReportsTable } from '@/components/reports/RecentReportsTable';
import { ReportPreviewModal } from '@/components/reports/ReportPreviewModal';
import { ScheduledReportsPanel } from '@/components/reports/ScheduledReportsPanel';
import { useAsyncData } from '@/hooks/useAsyncData';
import { downloadReport, fetchRecentReports, fetchReportOverview } from '@/lib/api/reportService';
import { DEFAULT_HISTORY_RANGE, findRange, HISTORY_RANGES } from '@/lib/constants/dateRanges';

const EMPTY_REPORTS = [];
const TREND_SERIES = [
    { key: 'complianceRate', label: 'Compliance Rate', color: '#16A34A' },
    { key: 'violationRate', label: 'Violation Rate', color: '#EF4444' },
];

function formatPercentTick(value) {
    return `${value}%`;
}

function AsyncBlock({ state, children }) {
    if (state.error) return <ErrorState message={state.error.message} onRetry={state.reload} className="py-6" />;
    if (!state.data) return <LoadingState />;
    return children(state.data);
}

export function ReportsPage() {
    const [rangeId, setRangeId] = useState(DEFAULT_HISTORY_RANGE.id);
    const [previewReport, setPreviewReport] = useState(null);
    const range = findRange(HISTORY_RANGES, rangeId);
    const overview = useAsyncData(() => fetchReportOverview(range), [range.id]);
    const recent = useAsyncData(fetchRecentReports, []);

    function handleDownload(report) {
        downloadReport(report);
        toast.success('Report downloaded as CSV (Phase 1 demo data).');
    }

    return (
        <div className="space-y-5">
            <div className="flex justify-end">
                <DateRangeSelect ranges={HISTORY_RANGES} value={range.id} onChange={setRangeId} />
            </div>

            <AsyncBlock state={overview}>{(data) => <KpiSummaryRow summary={data.summary} />}</AsyncBlock>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_20rem]">
                <Card title="Violations by Category">
                    <AsyncBlock state={overview}>
                        {(data) => <CategoryBarChart categories={data.summary.categories} />}
                    </AsyncBlock>
                </Card>
                <Card title="Compliance Trend">
                    <AsyncBlock state={overview}>
                        {(data) => <TrendChart data={data.trend} series={TREND_SERIES} yDomain={[0, 100]} yFormatter={formatPercentTick} />}
                    </AsyncBlock>
                </Card>
                <GenerateReportPanel range={range} onGenerated={() => recent.reload()} />
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                {recent.error ? (
                    <Card title="Recent Reports">
                        <ErrorState message={recent.error.message} onRetry={recent.reload} className="py-6" />
                    </Card>
                ) : (
                    <RecentReportsTable
                        reports={recent.data ?? EMPTY_REPORTS}
                        isLoading={recent.isLoading}
                        onDownload={handleDownload}
                        onPreview={setPreviewReport}
                    />
                )}
                <ScheduledReportsPanel />
            </div>

            <ReportPreviewModal report={previewReport} onClose={() => setPreviewReport(null)} onDownload={handleDownload} />
        </div>
    );
}