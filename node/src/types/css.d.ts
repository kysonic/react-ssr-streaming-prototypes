// A .css import resolves to the stylesheet URL:
// the esbuild plugin on the client, src/server/lib/css-url-hook.ts on the server
declare module '*.css' {
    const href: string;
    export default href;
}
