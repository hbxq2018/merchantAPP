import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/login/login'
import Home from '@/components/home/home'
import Income from '@/components/income'
import Process from '@/components/login/process'
import Settlein from '@/components/login/settlein'
import Review from '@/components/login/review'
import Menu from '@/components/home/menu'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/process',
      name: 'Process',
      component: Process
    },
    {
      path: '/settlein',
      name: 'Settlein',
      component: Settlein
    },
    {
      path: '/review',
      name: 'Review',
      component: Review
    },
    {
      path: '/menu',
      name: 'Menu',
      component: Menu
    }
  ]
})
