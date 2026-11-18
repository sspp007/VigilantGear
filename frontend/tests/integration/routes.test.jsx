
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '@/App';
import { login } from '@/lib/api/authService';
import { PAGE_META } from '@/lib/constants/pageMeta';
import { AuthProvider } from '@/lib/context/AuthProvider';
import { DEMO_ACCOUNTS } from '@/lib/data/userData';

function renderApp(path) {
    return render(
        <AuthProvider>
            <MemoryRouter initialEntries={[path]}>
                <App />
            </MemoryRouter>
        </AuthProvider>,
    );
}

async function expectLoginPage() {
    const loginHeading = await screen.findByRole('heading', {
        level: 1,
    });

    expect(loginHeading).toHaveTextContent(/Welcome to\s*Vigilant\s*Gear/);
}

beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('public routes', () => {
    it('renders the landing page', async () => {
        renderApp('/');

        expect(
            await screen.findByRole('heading', {
                level: 1,
                name: /AI-Powered PPE Compliance Monitoring/,
            }),
        ).toBeInTheDocument();
    });

    it('renders the login page', async () => {
        renderApp('/login');

        await expectLoginPage();
    });

    it('renders a not-found page for unknown routes', async () => {
        renderApp('/does-not-exist');

        expect(await screen.findByText('Page not found')).toBeInTheDocument();
    });
});

describe('protected routes', () => {
    it('redirects guests to the login page', async () => {
        renderApp('/dashboard');

        await expectLoginPage();
    });

    it.each(Object.entries(PAGE_META))(
        'renders %s for a signed-in user',
        async (path, meta) => {
            await login({
                ...DEMO_ACCOUNTS.admin,
                remember: false,
            });

            renderApp(path);

            expect(
                await screen.findByRole('heading', {
                    level: 1,
                    name: meta.title,
                }),
            ).toBeInTheDocument();
        },
    );

    it('logs out and returns to the login page', async () => {
        await login({
            ...DEMO_ACCOUNTS.admin,
            remember: false,
        });

        renderApp('/dashboard');

        await userEvent.click(
            await screen.findByRole('button', {
                name: 'Logout',
            }),
        );

        await expectLoginPage();
    });
});
