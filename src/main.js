import { createApp } from 'vue'
import router from './router/routes'
import App from './App.vue'
import './assets/style.css' // ← import here

createApp(App).use(router).mount('#app')
