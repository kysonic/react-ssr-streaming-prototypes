import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';

interface StreamingSSRConfig {
    bootstrapScripts?: string[];
    bootstrapModules?: string[];
    onShellReady?: () => void;
    onAllReady?: () => void;
    onError?: (error: Error) => void;
    timeout?: number;
}

export class StreamingSSRRendering {
    private config: StreamingSSRConfig;

    constructor(config: StreamingSSRConfig = {}) {
        this.config = config;
    }

    renderToStream(element: React.ReactElement): ReadableStream<Uint8Array> {
        let controller: ReadableStreamDefaultController<Uint8Array>;

        const stream = new ReadableStream<Uint8Array>({
            start(c) {
                controller = c;
            },
        });

        const { pipe } = renderToPipeableStream(element, {
            bootstrapScripts: this.config.bootstrapScripts || [
                '/build/client.js',
            ], // inject script tag
            bootstrapModules: this.config.bootstrapModules, // inject script type="module"

            onShellReady: () => {
                // Send initial shell - above-the-fold content
                this.config.onShellReady?.();
            },

            onAllReady: () => {
                // All Suspense boundaries resolved
                this.config.onAllReady?.();
            },

            onError: (error: Error) => {
                console.error('Streaming SSR error:', error);
                this.config.onError?.(error);

                // Send error fallback
                const errorHTML = `
                    <div style="padding: 20px; border: 1px solid red; background: #ffebee;">
                        <h3>Something went wrong</h3>
                        <p>Please try refreshing the page.</p>
                    </div>
                `;

                controller.enqueue(new TextEncoder().encode(errorHTML));
                controller.close();
            },

            onShellError: (error: Error) => {
                // Critical shell error - fall back to client rendering
                console.error('Shell error:', error);
                controller.close();
            },
        });

        // Pipe React's stream to our ReadableStream
        pipe({
            write: (chunk: string) => {
                controller.enqueue(new TextEncoder().encode(chunk));
            },
            end: () => {
                controller.close();
            },
        });

        return stream;
    }
}
