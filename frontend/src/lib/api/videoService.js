import { exportDetectionsCsv } from '@/lib/api/detectionService';
import { JOB_THUMBNAILS } from '@/lib/constants/images';
import { JOB_STATUS } from '@/lib/constants/jobStatus';
import { SEED_ANALYSIS_JOBS } from '@/lib/data/analysisJobs';
import { DETECTION_ROWS } from '@/lib/data/detectionData';
import { wait } from '@/lib/utils/delay';
import { validateVideoFile } from '@/lib/utils/file';

const PROGRESS_STEP_MIN = 4;
const PROGRESS_STEP_MAX = 11;

let jobStore = SEED_ANALYSIS_JOBS.map((job) => ({ ...job }));

function copyJobs() {
    return jobStore.map((job) => ({ ...job }));
}

function randomProgressStep() {
    return PROGRESS_STEP_MIN + Math.floor(Math.random() * (PROGRESS_STEP_MAX - PROGRESS_STEP_MIN + 1));
}

export function getAnalysisJobs() {
    return copyJobs();
}

export async function fetchAnalysisJobs() {
    await wait();
    return copyJobs();
}

export async function submitVideo(file) {
    const validationError = validateVideoFile(file);
    if (validationError) throw new Error(validationError);

    await wait();

    const job = {
        id: `job-${Date.now()}`,
        fileName: file.name,
        sizeBytes: file.size,
        status: JOB_STATUS.PROCESSING,
        progress: 0,
        thumbnail: JOB_THUMBNAILS[jobStore.length % JOB_THUMBNAILS.length],
        createdAt: new Date().toISOString(),
        error: null,
    };

    jobStore = [job, ...jobStore];
    return copyJobs();
}

export function advanceProcessingJobs() {
    jobStore = jobStore.map((job) => {
        if (job.status !== JOB_STATUS.PROCESSING) return job;

        const progress = Math.min(100, job.progress + randomProgressStep());
        return progress >= 100
            ? { ...job, progress: 100, status: JOB_STATUS.COMPLETED }
            : { ...job, progress };
    });

    return copyJobs();
}

export async function retryJob(jobId) {
    await wait(200);

    jobStore = jobStore.map((job) =>
        job.id === jobId ? { ...job, status: JOB_STATUS.PROCESSING, progress: 0, error: null } : job,
    );

    return copyJobs();
}

export function exportJobReport(job) {
    const baseName = job.fileName.replace(/\.[^.]+$/, '');
    exportDetectionsCsv(DETECTION_ROWS, `${baseName}_detections.csv`);
}

export function resetAnalysisJobs() {
    jobStore = SEED_ANALYSIS_JOBS.map((job) => ({ ...job }));
}