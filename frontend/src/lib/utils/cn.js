export function cn(...inputs) {
    const classes = [];

    for (const input of inputs) {
        if (!input) continue;

        if (typeof input === 'string') {
            classes.push(input);
        } else if (Array.isArray(input)) {
            classes.push(cn(...input));
        } else if (typeof input === 'object') {
            for (const [className, enabled] of Object.entries(input)) {
                if (enabled) classes.push(className);
            }
        }
    }

    return classes.filter(Boolean).join(' ');
}