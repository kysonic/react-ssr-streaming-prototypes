import type { DataCache } from '../app/lib/data/data-cache.ts';
import { DATA_GLOBAL, type DataPair } from '../app/lib/data/transfer.ts';

interface DataQueue {
    push(...pairs: DataPair[]): void;
}

// Puts the data the server streamed into the client cache as ready entries,
// so use() doesn't suspend on them and hydration doesn't fetch again.
//
// Call before hydrateRoot. Two parts, like React's own $RC queue:
// - scripts that ran before this bundle left an array: drain it now
// - scripts still to come (boundaries streamed later) call push() on the
//   object put in its place and land in the cache right away. They arrive
//   before the boundary's HTML, so React finds the data when it hydrates it
export function receiveServerData(cache: DataCache): void {
    const global = self as unknown as Record<string, DataQueue | undefined>;

    const put = (...pairs: DataPair[]) => {
        for (const [key, value] of pairs) {
            cache.set(key, value);
        }
    };

    const queued = global[DATA_GLOBAL];
    if (Array.isArray(queued)) {
        put(...queued);
    }

    // Replace standard array method to set data right direct in the cache on the client after hydration
    global[DATA_GLOBAL] = { push: put };
}
