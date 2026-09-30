import type { Query } from '../lib/data/query.ts';

export interface Product {
    id: string;
    title: string;
    price: number;
    description: string;
}

const PRODUCTS: Record<string, Product> = {
    '1': {
        id: '1',
        title: 'Mechanical Keyboard',
        price: 129,
        description: 'Hot-swappable switches, aluminium case, USB-C.',
    },
    '2': {
        id: '2',
        title: 'Wireless Mouse',
        price: 59,
        description: 'Lightweight shell, 70 hours of battery life.',
    },
    '3': {
        id: '3',
        title: 'USB-C Hub',
        price: 39,
        description: 'Seven ports: HDMI, SD card, three USB-A, two USB-C.',
    },
};

// Fake API: resolves after a delay so Suspense has something to stream.
// Unknown ids get a generic product for now (404 for them comes later)
export function fetchProduct(id: string, delay = 1000): Promise<Product> {
    console.log(`Fetch product ${id} <<<<<<<`);
    return new Promise((resolve) => {
        setTimeout(
            () =>
                resolve(
                    PRODUCTS[id] ?? {
                        title: `Product #${id}`,
                        price: 0,
                        description: 'No description yet.',
                    },
                ),
            delay,
        );
    });
}

export const productQuery = (id: string): Query<Product> => ({
    key: `product:${id}`,
    fetch: () => fetchProduct(id),
});

export interface ProductsResponse {
    products: Record<string, Product>;
    total: number;
}

// Fake API: Returns whole products we have at the moment
export function fetchProducts(delay = 3000): Promise<ProductsResponse> {
    console.log(`Fetch products <<<<<`);
    return new Promise((resolve) => {
        setTimeout(
            () =>
                resolve({
                    products: PRODUCTS,
                    total: Object.keys(PRODUCTS).length,
                }),
            delay,
        );
    });
}

export const productsQuery = (): Query<ProductsResponse> => ({
    key: 'products',
    fetch: () => fetchProducts(),
});
