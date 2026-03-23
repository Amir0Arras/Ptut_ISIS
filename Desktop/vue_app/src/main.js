import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './context/authStore'
import './index.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize auth session before mounting
const auth = useAuthStore()
auth.initSession()

app.mount('#app')
