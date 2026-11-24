import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { SafeImage } from '@/components/common/SafeImage';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PpeStateList } from '@/components/detection/PpeStateList';
import { getPpeLabel } from '@/lib/constants/ppe';
import { formatConfidence, formatDateTime } from '@/lib/utils/format';

export function DetectionDetailModal({ row, onClose }) {
    return (
        <Modal
            isOpen={Boolean(row)}
            onClose={onClose}
            title={row ? `Detection ${row.personId}` : ''}
            description="Simulated demo detection"
            footer={<Button onClick={onClose}>Close</Button>}
        >
            {row && (
                <div className="flex flex-col gap-5 sm:flex-row">
                    <SafeImage src={row.snapshot} alt={`Snapshot of ${row.personId}`} variant="snapshot" className="h-28 w-28 shrink-0 rounded-xl" />
                    <dl className="grid flex-1 gap-3 text-sm">
                        <div>
                            <dt className="text-ink-muted">Status</dt>
                            <dd className="mt-1">
                                <StatusBadge status={row.status} />
                            </dd>
                        </div>
                        <div>
                            <dt className="text-ink-muted">PPE</dt>
                            <dd className="mt-1">
                                <PpeStateList ppe={row.ppe} />
                            </dd>
                        </div>
                        <div>
                            <dt className="text-ink-muted">Missing PPE</dt>
                            <dd className="font-bold text-ink">
                                {row.missingPpe.length > 0 ? row.missingPpe.map(getPpeLabel).join(', ') : 'None'}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-ink-muted">Confidence</dt>
                            <dd className="font-bold text-ink">{formatConfidence(row.confidence)}</dd>
                        </div>
                        <div>
                            <dt className="text-ink-muted">Timestamp</dt>
                            <dd className="font-bold text-ink">{formatDateTime(row.timestamp)}</dd>
                        </div>
                    </dl>
                </div>
            )}
        </Modal>
    );
}
