export const DETECTION_STATUS = Object.freeze({
    COMPLIANT: 'compliant',
    VIOLATION: 'violation',
    UNCERTAIN: 'uncertain',
});

export const STATUS_META = {
    [DETECTION_STATUS.COMPLIANT]: {
        label: 'Compliant',
        badge: 'bg-green-100 text-green-700',
        surface: 'bg-surface-success',
        text: 'text-green-700',
        color: '#16A34A',
    },
    [DETECTION_STATUS.VIOLATION]: {
        label: 'Violation',
        badge: 'bg-red-100 text-red-700',
        surface: 'bg-surface-danger',
        text: 'text-red-700',
        color: '#DC2626',
    },
    [DETECTION_STATUS.UNCERTAIN]: {
        label: 'Uncertain',
        badge: 'bg-amber-100 text-amber-700',
        surface: 'bg-surface-warning',
        text: 'text-amber-700',
        color: '#F59E0B',
    },
};

export const DETECTION_STATUS_OPTIONS = [
    { value: 'all', label: 'All Status' },
    ...Object.entries(STATUS_META).map(([value, meta]) => ({ value, label: meta.label })),
];

export const REVIEW_STATUS = Object.freeze({
    OPEN: 'open',
    REVIEWED: 'reviewed',
    RESOLVED: 'resolved',
});

export const REVIEW_STATUS_META = {
    [REVIEW_STATUS.OPEN]: { label: 'Open', badge: 'bg-red-100 text-red-700' },
    [REVIEW_STATUS.REVIEWED]: { label: 'Reviewed', badge: 'bg-blue-100 text-blue-700' },
    [REVIEW_STATUS.RESOLVED]: { label: 'Resolved', badge: 'bg-green-100 text-green-700' },
};

export const REVIEW_STATUS_OPTIONS = [
    { value: 'all', label: 'All Status' },
    ...Object.entries(REVIEW_STATUS_META).map(([value, meta]) => ({ value, label: meta.label })),
];