import { createContext } from 'react';
import { preloadModule } from 'react-dom';
import type { ChunkAssets, Manifest } from '../../../lib/manifest.ts';

// Provided on the server only. On the client it's null: by then the
// preloads are already in the HTML and import() fetches chunks on its own
export const ManifestContext = createContext<Manifest | null>(null);

// <link rel="modulepreload"> for the chunk and its shared deps, all in parallel.
// Called during render: React (Float) dedupes by href and puts the links into
// <head> if the shell isn't flushed yet, or into the stream next to the
// Suspense boundary that is being revealed
export function preloadChunk(assets: ChunkAssets) {
    preloadModule(assets.js, { as: 'script' });
    for (const dep of assets.deps) {
        preloadModule(dep, { as: 'script' });
    }
}
