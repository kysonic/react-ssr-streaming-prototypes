import express from 'express';
import { StreamingSSRRenderer } from './lib/streaming-ssr-renderer.ts';
import { Root } from './components/root.tsx';

const app = express();
const port = 3007;

// Express 5 (path-to-regexp v8) no longer accepts a bare '*'
app.get('/{*splat}', (req, res) => {
    const renderer = new StreamingSSRRenderer({
        bootstrapScripts: ['/build/client.js'],

        onShellReady: () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
        },

        onError: () => {
            res.statusCode = 500;
        },

        timeout: 10_000,
    });

    const stream = renderer.renderToStream(<Root req={req} />);

    stream.pipe(res);
});

app.listen(port, (err) => {
    if (err) throw err;
    console.log(`Example app listening on port ${port}`);
});
