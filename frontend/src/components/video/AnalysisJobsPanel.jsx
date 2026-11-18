import { ArrowRight, Video } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { Modal } from '@/components/common/Modal';
import { AnalysisJobCard } from '@/components/video/AnalysisJobCard';

const VISIBLE_JOB_COUNT = 3;

export function AnalysisJobsPanel({ jobs, onRetry, onDownload, onView }) {
    const [isAllJobsOpen, setIsAllJobsOpen] = useState(false);

    function renderJobs(items) {
        return (
            <ul>
                {items.map((job) => (
                    <AnalysisJobCard
                        key={job.id}
                        job={job}
                        onRetry={() => onRetry(job.id)}
                        onDownload={() => onDownload(job)}
                        onView={() => onView(job)}
                    />
                ))}
            </ul>
        );
    }

    return (
        <Card
            title="Analysis Jobs"
            action={
                <button
                    type="button"
                    onClick={() => setIsAllJobsOpen(true)}
                    className="inline-flex items-center gap-1 text-sm font-bold text-brand transition hover:text-brand-dark"
                >
                    View All
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
            }
        >
            {jobs.length === 0 ? (
                <EmptyState icon={Video} title="No analysis jobs yet" description="Upload a video to start an analysis." />
            ) : (
                renderJobs(jobs.slice(0, VISIBLE_JOB_COUNT))
            )}

            <Modal
                isOpen={isAllJobsOpen}
                onClose={() => setIsAllJobsOpen(false)}
                title="All Analysis Jobs"
                description={`${jobs.length} ${jobs.length === 1 ? 'job' : 'jobs'}`}
                size="lg"
                footer={<Button onClick={() => setIsAllJobsOpen(false)}>Close</Button>}
            >
                {renderJobs(jobs)}
            </Modal>
        </Card>
    );
}