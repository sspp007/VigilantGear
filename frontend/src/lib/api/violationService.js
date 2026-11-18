import { REVIEW_STATUS_META } from '@/lib/constants/status';
import { DAILY_STATS } from '@/lib/data/dashboardData';
import { VIOLATION_RECORDS } from '@/lib/data/violationData';
import { downloadCsv } from '@/lib/utils/csv';
import { wait } from '@/lib/utils/delay';
import { formatConfidence, formatDateTime, formatShortDate } from '@/lib/utils/format';
import { countViolations, isWithinRange, summarizeDays } from '@/lib/utils/stats';

const EXPORT_COLUMNS = [
    { header: 'Person ID', accessor: (record) => record.personId },
    { header: 'Violation Type', accessor: (record) => record.violationType },
    { header: 'Missing PPE', accessor: (record) => record.missingPpe },
    { header: 'Source', accessor: (record) => record.sourceLabel },
    { header: 'Location', accessor: (record) => record.location },
    { header: 'Confidence', accessor: (record) => formatConfidence(record.confidence) },
    { header: 'Date & Time', accessor: (record) => formatDateTime(record.detectedAt) },
    { header: 'Review Status', accessor: (record) => REVIEW_STATUS_META[record.status].label },
];

export async function fetchViolationHistory(range) {
    await wait();

    const days = DAILY_STATS.filter((day) => isWithinRange(day.date, range));

    return {
        summary: summarizeDays(days),
        trend: days.map((day) => ({
            date: day.date,
            label: formatShortDate(day.date),
            violations: countViolations(day.violations),
        })),
        records: VIOLATION_RECORDS.filter((record) => isWithinRange(record.detectedAt, range)),
    };
}

export function filterViolations(records, { query = '', ppe = 'all', source = 'all', status = 'all' }) {
    const needle = query.trim().toLowerCase();

    return records.filter((record) => {
        if (ppe !== 'all' && record.category !== ppe) return false;
        if (source !== 'all' && record.sourceType !== source) return false;
        if (status !== 'all' && record.status !== status) return false;
        if (!needle) return true;

        return [record.personId, record.sourceLabel, record.location].some((value) =>
            value.toLowerCase().includes(needle),
        );
    });
}

export function exportViolationsCsv(records, fileName = 'violation_history.csv') {
    downloadCsv(fileName, EXPORT_COLUMNS, records);
}