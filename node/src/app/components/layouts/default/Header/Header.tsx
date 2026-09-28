import { Stylesheet } from '../../../common/Stylesheet.tsx';
import cssHref from './Header.css';

export function Header() {
    return (
        <header className="header">
            <Stylesheet href={cssHref} precedence="layout" />
            <div className="header__logo">LOGO</div>
            <div className="header__nav"></div>
            <div className="header__menu"></div>
        </header>
    );
}
