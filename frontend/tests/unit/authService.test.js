import { beforeEach, describe, expect, it } from 'vitest';
import { getSessionUser, login, logout, signup } from '@/lib/api/authService';
import { USER_ROLES } from '@/lib/constants/roles';
import { DEMO_ACCOUNTS } from '@/lib/data/userData';

beforeEach(() => {
    window.localStorage.clear();
});

describe('authService', () => {
    it('signs in the demo admin, creates a session and hides the password', async () => {
        const user = await login({ ...DEMO_ACCOUNTS.admin, remember: false });

        expect(user.role).toBe(USER_ROLES.ADMIN);
        expect(user).not.toHaveProperty('password');
        expect(getSessionUser()?.id).toBe(user.id);

        logout();
        expect(getSessionUser()).toBeNull();
    });

    it('rejects a wrong password', async () => {
        await expect(
            login({ email: DEMO_ACCOUNTS.admin.email, password: 'wrong', remember: false }),
        ).rejects.toThrow('Invalid email or password.');
    });

    it('rejects a disabled account', async () => {
        await expect(
            login({ email: 'rahul.verma@vigilantgear.com', password: 'Manager@123', remember: false }),
        ).rejects.toThrow('disabled');
    });

    it('assigns safety_manager on public signup even if a role is submitted', async () => {
        const user = await signup({
            fullName: 'Asha Rao',
            email: 'asha@acme.com',
            organization: 'Acme Constructions',
            password: 'Safety123',
            role: USER_ROLES.ADMIN,
        });

        expect(user.role).toBe(USER_ROLES.SAFETY_MANAGER);
    });

    it('rejects a duplicate email on signup', async () => {
        await expect(
            signup({
                fullName: 'Copy Cat',
                email: DEMO_ACCOUNTS.admin.email,
                organization: 'Acme',
                password: 'Safety123',
            }),
        ).rejects.toThrow('already exists');
    });
});