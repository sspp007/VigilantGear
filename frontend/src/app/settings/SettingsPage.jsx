import { RotateCcw, Save } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/common/Button';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { DetectionSection } from '@/components/settings/DetectionSection';
import { GeneralSection } from '@/components/settings/GeneralSection';
import { NotificationsSection } from '@/components/settings/NotificationsSection';
import { PpeSection } from '@/components/settings/PpeSection';
import { StorageSection } from '@/components/settings/StorageSection';
import { SystemSection } from '@/components/settings/SystemSection';
import { UsersSection } from '@/components/settings/UsersSection';
import { useSettings } from '@/hooks/useSettings';
import { SETTINGS_SECTIONS } from '@/lib/constants/settings';
import { cn } from '@/lib/utils/cn';
import { getSettingsErrors } from '@/lib/validators/settingsSchema';

const DRAFT_SECTION_IDS = ['general', 'ppe', 'detection', 'notifications', 'storage'];

export function SettingsPage() {
    const { settings, saveSettings, resetSettings } = useSettings();
    const [draft, setDraft] = useState(settings);
    const [errors, setErrors] = useState({});
    const [activeId, setActiveId] = useState(SETTINGS_SECTIONS[0].id);
    const [isResetOpen, setIsResetOpen] = useState(false);

    const isDirty = JSON.stringify(draft) !== JSON.stringify(settings);

    function handleChange(section, changes) {
        setDraft((current) => ({ ...current, [section]: { ...current[section], ...changes } }));
        setErrors({});
    }

    function handleSave() {
        if (!isDirty) {
            toast.info('No changes to save.');
            return;
        }

        const nextErrors = getSettingsErrors(draft);
        const errorKeys = Object.keys(nextErrors);
        if (errorKeys.length > 0) {
            const sectionsWithErrors = errorKeys.map((key) => key.split('.')[0]);
            setErrors(nextErrors);
            if (!sectionsWithErrors.includes(activeId)) setActiveId(sectionsWithErrors[0]);
            toast.error('Please fix the highlighted fields before saving.');
            return;
        }

        try {
            setDraft(saveSettings(draft));
            toast.success('Settings saved.');
        } catch (error) {
            toast.error(error.message);
        }
    }

    function restoreDefaults() {
        setDraft(resetSettings());
        setErrors({});
    }

    function handleConfirmReset() {
        restoreDefaults();
        setIsResetOpen(false);
        toast.success('Settings reset to defaults.');
    }

    function renderSection() {
        switch (activeId) {
            case 'users':
                return <UsersSection />;
            case 'ppe':
                return <PpeSection draft={draft} errors={errors} onChange={handleChange} />;
            case 'detection':
                return <DetectionSection draft={draft} onChange={handleChange} />;
            case 'notifications':
                return <NotificationsSection draft={draft} onChange={handleChange} />;
            case 'storage':
                return <StorageSection draft={draft} onChange={handleChange} onDemoDataCleared={restoreDefaults} />;
            case 'system':
                return <SystemSection />;
            default:
                return <GeneralSection draft={draft} errors={errors} onChange={handleChange} />;
        }
    }

    return (
        <div className="grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
            <nav
                aria-label="Settings sections"
                className="card flex gap-1 self-start overflow-x-auto p-2 lg:flex-col lg:overflow-visible"
            >
                {SETTINGS_SECTIONS.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        type="button"
                        aria-current={id === activeId ? 'page' : undefined}
                        onClick={() => setActiveId(id)}
                        className={cn(
                            'flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-4 py-3 text-left text-[15px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50',
                            id === activeId ? 'bg-brand text-white shadow-soft' : 'text-ink hover:bg-slate-100',
                        )}
                    >
                        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                        {label}
                    </button>
                ))}
            </nav>

            <div className="card min-w-0 p-5 sm:p-6">
                {renderSection()}

                {DRAFT_SECTION_IDS.includes(activeId) && (
                    <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-line pt-4">
                        {isDirty && <span className="mr-auto text-sm font-semibold text-amber-600">You have unsaved changes</span>}
                        <Button variant="secondary" icon={RotateCcw} onClick={() => setIsResetOpen(true)}>
                            Reset to Defaults
                        </Button>
                        <Button icon={Save} onClick={handleSave}>
                            Save Changes
                        </Button>
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={isResetOpen}
                onClose={() => setIsResetOpen(false)}
                onConfirm={handleConfirmReset}
                title="Reset all settings?"
                description="Every setting returns to its default value. Unsaved changes are lost."
                confirmLabel="Reset settings"
            />
        </div>
    );
}