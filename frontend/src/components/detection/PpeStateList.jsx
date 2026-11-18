import { Check, CircleHelp, X } from 'lucide-react';
import { PPE_TYPES } from '@/lib/constants/ppe';
import { PPE_STATE } from '@/lib/constants/ppeState';
import { cn } from '@/lib/utils/cn';

const STATE_STYLES = {
    [PPE_STATE.DETECTED]: { icon: Check, className: 'text-green-600', label: 'Detected' },
    [PPE_STATE.MISSING]: { icon: X, className: 'text-red-600', label: 'Missing' },
    [PPE_STATE.UNCERTAIN]: { icon: CircleHelp, className: 'text-amber-500', label: 'Uncertain' },
};

export function PpeStateList({ ppe, className }) {
    return (
        <ul className={cn('flex flex-wrap gap-x-3 gap-y-1', className)}>
            {PPE_TYPES.map((type) => {
                const style = STATE_STYLES[ppe[type.id]];
                const Icon = style.icon;

                return (
                    <li key={type.id} className="inline-flex items-center gap-1 text-sm text-ink">
                        <Icon className={cn('h-4 w-4', style.className)} strokeWidth={3} aria-hidden="true" />
                        <span>{type.label}</span>
                        <span className="sr-only">{`: ${style.label}`}</span>
                    </li>
                );
            })}
        </ul>
    );
}