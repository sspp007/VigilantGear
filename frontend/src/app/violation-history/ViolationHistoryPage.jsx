import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { CategoryDonut } from '@/components/charts/CategoryDonut';
import { TrendChart } from '@/components/charts/TrendChart';
import { Card } from '@/components/common/Card';
import { DateRangeSelect } from '@/components/common/DateRangeSelect';
import { ErrorState } from '@/components/common/ErrorState';
import { Pagination } from '@/components/common/Pagination';
import { LoadingState } from '@/components/common/Spinner';
import { ViolationDetailModal } from '@/components/violations/ViolationDetailModal';
import { ViolationFilters } from '@/components/violations/ViolationFilters';
import { ViolationKpiRow } from '@/components/violations/ViolationKpiRow';
import { VIOLATION_SORT_ACCESSORS, ViolationsTable } from '@/components/violations/ViolationsTable';
import { useAsyncData } from '@/hooks/useAsyncData';
import { usePagination } from '@/hooks/usePagination';
import { useSortedRows } from '@/hooks/useSortedRows';
import { exportViolationsCsv, fetchViolationHistory, filterViolations } from '@/lib/api/violationService';
import { DEFAULT_HISTORY_RANGE, findRange, HISTORY_RANGES } from '@/lib/constants/dateRanges';
import { cn } from '@/lib/utils/cn';

const DEFAULT_FILTERS = { query: '', ppe: 'all', source: 'all', status: 'all' };
const EMPTY_RECORDS = [];
const TREND_SERIES = [{ key: 'violations', label: 'Violations', color: '#EF4444' }];

export function ViolationHistoryPage() {
    const [searchParams] = useSearchParams();
    const [rangeId, setRangeId] = useState(DEFAULT_HISTORY_RANGE.id);
    const [filters, setFilters] = useState(() => ({ ...DEFAULT_FILTERS, query: searchParams.get('q') ?? '' }));
    const [selectedRecord, setSelectedRecord] = useState(null);

    const range = findRange(HISTORY_RANGES, rangeId);
    const { data, isLoading, error, reload } = useAsyncData(() => fetchViolationHistory(range), [range.id]);

    const records = data?.records ?? EMPTY_RECORDS;
    const filteredRecords = useMemo(() => filterViolations(records, filters), [records, filters]);
    const { sortedRows, sort, toggleSort } = useSortedRows(filteredRecords, VIOLATION_SORT_ACCESSORS);
    const pagination = usePagination(sortedRows, 10);
    const { resetPage } = pagination;

    function handleFilterChange(name, value) {
        setFilters((current) => ({ ...current, [name]: value }));
        resetPage();
    }

    function handleRangeChange(nextRangeId) {
        setRangeId(nextRangeId);
        resetPage();
    }

    function handleSortChange(key) {
        toggleSort(key);
        resetPage();
    }

    function handleExport() {
        if (sortedRows.length === 0) {
            toast.error('There are no violations to export.');
            return;
        }
        exportViolationsCsv(sortedRows);
        toast.success(`Exported ${sortedRows.length} violations to CSV.`);
    }

    if (error) return <ErrorState message={error.message} onRetry={reload} />;
    if (!data) return <LoadingState label="Loading violation history…" />;

    return (
        <div className="space-y-5">
            <div className="flex justify-end">
                <DateRangeSelect ranges={HISTORY_RANGES} value={range.id} onChange={handleRangeChange} />
            </div>

            <div className={cn('space-y-5 transition-opacity', isLoading && 'opacity-60')}>
                <ViolationKpiRow summary={data.summary} />

                <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
                    <Card title="Violation Trend">
                        <TrendChart data={data.trend} series={TREND_SERIES} />
                    </Card>
                    <Card title="Violations by Category">
                        <CategoryDonut categories={data.summary.categories} total={data.summary.violations} />
                    </Card>
                </div>

                <Card padded={false}>
                    <div className="p-4">
                        <ViolationFilters filters={filters} onChange={handleFilterChange} onExport={handleExport} />
                    </div>
                    <ViolationsTable
                        rows={pagination.pageItems}
                        rowOffset={pagination.rangeStart}
                        sort={sort}
                        onSortChange={handleSortChange}
                        isLoading={isLoading}
                        onView={setSelectedRecord}
                    />
                    <Pagination
                        {...pagination}
                        onPageChange={pagination.goToPage}
                        onPageSizeChange={pagination.changePageSize}
                        className="border-t border-line"
                    />
                </Card>
            </div>

            <ViolationDetailModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
        </div>
    );
}