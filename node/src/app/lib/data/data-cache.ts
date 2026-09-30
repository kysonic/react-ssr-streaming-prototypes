import { MapStore, type CacheStore } from './cache-store.ts';

// Extended promise compatible with use for synchronous resolution and stability 
export type Entry<T> = Promise<T> &
    (
        | { status: 'pending' }
        | { status: 'fulfilled'; value: T }
        | { status: 'rejected'; reason: unknown }
    );

export type Settled =
    | { status: 'fulfilled'; value: unknown }
    | { status: 'rejected'; reason: unknown };

type Listener = (key: string, result: Settled) => void;

// Promise cache by key: the same key always gives the same promise object,
// so it survives re-renders, discarded renders and remounts.
// Server: one instance per request (never share between users).
// Client: one instance per tab, filled with the data the server streamed.
//
// Facade: the app only talks to this class (get / set / invalidate / subscribe),
// the storage behind it is injected and can be replaced (see CacheStore)
export class DataCache {
    private store: CacheStore;
    private listeners = new Set<Listener>();

    constructor(store: CacheStore = new MapStore()) {
        this.store = store;
    }

    // Returns the entry for the key, starting the fetch only if there is none yet
    get<T>(key: string, fetcher: () => Promise<T>): Entry<T> {
        const existing = this.store.get(key);
        if (existing) {
            return existing as Entry<T>;
        }

        let promise: Promise<T>;
        try {
            promise = fetcher();
        } catch (error) {
            // A fetcher that throws synchronously is just a rejected entry
            promise = Promise.reject(error);
        }

        const entry = Object.assign(promise, { status: 'pending' }) as Entry<T>;
        this.store.set(key, entry);

        // Attached right here, before anyone else can subscribe: by the time
        // React re-renders the suspended component, the state is already set
        // and the listeners (streaming to the client) have already run
        promise.then(
            (value) => {
                Object.assign(entry, { status: 'fulfilled', value });
                this.notify(key, { status: 'fulfilled', value });
            },
            (reason) => {
                Object.assign(entry, { status: 'rejected', reason });
                this.notify(key, { status: 'rejected', reason });
            },
        );

        return entry;
    }

    // Put data on cache on client (took data from script DATA object)
    set<T>(key: string, value: T): void {
        const entry = Object.assign(Promise.resolve(value), {
            status: 'fulfilled',
            value,
        }) as Entry<T>;
        this.store.set(key, entry);
    }

    has(key: string): boolean {
        return this.store.has(key);
    }

    // Right now there is no TTL - so manual flush
    invalidate(key: string): void {
        this.store.delete(key);
    }

    // Subscribe on server to send data during streaming
    subscribe(listener: Listener): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    // Notify that promise is resolved
    private notify(key: string, result: Settled): void {
        for (const listener of this.listeners) {
            listener(key, result);
        }
    }
}
