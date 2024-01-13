import reactSWC from '@vitejs/plugin-react-swc';
import { Plugin, defineConfig } from 'vite';

function testServerPlugin(): Plugin {
  return {
    name: 'test-server-plugin',
    apply: 'serve',
    configureServer(server: unknown) {
      const state = 0;
      server.middlewares.use('/api/state', async (req, res, next) => {
        if (req.method === 'GET') {
          setTimeout(() => {
            res.end(JSON.stringify({
              state,
            }));
          }, 3000);
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig({
  server: {
    port: 5173,
    host: true,
  },
  plugins: [
    testServerPlugin(),
    reactSWC(),
  ],
  resolve: {
    conditions: ['dev'],
  },
});
