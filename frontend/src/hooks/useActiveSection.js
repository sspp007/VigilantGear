import { useEffect, useState } from 'react';

export function useActiveSection(sectionIds) {
    const [activeId, setActiveId] = useState(sectionIds[0]);

    useEffect(() => {
        const elements = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.find((entry) => entry.isIntersecting);
                if (visible) setActiveId(visible.target.id);
            },
            { rootMargin: '-40% 0px -50% 0px' },
        );

        elements.forEach((element) => observer.observe(element));
        return () => observer.disconnect();
    }, [sectionIds]);

    return activeId;
}