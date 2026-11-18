import { getSnapshot } from '@/lib/constants/images';
import { getPpeLabel, getViolationCategory, VIOLATION_CATEGORIES } from '@/lib/constants/ppe';
import { DETECTION_SOURCE, formatSource } from '@/lib/constants/sources';
import { REVIEW_STATUS } from '@/lib/constants/status';
import { DAILY_STATS, LATEST_STATS_DATE } from '@/lib/data/dashboardData';
import { createRandom, pick, shuffle } from '@/lib/utils/random';

const LATEST_PERSON_NUMBER = 1042;
const DAY_START_MINUTE = 360;
const DAY_END_MINUTE = 1079;
const LATEST_DAY_END_MINUTE = 575;

export const VIOLATION_LOCATIONS = [
    'Main Construction Site',
    'Block B Scaffolding',
    'Factory Floor 2',
    'Warehouse Gate',
];

const VIDEO_SOURCES = [
    { sourceType: DETECTION_SOURCE.VIDEO, sourceName: 'site_work_01.mp4' },
    { sourceType: DETECTION_SOURCE.VIDEO, sourceName: 'construction_day2.mp4' },
    { sourceType: DETECTION_SOURCE.VIDEO, sourceName: 'factory_inspection.mp4' },
];
const WEBCAM_SOURCE = { sourceType: DETECTION_SOURCE.WEBCAM, sourceName: null };
const SOURCE_POOL = [...VIDEO_SOURCES, WEBCAM_SOURCE];

const PINNED_LATEST = [
    { category: 'helmet', ...VIDEO_SOURCES[0], confidence: 0.97, minute: 624 },
    { category: 'safety_vest', ...WEBCAM_SOURCE, confidence: 0.88, minute: 617 },
    { category: 'goggles', ...VIDEO_SOURCES[1], confidence: 0.86, minute: 598 },
    { category: 'gloves', ...VIDEO_SOURCES[2], confidence: 0.83, minute: 581 },
    { category: 'helmet', ...WEBCAM_SOURCE, confidence: 0.95, minute: 576 },
];

function toTimestamp(date, minuteOfDay) {
    const hours = String(Math.floor(minuteOfDay / 60)).padStart(2, '0');
    const minutes = String(minuteOfDay % 60).padStart(2, '0');
    return `${date}T${hours}:${minutes}:00`;
}

function expandCategories(counts) {
    return VIOLATION_CATEGORIES.flatMap(({ id }) => Array.from({ length: counts[id] }, () => id));
}

function subtractPinned(counts, pinned) {
    const remaining = { ...counts };
    for (const entry of pinned) {
        remaining[entry.category] -= 1;
    }
    return remaining;
}

function pickReviewStatus(random, date) {
    const openChance = date === LATEST_STATS_DATE ? 0.7 : 0.15;
    const roll = random();
    if (roll < openChance) return REVIEW_STATUS.OPEN;
    return roll < (1 + openChance) / 2 ? REVIEW_STATUS.REVIEWED : REVIEW_STATUS.RESOLVED;
}

function buildDayEntries(day, random) {
    const isLatestDay = day.date === LATEST_STATS_DATE;
    const pinned = isLatestDay ? PINNED_LATEST : [];
    const windowEnd = isLatestDay ? LATEST_DAY_END_MINUTE : DAY_END_MINUTE;
    const span = windowEnd - DAY_START_MINUTE;
    const categories = shuffle(random, expandCategories(subtractPinned(day.violations, pinned)));

    const generated = categories.map((category, index) => ({
        category,
        ...pick(random, SOURCE_POOL),
        confidence: Number((0.8 + random() * 0.19).toFixed(2)),
        minute: windowEnd - Math.floor((index * span) / categories.length),
    }));

    return [...pinned, ...generated];
}

function buildViolationRecords() {
    const random = createRandom(2025);
    const newestFirst = [...DAILY_STATS].sort((a, b) => b.date.localeCompare(a.date));
    const records = [];

    for (const day of newestFirst) {
        for (const entry of buildDayEntries(day, random)) {
            const index = records.length;
            const personNumber = LATEST_PERSON_NUMBER - index;

            records.push({
                id: `VIO-${personNumber}`,
                personId: `P-${personNumber}`,
                snapshot: getSnapshot(index),
                category: entry.category,
                violationType: getViolationCategory(entry.category).label,
                missingPpe: entry.category === 'others' ? 'Other PPE' : getPpeLabel(entry.category),
                sourceType: entry.sourceType,
                sourceName: entry.sourceName,
                sourceLabel: formatSource(entry.sourceType, entry.sourceName),
                location: pick(random, VIOLATION_LOCATIONS),
                confidence: entry.confidence,
                detectedAt: toTimestamp(day.date, entry.minute),
                status: pickReviewStatus(random, day.date),
            });
        }
    }

    return records;
}

export const VIOLATION_RECORDS = buildViolationRecords();