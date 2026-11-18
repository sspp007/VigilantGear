import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GuestRoute } from '@/components/layout/GuestRoute';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { login } from '@/lib/api/authService';
import { NAV_ITEMS } from '@/lib/constants/navigation';
import { AuthProvider } from '@/lib/context/AuthProvider';
import { DEMO_ACCOUNTS } from '@/lib/data/userData';

function renderRoutes(path) {
    return render(
        <AuthProvider>
            <MemoryRouter initialEntries={[path]}>
                <Routes>
                    <Route element={<GuestRoute />}>
                        <Route path="/login" element={<p>Login screen</p>} />
                    </Route>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<p>Dashboard screen</p>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        </AuthProvider>,
    );
}

beforeEach(() => {
    window.localStorage.clear();
});

describe('route guards', () => {
    it('redirects guests from protected pages to login', () => {
        renderRoutes('/dashboard');
        expect(screen.getByText('Login screen')).toBeInTheDocument();
    });

    it('lets signed-in users in and keeps them off the login page', async () => {
        await login({ ...DEMO_ACCOUNTS.admin, remember: false });

        renderRoutes('/login');
        expect(screen.getByText('Dashboard screen')).toBeInTheDocument();
    });
});

describe('Sidebar', () => {
    it('renders every navigation item, marks the active one and logs out', async () => {
        const onLogout = vi.fn();
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Sidebar isOpen={false} onClose={vi.fn()} onLogout={onLogout} />
            </MemoryRouter>,
        );

        for (const item of NAV_ITEMS) {
            expect(screen.getByRole('link', { name: item.label })).toBeInTheDocument();
        }
        expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');

        await userEvent.click(screen.getByRole('button', { name: 'Logout' }));
        expect(onLogout).toHaveBeenCalledTimes(1);
    });
});