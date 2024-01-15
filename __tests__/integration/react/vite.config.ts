import { resolve } from 'node:path';
import reactSWC from '@vitejs/plugin-react-swc';
import mockDevServerPlugin from 'vite-plugin-mock-dev-server';

import { Plugin, defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 8777,
    proxy: {
      '^/api': { target: 'http://127.0.0.1:8777' },
    },
    fs: {
      strict: false,
    },
  },
  plugins: [
    mockDevServerPlugin({
      prefix: '^/api/',
      include: [
        '../../utils/mock/**/*.mock.{js,ts,cjs,mjs,json,json5}',
      ],
    }),
    reactSWC(),
  ],
  resolve: {
    conditions: ['dev'],
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
    ],
  },
});
