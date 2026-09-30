import type { RouteObject } from 'react-router';
import { DefaultLayout } from '../components/layouts/default/DefaultLayout.tsx';
import { HomePageSkeleton } from '../components/pages/Home/HomePageSkeleton.tsx';
import { ProductSkeleton } from '../components/pages/Product/ProductSkeleton.tsx';
import { lazyChunk } from '../lib/chunks/lazy-chunk.tsx';
import { page } from './page.tsx';

// id must match the manifest key: the source path relative to the project root
const HomePage = lazyChunk('src/app/components/pages/Home/HomePage.tsx', () =>
    import('../components/pages/Home/HomePage.tsx').then((m) => ({
        default: m.HomePage,
    })),
);

const ProductPage = lazyChunk(
    'src/app/components/pages/Product/ProductPage.tsx',
    () =>
        import('../components/pages/Product/ProductPage.tsx').then((m) => ({
            default: m.ProductPage,
        })),
);

const NotFoundPage = lazyChunk(
    'src/app/components/pages/NotFound/NotFoundPage.tsx',
    () =>
        import('../components/pages/NotFound/NotFoundPage.tsx').then((m) => ({
            default: m.NotFoundPage,
        })),
);

// Plain objects instead of <Route> JSX: the same array goes to useRoutes in App
// and to matchRoutes on the server (status / redirects before render)
export const routes: RouteObject[] = [
    {
        element: <DefaultLayout />,
        children: [
            { index: true, element: page(<HomePage />, <HomePageSkeleton />) },
            {
                path: 'products/:id',
                element: page(<ProductPage />, <ProductSkeleton />),
            },
            // Tiny page, no skeleton needed
            { path: '*', element: page(<NotFoundPage />, null) },
        ],
    },
];
