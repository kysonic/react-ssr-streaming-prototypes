import './src/server/lib/ignore-css.ts';

// Async because otherwise we won't ignore css imports on server...
await import('./src/server/server.tsx');
