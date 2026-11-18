import { Bell, Camera, Database, HardHat, Info, Settings as SettingsIcon, Users } from 'lucide-react';

export const SETTINGS_SECTIONS = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'users', label: 'Users & Roles', icon: Users },
    { id: 'ppe', label: 'PPE Configuration', icon: HardHat },
    { id: 'detection', label: 'Detection Settings', icon: Camera },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'storage', label: 'Storage & Retention', icon: Database },
    { id: 'system', label: 'System Information', icon: Info },
];

export const TIME_ZONE_OPTIONS = [
    { value: 'Asia/Kolkata', label: '(UTC+05:30) India Standard Time' },
    { value: 'UTC', label: '(UTC+00:00) Coordinated Universal Time' },
    { value: 'Europe/London', label: '(UTC+00:00) London' },
    { value: 'Asia/Dubai', label: '(UTC+04:00) Gulf Standard Time' },
    { value: 'Asia/Singapore', label: '(UTC+08:00) Singapore Time' },
    { value: 'Australia/Sydney', label: '(UTC+10:00) Sydney' },
    { value: 'America/New_York', label: '(UTC-05:00) Eastern Time' },
];

export const FRAME_INTERVAL_OPTIONS = [
    { value: 0.5, label: 'Every 0.5 seconds' },
    { value: 1, label: 'Every 1 second' },
    { value: 2, label: 'Every 2 seconds' },
    { value: 5, label: 'Every 5 seconds' },
];

export const RETENTION_OPTIONS = [
    { value: 30, label: '30 days' },
    { value: 60, label: '60 days' },
    { value: 90, label: '90 days' },
    { value: 180, label: '180 days' },
    { value: 365, label: '1 year' },
];

export const CONFIDENCE_LIMITS = Object.freeze({ min: 0.5, max: 0.99, step: 0.01 });

export const DEFAULT_SETTINGS = {
    general: {
        organizationName: 'VigilantGear Construction Ltd.',
        siteLocation: 'Main Construction Site',
        timeZone: 'Asia/Kolkata',
        contactEmail: 'safety@vigilantgear.com',
    },
    ppe: { helmet: true, safety_vest: true, goggles: true, gloves: true },
    detection: { confidenceThreshold: 0.8, frameSamplingInterval: 1 },
    preferences: { saveSnapshots: true, saveAnnotatedVideos: true, emailNotifications: false },
    notifications: { inAppAlerts: true, dailyDigest: false },
    storage: { retentionDays: 90 },
    reports: { scheduleEnabled: true, frequency: 'weekly', recipients: ['safety@company.com'] },
};