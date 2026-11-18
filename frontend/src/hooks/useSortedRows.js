import { useCallback, useMemo, useState } from 'react';

function compareValues(first, second) {
    if (typeof first === 'string' && typeof second === 'string') {
        return first.localeCompare(second, undefined, { numeric: true });
    }
    if (first < second) return -1;
    return first > second ? 1 : 0;
}

export function useSortedRows(rows, accessors, initialSort = null) {
    const [sort, setSort] = useState(initialSort);

    const sortedRows = useMemo(() => {
        const accessor = sort ? accessors[sort.key] : null;
        if (!accessor) return rows;

        const factor = sort.direction === 'asc' ? 1 : -1;
        return [...rows].sort((a, b) => compareValues(accessor(a), accessor(b)) * factor);
    }, [rows, accessors, sort]);

    const toggleSort = useCallback((key) => {
        setSort((current) => {
            if (current?.key !== key) return { key, direction: 'asc' };
            return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
        });
    }, []);

    return { sortedRows, sort, toggleSort };
}