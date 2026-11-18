import { Download, Eye } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import { DataTable } from '@/components/common/DataTable';
import { IconButton } from '@/components/common/IconButton';
import { Pagination } from '@/components/common/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { getReportTypeLabel, REPORT_FORMAT_META } from '@/lib/constants/reports';
import { formatBytes, formatDateRange, formatDateTime } from '@/lib/utils/format';

export function RecentReportsTable({ reports, isLoading, onDownload, onPreview }) {
    const pagination = usePagination(reports, 5);
    const { pageItems, rangeStart } = pagination;

    const columns = [
        { key: 'index', header: '#', cell: (report, index) => rangeStart + index },
        {
            key: 'name',
            header: 'Report Name',
            cell: (report) => <span className="font-semibold">{getReportTypeLabel(report.type)}</span>,
        },
        { key: 'duration', header: 'Duration', cell: (report) => formatDateRange(report.start, report.end) },
        { key: 'generatedAt', header: 'Generated On', cell: (report) => formatDateTime(report.generatedAt) },
        {
            key: 'format',
            header: 'Format',
            cell: (report) => (
                <Badge className={REPORT_FORMAT_META[report.format].badge}>{REPORT_FORMAT_META[report.format].label}</Badge>
            ),
        },
        { key: 'size', header: 'Size', cell: (report) => formatBytes(report.sizeBytes) },
        {
            key: 'actions',
            header: 'Action',
            cell: (report) => {
                const name = getReportTypeLabel(report.type);
                return (
                    <div className="flex gap-2">
                        <IconButton icon={Download} label={`Download ${name}`} size="sm" onClick={() => onDownload(report)} />
                        <IconButton icon={Eye} label={`Preview ${name}`} size="sm" onClick={() => onPreview(report)} />
                    </div>
                );
            },
        },
    ];

    return (
        <Card title="Recent Reports" padded={false} bodyClassName="pt-3">
            <DataTable columns={columns} rows={pageItems} isLoading={isLoading} caption="Recent reports" minWidth="min-w-[760px]" />
            <Pagination
                {...pagination}
                onPageChange={pagination.goToPage}
                onPageSizeChange={pagination.changePageSize}
                className="border-t border-line"
            />
        </Card>
    );
}