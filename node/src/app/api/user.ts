import type { Query } from '../lib/data/query.ts';

export interface User {
    id: number;
    name: string;
    email: string;
}

// Fake API: resolves after a delay so Suspense has something to stream
export function fetchUser(delay = 1500): Promise<User> {
    console.log('Fetch user <<<<<<<<<');
    return new Promise((resolve) => {
        setTimeout(
            () =>
                resolve({
                    id: 1,
                    name: 'Jane Doe',
                    email: 'jane@example.com',
                }),
            delay,
        );
    });
}

export const userQuery = (): Query<User> => ({
    key: 'user',
    fetch: () => fetchUser(),
});
