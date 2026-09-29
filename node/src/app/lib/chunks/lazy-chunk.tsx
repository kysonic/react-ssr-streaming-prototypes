import { lazy, use, type ComponentProps, type ComponentType } from 'react';
import { ManifestContext, preloadChunk } from './manifest-context.ts';

type AnyComponent = ComponentType<any>;

// React.lazy + preload of the chunk's JS from the manifest, in a single render pass:
//
//   const HomePage = lazyChunk(
//       'src/app/components/pages/Home/HomePage.tsx',
//       () => import('../pages/Home/HomePage.tsx').then((m) => ({ default: m.HomePage })),
//   );
//
// `id` is the source path relative to the project root (manifest key).
export function lazyChunk<T extends AnyComponent>(
    id: string,
    load: () => Promise<{ default: T }>,
): T {
    const Lazy = lazy(load);

    function Chunk(props: ComponentProps<T>) {
        const manifest = use(ManifestContext);

        if (manifest) {
            const assets = manifest.chunks[id];
            if (assets) {
                preloadChunk(assets);
            } else {
                console.warn(`lazyChunk: "${id}" is not in the manifest`);
            }
        }

        return <Lazy {...props} />;
    }

    Chunk.displayName = `LazyChunk(${id})`;

    // Lends to exact component not Chunk 
    return Chunk as unknown as T;
}
