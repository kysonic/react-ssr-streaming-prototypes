import { DefaultLayout } from './components/layouts/default/DefaultLayout.tsx';
import { HomePage } from './components/pages/Home/HomePage.tsx';

interface AppProps {
    url: string;
}

export function App({ url }: AppProps) {
    return (
        <main className="app">
            <DefaultLayout>
                <HomePage />
            </DefaultLayout>
        </main>
    );
}
