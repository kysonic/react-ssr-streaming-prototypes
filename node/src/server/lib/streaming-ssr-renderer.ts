import { PassThrough, type Readable } from 'node:stream';
import type { ReactElement } from 'react';
import { renderToPipeableStream } from 'react-dom/server';

interface StreamingSSRConfig {
    bootstrapScripts?: string[];
    bootstrapModules?: string[];
    onShellReady?: () => void;
    onAllReady?: () => void;
    onError?: (error: unknown) => void;
    timeout?: number;
}

export class StreamingSSRRenderer {
    private config: StreamingSSRConfig;

    constructor(config: StreamingSSRConfig = {}) {
        this.config = config;
    }

    renderToStream(element: ReactElement): Readable {
        // renderToPipeableStream needs a real Node Writable as the pipe target
        const output = new PassThrough();

        const { pipe, abort } = renderToPipeableStream(element, {
            bootstrapScripts: this.config.bootstrapScripts || [
                '/build/client.js',
            ], // inject script tag
            bootstrapModules: this.config.bootstrapModules, // inject script type="module"

            onShellReady: () => {
                // Send initial shell - above-the-fold content
                this.config.onShellReady?.();
                pipe(output);
            },

            onAllReady: () => {
                // All Suspense boundaries resolved
                this.config.onAllReady?.();
            },

            onError: (error) => {
                // Errors inside Suspense boundaries - React streams the
                // fallback and retries on the client
                console.error('Streaming SSR error:', error);
                this.config.onError?.(error);
            },

            onShellError: (error) => {
                // Critical shell error - nothing was sent yet, send fallback
                console.error('Shell error:', error);
                this.config.onError?.(error);
                output.end(`
                    <div style="padding: 20px; border: 1px solid red; background: #ffebee;">
                        <h3>Something went wrong</h3>
                        <p>Please try refreshing the page.</p>
                    </div>
                `);
            },
        });

        // Stop rendering what's left and let the client finish it
        if (this.config.timeout) {
            setTimeout(abort, this.config.timeout).unref();
        }

        return output;
    }
}
