import { Transform, type TransformCallback } from 'node:stream';

const HEAD_END = '</head>';

// Sits between React and the response and adds extra HTML (e.g. <script> with
// data) to the stream. `getHTML` is asked right before each batch of React's
// chunks goes out and returns whatever is ready by then ('' if nothing).
//
// - React writes one flush as several chunks that may split a tag, so all
//   chunks of one tick are buffered and sent together: the extra HTML only
//   ever lands between complete pieces of React's output
// - first batch (the shell): inserted before </head>, never before <!DOCTYPE>
// - later batches (streamed Suspense boundaries): inserted before the batch,
//   so it is parsed before the boundary's HTML and its reveal script
export class HtmlInjector extends Transform {
    private getHTML: () => string;
    private batch: Buffer[] = [];
    private scheduled: NodeJS.Immediate | null = null;
    private headSent = false;

    constructor(getHTML: () => string) {
        super();
        this.getHTML = getHTML;
    }

    override _transform(
        chunk: Buffer | string,
        _encoding: BufferEncoding,
        callback: TransformCallback,
    ) {
        this.batch.push(Buffer.from(chunk));
        // React finishes a flush synchronously, so by the next tick the batch is whole
        this.scheduled ??= setImmediate(() => this.sendBatch());
        callback();
    }

    override _flush(callback: TransformCallback) {
        // Stream is ending: don't wait for the tick
        this.sendBatch();
        callback();
    }

    private sendBatch() {
        if (this.scheduled) {
            clearImmediate(this.scheduled);
            this.scheduled = null;
        }
        if (!this.batch.length) {
            return;
        }

        const chunk = Buffer.concat(this.batch);
        this.batch = [];

        if (this.headSent) {
            this.push(this.getHTML());
            this.push(chunk);
            return;
        }

        // Until </head> has passed there is no safe place to put anything
        // (also covers the plain error page sent when the shell fails)
        const html = chunk.toString();
        const index = html.indexOf(HEAD_END);
        if (index === -1) {
            this.push(chunk);
            return;
        }

        this.headSent = true;
        this.push(html.slice(0, index) + this.getHTML() + html.slice(index));
    }
}
