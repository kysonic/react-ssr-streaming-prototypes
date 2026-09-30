import { Link } from 'react-router';
import { Stylesheet } from '../../common/Stylesheet.tsx';
import cssHref from './NotFoundPage.css';

// Rendered for any unmatched path. The HTTP status is still 200:
// it has to be set before the shell is flushed (matchRoutes on the server)
export function NotFoundPage() {
    return (
        <div className="not-found-page">
            <Stylesheet href={cssHref} />
            <h1>Page not found</h1>
            <p>
                <Link to="/">Back to the home page</Link>
            </p>
        </div>
    );
}
