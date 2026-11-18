import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/Spinner';
import { cn } from '@/lib/utils/cn';

const ALIGNMENT = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
};

function getAriaSort(column, sort) {
    if (!column.sortable) return undefined;
    if (sort?.key !== column.key) return 'none';
    return sort.direction === 'asc' ? 'ascending' : 'descending';
}

function SortIcon({ column, sort }) {
    if (sort?.key !== column.key) {
        return <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />;
    }
    const Icon = sort.direction === 'asc' ? ArrowUp : ArrowDown;
    return <Icon className="h-3.5 w-3.5 text-brand" aria-hidden="true" />;
}

export function DataTable({
    columns,
    rows,
    getRowKey = (row) => row.id,
    sort,
    onSortChange,
    isLoading = false,
    emptyState,
    caption,
    minWidth = 'min-w-[720px]',
    className,
}) {
    const showLoading = isLoading && rows.length === 0;
    const showEmpty = !isLoading && rows.length === 0;

    return (
        <div className={cn('overflow-x-auto', className)}>
            <table className={cn('w-full border-collapse text-sm', minWidth)}>
                {caption && <caption className="sr-only">{caption}</caption>}
                <thead>
                    <tr className="border-b border-line bg-slate-50/70">
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                scope="col"
                                aria-sort={getAriaSort(column, sort)}
                                className={cn(
                                    'whitespace-nowrap px-4 py-3 font-semibold text-ink',
                                    ALIGNMENT[column.align ?? 'left'],
                                    column.headerClassName,
                                )}
                            >
                                {column.sortable && onSortChange ? (
                                    <button
                                        type="button"
                                        onClick={() => onSortChange(column.key)}
                                        className="inline-flex items-center gap-1 rounded transition hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
                                    >
                                        {column.header}
                                        <SortIcon column={column} sort={sort} />
                                    </button>
                                ) : (
                                    column.header
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {showLoading && (
                        <tr>
                            <td colSpan={columns.length}>
                                <LoadingState />
                            </td>
                        </tr>
                    )}
                    {showEmpty && (
                        <tr>
                            <td colSpan={columns.length}>
                                {emptyState ?? (
                                    <EmptyState title="No results found" description="Try adjusting your search or filters." />
                                )}
                            </td>
                        </tr>
                    )}
                    {rows.map((row, index) => (
                        <tr key={getRowKey(row)} className="border-b border-line transition last:border-b-0 hover:bg-slate-50/60">
                            {columns.map((column) => (
                                <td
                                    key={column.key}
                                    className={cn(
                                        'px-4 py-3 align-middle text-ink',
                                        ALIGNMENT[column.align ?? 'left'],
                                        column.className,
                                    )}
                                >
                                    {column.cell(row, index)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}