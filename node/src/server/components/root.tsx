import { App } from '../../app/App.tsx';
import { Body, Head, Html } from './document.tsx';

export function Root() {
    return (
        <Html>
            <Head>
                <title>Streaming SSR App</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />

                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon.png"
                />
                <link rel="stylesheet" href="/build/client.css" />
            </Head>
            <Body>
                <App />
            </Body>
        </Html>
    );
}
