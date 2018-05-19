import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/login/login'
import Home from '@/components/home/home'
import Income from '@/components/home/income/income'
import Writeoff from '@/components/home/income/writeoff'
import Process from '@/components/login/process'
import Settlein from '@/components/login/settlein'
import ShopMap from '@/components/login/shopMap'
import Category from '@/components/login/category'
import Agreement from '@/components/login/agreement'
import Examine from '@/components/login/examine'
import Menu from '@/components/home/menu'
import Manage from '@/components/home/manage/manage'
import Scan from '@/components/home/scan/scan'
import Write from '@/components/home/scan/writeoff'
import AboutUs from '@/components/home/sublevel/aboutUs'
import Historyse from '@/components/home/sublevel/historyse'
import Historyofthebill from '@/components/home/sublevel/historyofthebill'
import DetailsSon from '@/components/home/sublevel/detailsSon'
import Edit from '@/components/home/manage/edit'
import Ticket from '@/components/home/ticket/ticket'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/login',
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
      path: '/scan',
      name: 'Scan',
      component: Scan
    },
    {
      path: '/write',
      name: 'Write',
      component: Write
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
      path: '/shopMap',
      name: 'ShopMap',
      component: ShopMap
    },
    {
      path: '/category',
      name: 'Category',
      component: Category
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
    {
      path: '/writeoff',
      name: 'Writeoff',
      component: Writeoff
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
    { //我的页面-->历史账单
      path: '/historyofthebill',
      name: 'Historyofthebill',
      component: Historyofthebill
    },  
    { //我的页面-->历史账单详情
      path: '/detailsSon',
      name: 'DetailsSon',
      component: DetailsSon
    },
    {
      path:'/ticket',
      name:'Ticket',
      component:Ticket
    }
  ]
})
