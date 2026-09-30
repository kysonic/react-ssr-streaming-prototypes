import { Stylesheet } from '../../common/Stylesheet.tsx';
import { ProductListSkeleton } from '../../features/ProductList/ProductListSkeleton.tsx';
import { UserProfileSkeleton } from '../../features/UserProfile/UserProfileSkeleton.tsx';
import cssHref from './HomePageSkeleton.css';

// Fallback for the lazy HomePage chunk, so it lives in the entry bundle.
// Own stylesheet for the same reason as UserProfileSkeleton: HomePage.css
// must stay in the HomePage chunk
export function HomePageSkeleton() {
    return (
        <div className="home-page-skeleton" aria-busy="true">
            <Stylesheet href={cssHref} />
            <section className="home-page-skeleton__hero">
                <div className="home-page-skeleton__title" />
                <div className="home-page-skeleton__subtitle" />
            </section>
            <aside>
                {/* Same fallbacks HomePage shows while its data loads,
                    so nothing blinks when the chunk arrives */}
                <UserProfileSkeleton />
            </aside>
            <section className="home-page-skeleton__list">
                <ProductListSkeleton />
            </section>
        </div>
    );
}
