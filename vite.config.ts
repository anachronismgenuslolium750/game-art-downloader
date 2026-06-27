import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import pkg from './package.json';

export default defineConfig({
    plugins: [
        monkey({
            entry: 'src/main.ts',
            userscript: {
                name: 'Game Art Downloader',
                namespace: 'https://github.com/redphx',
                version: pkg.version,
                description: 'Download game arts from Steam, GOG, XBOX, Playstation and Nintendo web stores',
                license: 'MIT',
                'run-at': 'context-menu',
                match: [
                    'https://www.xbox.com/*/games/store/*',
                    'https://store.playstation.com/*/product/*',
                    'https://store.playstation.com/*/concept/*',
                    'https://www.nintendo.com/*/store/products/*',
                    'https://www.gog.com/*/game/*',
                    'https://store.steampowered.com/app/*',
                ],
                grant: 'none',
                updateURL: 'https://github.com/redphx/game-art-downloader/raw/refs/heads/main/dist/game-art-downloader.meta.js',
                downloadURL: 'https://github.com/redphx/game-art-downloader/releases/latest/download/game-art-downloader.user.js',

            },
            build: {
                metaFileName: !pkg.version.includes('-dev'),
            },
        }),
    ],
    build: {
        minify: false,
        rollupOptions: {
            output: {},
        },
    },
    define: {
        __SCRIPT_VERSION__: JSON.stringify(pkg.version),
    },
});
