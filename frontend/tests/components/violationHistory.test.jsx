import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ViolationHistoryPage } from '@/app/violation-history/ViolationHistoryPage';
import { downloadBlob } from '@/lib/utils/download';

vi.mock('@/lib/utils/download', () => ({ downloadBlob: vi.fn() }));

function renderPage(path = '/violation-history') {
    return render(
        <MemoryRouter initialEntries={[path]}>
            <ViolationHistoryPage />
        </MemoryRouter>,
    );
}

beforeEach(() => {
    downloadBlob.mockClear();
});

describe('ViolationHistoryPage', () => {
    it('shows the reference KPI counts and the first page of the table', async () => {
        renderPage();

        expect(await screen.findByText('Total Violations')).toBeInTheDocument();
        expect(screen.getByText('623', { selector: 'p' })).toBeInTheDocument();
        expect(screen.getByText('262', { selector: 'p' })).toBeInTheDocument();
        expect(screen.getByText('Showing 1–10 of 623')).toBeInTheDocument();
    });

    it('pre-fills the search from the URL and filters the table', async () => {
        renderPage('/violation-history?q=P-1042');

        await screen.findByText('Total Violations');

        expect(screen.getByRole('searchbox')).toHaveValue('P-1042');
        expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(2);
    });

    it('filters by PPE type', async () => {
        renderPage();
        await screen.findByText('Total Violations');

        await userEvent.selectOptions(screen.getByLabelText('PPE type'), 'Gloves');

        expect(screen.getByText('Showing 1–10 of 37')).toBeInTheDocument();
    });

    it('updates the table when the date range changes', async () => {
        renderPage();
        await screen.findByText('Total Violations');

        await userEvent.selectOptions(screen.getByLabelText('Date range'), 'Jan 26, 2025');

        expect(await screen.findByText('Showing 1–10 of 147')).toBeInTheDocument();
    });

    it('sorts by a column', async () => {
        renderPage();
        await screen.findByText('Total Violations');

        await userEvent.click(screen.getByRole('button', { name: /Confidence/ }));

        expect(screen.getByRole('columnheader', { name: /Confidence/ })).toHaveAttribute('aria-sort', 'ascending');
    });

    it('exports the filtered records as CSV', async () => {
        renderPage();
        await screen.findByText('Total Violations');

        await userEvent.click(screen.getByRole('button', { name: 'Export CSV' }));

        expect(downloadBlob).toHaveBeenCalledWith('violation_history.csv', expect.any(Blob));
    });

    it('opens the details dialog for a record', async () => {
        renderPage();
        await screen.findByText('Total Violations');

        await userEvent.click(screen.getByRole('button', { name: 'View details for P-1042' }));

        expect(screen.getByRole('dialog', { name: 'Violation P-1042' })).toBeInTheDocument();
    });
});