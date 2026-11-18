import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { LoginPage } from '@/app/login/LoginPage';
import { SignupPage } from '@/app/signup/SignupPage';
import { GuestRoute } from '@/components/layout/GuestRoute';
import { AuthProvider } from '@/lib/context/AuthProvider';
import { DEMO_ACCOUNTS } from '@/lib/data/userData';

function renderAuthPages() {
    return render(
        <AuthProvider>
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route element={<GuestRoute />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                    </Route>
                    <Route path="/dashboard" element={<p>Dashboard screen</p>} />
                </Routes>
            </MemoryRouter>
        </AuthProvider>,
    );
}

beforeEach(() => {
    window.localStorage.clear();
});

describe('LoginPage', () => {
    it('shows validation errors for an empty form', async () => {
        renderAuthPages();

        await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));
        expect(await screen.findByText('Work email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    it('rejects wrong credentials', async () => {
        renderAuthPages();

        await userEvent.type(screen.getByLabelText('Work Email'), DEMO_ACCOUNTS.admin.email);
        await userEvent.type(screen.getByLabelText('Password'), 'wrong-password');
        await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

        expect(await screen.findByText('Invalid email or password.')).toBeInTheDocument();
    });

    it('signs in with the demo admin and leaves the login page', async () => {
        renderAuthPages();

        await userEvent.type(screen.getByLabelText('Work Email'), DEMO_ACCOUNTS.admin.email);
        await userEvent.type(screen.getByLabelText('Password'), DEMO_ACCOUNTS.admin.password);
        await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

        expect(await screen.findByText('Dashboard screen')).toBeInTheDocument();
    });

    it('toggles password visibility', async () => {
        renderAuthPages();

        const password = screen.getByLabelText('Password');
        expect(password).toHaveAttribute('type', 'password');
        await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
        expect(password).toHaveAttribute('type', 'text');
    });
});

describe('SignupPage', () => {
    it('flags mismatched passwords', async () => {
        renderAuthPages();
        await userEvent.click(screen.getByRole('link', { name: 'Create Account' }));

        await userEvent.type(screen.getByPlaceholderText('Enter your full name'), 'Asha Rao');
        await userEvent.type(screen.getByPlaceholderText('Enter your work email'), 'asha@acme.com');
        await userEvent.type(screen.getByPlaceholderText('Enter your organization name'), 'Acme Constructions');
        await userEvent.type(screen.getByPlaceholderText('Create a password'), 'Safety123');
        await userEvent.type(screen.getByPlaceholderText('Confirm your password'), 'Different123');
        await userEvent.click(screen.getByLabelText('I agree to the'));
        await userEvent.click(screen.getByRole('button', { name: 'Create Account' }));

        expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
    });
});