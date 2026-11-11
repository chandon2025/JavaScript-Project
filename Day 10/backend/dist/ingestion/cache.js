class IngestionCache {
    store = new Map();
    get(key) {
        const entry = this.store.get(key);
        if (!entry)
            return null;
        if (Date.now() - entry.timestamp > entry.ttlMs) {
            this.store.delete(key);
            return null;
        }
        return entry.data;
    }
    set(key, data, ttlSeconds = 21600) {
        this.store.set(key, {
            data,
            timestamp: Date.now(),
            ttlMs: ttlSeconds * 1000,
        });
    }
    has(key) {
        return this.get(key) !== null;
    }
    clear() {
        this.store.clear();
    }
}
export const appCache = new IngestionCache();
