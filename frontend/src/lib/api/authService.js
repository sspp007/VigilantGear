import { loadUsers, saveUsers, toPublicUser } from '@/lib/api/userRepository';
import { PUBLIC_SIGNUP_ROLE } from '@/lib/constants/roles';
import { STORAGE_KEYS } from '@/lib/constants/storageKeys';
import { USER_STATUS } from '@/lib/constants/userStatus';
import { DEMO_ACCOUNTS } from '@/lib/data/userData';
import { wait } from '@/lib/utils/delay';
import { readStorage, removeStorage, writeStorage } from '@/lib/utils/storage';

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

function normalizeEmail(email) {
    return email.trim().toLowerCase();
}

function startSession(user) {
    writeStorage(STORAGE_KEYS.session, { userId: user.id, expiresAt: Date.now() + SESSION_DURATION_MS });
}

export function getSessionUser() {
    const session = readStorage(STORAGE_KEYS.session, null);
    if (!session) return null;

    if (session.expiresAt < Date.now()) {
        removeStorage(STORAGE_KEYS.session);
        return null;
    }

    const user = loadUsers().find((candidate) => candidate.id === session.userId);
    return user && user.status === USER_STATUS.ACTIVE ? toPublicUser(user) : null;
}

export function getRememberedEmail() {
    return readStorage(STORAGE_KEYS.rememberedEmail, '');
}

export async function login({ email, password, remember }) {
    await wait();

    const user = loadUsers().find((candidate) => candidate.email.toLowerCase() === normalizeEmail(email));
    if (!user || user.password !== password) {
        throw new Error('Invalid email or password.');
    }
    if (user.status !== USER_STATUS.ACTIVE) {
        throw new Error('This account is disabled. Contact your administrator.');
    }

    startSession(user);
    if (remember) {
        writeStorage(STORAGE_KEYS.rememberedEmail, user.email);
    } else {
        removeStorage(STORAGE_KEYS.rememberedEmail);
    }

    return toPublicUser(user);
}

export async function loginWithProvider(providerName) {
    await wait(600);

    const user = loadUsers().find(
        (candidate) => candidate.email === DEMO_ACCOUNTS.manager.email && candidate.status === USER_STATUS.ACTIVE,
    );
    if (!user) {
        throw new Error(`The demo ${providerName} account is unavailable.`);
    }

    startSession(user);
    return toPublicUser(user);
}

export async function signup({ fullName, email, organization, password }) {
    await wait();

    const users = loadUsers();
    const normalizedEmail = normalizeEmail(email);
    if (users.some((candidate) => candidate.email.toLowerCase() === normalizedEmail)) {
        throw new Error('An account with this email already exists.');
    }

    const user = {
        id: `user-${Date.now()}`,
        fullName: fullName.trim(),
        email: normalizedEmail,
        organization: organization.trim(),
        password,
        role: PUBLIC_SIGNUP_ROLE,
        status: USER_STATUS.ACTIVE,
        createdAt: new Date().toISOString(),
    };

    saveUsers([...users, user]);
    startSession(user);
    return toPublicUser(user);
}

export async function requestPasswordReset() {
    await wait(500);
}

export function logout() {
    removeStorage(STORAGE_KEYS.session);
}