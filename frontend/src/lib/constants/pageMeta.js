import { ROUTES } from '@/lib/constants/routes';

export const PAGE_META = {
    [ROUTES.dashboard]: {
        title: 'Dashboard',
        subtitle: 'Overview of PPE compliance and safety insights',
    },
    [ROUTES.liveDetection]: {
        title: 'Live Detection',
        subtitle: 'Real-time PPE detection using your camera',
    },
    [ROUTES.videoAnalysis]: {
        title: 'Video Analysis',
        subtitle: 'Upload a video to detect PPE and analyze compliance',
    },
    [ROUTES.detectionResults]: {
        title: 'Detection Results',
        subtitle: 'Review detection results from analyzed videos',
    },
    [ROUTES.violationHistory]: {
        title: 'Violation History',
        subtitle: 'Search and review historical PPE violations',
    },
    [ROUTES.reports]: {
        title: 'Reports',
        subtitle: 'Generate and export PPE compliance reports',
    },
    [ROUTES.settings]: {
        title: 'Settings',
        subtitle: 'Configure system, detection, and organization preferences',
    },
};