import { Stylesheet } from '../../../common/Stylesheet.tsx';
import cssHref from './Footer.css';

export function Footer() {
    return (
        <footer className="footer">
            <Stylesheet href={cssHref} precedence="layout" />
            <div className="footer__copy">(c) Copyrights</div>
        </footer>
    );
}
