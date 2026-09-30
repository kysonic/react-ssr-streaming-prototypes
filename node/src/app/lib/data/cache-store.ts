import type { Entry } from './data-cache.ts';

// Where DataCache keeps its entries. Swap the implementation by passing
// another store to `new DataCache(store)` (LRU, size limit, a test double...).
//
// The contract is synchronous on purpose: use() reads the entry during render
// and can't wait. An async storage (IndexedDB, localStorage in a worker) can't
// implement it directly - it goes on top as persistence: load into the cache
// with cache.set() before hydrateRoot, write back from cache.subscribe()
export interface CacheStore {
    get(key: string): Entry<unknown> | undefined;
    set(key: string, entry: Entry<unknown>): void;
    has(key: string): boolean;
    delete(key: string): void;
}

// Default: plain in-memory Map, lives as long as the DataCache instance
// (one request on the server, one tab on the client)
export class MapStore implements CacheStore {
    private entries = new Map<string, Entry<unknown>>();

    get(key: string) {
        return this.entries.get(key);
    }

    set(key: string, entry: Entry<unknown>) {
        this.entries.set(key, entry);
    }

    has(key: string) {
        return this.entries.has(key);
    }

    delete(key: string) {
        this.entries.delete(key);
    }
}
