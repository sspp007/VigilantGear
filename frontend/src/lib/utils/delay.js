export const MOCK_LATENCY_MS = 300;

export function wait(milliseconds = MOCK_LATENCY_MS) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}