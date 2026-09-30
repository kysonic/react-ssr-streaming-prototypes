import { Suspense } from 'react';
import { UserProfileSkeleton } from '../../features/UserProfile/UserProfileSkeleton.tsx';
import { Stylesheet } from '../../common/Stylesheet.tsx';
import { lazyChunk } from '../../../lib/chunks/lazy-chunk.tsx';
import { ProductList } from '../../features/ProductList/ProductList.tsx';

import cssHref from './HomePage.css';

const UserProfile = lazyChunk(
    'src/app/components/features/UserProfile/UserProfile.tsx',
    () =>
        import('../../features/UserProfile/UserProfile.tsx').then((m) => ({
            default: m.UserProfile,
        })),
);

export function HomePage() {
    return (
        <div className="home-page">
            <Stylesheet href={cssHref} />
            <section className="home-page__hero">
                <h1>Welcome to Our Store</h1>
                <p>Discover amazing products</p>
            </section>
            <aside className="home-page__sidebar">
                <Suspense fallback={<UserProfileSkeleton />}>
                    <UserProfile />
                </Suspense>
            </aside>
            <section className="home-page__list">
                <Suspense fallback={<div>Product list fallback...</div>}>
                    <ProductList />
                </Suspense>
            </section>
        </div>
    );
}
