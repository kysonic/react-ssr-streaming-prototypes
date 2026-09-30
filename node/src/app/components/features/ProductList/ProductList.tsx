import { productsQuery } from '../../../api/product.ts';
import { useQuery } from '../../../lib/data/query.ts';

export function ProductList() {
    const products = useQuery(productsQuery());

    return <div>{JSON.stringify(products)}</div>;
}
