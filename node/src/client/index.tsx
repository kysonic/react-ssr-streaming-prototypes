import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { DataCache } from '../app/lib/data/data-cache.ts';
import { DataContext } from '../app/lib/data/data-context.ts';
import { Root } from '../server/components/root.tsx';

// One cache for the whole tab: data stays while the user navigates
const dataCache = new DataCache();

// Same tree as on the server, with StaticRouter swapped for BrowserRouter
hydrateRoot(
    document,
    <DataContext value={dataCache}>
        <BrowserRouter>
            <Root />
        </BrowserRouter>
    </DataContext>,
);
