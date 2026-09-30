import { Link } from 'react-router';
import { productsQuery } from '../../../api/product.ts';
import { useQuery } from '../../../lib/data/query.ts';
import { Stylesheet } from '../../common/Stylesheet.tsx';
import cssHref from './ProductList.css';

export function ProductList() {
    const { products, total } = useQuery(productsQuery());

    return (
        <div className="product-list">
            <Stylesheet href={cssHref} precedence="features" />
            <h2 className="product-list__heading">
                Products <span className="product-list__total">{total}</span>
            </h2>
            <ul className="product-list__grid">
                {Object.values(products).map((product) => (
                    <li key={product.id}>
                        <Link
                            to={`/products/${product.id}`}
                            className="product-list__card"
                        >
                            <div className="product-list__image" />
                            <div className="product-list__title">
                                {product.title}
                            </div>
                            <div className="product-list__price">
                                ${product.price}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
