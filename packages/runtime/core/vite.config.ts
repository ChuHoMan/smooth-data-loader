import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    plugins: [
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
      },
    },

    server: {
      port: 8787,
    },
  };
});
