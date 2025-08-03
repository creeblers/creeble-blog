// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    output: 'static',
    site: 'https://creeblers.github.io',
    base: '/creeble-blog',
    server: {
        host: '0.0.0.0',
        port: 4321,
    },
});
