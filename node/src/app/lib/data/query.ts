import { use } from 'react';
import { useDataCache } from './data-context.ts';

// What to load and under which key it lives in the cache. Built in one place
// (see productQuery, userQuery), so the page that prefetches and the feature
// that reads can't disagree on the key
export interface Query<T> {
    key: string;
    fetch: () => Promise<T>;
}

// Reads the data. Suspends while it's loading - render inside <Suspense>.
// The promise comes from the cache, so re-renders get the same one
export function useQuery<T>(query: Query<T>): T {
    return use(useDataCache().get(query.key, query.fetch));
}

// Only starts the request, never suspends (render-as-you-fetch): call it in
// the page so the data loads in parallel with the feature's chunk, then the
// feature's useQuery picks up the same promise
export function usePrefetch<T>(query: Query<T>): void {
    useDataCache().get(query.key, query.fetch);
}
