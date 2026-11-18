import { useCallback, useState } from 'react';
import {
    loadSettings,
    resetSettings as resetStoredSettings,
    saveSettings as persistSettings,
} from '@/lib/api/settingsService';

export function useSettings() {
    const [settings, setSettings] = useState(loadSettings);

    const saveSettings = useCallback((nextSettings) => {
        const saved = persistSettings(nextSettings);
        setSettings(saved);
        return saved;
    }, []);

    const resetSettings = useCallback(() => {
        const defaults = resetStoredSettings();
        setSettings(defaults);
        return defaults;
    }, []);

    return { settings, saveSettings, resetSettings };
}