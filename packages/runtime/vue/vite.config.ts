import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueRouter from 'unplugin-vue-router/vite';
import dts from 'vite-plugin-dts';
import { dependencies, peerDependencies } from './package.json';

const external = Object.keys({ ...dependencies, ...peerDependencies });
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    plugins: [
      VueRouter({
        dataFetching: true,
      }),
      vue(),
      !isDev && dts(),
    ],

    build: {
      minify: 'esbuild',
      lib: {
        entry: 'src/index.ts',
        formats: ['es', 'cjs', 'umd'],
        name: 'index',
        fileName: format => `index.${format}.js`,
      },
      rollupOptions: {
        external,
        output: {
          globals: {
            'vue': 'Vue',
            'vue-router': 'vueRouter',
            '@smooth-data-loader/runtime-core': 'smoothDataLoaderRuntimeCore',
          },
        },
      },
    },

    server: {
      port: 8787,
    },
  };
});
