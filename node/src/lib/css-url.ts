import path from 'node:path';

// Shared by the esbuild plugin (client) and the server hook,
// so both sides resolve a .css import to the same URL
const APP_DIR = path.resolve(import.meta.dirname, '../app');

export const CSS_PUBLIC_PATH = '/build/css/';

// src/app/components/features/UserProfile/UserProfile.css
// -> /build/css/components/features/UserProfile/UserProfile.css
export function cssUrl(file: string): string {
    return (
        CSS_PUBLIC_PATH + path.relative(APP_DIR, file).split(path.sep).join('/')
    );
}
