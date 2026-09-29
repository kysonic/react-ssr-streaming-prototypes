import { useRoutes } from 'react-router';
import { Stylesheet } from './components/common/Stylesheet.tsx';
import { routes } from './routes/index.tsx';
import globalCss from './styles/global.css';

export function App() {
    const page = useRoutes(routes);

    return (
        <main className="app">
            <Stylesheet href={globalCss} precedence="base" />
            {page}
        </main>
    );
}
