import { Download, Eye, Play, RotateCw } from 'lucide-react';
import { IconButton } from '@/components/common/IconButton';
import { ProgressRing } from '@/components/common/ProgressRing';
import { SafeImage } from '@/components/common/SafeImage';
import { JobStatusBadge } from '@/components/common/StatusBadge';
import { JOB_STATUS } from '@/lib/constants/jobStatus';

export function AnalysisJobCard({ job, onRetry, onDownload, onView }) {
    const isProcessing = job.status === JOB_STATUS.PROCESSING;
    const isCompleted = job.status === JOB_STATUS.COMPLETED;
    const isFailed = job.status === JOB_STATUS.FAILED;

    return (
        <li className="flex items-center gap-4 border-b border-line py-3 last:border-b-0">
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl">
                <SafeImage src={job.thumbnail} alt={`Thumbnail of ${job.fileName}`} className="h-full w-full" />
                <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink shadow">
                        <Play className="h-4 w-4 fill-current" />
                    </span>
                </span>
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-base font-bold text-ink">{job.fileName}</p>
                {isProcessing && (
                    <>
                        <p className="text-sm font-medium text-ink-muted">{`Processing… (${job.progress}%)`}</p>
                        <div
                            role="progressbar"
                            aria-label={`Processing ${job.fileName}`}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={job.progress}
                            className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200"
                        >
                            <div
                                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                                style={{ width: `${job.progress}%` }}
                            />
                        </div>
                    </>
                )}
                {!isProcessing && (
                    <div className="mt-1" title={job.error ?? undefined}>
                        <JobStatusBadge status={job.status} />
                    </div>
                )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
                {isProcessing && (
                    <ProgressRing
                        value={job.progress}
                        size={36}
                        strokeWidth={4}
                        label={`${job.progress}% processed`}
                        trackClassName="stroke-blue-100"
                        indicatorClassName="stroke-blue-500"
                    />
                )}
                {isCompleted && (
                    <>
                        <IconButton icon={Download} label={`Download report for ${job.fileName}`} onClick={onDownload} />
                        <IconButton icon={Eye} label={`View results for ${job.fileName}`} onClick={onView} />
                    </>
                )}
                {isFailed && <IconButton icon={RotateCw} label={`Retry analysis of ${job.fileName}`} onClick={onRetry} />}
            </div>
        </li>
    );
}