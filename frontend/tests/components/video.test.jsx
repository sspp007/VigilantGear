import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AnalysisJobCard } from '@/components/video/AnalysisJobCard';
import { VideoUploadZone } from '@/components/video/VideoUploadZone';

const baseJob = {
    id: 'job-x',
    fileName: 'site_work_01.mp4',
    sizeBytes: 1024,
    thumbnail: '/images/thumbs/thumb-1.jpg',
    progress: 0,
    error: null,
};

describe('VideoUploadZone', () => {
    it('accepts a supported video file', () => {
        const onFileSelected = vi.fn();
        const { container } = render(<VideoUploadZone onFileSelected={onFileSelected} />);
        const file = new File(['data'], 'clip.mp4', { type: 'video/mp4' });

        fireEvent.change(container.querySelector('input[type="file"]'), { target: { files: [file] } });

        expect(onFileSelected).toHaveBeenCalledWith(file);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('rejects an unsupported file and explains why', () => {
        const onFileSelected = vi.fn();
        const { container } = render(<VideoUploadZone onFileSelected={onFileSelected} />);
        const file = new File(['data'], 'notes.pdf', { type: 'application/pdf' });

        fireEvent.change(container.querySelector('input[type="file"]'), { target: { files: [file] } });

        expect(onFileSelected).not.toHaveBeenCalled();
        expect(screen.getByRole('alert')).toHaveTextContent(/Unsupported format/);
    });

    it('accepts a dropped video file', () => {
        const onFileSelected = vi.fn();
        render(<VideoUploadZone onFileSelected={onFileSelected} />);
        const file = new File(['data'], 'drop.mov', { type: 'video/quicktime' });

        fireEvent.drop(screen.getByText(/Drag & drop/).closest('label'), { dataTransfer: { files: [file] } });

        expect(onFileSelected).toHaveBeenCalledWith(file);
    });
});

describe('AnalysisJobCard', () => {
    it('shows progress for a processing job', () => {
        render(<AnalysisJobCard job={{ ...baseJob, status: 'processing', progress: 68 }} />);

        expect(screen.getByText('Processing… (68%)')).toBeInTheDocument();
        expect(screen.getByRole('progressbar', { name: /Processing site_work_01/ })).toHaveAttribute(
            'aria-valuenow',
            '68',
        );
    });

    it('offers download and view for a completed job', async () => {
        const onDownload = vi.fn();
        const onView = vi.fn();
        render(
            <AnalysisJobCard job={{ ...baseJob, status: 'completed', progress: 100 }} onDownload={onDownload} onView={onView} />,
        );

        expect(screen.getByText('Completed')).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: /Download report/ }));
        await userEvent.click(screen.getByRole('button', { name: /View results/ }));
        expect(onDownload).toHaveBeenCalledTimes(1);
        expect(onView).toHaveBeenCalledTimes(1);
    });

    it('offers retry for a failed job', async () => {
        const onRetry = vi.fn();
        render(<AnalysisJobCard job={{ ...baseJob, status: 'failed', progress: 34 }} onRetry={onRetry} />);

        expect(screen.getByText('Failed')).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: /Retry analysis/ }));
        expect(onRetry).toHaveBeenCalledTimes(1);
    });
});