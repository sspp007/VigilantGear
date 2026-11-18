import { API_BASE_URL } from '@/lib/api/httpClient';
import { DEFAULT_SETTINGS } from '@/lib/constants/settings';
import { STORAGE_KEYS } from '@/lib/constants/storageKeys';
import { readStorage, removeStorage, writeStorage } from '@/lib/utils/storage';

const APP_VERSION = '1.0.0';

function mergeWithDefaults(stored) {
    return Object.fromEntries(
        Object.entries(DEFAULT_SETTINGS).map(([section, defaults]) => [
            section,
            { ...defaults, ...(stored?.[section] ?? {}) },
        ]),
    );
}

export function loadSettings() {
    return mergeWithDefaults(readStorage(STORAGE_KEYS.settings, null));
}

export function saveSettings(settings) {
    const merged = mergeWithDefaults(settings);
    if (!writeStorage(STORAGE_KEYS.settings, merged)) {
        throw new Error('Unable to save settings in this browser.');
    }
    return merged;
}

export function resetSettings() {
    removeStorage(STORAGE_KEYS.settings);
    return mergeWithDefaults(null);
}

export function getSystemInfo() {
    return [
        { id: 'version', label: 'Application Version', value: APP_VERSION },
        { id: 'environment', label: 'Environment', value: import.meta.env.MODE },
        { id: 'api', label: 'API Base URL', value: API_BASE_URL },
        { id: 'backend', label: 'Backend API', value: 'Not connected (Phase 2)' },
        { id: 'database', label: 'Database', value: 'Not connected (Phase 3)' },
        { id: 'ai', label: 'AI Module', value: 'Not connected (Phase 4)' },
        { id: 'storage', label: 'Demo Data Storage', value: 'Browser localStorage' },
    ];
}