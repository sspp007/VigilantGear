import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { SettingsPage } from '@/app/settings/SettingsPage';
import { login } from '@/lib/api/authService';
import { STORAGE_KEYS } from '@/lib/constants/storageKeys';
import { AuthProvider } from '@/lib/context/AuthProvider';
import { DEMO_ACCOUNTS } from '@/lib/data/userData';

async function renderAs(account) {
    await login({ ...account, remember: false });
    return render(
        <AuthProvider>
            <SettingsPage />
        </AuthProvider>,
    );
}

function readSavedSettings() {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEYS.settings));
}

beforeEach(() => {
    window.localStorage.clear();
});

describe('SettingsPage: general', () => {
    it('shows the default values from the reference screen', async () => {
        await renderAs(DEMO_ACCOUNTS.admin);

        expect(screen.getByLabelText(/Organization Name/)).toHaveValue('VigilantGear Construction Ltd.');
        expect(screen.getByLabelText('Confidence threshold value')).toHaveValue(0.8);
        expect(screen.getByRole('switch', { name: 'Enable Email Notifications' })).toHaveAttribute('aria-checked', 'false');
    });

    it('saves changes to local storage', async () => {
        await renderAs(DEMO_ACCOUNTS.admin);
        const input = screen.getByLabelText(/Organization Name/);

        await userEvent.clear(input);
        await userEvent.type(input, 'Acme Safety');
        await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

        expect(readSavedSettings().general.organizationName).toBe('Acme Safety');
    });

    it('blocks saving an invalid organization name', async () => {
        await renderAs(DEMO_ACCOUNTS.admin);

        await userEvent.clear(screen.getByLabelText(/Organization Name/));
        await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

        expect(await screen.findByText('Organization name is required')).toBeInTheDocument();
        expect(window.localStorage.getItem(STORAGE_KEYS.settings)).toBeNull();
    });

    it('restores defaults after confirmation', async () => {
        await renderAs(DEMO_ACCOUNTS.admin);
        const input = screen.getByLabelText(/Organization Name/);

        await userEvent.clear(input);
        await userEvent.type(input, 'Temporary Name');
        await userEvent.click(screen.getByRole('button', { name: 'Reset to Defaults' }));
        await userEvent.click(screen.getByRole('button', { name: 'Reset settings' }));

        expect(screen.getByLabelText(/Organization Name/)).toHaveValue('VigilantGear Construction Ltd.');
    });
});

describe('SettingsPage: other sections', () => {
    it('requires at least one PPE type', async () => {
        await renderAs(DEMO_ACCOUNTS.admin);

        await userEvent.click(screen.getByRole('button', { name: 'PPE Configuration' }));
        for (const name of ['Helmet', 'Safety Vest', 'Goggles', 'Gloves']) {
            await userEvent.click(screen.getByRole('switch', { name: `Detect ${name}` }));
        }
        await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

        expect(await screen.findByText('Enable at least one PPE type to detect')).toBeInTheDocument();
    });

    it('shows system information', async () => {
        await renderAs(DEMO_ACCOUNTS.admin);

        await userEvent.click(screen.getByRole('button', { name: 'System Information' }));

        expect(screen.getByText('Application Version')).toBeInTheDocument();
        expect(screen.getByText('Not connected (Phase 2)')).toBeInTheDocument();
    });
});

describe('SettingsPage: users and roles', () => {
    it('gives administrators user controls', async () => {
        await renderAs(DEMO_ACCOUNTS.admin);

        await userEvent.click(screen.getByRole('button', { name: 'Users & Roles' }));

        expect(await screen.findByText('Priya Sharma')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Add User' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Disable Priya Sharma' })).toBeInTheDocument();
    });

    it('keeps the table read-only for safety managers', async () => {
        await renderAs(DEMO_ACCOUNTS.manager);

        await userEvent.click(screen.getByRole('button', { name: 'Users & Roles' }));

        expect(await screen.findByText('Rahul Verma')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Add User' })).not.toBeInTheDocument();
        expect(screen.getByText(/Only administrators/)).toBeInTheDocument();
    });

    it('adds a user', async () => {
        await renderAs(DEMO_ACCOUNTS.admin);
        await userEvent.click(screen.getByRole('button', { name: 'Users & Roles' }));
        await screen.findByText('Priya Sharma');

        await userEvent.click(screen.getByRole('button', { name: 'Add User' }));
        const dialog = await screen.findByRole('dialog');
        await userEvent.type(within(dialog).getByLabelText(/Full Name/), 'Meera Nair');
        await userEvent.type(within(dialog).getByLabelText(/Email/), 'meera@acme.com');
        await userEvent.click(within(dialog).getByRole('button', { name: 'Add User' }));

        expect(await screen.findByText('Meera Nair', {}, { timeout: 3000 })).toBeInTheDocument();
    });
});