import { Footer } from './Footer/Footer.tsx';
import { Header } from './Header/Header.tsx';
import { Stylesheet } from '../../common/Stylesheet.tsx';
import cssHref from './DefaultLayout.css';

export interface DefaultLayoutProps {
    children: React.ReactElement;
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
    return (
        <div className="default-layout">
            <Stylesheet href={cssHref} precedence="layout" />
            <Header />
            <div className="default-layout__content">{children}</div>
            <Footer />
        </div>
    );
}
