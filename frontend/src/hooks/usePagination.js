import { useCallback, useMemo, useState } from 'react';

export function usePagination(items, initialPageSize = 10) {
    const [requestedPage, setRequestedPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);

    const totalItems = items.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const page = Math.min(requestedPage, totalPages);
    const startIndex = (page - 1) * pageSize;

    const pageItems = useMemo(
        () => items.slice(startIndex, startIndex + pageSize),
        [items, startIndex, pageSize],
    );

    const goToPage = useCallback((nextPage) => setRequestedPage(Math.max(1, nextPage)), []);
    const resetPage = useCallback(() => setRequestedPage(1), []);
    const changePageSize = useCallback((size) => {
        setPageSize(size);
        setRequestedPage(1);
    }, []);

    return {
        page,
        pageSize,
        totalItems,
        totalPages,
        pageItems,
        rangeStart: totalItems === 0 ? 0 : startIndex + 1,
        rangeEnd: Math.min(startIndex + pageSize, totalItems),
        goToPage,
        resetPage,
        changePageSize,
    };
}