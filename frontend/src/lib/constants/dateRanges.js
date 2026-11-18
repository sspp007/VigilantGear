export const DASHBOARD_RANGES = [
    { id: 'last7', label: 'Last 7 Days', start: '2025-01-20', end: '2025-01-26' },
    { id: 'last3', label: 'Last 3 Days', start: '2025-01-24', end: '2025-01-26' },
    { id: 'today', label: 'Today', start: '2025-01-26', end: '2025-01-26' },
];

export const HISTORY_RANGES = [
    { id: 'jan', label: 'Jan 01, 2025 – Jan 26, 2025', start: '2025-01-01', end: '2025-01-26' },
    { id: 'last7', label: 'Jan 20, 2025 – Jan 26, 2025', start: '2025-01-20', end: '2025-01-26' },
    { id: 'last3', label: 'Jan 24, 2025 – Jan 26, 2025', start: '2025-01-24', end: '2025-01-26' },
    { id: 'today', label: 'Jan 26, 2025', start: '2025-01-26', end: '2025-01-26' },
];

export const DEFAULT_DASHBOARD_RANGE = DASHBOARD_RANGES[0];
export const DEFAULT_HISTORY_RANGE = HISTORY_RANGES[0];

export function findRange(ranges, id) {
    return ranges.find((range) => range.id === id) ?? ranges[0];
}