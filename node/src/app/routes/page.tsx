import { Suspense, type ReactElement, type ReactNode } from 'react';

// page helper needs to not forget Suspense wrap around page route.
// Takes an element, so static props are type-checked as usual JSX:
// page(<CatalogPage mode="sale" />, <CatalogSkeleton />)
export function page(element: ReactElement, skeleton: ReactNode) {
    return <Suspense fallback={skeleton}>{element}</Suspense>;
}
