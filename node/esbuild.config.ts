import fs from 'node:fs';
import path from 'node:path';
import * as esbuild from 'esbuild';
import { cssUrl } from './src/lib/css-url.ts';
import { createManifest, MANIFEST_FILE } from './src/lib/manifest.ts';

const watch = process.argv.includes('--watch');

const PUBLIC_DIR = 'public';
const BUILD_DIR = 'public/build';
const JS_DIR = 'public/build/js';
const CLIENT_ENTRY = 'src/client/index.tsx';

// Stale outputs from a previous run (hashed names never get overwritten)
fs.rmSync(path.resolve(import.meta.dirname, BUILD_DIR), {
    recursive: true,
    force: true,
});

// `import href from './X.css'` -> `export default '/build/css/.../X.css'`;
// the CSS itself is built separately by cssOptions
// don't works with css from node modules and aliases (@/styles etc)
const cssUrlPlugin: esbuild.Plugin = {
    name: 'css-url',
    setup(build) {
        build.onResolve({ filter: /\.css$/ }, (args) => ({
            path: path.resolve(args.resolveDir, args.path),
            namespace: 'css-url',
        }));

        build.onLoad({ filter: /.*/, namespace: 'css-url' }, (args) => ({
            contents: `export default ${JSON.stringify(cssUrl(args.path))};`,
            loader: 'js',
        }));
    },
};

// Writes manifest.json after every (re)build: source path -> chunk URLs,
// so the server knows what to preload for each lazy component
const manifestPlugin: esbuild.Plugin = {
    name: 'manifest',
    setup(build) {
        const cwd = build.initialOptions.absWorkingDir!;

        build.onEnd((result) => {
            if (!result.metafile) {
                return; // build failed
            }

            const manifest = createManifest(result.metafile, {
                entryPoint: CLIENT_ENTRY,
                publicDir: PUBLIC_DIR,
            });

            // Write to a temp file, then rename: rename is atomic on the same
            // filesystem, so the server never reads a half-written manifest
            const manifestPath = path.resolve(cwd, MANIFEST_FILE);
            const tmpPath = `${manifestPath}.tmp`;
            fs.writeFileSync(tmpPath, JSON.stringify(manifest, null, 2));
            fs.renameSync(tmpPath, manifestPath);

            // In watch mode every rebuild emits new hashes, drop the old files
            const outputs = new Set(
                Object.keys(result.metafile.outputs).map((file) =>
                    path.resolve(cwd, file),
                ),
            );
            
            for (const file of fs.readdirSync(path.resolve(cwd, JS_DIR), {
                recursive: true,
                withFileTypes: true,
            })) {
                const filePath = path.join(file.parentPath, file.name);
                if (file.isFile() && !outputs.has(filePath)) {
                    fs.rmSync(filePath);
                }
            }
        });
    },
};

const jsOptions: esbuild.BuildOptions = {
    absWorkingDir: import.meta.dirname,
    entryPoints: { client: CLIENT_ENTRY },
    outdir: JS_DIR,
    // ESM is required for splitting: every import() becomes its own chunk,
    // code shared between chunks goes to chunks/chunk-[hash].js
    format: 'esm',
    splitting: true,
    entryNames: '[name]-[hash]',
    chunkNames: 'chunks/[name]-[hash]',
    metafile: true,
    bundle: true,
    jsx: 'automatic',
    define: {
        'process.env.NODE_ENV': JSON.stringify('development'),
    },
    plugins: [cssUrlPlugin, manifestPlugin],
    logLevel: 'info',
};

// Every .css file is its own entry, so each one loads independently
const cssOptions: esbuild.BuildOptions = {
    absWorkingDir: import.meta.dirname,
    entryPoints: ['src/app/**/*.css'],
    outbase: 'src/app',
    outdir: 'public/build/css',
    bundle: true, // inlines @import
    logLevel: 'info',
};

if (watch) {
    // Keeps the process alive and rebuilds on every change
    const contexts = await Promise.all([
        esbuild.context(jsOptions),
        esbuild.context(cssOptions),
    ]);
    await Promise.all(contexts.map((ctx) => ctx.watch()));
} else {
    await Promise.all([esbuild.build(jsOptions), esbuild.build(cssOptions)]);
}
