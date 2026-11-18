import { resetReports } from '@/lib/api/reportService';
import { getAnalysisJobs, resetAnalysisJobs } from '@/lib/api/videoService';
import { JOB_STATUS } from '@/lib/constants/jobStatus';
import { STORAGE_KEYS } from '@/lib/constants/storageKeys';
import { VIOLATION_RECORDS } from '@/lib/data/violationData';
import { removeStorage } from '@/lib/utils/storage';

const ANNOTATED_SIZE_RATIO = 1.15;
const SNAPSHOT_SIZE_BYTES = 180 * 1024;

export function getStorageBreakdown() {
    const jobs = getAnalysisJobs();
    const uploadBytes = jobs.reduce((total, job) => total + job.sizeBytes, 0);
    const annotatedBytes = jobs
        .filter((job) => job.status === JOB_STATUS.COMPLETED)
        .reduce((total, job) => total + Math.round(job.sizeBytes * ANNOTATED_SIZE_RATIO), 0);

    return [
        { id: 'uploads', label: 'Uploaded Videos', bytes: uploadBytes },
        { id: 'annotated', label: 'Annotated Videos', bytes: annotatedBytes },
        { id: 'snapshots', label: 'Detection Snapshots', bytes: VIOLATION_RECORDS.length * SNAPSHOT_SIZE_BYTES },
    ];
}

export function clearDemoData() {
    removeStorage(STORAGE_KEYS.settings);
    removeStorage(STORAGE_KEYS.readNotifications);
    resetAnalysisJobs();
    resetReports();
}