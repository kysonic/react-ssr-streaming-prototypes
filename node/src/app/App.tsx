import { DefaultLayout } from './components/layouts/default/DefaultLayout.tsx';
import { HomePage } from './components/pages/Home/HomePage.tsx';
import './styles/global.css';

export function App() {
    return (
        <main className="app">
            <DefaultLayout>
                <HomePage />
            </DefaultLayout>
        </main>
    );
}
