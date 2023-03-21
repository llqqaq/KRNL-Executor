import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/large-file-slice',
    name: 'LargeFileSlice',
    component: () => import('@/views/LargeFileSlicing')
  },
  {
    path: '/iframe',
    name: 'Iframe',
    component: () => import('@/views/Iframe')
  },
  {
    path: '/all-fun',
    name: 'AllFun',
    component: () => import('@/views/All')
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
