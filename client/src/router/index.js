import {createRouter, createWebHistory} from 'vue-router'
import Home from '@/views/Home'
import Login from '@/views/Login'
import Register from '@/views/Register'
const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/Login',
    component: Login,
  },
  {
    path: '/Register',
    component: Register,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
