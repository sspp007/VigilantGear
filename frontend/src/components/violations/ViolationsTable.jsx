import { Eye } from 'lucide-react';
import { DataTable } from '@/components/common/DataTable';
import { IconButton } from '@/components/common/IconButton';
import { SafeImage } from '@/components/common/SafeImage';
import { CategoryBadge, ReviewStatusBadge } from '@/components/common/StatusBadge';
import { formatConfidence, formatDateTime } from '@/lib/utils/format';

export const VIOLATION_SORT_ACCESSORS = {
    personId: (record) => record.personId,
    violationType: (record) => record.violationType,
    source: (record) => record.sourceLabel,
    confidence: (record) => record.confidence,
    detectedAt: (record) => record.detectedAt,
};

export function ViolationsTable({ rows, rowOffset, sort, onSortChange, isLoading, onView }) {
    const columns = [
        { key: 'index', header: '#', cell: (record, index) => rowOffset + index },
        {
            key: 'snapshot',
            header: 'Snapshot',
            cell: (record) => (
                <SafeImage src={record.snapshot} alt={`Snapshot of ${record.personId}`} className="h-10 w-14 rounded-lg" />
            ),
        },
        {
            key: 'personId',
            header: 'Person ID',
            sortable: true,
            cell: (record) => <span className="font-semibold">{record.personId}</span>,
        },
        {
            key: 'violationType',
            header: 'Violation Type',
            sortable: true,
            cell: (record) => <CategoryBadge categoryId={record.category} />,
        },
        { key: 'missingPpe', header: 'Missing PPE', cell: (record) => record.missingPpe },
        { key: 'source', header: 'Source', sortable: true, cell: (record) => record.sourceLabel },
        {
            key: 'confidence',
            header: 'Confidence',
            sortable: true,
            cell: (record) => formatConfidence(record.confidence),
        },
        {
            key: 'detectedAt',
            header: 'Date & Time',
            sortable: true,
            cell: (record) => formatDateTime(record.detectedAt),
        },
        { key: 'status', header: 'Status', cell: (record) => <ReviewStatusBadge status={record.status} /> },
        {
            key: 'action',
            header: 'Action',
            align: 'center',
            cell: (record) => (
                <IconButton
                    icon={Eye}
                    label={`View details for ${record.personId}`}
                    size="sm"
                    onClick={() => onView(record)}
                />
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            rows={rows}
            sort={sort}
            onSortChange={onSortChange}
            isLoading={isLoading}
            caption="Violation history"
            minWidth="min-w-[1040px]"
        />
    );
}