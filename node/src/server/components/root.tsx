import { App } from '../../app/App.tsx';
import {
    ManifestContext,
    preloadChunk,
} from '../../app/lib/chunks/manifest-context.ts';
import type { Manifest } from '../../lib/manifest.ts';
import { Body, Head, Html } from './document.tsx';

interface RootProps {
    manifest?: Manifest; // server only, see ManifestContext
}

export function Root({ manifest }: RootProps) {
    // Needs to preload deps, entry would be preloaded by bootstrap modules on server
    if (manifest) {
        preloadChunk(manifest.entry);
    }

    return (
        <ManifestContext value={manifest ?? null}>
            <Html>
                <Head>
                    <title>Streaming SSR App</title>
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1"
                    />

                    <link
                        rel="icon"
                        type="image/png"
                        sizes="32x32"
                        href="/favicon.png"
                    />
                </Head>
                <Body>
                    <App />
                </Body>
            </Html>
        </ManifestContext>
    );
}
