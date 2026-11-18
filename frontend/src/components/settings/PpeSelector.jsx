import { Glasses, Hand, HardHat, Shirt } from 'lucide-react';
import { Checkbox } from '@/components/common/Checkbox';
import { Toggle } from '@/components/common/Toggle';
import { PPE_TYPES } from '@/lib/constants/ppe';

const PPE_ICONS = {
    helmet: HardHat,
    safety_vest: Shirt,
    goggles: Glasses,
    gloves: Hand,
};

export function PpeSelector({ value, onChange, variant = 'inline', error }) {
    function setPpe(id, enabled) {
        onChange({ ...value, [id]: enabled });
    }

    return (
        <div>
            {variant === 'cards' ? (
                <ul className="grid gap-3 sm:grid-cols-2">
                    {PPE_TYPES.map((type) => {
                        const Icon = PPE_ICONS[type.id];
                        return (
                            <li key={type.id} className="flex items-center justify-between gap-3 rounded-xl border border-line p-4">
                                <span className="flex items-center gap-3 text-sm font-bold text-ink">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-brand">
                                        <Icon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                    {type.label}
                                </span>
                                <Toggle
                                    checked={value[type.id]}
                                    onChange={(enabled) => setPpe(type.id, enabled)}
                                    aria-label={`Detect ${type.label}`}
                                />
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                    <span className="text-sm font-bold text-ink">PPE to Detect</span>
                    {PPE_TYPES.map((type) => (
                        <Checkbox
                            key={type.id}
                            label={type.label}
                            checked={value[type.id]}
                            onChange={(event) => setPpe(type.id, event.target.checked)}
                        />
                    ))}
                </div>
            )}
            {error && (
                <p role="alert" className="mt-2 text-xs font-medium text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}