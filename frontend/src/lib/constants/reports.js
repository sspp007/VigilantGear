export const REPORT_TYPES = Object.freeze({
    COMPLIANCE: 'compliance',
    VIOLATION_SUMMARY: 'violation_summary',
    DETECTION_SUMMARY: 'detection_summary',
});

export const REPORT_TYPE_OPTIONS = [
    { value: REPORT_TYPES.COMPLIANCE, label: 'PPE Compliance Report' },
    { value: REPORT_TYPES.VIOLATION_SUMMARY, label: 'Violation Summary Report' },
    { value: REPORT_TYPES.DETECTION_SUMMARY, label: 'Detection Summary Report' },
];

export const REPORT_GROUPS = Object.freeze({
    OVERALL: 'overall',
    DAILY: 'daily',
    CATEGORY: 'category',
});

export const REPORT_GROUP_OPTIONS = [
    { value: REPORT_GROUPS.OVERALL, label: 'Overall' },
    { value: REPORT_GROUPS.DAILY, label: 'Daily' },
    { value: REPORT_GROUPS.CATEGORY, label: 'PPE Category' },
];

export const REPORT_FORMATS = Object.freeze({
    PDF: 'pdf',
    XLSX: 'xlsx',
    CSV: 'csv',
});

export const REPORT_FORMAT_OPTIONS = [
    { value: REPORT_FORMATS.PDF, label: 'PDF' },
    { value: REPORT_FORMATS.XLSX, label: 'Excel (XLSX)' },
    { value: REPORT_FORMATS.CSV, label: 'CSV' },
];

export const REPORT_FORMAT_META = {
    [REPORT_FORMATS.PDF]: { label: 'PDF', badge: 'bg-red-50 text-red-600', sizeFactor: 10 },
    [REPORT_FORMATS.XLSX]: { label: 'XLSX', badge: 'bg-green-50 text-green-700', sizeFactor: 4 },
    [REPORT_FORMATS.CSV]: { label: 'CSV', badge: 'bg-slate-100 text-slate-600', sizeFactor: 1 },
};

export const SCHEDULE_FREQUENCY_OPTIONS = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
];

export function getReportTypeLabel(type) {
    return REPORT_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? type;
}