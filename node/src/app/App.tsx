import { DefaultLayout } from './components/layouts/default/DefaultLayout.tsx';
import { HomePage } from './components/pages/Home/HomePage.tsx';
import { Stylesheet } from './components/common/Stylesheet.tsx';
import globalCss from './styles/global.css';

export function App() {
    return (
        <main className="app">
            <Stylesheet href={globalCss} precedence="base" />
            <DefaultLayout>
                <HomePage />
            </DefaultLayout>
        </main>
    );
}
