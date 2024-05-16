import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    base: '/my-app/',
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
    ],
    server: {
      hmr: {
        host: '20.20.2.1'
      }
    },
    resolve: {
      alias: {
        '@': '/src',
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
});
