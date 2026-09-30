import { NavLink } from 'react-router';
import { Stylesheet } from '../../../common/Stylesheet.tsx';
import cssHref from './Header.css';

const NAV = [
    { to: '/', label: 'Home' },
    { to: '/products/1', label: 'Keyboard' },
    { to: '/products/2', label: 'Mouse' },
    { to: '/products/3', label: 'Hub' },
];

export function Header() {
    return (
        <header className="header">
            <Stylesheet href={cssHref} precedence="layout" />
            <div className="header__logo">LOGO</div>
            <nav className="header__nav">
                {NAV.map(({ to, label }) => (
                    // NavLink sets .active on the current route; `end` so "/"
                    // is not active on every page
                    <NavLink key={to} to={to} end className="header__link">
                        {label}
                    </NavLink>
                ))}
            </nav>
            <div className="header__menu"></div>
        </header>
    );
}
