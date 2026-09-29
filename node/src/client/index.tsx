import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { Root } from '../server/components/root.tsx';

// Same tree as on the server, with StaticRouter swapped for BrowserRouter
hydrateRoot(
    document,
    <BrowserRouter>
        <Root />
    </BrowserRouter>,
);
