import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueRouter from 'unplugin-vue-router/vite';
import mockDevServerPlugin from 'vite-plugin-mock-dev-server';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '^/api': { target: 'http://127.0.0.1:5173' },
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
    VueRouter({
      dataFetching: true,
    }),
    vue(),
  ],
  resolve: {
    conditions: ['dev'],
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
    ],
  },
});
