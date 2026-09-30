import { Suspense } from 'react';
import { useParams } from 'react-router';
import { fetchProduct } from '../../../api/product.ts';
import { ProductDetails } from '../../features/ProductDetails/ProductDetails.tsx';
import { ProductSkeleton } from './ProductSkeleton.tsx';

export function ProductPage() {
    const { id } = useParams<'id'>();
    // Created here, above the Suspense boundary, so the promise stays the same
    // while ProductDetails suspends and re-renders
    const productPromise = fetchProduct(id!);

    return (
        <div className="product-page">
            <Suspense key={id} fallback={<ProductSkeleton />}>
                <ProductDetails productPromise={productPromise} />
            </Suspense>
        </div>
    );
}
