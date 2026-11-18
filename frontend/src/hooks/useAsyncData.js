import { useCallback, useEffect, useState } from 'react';

export function useAsyncData(fetcher, deps = []) {
    const [state, setState] = useState({ data: null, isLoading: true, error: null });
    const [reloadCount, setReloadCount] = useState(0);

    useEffect(() => {
        let isActive = true;
        setState((current) => ({ ...current, isLoading: true, error: null }));

        Promise.resolve()
            .then(fetcher)
            .then((data) => {
                if (isActive) setState({ data, isLoading: false, error: null });
            })
            .catch((error) => {
                if (isActive) setState({ data: null, isLoading: false, error });
            });

        return () => {
            isActive = false;
        };
    }, [...deps, reloadCount]);

    const reload = useCallback(() => setReloadCount((count) => count + 1), []);

    return { ...state, reload };
}