import path from 'node:path';
import * as esbuild from 'esbuild';
import { cssUrl } from './src/lib/css-url.ts';

const watch = process.argv.includes('--watch');

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

const jsOptions: esbuild.BuildOptions = {
    absWorkingDir: import.meta.dirname,
    entryPoints: ['src/client/index.tsx'],
    outfile: 'public/build/client.js',
    bundle: true,
    jsx: 'automatic',
    define: {
        'process.env.NODE_ENV': JSON.stringify('development'),
    },
    plugins: [cssUrlPlugin],
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
