import { ChevronRight, Users } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { Modal } from '@/components/common/Modal';
import { SafeImage } from '@/components/common/SafeImage';
import { StatusBadge } from '@/components/common/StatusBadge';
import { STATUS_META } from '@/lib/constants/status';
import { formatConfidence } from '@/lib/utils/format';

export function RealtimeDetections({ detections, isLive }) {
    const [selectedId, setSelectedId] = useState(null);
    const selected = detections.find((detection) => detection.id === selectedId);

    return (
        <Card title="Real-time Detections">
            {detections.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title={isLive ? 'No people detected' : 'Camera is off'}
                    description="Start the camera to see simulated detections."
                    className="py-6"
                />
            ) : (
                <ul className="divide-y divide-line">
                    {detections.map((detection) => (
                        <li key={detection.id}>
                            <button
                                type="button"
                                onClick={() => setSelectedId(detection.id)}
                                className="flex w-full items-center gap-3 rounded-xl py-2.5 text-left transition hover:bg-slate-50"
                            >
                                <SafeImage
                                    src={detection.snapshot}
                                    alt={`${detection.personLabel} snapshot`}
                                    className="h-12 w-12 shrink-0 rounded-lg"
                                />
                                <span className="flex-1 text-sm font-bold text-ink">{detection.personLabel}</span>
                                <StatusBadge status={detection.status} label={detection.label} />
                                <ChevronRight className="h-5 w-5 shrink-0 text-ink" aria-hidden="true" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <Modal
                isOpen={Boolean(selected)}
                onClose={() => setSelectedId(null)}
                title={selected?.personLabel ?? ''}
                description="Simulated detection details"
                size="sm"
                footer={<Button onClick={() => setSelectedId(null)}>Close</Button>}
            >
                {selected && (
                    <div className="flex items-start gap-4">
                        <SafeImage
                            src={selected.snapshot}
                            alt={`${selected.personLabel} snapshot`}
                            className="h-24 w-24 shrink-0 rounded-xl"
                        />
                        <dl className="space-y-2 text-sm">
                            <div>
                                <dt className="text-ink-muted">Status</dt>
                                <dd>
                                    <StatusBadge status={selected.status} label={selected.label} />
                                </dd>
                            </div>
                            <div>
                                <dt className="text-ink-muted">Confidence</dt>
                                <dd className="font-bold text-ink">{formatConfidence(selected.confidence)}</dd>
                            </div>
                            <div>
                                <dt className="text-ink-muted">Classification</dt>
                                <dd className="font-bold text-ink">{STATUS_META[selected.status].label}</dd>
                            </div>
                        </dl>
                    </div>
                )}
            </Modal>
        </Card>
    );
}