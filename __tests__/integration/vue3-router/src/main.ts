import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {
    createWebHistory,
    createRouter,
    setupDataFetchingGuard
  } from 'vue-router/auto'

const router = createRouter({
    history: createWebHistory()
})

setupDataFetchingGuard(router)

const app = createApp(App)

app.use(router)

app.mount('#app')
