import { useCallback, useEffect, useRef, useState } from 'react';
import { advanceProcessingJobs, getAnalysisJobs, retryJob, submitVideo } from '@/lib/api/videoService';
import { JOB_STATUS } from '@/lib/constants/jobStatus';

const TICK_INTERVAL_MS = 1200;

export function useAnalysisJobs({ onCompleted } = {}) {
    const [jobs, setJobs] = useState(getAnalysisJobs);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const jobsRef = useRef(jobs);
    const onCompletedRef = useRef(onCompleted);

    useEffect(() => {
        onCompletedRef.current = onCompleted;
    }, [onCompleted]);

    const commit = useCallback((nextJobs) => {
        jobsRef.current = nextJobs;
        setJobs(nextJobs);
    }, []);

    const hasProcessingJobs = jobs.some((job) => job.status === JOB_STATUS.PROCESSING);

    useEffect(() => {
        if (!hasProcessingJobs) return undefined;

        const timer = setInterval(() => {
            const previousJobs = jobsRef.current;
            const nextJobs = advanceProcessingJobs();
            const finishedJobs = nextJobs.filter(
                (job) =>
                    job.status === JOB_STATUS.COMPLETED &&
                    previousJobs.some((previous) => previous.id === job.id && previous.status === JOB_STATUS.PROCESSING),
            );

            commit(nextJobs);
            finishedJobs.forEach((job) => onCompletedRef.current?.(job));
        }, TICK_INTERVAL_MS);

        return () => clearInterval(timer);
    }, [hasProcessingJobs, commit]);

    const submit = useCallback(
        async (file) => {
            setIsSubmitting(true);
            try {
                commit(await submitVideo(file));
            } finally {
                setIsSubmitting(false);
            }
        },
        [commit],
    );

    const retry = useCallback(
        async (jobId) => {
            commit(await retryJob(jobId));
        },
        [commit],
    );

    return { jobs, isSubmitting, submit, retry };
}