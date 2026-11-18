import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Select } from '@/components/common/Select';
import { cn } from '@/lib/utils/cn';
import { formatNumber } from '@/lib/utils/format';

const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 25].map((size) => ({ value: size, label: `${size} / page` }));

const PAGE_BUTTON_CLASS =
    'flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 disabled:cursor-not-allowed disabled:opacity-40';

function getPageItems(page, totalPages) {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const items = [1];
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    if (start > 2) items.push('start-ellipsis');
    for (let number = start; number <= end; number += 1) items.push(number);
    if (end < totalPages - 1) items.push('end-ellipsis');
    items.push(totalPages);

    return items;
}

export function Pagination({
    page,
    totalPages,
    totalItems,
    rangeStart,
    rangeEnd,
    pageSize,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    onPageChange,
    onPageSizeChange,
    className,
}) {
    if (totalItems === 0) return null;

    return (
        <nav
            aria-label="Pagination"
            className={cn('flex flex-col items-center justify-between gap-3 px-4 py-3 sm:flex-row', className)}
        >
            <p className="text-sm text-ink-muted">
                {`Showing ${formatNumber(rangeStart)}–${formatNumber(rangeEnd)} of ${formatNumber(totalItems)}`}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
                {onPageSizeChange && (
                    <Select
                        aria-label="Rows per page"
                        options={pageSizeOptions}
                        value={pageSize}
                        onChange={onPageSizeChange}
                        className="w-32"
                        selectClassName="h-9 text-sm"
                    />
                )}

                <button
                    type="button"
                    aria-label="Previous page"
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                    className={cn(PAGE_BUTTON_CLASS, 'text-ink hover:bg-slate-100')}
                >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>

                {getPageItems(page, totalPages).map((item) =>
                    typeof item === 'string' ? (
                        <span key={item} className="px-1 text-ink-muted" aria-hidden="true">
                            …
                        </span>
                    ) : (
                        <button
                            key={item}
                            type="button"
                            aria-label={`Page ${item}`}
                            aria-current={item === page ? 'page' : undefined}
                            onClick={() => onPageChange(item)}
                            className={cn(
                                PAGE_BUTTON_CLASS,
                                item === page ? 'bg-brand text-white' : 'text-ink hover:bg-slate-100',
                            )}
                        >
                            {item}
                        </button>
                    ),
                )}

                <button
                    type="button"
                    aria-label="Next page"
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                    className={cn(PAGE_BUTTON_CLASS, 'text-ink hover:bg-slate-100')}
                >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
            </div>
        </nav>
    );
}