import { cn } from '@/lib/utils/cn';

export function getTabId(idPrefix, tabId) {
    return `${idPrefix}-tab-${tabId}`;
}

export function getPanelId(idPrefix) {
    return `${idPrefix}-panel`;
}

export function Tabs({ tabs, activeId, onChange, idPrefix, className }) {
    function handleKeyDown(event) {
        const currentIndex = tabs.findIndex((tab) => tab.id === activeId);
        let nextIndex;

        if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        else return;

        event.preventDefault();
        const nextTab = tabs[nextIndex];
        onChange(nextTab.id);
        document.getElementById(getTabId(idPrefix, nextTab.id))?.focus();
    }

    return (
        <div role="tablist" className={cn('flex border-b border-line', className)} onKeyDown={handleKeyDown}>
            {tabs.map((tab) => {
                const isActive = tab.id === activeId;
                return (
                    <button
                        key={tab.id}
                        id={getTabId(idPrefix, tab.id)}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={getPanelId(idPrefix)}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => onChange(tab.id)}
                        className={cn(
                            '-mb-px flex-1 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50',
                            isActive ? 'border-brand text-brand' : 'border-transparent text-ink hover:text-brand',
                        )}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}