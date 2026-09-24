interface AppProps {
    url: string;
}

export function App({ url }: AppProps) {
    return (
        <main>
            <h1>Streaming SSR App</h1>
            <p>Current URL: {url}</p>
        </main>
    );
}
