export const PPE_TYPES = [
    { id: 'helmet', label: 'Helmet' },
    { id: 'safety_vest', label: 'Safety Vest' },
    { id: 'goggles', label: 'Goggles' },
    { id: 'gloves', label: 'Gloves' },
];

const CATEGORY_STYLES = {
    helmet: { color: '#EF4444', badge: 'bg-red-100 text-red-700', surface: 'bg-surface-danger' },
    safety_vest: { color: '#F59E0B', badge: 'bg-amber-100 text-amber-700', surface: 'bg-surface-warning' },
    goggles: { color: '#3B82F6', badge: 'bg-blue-100 text-blue-700', surface: 'bg-surface-info' },
    gloves: { color: '#8B5CF6', badge: 'bg-violet-100 text-violet-700', surface: 'bg-surface-accent' },
    others: { color: '#B8C2D1', badge: 'bg-slate-100 text-slate-600', surface: 'bg-slate-100' },
};

export const VIOLATION_CATEGORIES = [
    ...PPE_TYPES.map(({ id, label }) => ({ id, label: `No ${label}`, ...CATEGORY_STYLES[id] })),
    { id: 'others', label: 'Others', ...CATEGORY_STYLES.others },
];

export const PPE_FILTER_OPTIONS = [
    { value: 'all', label: 'All PPE Types' },
    ...PPE_TYPES.map(({ id, label }) => ({ value: id, label })),
];

export function getPpeLabel(id) {
    return PPE_TYPES.find((type) => type.id === id)?.label ?? id;
}

export function getViolationCategory(id) {
    return (
        VIOLATION_CATEGORIES.find((category) => category.id === id) ??
        VIOLATION_CATEGORIES[VIOLATION_CATEGORIES.length - 1]
    );
}