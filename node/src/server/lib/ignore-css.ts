import { registerHooks } from 'node:module';

// Do not load .css on server
// Added in: v23.5.0, v22.15.0 <-- for Node <23 use another solution (Experimental)
// Doesn't work with import styles from <<<<<
registerHooks({
    load(url, context, nextLoad) {
        if (url.endsWith('.css')) {
            return { format: 'module', source: '', shortCircuit: true };
        }
        return nextLoad(url, context);
    },
});
