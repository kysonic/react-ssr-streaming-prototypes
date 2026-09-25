import type { ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

export function Html({ children }: Props) {
    return <html lang="en">{children}</html>;
}

export function Head({ children }: Props) {
    return (
        <head>
            <meta charSet="utf-8" />
            {children}
        </head>
    );
}

export function Body({ children }: Props) {
    return (
        <body>
            <div id="root">{children}</div>
        </body>
    );
}
