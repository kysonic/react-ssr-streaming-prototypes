import { use } from 'react';
import type { Product } from '../../../api/product.ts';
import { Stylesheet } from '../../common/Stylesheet.tsx';
import cssHref from './ProductDetails.css';

export interface ProductDetailsProps {
    productPromise: Promise<Product>;
}

export function ProductDetails({ productPromise }: ProductDetailsProps) {
    const product = use(productPromise);

    return (
        <article className="product-details">
            <Stylesheet href={cssHref} precedence="features" />
            <div className="product-details__image" />
            <div className="product-details__info">
                <h1 className="product-details__title">{product.title}</h1>
                <div className="product-details__price">${product.price}</div>
                <p className="product-details__description">
                    {product.description}
                </p>
            </div>
        </article>
    );
}
