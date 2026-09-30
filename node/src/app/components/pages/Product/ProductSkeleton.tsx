import { Stylesheet } from '../../common/Stylesheet.tsx';
import cssHref from './ProductSkeleton.css';

// Used twice: as the route fallback (while the ProductPage chunk loads, so it's
// imported by routes and lives in the entry bundle) and inside ProductPage
// (while the product loads). Same skeleton - nothing blinks between the two.
// Own stylesheet: ProductDetails.css must stay in the ProductPage chunk
export function ProductSkeleton() {
    return (
        <div className="product-skeleton" aria-busy="true">
            <Stylesheet href={cssHref} />
            <div className="product-skeleton__image" />
            <div className="product-skeleton__info">
                <div className="product-skeleton__title" />
                <div className="product-skeleton__price" />
                <div className="product-skeleton__description" />
            </div>
        </div>
    );
}
