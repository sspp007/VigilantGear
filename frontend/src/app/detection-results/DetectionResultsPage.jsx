import { useState } from 'react';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/Spinner';
import { DetectionDetailModal } from '@/components/detection/DetectionDetailModal';
import { DetectionDetailsTable } from '@/components/detection/DetectionDetailsTable';
import { DetectionSummaryPanel } from '@/components/detection/DetectionSummaryPanel';
import { ResultVideoPlayer } from '@/components/detection/ResultVideoPlayer';
import { useAsyncData } from '@/hooks/useAsyncData';
import { fetchDetectionResults } from '@/lib/api/detectionService';

export function DetectionResultsPage() {
    const { data, error, reload } = useAsyncData(fetchDetectionResults, []);
    const [selectedRow, setSelectedRow] = useState(null);

    if (error) return <ErrorState message={error.message} onRetry={reload} />;
    if (!data) return <LoadingState label="Loading detection results…" />;

    return (
        <div className="space-y-5">
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                <ResultVideoPlayer video={data.video} annotations={data.annotations} />
                <DetectionSummaryPanel summary={data.summary} rows={data.rows} onSelectRow={setSelectedRow} />
            </div>
            <DetectionDetailsTable rows={data.rows} onSelectRow={setSelectedRow} />
            <DetectionDetailModal row={selectedRow} onClose={() => setSelectedRow(null)} />
        </div>
    );
}