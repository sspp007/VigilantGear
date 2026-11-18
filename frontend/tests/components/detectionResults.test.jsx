import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DetectionResultsPage } from '@/app/detection-results/DetectionResultsPage';
import { downloadBlob } from '@/lib/utils/download';

vi.mock('@/lib/utils/download', () => ({ downloadBlob: vi.fn() }));

beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    downloadBlob.mockClear();
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('DetectionResultsPage', () => {
    it('shows the tab counts and the analysis summary', async () => {
        render(<DetectionResultsPage />);

        expect(await screen.findByRole('tab', { name: 'Detections (24)' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Violations (6)' })).toBeInTheDocument();
        expect(screen.getByText('412')).toBeInTheDocument();
        expect(screen.getByText('77.2%')).toBeInTheDocument();
    });

    it('lists only violations in the Violations tab', async () => {
        render(<DetectionResultsPage />);

        await userEvent.click(await screen.findByRole('tab', { name: 'Violations (6)' }));

        const panel = screen.getByRole('tabpanel');
        expect(within(panel).getByText('P-002')).toBeInTheDocument();
        expect(within(panel).queryByText('P-001')).not.toBeInTheDocument();
    });

    it('searches the details table by person ID', async () => {
        render(<DetectionResultsPage />);
        await screen.findByRole('tab', { name: 'Detections (24)' });

        await userEvent.type(screen.getByRole('searchbox'), 'p-004');

        expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(2);
    });

    it('filters by status and paginates the result', async () => {
        render(<DetectionResultsPage />);
        await screen.findByRole('tab', { name: 'Detections (24)' });

        await userEvent.selectOptions(screen.getByLabelText('Status'), 'Violation');

        expect(screen.getByText('Showing 1–5 of 6')).toBeInTheDocument();
    });

    it('exports the filtered rows as CSV', async () => {
        render(<DetectionResultsPage />);
        await screen.findByRole('tab', { name: 'Detections (24)' });

        await userEvent.click(screen.getByRole('button', { name: 'Export CSV' }));

        expect(downloadBlob).toHaveBeenCalledWith('detection_results.csv', expect.any(Blob));
    });

    it('opens the detail dialog for a row', async () => {
        render(<DetectionResultsPage />);
        await screen.findByRole('tab', { name: 'Detections (24)' });

        await userEvent.click(screen.getByRole('button', { name: 'View details for P-002' }));

        expect(screen.getByRole('dialog', { name: 'Detection P-002' })).toBeInTheDocument();
    });

    it('toggles simulated playback', async () => {
        render(<DetectionResultsPage />);

        await userEvent.click(await screen.findByRole('button', { name: 'Play video' }));

        expect(screen.getByRole('button', { name: 'Pause video' })).toBeInTheDocument();
    });
});