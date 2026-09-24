import { createReadableStream } from 'stream/web';
import { renderToReadableStream } from 'react-dom/server';
import React, { Suspense } from 'react';

interface StreamingSSRConfig {
    bootstrapScripts?: string[];
    bootstrapModules?: string[];
    onShellReady?: () => void;
    onAllReady?: () => void;
    onError?: (error: Error) => void;
    timeout?: number;
}

export class StreamingSSRRendering {
    constructor(private config: StreamingSSRConfig = {}) {}

    renderToStream(element: React.ReactElement): ReadableStream<Uint8Array> {
        const stream = renderToReadableStream(element, {
            bootstrapScripts: this.config.bootstrapScripts || [
                '/build/client.js',
            ],
        });

        return stream;
    }
}
