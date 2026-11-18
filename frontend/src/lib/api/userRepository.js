import { STORAGE_KEYS } from '@/lib/constants/storageKeys';
import { SEED_USERS } from '@/lib/data/userData';
import { readStorage, writeStorage } from '@/lib/utils/storage';

export function loadUsers() {
    const stored = readStorage(STORAGE_KEYS.users, null);
    if (Array.isArray(stored) && stored.length > 0) return stored;

    writeStorage(STORAGE_KEYS.users, SEED_USERS);
    return SEED_USERS.map((user) => ({ ...user }));
}

export function saveUsers(users) {
    writeStorage(STORAGE_KEYS.users, users);
}

export function toPublicUser(user) {
    return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        organization: user.organization,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
    };
}