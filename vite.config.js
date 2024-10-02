import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    base: '/my-app/', // Adjust this depending on your app deployment
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
    ],
    server: {
        hmr: {
            host: 'localhost', // Change to your actual development host if needed
        }
    },
    resolve: {
        alias: {
            '@': '/src',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return 'vendor';
                    }
                },
            },
        },
        chunkSizeWarningLimit: 1000, // Optional: Adjust this based on your app's needs
    },
});
