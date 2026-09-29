import fs from 'node:fs';
import path from 'node:path';
import { MANIFEST_FILE, type Manifest } from '../../lib/manifest.ts';

const PROJECT_ROOT = path.resolve(import.meta.dirname, '../../..');
const isDev = process.env.NODE_ENV !== 'production';

let cached: Manifest | undefined;

// Written by esbuild.config.ts. In dev the client is rebuilt in watch mode
// with new hashes, so re-read on every request; in prod read once
export function readManifest(): Manifest {
    if (cached && !isDev) {
        return cached;
    }

    const file = path.resolve(PROJECT_ROOT, MANIFEST_FILE);
    try {
        cached = JSON.parse(fs.readFileSync(file, 'utf8')) as Manifest;
    } catch (error) {
        throw new Error(
            `Can't read ${MANIFEST_FILE}, run \`pnpm build:client\` first`,
            { cause: error },
        );
    }
    return cached;
}
