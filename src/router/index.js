import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/Users.vue'
import Permissions from '../components/power/Permissions.vue'
import Interface from '../components/interfaces/Interface.vue'
import Menu from '../components/menus/Menu.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import Lists from '../components/goods/Lists.vue'
import Add from '../components/goods/Add.vue'
import Order from '../components/order/Order.vue'
Vue.use(VueRouter)
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: User },
      { path: '/permissions', component: Permissions },
      { path: '/interfaces', component: Interface },
      { path: '/menus', component: Menu },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/cateparams', component: Params },
      { path: '/goodslists', component: Lists },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
    ]
  },
]
const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from代表从那个路径跳转而来
  // next是一个函数，表示放行
  // next()放行 next('/login')强制跳转
  if (to.path == '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
