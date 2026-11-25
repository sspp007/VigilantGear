import axios from 'axios';
import {
    AI_BASE_URL,
    AI_SERVICE_TOKEN,
    exportDetectionsCsv,
    mapDetectionsToUi,
    setLatestRealResult,
} from '@/lib/api/detectionService';
import { JOB_THUMBNAILS } from '@/lib/constants/images';
import { JOB_STATUS } from '@/lib/constants/jobStatus';
import { SEED_ANALYSIS_JOBS } from '@/lib/data/analysisJobs';
import { DETECTION_ROWS } from '@/lib/data/detectionData';
import { wait } from '@/lib/utils/delay';
import { validateVideoFile } from '@/lib/utils/file';

const PROGRESS_STEP_MIN = 8;
const PROGRESS_STEP_MAX = 18;

let jobStore = SEED_ANALYSIS_JOBS.map((job) => ({ ...job }));
const jobReports = new Map();

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

    const jobId = `job-${Date.now()}`;
    const job = {
        id: jobId,
        fileName: file.name,
        sizeBytes: file.size,
        status: JOB_STATUS.PROCESSING,
        progress: 15,
        thumbnail: JOB_THUMBNAILS[jobStore.length % JOB_THUMBNAILS.length],
        createdAt: new Date().toISOString(),
        error: null,
    };

    jobStore = [job, ...jobStore];

    const formData = new FormData();
    formData.append('file', file);

    axios
        .post(`${AI_BASE_URL}/predict/video`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-service-token': AI_SERVICE_TOKEN,
            },
            timeout: 120000,
        })
        .then(({ data }) => {
            const flattenedDetections = (data.timeline || []).flatMap((frameEntry) =>
                frameEntry.detections.map((d) => ({
                    ...d,
                    timestamp: new Date(Date.now() + frameEntry.timestamp_seconds * 1000).toISOString(),
                })),
            );

            const uiResult = mapDetectionsToUi(flattenedDetections, {
                fileName: data.file_name || file.name,
                durationSeconds: Math.max(1, Math.round(data.duration_seconds || 10)),
                positionSeconds: 0,
            });

            setLatestRealResult(uiResult);
            jobReports.set(jobId, uiResult.rows);

            jobStore = jobStore.map((j) =>
                j.id === jobId ? { ...j, progress: 100, status: JOB_STATUS.COMPLETED } : j,
            );
        })
        .catch((err) => {
            jobStore = jobStore.map((j) =>
                j.id === jobId
                    ? {
                          ...j,
                          status: JOB_STATUS.FAILED,
                          error: err?.response?.data?.detail || err.message || 'AI inference failed',
                      }
                    : j,
            );
        });

    return copyJobs();
}

export function advanceProcessingJobs() {
    jobStore = jobStore.map((job) => {
        if (job.status !== JOB_STATUS.PROCESSING) return job;
        // Cap simulated visual progress at 90% until the real FastAPI response completes
        const progress = Math.min(90, job.progress + randomProgressStep());
        return { ...job, progress };
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
    const rows = jobReports.get(job.id) || DETECTION_ROWS;
    exportDetectionsCsv(rows, `${baseName}_detections.csv`);
}

export function resetAnalysisJobs() {
    jobStore = SEED_ANALYSIS_JOBS.map((job) => ({ ...job }));
    jobReports.clear();
}