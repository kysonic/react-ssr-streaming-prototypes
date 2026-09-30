import { Stylesheet } from '../../common/Stylesheet.tsx';
import cssHref from './ProductListSkeleton.css';

// How many cards to draw: the real count is unknown until the data arrives
const CARDS = 3;

// Own stylesheet: the skeleton is also part of HomePageSkeleton (entry bundle),
// ProductList.css must stay in the HomePage chunk
export function ProductListSkeleton() {
    return (
        <div className="product-list-skeleton" aria-busy="true">
            <Stylesheet href={cssHref} precedence="features" />
            <div className="product-list-skeleton__heading" />
            <ul className="product-list-skeleton__grid">
                {Array.from({ length: CARDS }, (_, index) => (
                    <li key={index} className="product-list-skeleton__card">
                        <div className="product-list-skeleton__image" />
                        <div className="product-list-skeleton__title" />
                        <div className="product-list-skeleton__price" />
                    </li>
                ))}
            </ul>
        </div>
    );
}
