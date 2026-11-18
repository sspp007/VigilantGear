import { cn } from '@/lib/utils/cn';
import { formatNumber } from '@/lib/utils/format';

const TONES = {
    info: { surface: 'bg-surface-info', halo: 'bg-blue-100', core: 'bg-blue-200/70 text-blue-600', value: 'text-ink', label: 'text-blue-900' },
    success: { surface: 'bg-surface-success', halo: 'bg-green-100', core: 'bg-green-500 text-white', value: 'text-ink', label: 'text-green-800' },
    danger: { surface: 'bg-surface-danger', halo: 'bg-red-100', core: 'bg-red-500 text-white', value: 'text-red-800', label: 'text-red-800' },
    warning: { surface: 'bg-surface-warning', halo: 'bg-amber-100', core: 'bg-amber-400 text-white', value: 'text-ink', label: 'text-amber-800' },
    accent: { surface: 'bg-surface-accent', halo: 'bg-violet-100', core: 'bg-violet-200/70 text-violet-600', value: 'text-ink', label: 'text-violet-900' },
    neutral: { surface: 'bg-slate-100', halo: 'bg-slate-200/70', core: 'bg-slate-200 text-slate-500', value: 'text-ink', label: 'text-slate-700' },
};

export function KpiCard({ icon: Icon, value, label, tone = 'info', className }) {
    const styles = TONES[tone];
    const displayValue = typeof value === 'number' ? formatNumber(value) : value;

    return (
        <div className={cn('flex items-center gap-3 rounded-2xl p-4', styles.surface, className)}>
            <span className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-full', styles.halo)}>
                <span className={cn('flex h-10 w-10 items-center justify-center rounded-full', styles.core)}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
            </span>
            <div className="min-w-0">
                <p className={cn('text-2xl font-extrabold leading-tight', styles.value)}>{displayValue}</p>
                <p className={cn('truncate text-sm font-semibold', styles.label)}>{label}</p>
            </div>
        </div>
    );
}