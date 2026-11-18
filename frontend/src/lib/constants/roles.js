export const USER_ROLES = Object.freeze({
    ADMIN: 'admin',
    SAFETY_MANAGER: 'safety_manager',
});

export const ROLE_LABELS = {
    [USER_ROLES.ADMIN]: 'Admin',
    [USER_ROLES.SAFETY_MANAGER]: 'Safety Manager',
};

export const PUBLIC_SIGNUP_ROLE = USER_ROLES.SAFETY_MANAGER;