import { Info, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Select } from '@/components/common/Select';
import { Toggle } from '@/components/common/Toggle';
import { getReportSchedule, saveReportSchedule } from '@/lib/api/reportService';
import { SCHEDULE_FREQUENCY_OPTIONS } from '@/lib/constants/reports';

const emailSchema = z.string().email();

export function ScheduledReportsPanel() {
    const [schedule, setSchedule] = useState(getReportSchedule);
    const [recipientDraft, setRecipientDraft] = useState('');
    const [recipientError, setRecipientError] = useState(null);

    function update(changes) {
        try {
            setSchedule(saveReportSchedule(changes));
            return true;
        } catch (error) {
            toast.error(error.message);
            return false;
        }
    }

    function addRecipient() {
        const email = recipientDraft.trim().toLowerCase();
        if (!email) return;

        if (!emailSchema.safeParse(email).success) {
            setRecipientError('Enter a valid email address');
            return;
        }
        if (schedule.recipients.includes(email)) {
            setRecipientError('This recipient is already added');
            return;
        }

        if (update({ recipients: [...schedule.recipients, email] })) {
            setRecipientDraft('');
            setRecipientError(null);
        }
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            addRecipient();
        }
    }

    const isEnabled = schedule.scheduleEnabled;

    return (
        <Card
            title="Scheduled Reports"
            subtitle="Email reports automatically"
            action={
                <Toggle
                    checked={isEnabled}
                    onChange={(checked) => update({ scheduleEnabled: checked })}
                    aria-label="Enable scheduled reports"
                />
            }
        >
            <div className="space-y-4">
                <p className="flex items-start gap-2 rounded-xl bg-surface-warning px-3 py-2 text-xs text-amber-800">
                    <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    Not connected in Phase 1: the schedule is saved in this browser and no emails are sent.
                </p>

                <Select
                    label="Frequency"
                    options={SCHEDULE_FREQUENCY_OPTIONS}
                    value={schedule.frequency}
                    onChange={(frequency) => update({ frequency })}
                    disabled={!isEnabled}
                />

                <div>
                    <p className="mb-1.5 text-sm font-semibold text-ink">Recipients</p>
                    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-line p-2">
                        {schedule.recipients.map((email) => (
                            <span
                                key={email}
                                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-semibold text-ink"
                            >
                                {email}
                                <button
                                    type="button"
                                    aria-label={`Remove ${email}`}
                                    disabled={!isEnabled}
                                    onClick={() => update({ recipients: schedule.recipients.filter((item) => item !== email) })}
                                    className="rounded-full p-0.5 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                                </button>
                            </span>
                        ))}
                        <input
                            type="email"
                            value={recipientDraft}
                            disabled={!isEnabled}
                            onChange={(event) => {
                                setRecipientDraft(event.target.value);
                                setRecipientError(null);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Add recipient email"
                            aria-label="Add recipient email"
                            className="min-w-0 flex-1 bg-transparent px-1 py-1 text-sm focus:outline-none disabled:cursor-not-allowed"
                        />
                        <Button size="sm" variant="secondary" disabled={!isEnabled} onClick={addRecipient}>
                            Add
                        </Button>
                    </div>
                    {recipientError && (
                        <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                            {recipientError}
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
}