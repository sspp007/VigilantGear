import { JOB_THUMBNAILS } from '@/lib/constants/images';
import { JOB_STATUS } from '@/lib/constants/jobStatus';

const MEGABYTE = 1024 * 1024;

export const SEED_ANALYSIS_JOBS = [
    {
        id: 'job-1',
        fileName: 'site_work_01.mp4',
        sizeBytes: 148 * MEGABYTE,
        status: JOB_STATUS.PROCESSING,
        progress: 68,
        thumbnail: JOB_THUMBNAILS[0],
        createdAt: '2025-01-26T10:30:00',
        error: null,
    },
    {
        id: 'job-2',
        fileName: 'construction_day2.mp4',
        sizeBytes: 212 * MEGABYTE,
        status: JOB_STATUS.COMPLETED,
        progress: 100,
        thumbnail: JOB_THUMBNAILS[1],
        createdAt: '2025-01-26T09:15:00',
        error: null,
    },
    {
        id: 'job-3',
        fileName: 'factory_inspection.mp4',
        sizeBytes: 96 * MEGABYTE,
        status: JOB_STATUS.FAILED,
        progress: 34,
        thumbnail: JOB_THUMBNAILS[2],
        createdAt: '2025-01-26T08:40:00',
        error: 'Frame extraction failed (simulated).',
    },
];