import { registerHooks } from 'node:module';
import { fileURLToPath } from 'node:url';
import { cssUrl } from '../../lib/css-url.ts';

// `import href from './X.css'` on the server resolves to the same URL
// the client bundle gets (see esbuild.config.ts)
// Added in: v23.5.0, v22.15.0 <-- for Node <23 use module.register() (async hooks)
registerHooks({
    load(url, context, nextLoad) {
        if (url.endsWith('.css')) {
            const href = cssUrl(fileURLToPath(url));

            return {
                format: 'module',
                source: `export default ${JSON.stringify(href)};`,
                shortCircuit: true,
            };
        }
        return nextLoad(url, context);
    },
});
