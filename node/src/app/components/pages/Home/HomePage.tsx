import { Suspense } from 'react';
import { fetchUser } from '../../../api/user.ts';
import { UserProfileSkeleton } from '../../features/UserProfile/UserProfileSkeleton.tsx';
import { Stylesheet } from '../../common/Stylesheet.tsx';
import cssHref from './HomePage.css';
import { lazyChunk } from '../../../lib/chunks/lazy-chunk.tsx';

const UserProfile = lazyChunk(
    'src/app/components/features/UserProfile/UserProfile.tsx',
    () =>
        import('../../features/UserProfile/UserProfile.tsx').then((m) => ({
            default: m.UserProfile,
        })),
);

export function HomePage() {
    // Created here, above the Suspense boundary, so the promise stays the same
    // while UserProfile suspends and re-renders
    const userPromise = fetchUser();

    return (
        <div className="home-page">
            <Stylesheet href={cssHref} />
            <section className="home-page__hero">
                <h1>Welcome to Our Store</h1>
                <p>Discover amazing products</p>
            </section>
            <aside className="home-page__sidebar">
                <Suspense fallback={<UserProfileSkeleton />}>
                    <UserProfile userPromise={userPromise} />
                </Suspense>
            </aside>
        </div>
    );
}
