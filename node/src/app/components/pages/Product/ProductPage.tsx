import { Suspense } from 'react';
import { useParams } from 'react-router';
import { ProductDetails } from '../../features/ProductDetails/ProductDetails.tsx';
import { ProductSkeleton } from './ProductSkeleton.tsx';

export function ProductPage() {
    const { id } = useParams<'id'>();

    return (
        <div className="product-page">
            <Suspense key={id} fallback={<ProductSkeleton />}>
                <ProductDetails id={id!} />
            </Suspense>
        </div>
    );
}
