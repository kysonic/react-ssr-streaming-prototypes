import { createContext, useContext } from 'react';
import type { DataCache } from './data-cache.ts';

// Server: a new cache per request (src/server/server.tsx).
// Client: one cache per tab (src/client/index.tsx)
export const DataContext = createContext<DataCache | null>(null);

export function useDataCache(): DataCache {
    const cache = useContext(DataContext);

    if (!cache) {
        throw new Error('DataContext is missing: wrap the tree in <DataContext>');
    }
    
    return cache;
}
