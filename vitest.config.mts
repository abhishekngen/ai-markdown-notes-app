import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: 'src/tests/setup.ts',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'), // or wherever your root is
        },
    },
});
