import * as esbuild from 'esbuild';

const watch = process.argv.includes('--watch');

const options: esbuild.BuildOptions = {
    absWorkingDir: import.meta.dirname,
    entryPoints: ['src/client/index.tsx'],
    outfile: 'public/build/client.js',
    bundle: true,
    jsx: 'automatic',
    define: {
        'process.env.NODE_ENV': JSON.stringify('development'),
    },
    logLevel: 'info',
};

if (watch) {
    // Keeps the process alive and rebuilds on every change
    const ctx = await esbuild.context(options);
    await ctx.watch();
} else {
    await esbuild.build(options);
}
