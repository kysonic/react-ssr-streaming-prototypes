import type { DataCache } from '../../app/lib/data/data-cache.ts';
import { DATA_GLOBAL, type DataPair } from '../../app/lib/data/transfer.ts';

// JSON is not safe inside <script> as is: "</script>" or "<!--" in the data
// would end the tag or open a comment (XSS). Escaped, "<" stays a valid JSON
// string character and the browser never sees a tag
function serialize(value: unknown): string {
    return JSON.stringify(value)
        .replace(/</g, '\\u003c')
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');
}

// Collects the data loaded during this request and hands it out as <script>
// tags for HtmlInjector. An entry settles before React renders the boundary
// that reads it, so its script is always taken with (or before) the batch
// that carries the boundary's HTML - the client has the data before it hydrates.
//
// Rejected entries are skipped: the client finds nothing in its cache
// and fetches on its own
export function createDataInjector(cache: DataCache): () => string {
    let pending: string[] = [];

    cache.subscribe((key, result) => {
        if (result.status === 'fulfilled') {
            pending.push(serialize([key, result.value] satisfies DataPair));
        }
    });

    return () => {
        if (!pending.length) {
            return '';
        }
        // One script per batch: push(...) takes all the pairs at once
        const html = `<script>(self.${DATA_GLOBAL}||=[]).push(${pending.join(',')})</script>`;
        pending = [];
        return html;
    };
}
