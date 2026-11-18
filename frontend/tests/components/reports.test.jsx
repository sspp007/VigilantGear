import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ReportsPage } from '@/app/reports/ReportsPage';
import { resetReports } from '@/lib/api/reportService';
import { downloadBlob } from '@/lib/utils/download';

vi.mock('@/lib/utils/download', () => ({ downloadBlob: vi.fn() }));

beforeEach(() => {
    window.localStorage.clear();
    resetReports();
    downloadBlob.mockClear();
});

describe('ReportsPage', () => {
    it('shows the reference KPIs and the category chart data', async () => {
        render(<ReportsPage />);

        expect(await screen.findByText('3,842')).toBeInTheDocument();
        expect(screen.getByText('2,964')).toBeInTheDocument();
        expect(screen.getByText('77.1%')).toBeInTheDocument();
        expect(await screen.findByRole('img', { name: /No Helmet: 262/ })).toBeInTheDocument();
    });

    it('lists the recent reports', async () => {
        render(<ReportsPage />);

        const table = screen.getByRole('table');
        expect(await within(table).findByText('Violation Summary Report')).toBeInTheDocument();
        expect(within(table).getByText('1.2 MB')).toBeInTheDocument();
    });

    it('generates a new report and adds it to the list', async () => {
        render(<ReportsPage />);

        const table = screen.getByRole('table');

        await within(table).findByText('Violation Summary Report');

        await userEvent.selectOptions(
            screen.getByLabelText('Report Type'),
            'Detection Summary Report',
        );

        await userEvent.click(screen.getByLabelText('CSV'));

        await userEvent.click(
            screen.getByRole('button', { name: 'Generate Report' }),
        );

        expect(
            await within(table).findByText('Detection Summary Report', {}, {
                timeout: 3000,
            }),
        ).toBeInTheDocument();
    });

    it('downloads a report as CSV', async () => {
        render(<ReportsPage />);
        const table = screen.getByRole('table');
        await within(table).findByText('Violation Summary Report');

        await userEvent.click(screen.getByRole('button', { name: 'Download PPE Compliance Report' }));

        expect(downloadBlob).toHaveBeenCalledWith('ppe_compliance_report_2025-01-01_2025-01-26.csv', expect.any(Blob));
    });

    it('previews the data behind a report', async () => {
        render(<ReportsPage />);
        const table = screen.getByRole('table');
        await within(table).findByText('Violation Summary Report');

        await userEvent.click(screen.getByRole('button', { name: 'Preview Violation Summary Report' }));

        const dialog = screen.getByRole('dialog', { name: 'Violation Summary Report' });
        expect(within(dialog).getByText('262')).toBeInTheDocument();
    });

    it('adds a scheduled-report recipient and rejects invalid emails', async () => {
        render(<ReportsPage />);
        const input = screen.getByLabelText('Add recipient email');

        await userEvent.type(input, 'nope{Enter}');
        expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email address');

        await userEvent.clear(input);
        await userEvent.type(input, 'ops@acme.com{Enter}');
        expect(screen.getByText('ops@acme.com')).toBeInTheDocument();
    });

    it('turns the schedule off', async () => {
        render(<ReportsPage />);
        const toggle = screen.getByRole('switch', { name: 'Enable scheduled reports' });

        await userEvent.click(toggle);

        expect(toggle).toHaveAttribute('aria-checked', 'false');
        expect(screen.getByLabelText('Frequency')).toBeDisabled();
    });
});