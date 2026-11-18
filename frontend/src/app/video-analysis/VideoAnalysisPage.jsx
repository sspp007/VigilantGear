import { Info } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card } from '@/components/common/Card';
import { KpiSummaryRow } from '@/components/common/KpiSummaryRow';
import { LoadingState } from '@/components/common/Spinner';
import { AnalysisJobsPanel } from '@/components/video/AnalysisJobsPanel';
import { SelectedVideoPreview } from '@/components/video/SelectedVideoPreview';
import { VideoUploadZone } from '@/components/video/VideoUploadZone';
import { useAnalysisJobs } from '@/hooks/useAnalysisJobs';
import { useAsyncData } from '@/hooks/useAsyncData';
import { fetchDetectionResults } from '@/lib/api/detectionService';
import { exportJobReport } from '@/lib/api/videoService';
import { ROUTES } from '@/lib/constants/routes';

function notifyCompleted(job) {
    toast.success(`${job.fileName} analysis completed (simulated).`);
}

export function VideoAnalysisPage() {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const { jobs, isSubmitting, submit, retry } = useAnalysisJobs({ onCompleted: notifyCompleted });
    const { data: results } = useAsyncData(fetchDetectionResults, []);

    async function handleStartAnalysis() {
        try {
            await submit(selectedFile);
            setSelectedFile(null);
            toast.success('Video queued. Processing progress is simulated.');
        } catch (error) {
            toast.error(error.message);
        }
    }

    async function handleRetry(jobId) {
        try {
            await retry(jobId);
            toast.info('Retrying analysis (simulated).');
        } catch (error) {
            toast.error(error.message);
        }
    }

    function handleDownload(job) {
        exportJobReport(job);
        toast.success('Report downloaded as CSV (demo detection data).');
    }

    return (
        <div className="space-y-5">
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
                <Card>
                    <VideoUploadZone onFileSelected={setSelectedFile} disabled={isSubmitting} />
                    {selectedFile && (
                        <SelectedVideoPreview
                            file={selectedFile}
                            isStarting={isSubmitting}
                            onStart={handleStartAnalysis}
                            onRemove={() => setSelectedFile(null)}
                        />
                    )}
                    <p className="mt-4 flex items-start gap-2 text-xs text-ink-muted">
                        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        Demo mode: videos stay in your browser and processing progress is simulated. Real AI analysis is added in
                        a later phase.
                    </p>
                </Card>

                <AnalysisJobsPanel
                    jobs={jobs}
                    onRetry={handleRetry}
                    onDownload={handleDownload}
                    onView={() => navigate(ROUTES.detectionResults)}
                />
            </div>

            <Card title="Analysis Summary">
                {results ? <KpiSummaryRow summary={results.summary} /> : <LoadingState label="Loading summary…" />}
            </Card>
        </div>
    );
}