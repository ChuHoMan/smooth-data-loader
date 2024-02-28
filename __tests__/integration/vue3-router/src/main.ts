import { createApp } from 'vue';
import './style.css';
import {
  DataLoaderPlugin,
  createRouter,
  createWebHistory,
} from 'vue-router/auto';
import { createPinia } from 'pinia';
import { QueryPlugin } from '@pinia/colada';
import App from './App.vue';

const router = createRouter({
  history: createWebHistory(),
});

const app = createApp(App);
app.use(createPinia());
// install after pinia
app.use(QueryPlugin, {
  // optional options
});
app.use(DataLoaderPlugin, {
  router,
});
app.use(router);

app.mount('#app');
