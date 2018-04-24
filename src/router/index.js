import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/login/login'
import Home from '@/components/home/home'
import Income from '@/components/home/income/income'
import Process from '@/components/login/process'
import Settlein from '@/components/login/settlein'
import Agreement from '@/components/login/agreement'
import Examine from '@/components/login/examine'
import Menu from '@/components/home/menu'
import Manage from '@/components/home/manage/manage'
import AboutUs from '@/components/home/sublevel/aboutUs'
import Historyse from '@/components/home/sublevel/historyse'
import Historyofthebill from '@/components/home/sublevel/historyofthebill'
import Edit from '@/components/home/manage/edit'
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
      path: '/manage',
      name: 'Manage',
      component: Manage
    },
    {
      path: '/edit',
      name: 'Edit',
      component: Edit
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
      path: '/agreement',
      name: 'Agreement',
      component: Agreement
    },
    {
      path: '/examine',
      name: 'Examine',
      component: Examine
    },
    {
      path: '/menu',
      name: 'Menu',
      component: Menu
    },
    {
      path: '/income',
      name: 'Income',
      component: Income
    },
    { //我的页面-->关于我们
      path: '/aboutUs',
      name: 'AboutUs',
      component: AboutUs
    },
    { //我的页面-->缴费服务
      path: '/historyse',
      name: 'Historyse',
      component: Historyse
    },
    { //我的页面-->缴费服务
      path: '/historyofthebill',
      name: 'Historyofthebill',
      component: Historyofthebill
    },
  ]
})
