import {createRouter, createWebHistory} from 'vue-router'
import Home from '@/views/Home'
import Login from '@/views/Login'
import Register from '@/views/Register'
import Admin from '@/views/Admin'
import Dashboard from '@/components/admin/Dashboard.vue'

//Admin

import ShowUsers from '@/components/admin/users/ShowUsers'

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/auth/login',
    component: Login,
  },
  {
    path: '/auth/register',
    component: Register,
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    // beforeEnter(to, from, next) {
    //   if (checkUserPermissions('4')) {
    //     next()
    //   } else {
    //     next('/not-found')
    //   }
    // },
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: 'show-users',
        components: {
          admin: ShowUsers,
        },
      },
      {
        path: 'dashboard',
        components: {
          admin: Dashboard,
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    let isAuthenticated = false
    if (!isAuthenticated) {
      next({
        path: '/auth/login',
        query: {redirect: to.fullPath},
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})
export default router
