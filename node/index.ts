import './src/server/lib/css-url-hook.ts';

// Dynamic import: the hook must be registered before the app's modules load
await import('./src/server/server.tsx');
