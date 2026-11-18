export const USER_STATUS = Object.freeze({
    ACTIVE: 'active',
    DISABLED: 'disabled',
});

export const USER_STATUS_META = {
    [USER_STATUS.ACTIVE]: { label: 'Active', badge: 'bg-green-100 text-green-700' },
    [USER_STATUS.DISABLED]: { label: 'Disabled', badge: 'bg-slate-100 text-slate-600' },
};