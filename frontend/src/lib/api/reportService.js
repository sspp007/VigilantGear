import { loadSettings, saveSettings } from '@/lib/api/settingsService';
import { VIOLATION_CATEGORIES } from '@/lib/constants/ppe';
import {
    getReportTypeLabel,
    REPORT_FORMAT_META,
    REPORT_GROUPS,
    REPORT_TYPES,
} from '@/lib/constants/reports';
import { DAILY_STATS } from '@/lib/data/dashboardData';
import { SEED_REPORTS } from '@/lib/data/reportData';
import { downloadCsv, toCsv } from '@/lib/utils/csv';
import { wait } from '@/lib/utils/delay';
import { calculateRate, formatDate, formatDateRange, formatShortDate } from '@/lib/utils/format';
import { countViolations, isWithinRange, summarizeDays } from '@/lib/utils/stats';

const MIN_REPORT_BYTES = 1024;

const periodColumn = { header: 'Period', accessor: (row) => row.label };

const TYPE_COLUMNS = {
    [REPORT_TYPES.COMPLIANCE]: [
        periodColumn,
        { header: 'Total Detections', accessor: (row) => row.summary.total },
        { header: 'Compliant', accessor: (row) => row.summary.compliant },
        { header: 'Violations', accessor: (row) => row.summary.violations },
        { header: 'Uncertain', accessor: (row) => row.summary.uncertain },
        { header: 'Compliance Rate (%)', accessor: (row) => row.summary.complianceRate },
    ],
    [REPORT_TYPES.VIOLATION_SUMMARY]: [
        periodColumn,
        { header: 'Total Violations', accessor: (row) => row.summary.violations },
        ...VIOLATION_CATEGORIES.map((category) => ({
            header: category.label,
            accessor: (row) => row.byCategory[category.id],
        })),
    ],
    [REPORT_TYPES.DETECTION_SUMMARY]: [
        periodColumn,
        { header: 'Total Detections', accessor: (row) => row.summary.total },
        { header: 'Compliant', accessor: (row) => row.summary.compliant },
        { header: 'Violations', accessor: (row) => row.summary.violations },
        { header: 'Uncertain', accessor: (row) => row.summary.uncertain },
    ],
};

const CATEGORY_COLUMNS = [
    { header: 'Category', accessor: (row) => row.label },
    { header: 'Violations', accessor: (row) => row.count },
    { header: 'Share (%)', accessor: (row) => row.percent },
];

let reportStore = SEED_REPORTS.map((report) => ({ ...report }));

function buildRowValues(label, days) {
    const summary = summarizeDays(days);
    const byCategory = Object.fromEntries(summary.categories.map((category) => [category.id, category.count]));
    return { label, summary, byCategory };
}

export function buildReportTable({ type, groupBy, start, end }) {
    const days = DAILY_STATS.filter((day) => isWithinRange(day.date, { start, end }));

    if (groupBy === REPORT_GROUPS.CATEGORY) {
        return { columns: CATEGORY_COLUMNS, rows: summarizeDays(days).categories };
    }

    if (groupBy === REPORT_GROUPS.DAILY) {
        return {
            columns: TYPE_COLUMNS[type],
            rows: days.map((day) => buildRowValues(formatDate(day.date), [day])),
        };
    }

    return { columns: TYPE_COLUMNS[type], rows: [buildRowValues(formatDateRange(start, end), days)] };
}

export async function fetchReportOverview(range) {
    await wait();

    const days = DAILY_STATS.filter((day) => isWithinRange(day.date, range));

    return {
        summary: summarizeDays(days),
        trend: days.map((day) => {
            const violations = countViolations(day.violations);
            const total = day.compliant + day.uncertain + violations;
            return {
                label: formatShortDate(day.date),
                complianceRate: calculateRate(day.compliant, total),
                violationRate: calculateRate(violations, total),
            };
        }),
    };
}

export async function fetchRecentReports() {
    await wait();
    return reportStore.map((report) => ({ ...report }));
}

export async function generateReport({ type, groupBy, format, range }) {
    await wait(700);

    const { columns, rows } = buildReportTable({ type, groupBy, start: range.start, end: range.end });
    const csvBytes = Math.max(new Blob([toCsv(columns, rows)]).size, MIN_REPORT_BYTES);

    const report = {
        id: `rep-${Date.now()}`,
        type,
        groupBy,
        format,
        start: range.start,
        end: range.end,
        generatedAt: new Date().toISOString(),
        sizeBytes: csvBytes * REPORT_FORMAT_META[format].sizeFactor,
    };

    reportStore = [report, ...reportStore];
    return { ...report };
}

export function downloadReport(report) {
    const { columns, rows } = buildReportTable(report);
    const slug = getReportTypeLabel(report.type).toLowerCase().replace(/\s+/g, '_');
    downloadCsv(`${slug}_${report.start}_${report.end}.csv`, columns, rows);
}

export function getReportSchedule() {
    return loadSettings().reports;
}

export function saveReportSchedule(schedule) {
    const settings = loadSettings();
    return saveSettings({ ...settings, reports: { ...settings.reports, ...schedule } }).reports;
}

export function resetReports() {
    reportStore = SEED_REPORTS.map((report) => ({ ...report }));
}