import { Suspense } from 'react';
import { fetchUser } from '../../../api/user.ts';
import { UserProfileSkeleton } from '../../features/UserProfile/UserProfileSkeleton.tsx';
import { UserProfile } from '../../features/UserProfile/UserProfile.tsx';
import './HomePage.css';

export function HomePage() {
    // Created here, above the Suspense boundary, so the promise stays the same
    // while UserProfile suspends and re-renders
    const userPromise = fetchUser();

    return (
        <div className="home-page">
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
