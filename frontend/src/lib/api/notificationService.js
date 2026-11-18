import { ROUTES } from '@/lib/constants/routes';
import { STORAGE_KEYS } from '@/lib/constants/storageKeys';
import { VIOLATION_RECORDS } from '@/lib/data/violationData';
import { readStorage, writeStorage } from '@/lib/utils/storage';

const VIOLATION_NOTIFICATION_COUNT = 3;

const SYSTEM_NOTIFICATIONS = [
    {
        id: 'notif-job-complete',
        title: 'Video analysis completed',
        description: 'construction_day2.mp4 is ready to review',
        createdAt: '2025-01-26T09:50:00',
        to: ROUTES.detectionResults,
    },
    {
        id: 'notif-job-failed',
        title: 'Video analysis failed',
        description: 'factory_inspection.mp4 could not be processed',
        createdAt: '2025-01-26T09:20:00',
        to: ROUTES.videoAnalysis,
    },
];

const NOTIFICATIONS = [
    ...VIOLATION_RECORDS.slice(0, VIOLATION_NOTIFICATION_COUNT).map((record) => ({
        id: `notif-${record.id}`,
        title: `${record.violationType} detected`,
        description: `${record.personId} · ${record.sourceLabel}`,
        createdAt: record.detectedAt,
        to: ROUTES.violationHistory,
    })),
    ...SYSTEM_NOTIFICATIONS,
].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

function readIds() {
    return new Set(readStorage(STORAGE_KEYS.readNotifications, []));
}

export function loadNotifications() {
    const readIdSet = readIds();
    return NOTIFICATIONS.map((notification) => ({ ...notification, read: readIdSet.has(notification.id) }));
}

export function markNotificationRead(notificationId) {
    const readIdSet = readIds();
    readIdSet.add(notificationId);
    writeStorage(STORAGE_KEYS.readNotifications, [...readIdSet]);
    return loadNotifications();
}

export function markAllNotificationsRead() {
    writeStorage(
        STORAGE_KEYS.readNotifications,
        NOTIFICATIONS.map((notification) => notification.id),
    );
    return loadNotifications();
}