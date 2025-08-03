// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    output: 'static',
    site: import.meta.env.DEV ? 'https://creeble-blog.localhost' : 'https://creeblers.github.io',
    base: import.meta.env.DEV ? '/' : '/creeble-blog',
    server: {
        host: '0.0.0.0',
        port: 4321,
    },
});
