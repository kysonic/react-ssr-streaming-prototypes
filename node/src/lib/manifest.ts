import path from 'node:path';
import type { Metafile } from 'esbuild';

// Relative to the project root (node/)
export const MANIFEST_FILE = 'public/build/manifest.json';

// What the page needs to run one piece of client code
export interface ChunkAssets {
    js: string; // the module itself
    deps: string[]; // shared chunks it imports statically (preload them in parallel)
}

export interface Manifest {
    entry: ChunkAssets; // client bootstrap (src/client/index.tsx)
    // Every import() target, keyed by its source path relative to the project root:
    // 'src/app/components/pages/Home/HomePage.tsx' -> { js, deps }
    chunks: Record<string, ChunkAssets>;
}

interface CreateManifestOptions {
    entryPoint: string; // source path of the client entry
    publicDir: string; // output paths inside it become URLs
}

export function createManifest(
    metafile: Metafile,
    { entryPoint, publicDir }: CreateManifestOptions,
): Manifest {
    // Metafile paths always use '/', even on Windows, so posix is enough.
    // Leading '/' so the URL doesn't resolve against the page path (/users/42)
    const toUrl = (file: string) => '/' + path.posix.relative(publicDir, file);

    // Static imports only: dynamic ones are loaded on demand, not with the chunk.
    // Transitive, because a shared chunk can import another shared chunk
    const collectDeps = (file: string, seen = new Set<string>()) => {
        for (const imp of metafile.outputs[file]?.imports ?? []) {
            if (imp.kind === 'import-statement' && !seen.has(imp.path)) {
                seen.add(imp.path);
                collectDeps(imp.path, seen);
            }
        }
        return seen;
    };

    let entry: ChunkAssets | undefined;
    const chunks: Record<string, ChunkAssets> = {};

    for (const [file, output] of Object.entries(metafile.outputs)) {
        // esbuild sets entryPoint for real entries and for import() targets,
        // shared chunks have none
        if (!output.entryPoint || !file.endsWith('.js')) {
            continue;
        }

        const assets: ChunkAssets = {
            js: toUrl(file),
            deps: [...collectDeps(file)].map(toUrl),
        };

        if (output.entryPoint === entryPoint) {
            entry = assets;
        } else {
            chunks[output.entryPoint] = assets;
        }
    }

    if (!entry) {
        throw new Error(`Entry point ${entryPoint} not found in metafile`);
    }

    return { entry, chunks };
}
