// CSS is bundled by esbuild on the client and ignored on the server
// (see src/server/lib/ignore-css.ts); only side-effect imports are used
declare module '*.css';
