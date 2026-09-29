import { Outlet } from 'react-router';
import { Footer } from './Footer/Footer.tsx';
import { Header } from './Header/Header.tsx';
import { Stylesheet } from '../../common/Stylesheet.tsx';
import cssHref from './DefaultLayout.css';

// Layout route: Header / Footer stay mounted, the matched page renders into <Outlet />.
// No Suspense here: each page brings its own via page() in routes
export function DefaultLayout() {
    return (
        <div className="default-layout">
            <Stylesheet href={cssHref} precedence="layout" />
            <Header />
            <div className="default-layout__content">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}
