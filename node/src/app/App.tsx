import { Suspense } from 'react';
import { DefaultLayout } from './components/layouts/default/DefaultLayout.tsx';
import { Stylesheet } from './components/common/Stylesheet.tsx';
import { lazyChunk } from './lib/chunks/lazy-chunk.tsx';
import globalCss from './styles/global.css';

// id must match the manifest key: the source path relative to the project root
const HomePage = lazyChunk('src/app/components/pages/Home/HomePage.tsx', () =>
    import('./components/pages/Home/HomePage.tsx').then((m) => ({
        default: m.HomePage,
    })),
);

export function App() {
    return (
        <main className="app">
            <Stylesheet href={globalCss} precedence="base" />
            <DefaultLayout>
                <Suspense fallback={<div>Home page loading...</div>}>
                    <HomePage />
                </Suspense>
            </DefaultLayout>
        </main>
    );
}
