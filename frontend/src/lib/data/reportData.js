import { REPORT_FORMATS, REPORT_GROUPS, REPORT_TYPES } from '@/lib/constants/reports';

export const SEED_REPORTS = [
    {
        id: 'rep-1',
        type: REPORT_TYPES.COMPLIANCE,
        groupBy: REPORT_GROUPS.OVERALL,
        format: REPORT_FORMATS.PDF,
        start: '2025-01-01',
        end: '2025-01-26',
        generatedAt: '2025-01-26T10:30:00',
        sizeBytes: 1258291,
    },
    {
        id: 'rep-2',
        type: REPORT_TYPES.VIOLATION_SUMMARY,
        groupBy: REPORT_GROUPS.OVERALL,
        format: REPORT_FORMATS.XLSX,
        start: '2025-01-01',
        end: '2025-01-26',
        generatedAt: '2025-01-26T10:15:00',
        sizeBytes: 876544,
    },
    {
        id: 'rep-3',
        type: REPORT_TYPES.DETECTION_SUMMARY,
        groupBy: REPORT_GROUPS.OVERALL,
        format: REPORT_FORMATS.PDF,
        start: '2025-01-20',
        end: '2025-01-26',
        generatedAt: '2025-01-26T09:58:00',
        sizeBytes: 1153434,
    },
];