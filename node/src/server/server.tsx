import path from 'node:path';
import express from 'express';
import { StreamingSSRRenderer } from './lib/streaming-ssr-renderer.ts';
import { Root } from './components/root.tsx';

const app = express();
const port = process.env.PORT ?? 3007;

// Static handler
app.use(express.static(path.resolve(import.meta.dirname, '../../public')));

// Express 5 (path-to-regexp v8) no longer accepts a bare '*'
app.get('/{*splat}', (req, res, next) => {
    // Paths with an extension are static
    if (path.extname(req.path)) {
        return next();
    }

    const renderer = new StreamingSSRRenderer({
        bootstrapScripts: ['/build/client.js'],

        onShellReady: () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            console.log('Shell ready - All without suspense', req.url);
        },

        onAllReady: () => {
            console.log('All Suspenses Resolved', req.url);
        },

        onError: () => {
            res.statusCode = 500;
        },

        timeout: 10_000,
    });

    const stream = renderer.renderToStream(<Root />);

    stream.pipe(res);
});

app.listen(port, (err) => {
    if (err) {
        throw err;
    }
    
    console.log(`Streaming SSR app listening on port ${port}`);
});
