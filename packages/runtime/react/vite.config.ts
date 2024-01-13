import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { dependencies, peerDependencies } from './package.json';

const external = Object.keys({ ...dependencies, ...peerDependencies });

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    plugins: [
      react(),
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
            'react': 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'jsxRuntime',
            'react-router': 'reactRouter',
            'react-router-dom': 'reactRouterDom',
            '@smooth-data-loader/runtime-core': 'smoothDataLoaderRuntimeCore',
            'swr': 'useSWR',
          },
        },
      },
    },

    server: {
      port: 8787,
    },
  };
});
