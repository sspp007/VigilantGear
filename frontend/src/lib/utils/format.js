import { format, parseISO } from 'date-fns';

const BYTE_UNITS = ['B', 'KB', 'MB', 'GB'];

function toDate(value) {
    return value instanceof Date ? value : parseISO(value);
}

export function formatDate(value) {
    return format(toDate(value), 'MMM dd, yyyy');
}

export function formatShortDate(value) {
    return format(toDate(value), 'MMM dd');
}

export function formatDateTime(value) {
    return format(toDate(value), 'MMM dd, hh:mm a');
}

export function formatDateRange(start, end) {
    return `${formatDate(start)} – ${formatDate(end)}`;
}

export function formatNumber(value) {
    return value.toLocaleString('en-US');
}

export function formatPercent(value, digits = 1) {
    return `${value.toFixed(digits)}%`;
}

export function formatConfidence(value) {
    return value.toFixed(2);
}

export function calculateRate(part, total, digits = 1) {
    if (!total) return 0;
    return Number(((part / total) * 100).toFixed(digits));
}

export function formatClock(totalSeconds) {
    const safeSeconds = Math.max(0, Math.floor(totalSeconds));
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = String(safeSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
}

export function formatBytes(bytes) {
    if (!bytes || bytes < 1) return '0 B';
    const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), BYTE_UNITS.length - 1);
    const value = bytes / 1024 ** unitIndex;
    const digits = unitIndex === 0 || value >= 100 ? 0 : 1;
    return `${value.toFixed(digits)} ${BYTE_UNITS[unitIndex]}`;
}