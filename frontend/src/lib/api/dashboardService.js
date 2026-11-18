import { DAILY_STATS } from '@/lib/data/dashboardData';
import { VIOLATION_RECORDS } from '@/lib/data/violationData';
import { wait } from '@/lib/utils/delay';
import { formatShortDate } from '@/lib/utils/format';
import { countViolations, isWithinRange, summarizeDays } from '@/lib/utils/stats';

const RECENT_VIOLATION_LIMIT = 3;

export async function fetchDashboard(range) {
    await wait();

    const days = DAILY_STATS.filter((day) => isWithinRange(day.date, range));

    return {
        summary: summarizeDays(days),
        trend: days.map((day) => ({
            date: day.date,
            label: formatShortDate(day.date),
            compliant: day.compliant,
            violations: countViolations(day.violations),
        })),
        recentViolations: VIOLATION_RECORDS.filter((record) => isWithinRange(record.detectedAt, range)).slice(
            0,
            RECENT_VIOLATION_LIMIT,
        ),
    };
}