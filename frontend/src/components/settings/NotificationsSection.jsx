import { Bell, Info } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Toggle } from '@/components/common/Toggle';
import { SettingsSection } from '@/components/settings/SettingsSection';

export function NotificationsSection({ draft, onChange }) {
    const { notifications, preferences } = draft;

    return (
        <SettingsSection icon={Bell} title="Notifications" description="Choose how you want to be alerted">
            <Card>
                <p className="mb-4 flex items-start gap-2 rounded-xl bg-surface-warning px-3 py-2 text-xs text-amber-800">
                    <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    Preferences are saved in this browser. Email delivery is not connected in Phase 1.
                </p>
                <div className="space-y-4">
                    <Toggle
                        label="In-app violation alerts"
                        checked={notifications.inAppAlerts}
                        onChange={(inAppAlerts) => onChange('notifications', { inAppAlerts })}
                    />
                    <Toggle
                        label="Daily summary digest"
                        checked={notifications.dailyDigest}
                        onChange={(dailyDigest) => onChange('notifications', { dailyDigest })}
                    />
                    <Toggle
                        label="Email notifications"
                        checked={preferences.emailNotifications}
                        onChange={(emailNotifications) => onChange('preferences', { emailNotifications })}
                    />
                </div>
            </Card>
        </SettingsSection>
    );
}