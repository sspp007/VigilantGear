import { describe, expect, it } from 'vitest';
import { filterDetections } from '@/lib/api/detectionService';
import { buildReportTable } from '@/lib/api/reportService';
import { filterViolations } from '@/lib/api/violationService';
import { HISTORY_RANGES } from '@/lib/constants/dateRanges';
import { REPORT_GROUPS, REPORT_TYPES } from '@/lib/constants/reports';
import { DETECTION_STATUS } from '@/lib/constants/status';
import { DAILY_STATS } from '@/lib/data/dashboardData';
import { DETECTION_ROWS } from '@/lib/data/detectionData';
import { VIOLATION_RECORDS } from '@/lib/data/violationData';
import { countByStatus, isWithinRange, summarizeDays } from '@/lib/utils/stats';

describe('shared dashboard dataset', () => {
    const summary = summarizeDays(DAILY_STATS);

    it('matches the reference KPI totals', () => {
        expect(summary.total).toBe(3842);
        expect(summary.compliant).toBe(2964);
        expect(summary.violations).toBe(623);
        expect(summary.uncertain).toBe(255);
        expect(summary.complianceRate).toBe(77.1);
    });

    it('matches the reference category split', () => {
        expect(summary.categories.map((category) => category.count)).toEqual([262, 224, 75, 37, 25]);
        expect(summary.categories.map((category) => category.percent)).toEqual([42, 36, 12, 6, 4]);
    });
});

describe('violation records', () => {
    it('are generated from the daily counts', () => {
        expect(VIOLATION_RECORDS).toHaveLength(623);

        const counts = Object.fromEntries(
            summarizeDays(DAILY_STATS).categories.map((category) => [category.id, category.count]),
        );
        for (const [categoryId, expected] of Object.entries(counts)) {
            expect(VIOLATION_RECORDS.filter((record) => record.category === categoryId)).toHaveLength(expected);
        }
    });

    it('start with the five rows shown in the reference screen', () => {
        const [first, second, third, fourth, fifth] = VIOLATION_RECORDS;
        expect(first).toMatchObject({ personId: 'P-1042', category: 'helmet', confidence: 0.97, detectedAt: '2025-01-26T10:24:00' });
        expect(second).toMatchObject({ personId: 'P-1041', category: 'safety_vest', confidence: 0.88 });
        expect(third).toMatchObject({ personId: 'P-1040', category: 'goggles', confidence: 0.86 });
        expect(fourth).toMatchObject({ personId: 'P-1039', category: 'gloves', confidence: 0.83 });
        expect(fifth).toMatchObject({ personId: 'P-1038', category: 'helmet', confidence: 0.95 });
    });

    it('are unique and sorted newest first', () => {
        expect(new Set(VIOLATION_RECORDS.map((record) => record.personId)).size).toBe(623);
        for (let index = 1; index < VIOLATION_RECORDS.length; index += 1) {
            expect(VIOLATION_RECORDS[index - 1].detectedAt >= VIOLATION_RECORDS[index].detectedAt).toBe(true);
        }
    });

    it('agree with the daily counts for every date range preset', () => {
        for (const range of HISTORY_RANGES) {
            const days = DAILY_STATS.filter((day) => isWithinRange(day.date, range));
            const records = VIOLATION_RECORDS.filter((record) => isWithinRange(record.detectedAt, range));
            expect(records).toHaveLength(summarizeDays(days).violations);
        }
    });

    it('filter by PPE type and search term', () => {
        expect(filterViolations(VIOLATION_RECORDS, { ppe: 'helmet' })).toHaveLength(262);
        expect(filterViolations(VIOLATION_RECORDS, { query: 'p-1042' })).toHaveLength(1);
    });
});

describe('detection rows', () => {
    it('match the reference tab counts', () => {
        const counts = countByStatus(DETECTION_ROWS);
        expect(DETECTION_ROWS).toHaveLength(24);
        expect(counts[DETECTION_STATUS.VIOLATION]).toBe(6);
    });

    it('show helmet and gloves missing for P-002', () => {
        const row = DETECTION_ROWS.find((candidate) => candidate.personId === 'P-002');
        expect(row.status).toBe(DETECTION_STATUS.VIOLATION);
        expect(row.missingPpe).toEqual(['helmet', 'gloves']);
    });

    it('filter by status and search', () => {
        expect(filterDetections(DETECTION_ROWS, { status: DETECTION_STATUS.VIOLATION })).toHaveLength(6);
        expect(filterDetections(DETECTION_ROWS, { query: 'p-004' })).toHaveLength(1);
    });
});

describe('report tables', () => {
    const range = { start: '2025-01-01', end: '2025-01-26' };

    it('builds an overall compliance row that matches the KPI totals', () => {
        const table = buildReportTable({ type: REPORT_TYPES.COMPLIANCE, groupBy: REPORT_GROUPS.OVERALL, ...range });
        expect(table.rows).toHaveLength(1);
        expect(table.rows[0].summary.total).toBe(3842);
    });

    it('builds one row per day and one per category', () => {
        const daily = buildReportTable({ type: REPORT_TYPES.VIOLATION_SUMMARY, groupBy: REPORT_GROUPS.DAILY, ...range });
        const category = buildReportTable({ type: REPORT_TYPES.COMPLIANCE, groupBy: REPORT_GROUPS.CATEGORY, ...range });
        expect(daily.rows).toHaveLength(7);
        expect(category.rows).toHaveLength(5);
    });
});