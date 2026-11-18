export const JOB_STATUS = Object.freeze({
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
});

export const JOB_STATUS_META = {
    [JOB_STATUS.PROCESSING]: { label: 'Processing', badge: 'bg-blue-100 text-blue-700' },
    [JOB_STATUS.COMPLETED]: { label: 'Completed', badge: 'bg-green-100 text-green-700' },
    [JOB_STATUS.FAILED]: { label: 'Failed', badge: 'bg-red-100 text-red-700' },
};