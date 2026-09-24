import type { Request } from "express";
import { App } from "./App.tsx";
import { Body, Head, Html } from "./document.tsx";

export interface PageProps {
    req: Request;
}

export function Page({ req }: PageProps) {
    return (
        <Html>
            <Head>
                <title>Streaming SSR App</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </Head>
            <Body>
                <App url={req.url} />
            </Body>
        </Html>
    );
}
