export interface Product {
    id: string;
    title: string;
    price: number;
    description: string;
}

const PRODUCTS: Record<string, Omit<Product, 'id'>> = {
    '1': {
        title: 'Mechanical Keyboard',
        price: 129,
        description: 'Hot-swappable switches, aluminium case, USB-C.',
    },
    '2': {
        title: 'Wireless Mouse',
        price: 59,
        description: 'Lightweight shell, 70 hours of battery life.',
    },
    '3': {
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
                resolve({
                    id,
                    ...(PRODUCTS[id] ?? {
                        title: `Product #${id}`,
                        price: 0,
                        description: 'No description yet.',
                    }),
                }),
            delay,
        );
    });
}
