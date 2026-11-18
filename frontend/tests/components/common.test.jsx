import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Users } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '@/components/common/Button';
import { Checkbox } from '@/components/common/Checkbox';
import { ComplianceRateCard } from '@/components/common/ComplianceRateCard';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { DataTable } from '@/components/common/DataTable';
import { ErrorState } from '@/components/common/ErrorState';
import { Input } from '@/components/common/Input';
import { KpiCard } from '@/components/common/KpiCard';
import { Modal } from '@/components/common/Modal';
import { Pagination } from '@/components/common/Pagination';
import { SafeImage } from '@/components/common/SafeImage';
import { SearchInput } from '@/components/common/SearchInput';
import { Select } from '@/components/common/Select';
import { CategoryBadge, StatusBadge } from '@/components/common/StatusBadge';
import { Toggle } from '@/components/common/Toggle';

describe('Button', () => {
    it('fires onClick and is disabled while loading', async () => {
        const onClick = vi.fn();
        const { rerender } = render(<Button onClick={onClick}>Save</Button>);

        await userEvent.click(screen.getByRole('button', { name: 'Save' }));
        expect(onClick).toHaveBeenCalledTimes(1);

        rerender(
            <Button onClick={onClick} isLoading>
                Save
            </Button>,
        );
        expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    });
});

describe('Input', () => {
    it('links the label and exposes the error state', () => {
        render(<Input label="Work Email" error="Required" />);

        const input = screen.getByLabelText('Work Email');
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByRole('alert')).toHaveTextContent('Required');
    });
});

describe('Select', () => {
    it('returns the original option value type', async () => {
        const onChange = vi.fn();
        const options = [
            { value: 0.5, label: 'Every 0.5 seconds' },
            { value: 1, label: 'Every 1 second' },
        ];
        render(<Select label="Frame interval" options={options} value={1} onChange={onChange} />);

        await userEvent.selectOptions(screen.getByLabelText('Frame interval'), 'Every 0.5 seconds');
        expect(onChange).toHaveBeenCalledWith(0.5);
    });
});

describe('Checkbox', () => {
    it('toggles when clicked through its label', async () => {
        render(<Checkbox label="Remember me" />);

        await userEvent.click(screen.getByLabelText('Remember me'));
        expect(screen.getByLabelText('Remember me')).toBeChecked();
    });
});

describe('Toggle', () => {
    it('reports the next value', async () => {
        const onChange = vi.fn();
        render(<Toggle label="Save snapshots" checked={false} onChange={onChange} />);

        await userEvent.click(screen.getByRole('switch', { name: 'Save snapshots' }));
        expect(onChange).toHaveBeenCalledWith(true);
    });
});

describe('Modal and ConfirmDialog', () => {
    it('renders an accessible dialog and closes on Escape', async () => {
        const onClose = vi.fn();
        render(
            <Modal isOpen onClose={onClose} title="Details">
                <p>Body</p>
            </Modal>,
        );

        expect(screen.getByRole('dialog', { name: 'Details' })).toBeInTheDocument();
        await userEvent.keyboard('{Escape}');
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('renders nothing when closed', () => {
        render(<Modal isOpen={false} onClose={vi.fn()} title="Hidden" />);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('calls onConfirm from the confirm button', async () => {
        const onConfirm = vi.fn();
        render(
            <ConfirmDialog
                isOpen
                onClose={vi.fn()}
                onConfirm={onConfirm}
                title="Delete user?"
                confirmLabel="Delete"
                tone="danger"
            />,
        );

        await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });
});

describe('Pagination', () => {
    const baseProps = { totalPages: 5, totalItems: 47, rangeStart: 11, rangeEnd: 20, pageSize: 10 };

    it('shows the range and navigates', async () => {
        const onPageChange = vi.fn();
        render(<Pagination {...baseProps} page={2} onPageChange={onPageChange} />);

        expect(screen.getByText('Showing 11–20 of 47')).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
        expect(onPageChange).toHaveBeenLastCalledWith(3);
        await userEvent.click(screen.getByRole('button', { name: 'Page 4' }));
        expect(onPageChange).toHaveBeenLastCalledWith(4);
    });

    it('disables previous on the first page', () => {
        render(<Pagination {...baseProps} page={1} onPageChange={vi.fn()} />);
        expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    });
});

describe('SearchInput', () => {
    it('reports typing and clears the value', async () => {
        const onChange = vi.fn();
        render(<SearchInput value="abc" onChange={onChange} placeholder="Search by Person ID" />);

        fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'x' } });
        expect(onChange).toHaveBeenLastCalledWith('x');

        await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
        expect(onChange).toHaveBeenLastCalledWith('');
    });
});

describe('DataTable', () => {
    const columns = [
        { key: 'name', header: 'Name', sortable: true, cell: (row) => row.name },
        { key: 'role', header: 'Role', cell: (row) => row.role },
    ];
    const rows = [
        { id: 1, name: 'Asha', role: 'Admin' },
        { id: 2, name: 'Ravi', role: 'Manager' },
    ];

    it('renders rows and wires sorting', async () => {
        const onSortChange = vi.fn();
        render(
            <DataTable columns={columns} rows={rows} sort={{ key: 'name', direction: 'asc' }} onSortChange={onSortChange} />,
        );

        expect(screen.getByText('Ravi')).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'ascending');

        await userEvent.click(screen.getByRole('button', { name: /Name/ }));
        expect(onSortChange).toHaveBeenCalledWith('name');
    });

    it('shows the empty and loading states', () => {
        const { rerender } = render(<DataTable columns={columns} rows={[]} />);
        expect(screen.getByText('No results found')).toBeInTheDocument();

        rerender(<DataTable columns={columns} rows={[]} isLoading />);
        expect(screen.getByRole('status')).toBeInTheDocument();
    });
});

describe('SafeImage', () => {
    it('falls back to a placeholder when the image fails', () => {
        render(<SafeImage src="/images/missing.jpg" alt="Worker" />);

        fireEvent.error(screen.getByAltText('Worker'));
        expect(screen.getByRole('img', { name: 'Worker' }).tagName).toBe('DIV');
    });
});

describe('badges and KPI cards', () => {
    it('renders status and category badges', () => {
        render(
            <>
                <StatusBadge status="violation" />
                <StatusBadge status="uncertain" label="Needs review" />
                <CategoryBadge categoryId="helmet" />
            </>,
        );

        expect(screen.getByText('Violation')).toBeInTheDocument();
        expect(screen.getByText('Needs review')).toBeInTheDocument();
        expect(screen.getByText('No Helmet')).toBeInTheDocument();
    });

    it('formats KPI numbers and the compliance rate', () => {
        render(
            <>
                <KpiCard icon={Users} value={3842} label="Total Detections" />
                <ComplianceRateCard rate={77.1} />
            </>,
        );

        expect(screen.getByText('3,842')).toBeInTheDocument();
        expect(screen.getByText('77.1%')).toBeInTheDocument();
    });
});

describe('ErrorState', () => {
    it('offers a retry action', async () => {
        const onRetry = vi.fn();
        render(<ErrorState message="Failed to load" onRetry={onRetry} />);

        await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
        expect(onRetry).toHaveBeenCalledTimes(1);
    });
});