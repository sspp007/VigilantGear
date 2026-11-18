import { cn } from '@/lib/utils/cn';
import { formatNumber } from '@/lib/utils/format';

const TONES = {
    plain: { row: '', core: 'bg-slate-100 text-ink-muted', value: 'text-ink' },
    info: { row: 'bg-surface-info', core: 'bg-blue-100 text-blue-600', value: 'text-ink' },
    success: { row: 'bg-surface-success', core: 'bg-green-500 text-white', value: 'text-green-700' },
    danger: { row: 'bg-surface-danger', core: 'bg-red-500 text-white', value: 'text-red-700' },
    warning: { row: 'bg-surface-warning', core: 'bg-amber-400 text-white', value: 'text-amber-600' },
};

export function StatRow({ icon: Icon, label, value, tone = 'plain', className }) {
    const styles = TONES[tone];
    const displayValue = typeof value === 'number' ? formatNumber(value) : value;

    return (
        <div className={cn('flex items-center gap-3 rounded-xl px-3 py-2.5', styles.row, className)}>
            <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', styles.core)}>
                <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="flex-1 text-sm font-semibold text-ink">{label}</span>
            <span className={cn('text-xl font-extrabold', styles.value)}>{displayValue}</span>
        </div>
    );
}