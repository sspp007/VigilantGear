import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { SafeImage } from '@/components/common/SafeImage';
import { CategoryBadge, ReviewStatusBadge } from '@/components/common/StatusBadge';
import { formatConfidence, formatDateTime } from '@/lib/utils/format';

function buildDetails(record) {
    return [
        { label: 'Violation type', value: <CategoryBadge categoryId={record.category} /> },
        { label: 'Missing PPE', value: record.missingPpe },
        { label: 'Source', value: record.sourceLabel },
        { label: 'Location', value: record.location },
        { label: 'Confidence', value: formatConfidence(record.confidence) },
        { label: 'Detected at', value: formatDateTime(record.detectedAt) },
        { label: 'Review status', value: <ReviewStatusBadge status={record.status} /> },
    ];
}

export function ViolationDetailModal({ record, onClose }) {
    return (
        <Modal
            isOpen={Boolean(record)}
            onClose={onClose}
            title={record ? `Violation ${record.personId}` : ''}
            description="Simulated demo record"
            footer={<Button onClick={onClose}>Close</Button>}
        >
            {record && (
                <div className="flex flex-col gap-5 sm:flex-row">
                    <SafeImage
                        src={record.snapshot}
                        alt={`Snapshot of ${record.personId}`}
                        className="h-32 w-32 shrink-0 rounded-xl"
                    />
                    <dl className="grid flex-1 gap-3 text-sm sm:grid-cols-2">
                        {buildDetails(record).map((detail) => (
                            <div key={detail.label}>
                                <dt className="text-ink-muted">{detail.label}</dt>
                                <dd className="mt-0.5 font-bold text-ink">{detail.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            )}
        </Modal>
    );
}