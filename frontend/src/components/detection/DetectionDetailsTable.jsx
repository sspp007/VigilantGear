import { Download, Eye } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { DataTable } from '@/components/common/DataTable';
import { IconButton } from '@/components/common/IconButton';
import { Pagination } from '@/components/common/Pagination';
import { SafeImage } from '@/components/common/SafeImage';
import { SearchInput } from '@/components/common/SearchInput';
import { Select } from '@/components/common/Select';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PpeStateList } from '@/components/detection/PpeStateList';
import { usePagination } from '@/hooks/usePagination';
import { exportDetectionsCsv, filterDetections } from '@/lib/api/detectionService';
import { getPpeLabel, PPE_FILTER_OPTIONS } from '@/lib/constants/ppe';
import { DETECTION_STATUS_OPTIONS } from '@/lib/constants/status';
import { formatConfidence, formatDateTime } from '@/lib/utils/format';

export function DetectionDetailsTable({ rows, onSelectRow }) {
    const [query, setQuery] = useState('');
    const [ppe, setPpe] = useState('all');
    const [status, setStatus] = useState('all');

    const filteredRows = useMemo(() => filterDetections(rows, { query, ppe, status }), [rows, query, ppe, status]);
    const pagination = usePagination(filteredRows, 5);
    const { pageItems, rangeStart, resetPage } = pagination;

    function withPageReset(setter) {
        return (value) => {
            setter(value);
            resetPage();
        };
    }

    function handleExport() {
        if (filteredRows.length === 0) {
            toast.error('There are no detections to export.');
            return;
        }
        exportDetectionsCsv(filteredRows);
        toast.success(`Exported ${filteredRows.length} detections to CSV.`);
    }

    const columns = [
        { key: 'index', header: '#', cell: (row, index) => rangeStart + index },
        {
            key: 'snapshot',
            header: 'Snapshot',
            cell: (row) => (
                <SafeImage src={row.snapshot} alt={`Snapshot of ${row.personId}`} variant="snapshot" className="h-10 w-10 rounded-lg" />
            ),
        },
        { key: 'personId', header: 'Person ID', cell: (row) => <span className="font-semibold">{row.personId}</span> },
        { key: 'status', header: 'PPE Status', cell: (row) => <StatusBadge status={row.status} /> },
        { key: 'ppe', header: 'Detected PPE', cell: (row) => <PpeStateList ppe={row.ppe} /> },
        {
            key: 'missing',
            header: 'Missing PPE (Violation)',
            cell: (row) =>
                row.missingPpe.length > 0 ? (
                    <Badge className="bg-red-100 text-red-700">{row.missingPpe.map(getPpeLabel).join(', ')}</Badge>
                ) : (
                    '—'
                ),
        },
        { key: 'confidence', header: 'Confidence', cell: (row) => formatConfidence(row.confidence) },
        { key: 'timestamp', header: 'Timestamp', cell: (row) => formatDateTime(row.timestamp) },
        {
            key: 'action',
            header: 'Action',
            align: 'center',
            cell: (row) => (
                <IconButton
                    icon={Eye}
                    label={`View details for ${row.personId}`}
                    size="sm"
                    onClick={() => onSelectRow(row)}
                />
            ),
        },
    ];

    return (
        <Card padded={false}>
            <div className="flex flex-col gap-3 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-lg font-bold text-ink">Detection Details</h2>
                    <p className="text-xs text-ink-muted">
                        The PPE filter shows people whose selected PPE is missing or unconfirmed.
                    </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <SearchInput
                        value={query}
                        onChange={withPageReset(setQuery)}
                        placeholder="Search by person ID…"
                        ariaLabel="Search by person ID"
                        className="sm:w-64"
                    />
                    <Select
                        aria-label="PPE type"
                        options={PPE_FILTER_OPTIONS}
                        value={ppe}
                        onChange={withPageReset(setPpe)}
                        className="sm:w-44"
                    />
                    <Select
                        aria-label="Status"
                        options={DETECTION_STATUS_OPTIONS}
                        value={status}
                        onChange={withPageReset(setStatus)}
                        className="sm:w-40"
                    />
                    <Button icon={Download} onClick={handleExport}>
                        Export CSV
                    </Button>
                </div>
            </div>

            <DataTable columns={columns} rows={pageItems} caption="Detection details" minWidth="min-w-[960px]" />
            <Pagination
                {...pagination}
                onPageChange={pagination.goToPage}
                onPageSizeChange={pagination.changePageSize}
                className="border-t border-line"
            />
        </Card>
    );
}
