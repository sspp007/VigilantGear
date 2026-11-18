import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

class ObserverStub {
    observe() { }

    unobserve() { }

    disconnect() { }
}

globalThis.ResizeObserver ??= ObserverStub;
globalThis.IntersectionObserver ??= ObserverStub;

afterEach(() => {
    cleanup();
});