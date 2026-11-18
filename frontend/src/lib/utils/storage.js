export function readStorage(key, fallback) {
    try {
        const raw = window.localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
    } catch (error) {
        console.warn(`Unable to read "${key}" from local storage.`, error);
        return fallback;
    }
}

export function writeStorage(key, value) {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.warn(`Unable to write "${key}" to local storage.`, error);
        return false;
    }
}

export function removeStorage(key) {
    try {
        window.localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.warn(`Unable to remove "${key}" from local storage.`, error);
        return false;
    }
}