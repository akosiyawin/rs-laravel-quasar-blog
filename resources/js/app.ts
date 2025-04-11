// import '../css/app.css';

import { createApp } from 'vue'
import { Quasar, Notify , Dialog} from 'quasar'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './router/routes'
import App from './App.vue'

// Import Quasar css
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

// Import boot files
import axiosBoot from './boot/axios'

// Create the app instance
const app = createApp(App)

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const requiresAuth = to.matched.some(record => record.meta?.requiresAuth)
  const isGuestRoute = to.matched.some(record => record.meta?.guest)

  if (requiresAuth && !token) {
    next('/login')
  } else if (isGuestRoute && token) {
    next('/')
  } else {
    next()
  }
})

// Use plugins
app.use(Quasar, {
  plugins: {
    Notify,
    Dialog
  }
})
app.use(router)

// Initialize boot files
axiosBoot({ app, router })

// Mount app
app.mount('#app')

