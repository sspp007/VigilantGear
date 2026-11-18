import { VIOLATION_CATEGORIES } from '@/lib/constants/ppe';
import { DETECTION_STATUS } from '@/lib/constants/status';
import { calculateRate } from '@/lib/utils/format';

const EMPTY_STATUS_COUNTS = Object.freeze({
    [DETECTION_STATUS.COMPLIANT]: 0,
    [DETECTION_STATUS.VIOLATION]: 0,
    [DETECTION_STATUS.UNCERTAIN]: 0,
});

export function isWithinRange(value, range) {
    const day = value.slice(0, 10);
    return day >= range.start && day <= range.end;
}

export function countViolations(violations) {
    return Object.values(violations).reduce((total, count) => total + count, 0);
}

export function summarizeDays(days) {
    const compliant = days.reduce((total, day) => total + day.compliant, 0);
    const uncertain = days.reduce((total, day) => total + day.uncertain, 0);
    const violations = days.reduce((total, day) => total + countViolations(day.violations), 0);
    const total = compliant + uncertain + violations;

    const categories = VIOLATION_CATEGORIES.map((category) => {
        const count = days.reduce((sum, day) => sum + day.violations[category.id], 0);
        return { ...category, count, percent: calculateRate(count, violations, 0) };
    });

    return {
        total,
        compliant,
        violations,
        uncertain,
        complianceRate: calculateRate(compliant, total),
        categories,
    };
}

export function countByStatus(items) {
    const counts = { ...EMPTY_STATUS_COUNTS };
    for (const item of items) {
        counts[item.status] += 1;
    }
    return counts;
}