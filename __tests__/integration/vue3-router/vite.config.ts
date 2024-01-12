import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'

function testServerPlugin() {
	return {
		name: 'test-server-plugin',
		apply: "serve",
		configureServer(server: unknown) {
			let state = 0;
			server.middlewares.use( "/api/state", async (req, res, next) => {
				if( req.method === "GET" ) {
                    setTimeout(() => {
                        res.end(JSON.stringify({
                            state: state,
                        }));
                    }, 1500)
				} else {
					next()
				}
			})
		}
	}
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    testServerPlugin(),
    VueRouter({
      dataFetching: true,
    }),
    vue(),
  ],
  resolve: {
	conditions: ['dev']
}
})
