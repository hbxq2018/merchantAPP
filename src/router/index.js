import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/login/login'
import Income from '@/components/income'
import Process from '@/components/login/process'
import Settlein from '@/components/login/settlein'
import Review from '@/components/login/review'
import Menu from '@/components/home/menu'
import Mine from '@/components/mine/mine'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
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
    },
    {
      path: '/mine',
      name: 'Mine',
      component: Mine
    }
  ]
})
