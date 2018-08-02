import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login'
import Home from '@/components/home/home'
import Income from '@/components/home/income/income'
import Writeoff from '@/components/home/income/writeoff'
import Bill from '@/components/home/income/bill'
import Process from '@/components/login/process'
import Settlein from '@/components/login/settlein'
import ShopMap from '@/components/login/shopMap'
import Category from '@/components/login/category'
import Agreement from '@/components/login/agreement'
import Examine from '@/components/login/examine'
import Menu from '@/components/home/menu'
import Moving from '@/components/home/moving'
import Actlist from '@/components/activity/actlist'
import Actsign from '@/components/activity/actsign'
import Actdetails from '@/components/activity/actdetails'
import Manage from '@/components/home/manage/manage'
import Scan from '@/components/home/scan/scan'
import Write from '@/components/home/scan/writeoff'
import AboutUs from '@/components/home/sublevel/aboutUs'
import Historyse from '@/components/home/sublevel/historyse'
import Historyofthebill from '@/components/home/sublevel/historyofthebill'
import DetailsSon from '@/components/home/sublevel/detailsSon'
import Edit from '@/components/home/manage/edit'
import Other from '@/components/home/manage/other'
import PhotoList from '@/components/home/manage/photoList'
import Ticket from '@/components/home/ticket/ticket'
import Promotion from '@/components/home/ticket/promotion'
import SetMeal from '@/components/home/ticket/setMeal'
import ToSetMeal from '@/components/home/ticket/toSetMeal'
import Dishes from '@/components/home/manage/dishes'
import AddDishes from '@/components/home/manage/addDishes'
import ServiceManual from '@/components/home/sublevel/ServiceManual'   
import Aboutthefood from '@/components/home/sublevel/synopsisManual/aboutthefood'
import Howtocheckin from '@/components/home/sublevel/synopsisManual/howtocheckin'     
import Howtouse from '@/components/home/sublevel/synopsisManual/howtouse'    
import ImproveService from '@/components/home/sublevel/synopsisManual/improveService'
import Questions from '@/components/home/sublevel/synopsisManual/questions'
import Ihatetheqrcode from '@/components/home/ihatetheqrcode/ihatetheqrcode'
import AddVideo from '@/components/home/addDynamic/addVideo'
import Article from '@/components/home/addDynamic/article'
import VideoDateil from '@/components/home/addDynamic/videoDateil'
import Wallet from '@/components/home/wallet/wallet'
import Notes from '@/components/home/wallet/notes'
import Withdraw from '@/components/home/wallet/withdraw'
import Withnodes from '@/components/home/wallet/withnodes'
import Payment from '@/components/home/payment/payment'
import Annal from '@/components/home/payment/annal'
import Customize from '@/components/home/payment/customize'

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
      path: '/other',
      name: 'Other',
      component: Other
    },
    {
      path: '/photoList',
      name: 'PhotoList',
      component: PhotoList
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
    {
      path: '/bill',
      name: 'Bill',
      component: Bill
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
    { //我的页面-->使用手册
      path: '/serviceManual',
      name: 'ServiceManual',
      component: ServiceManual
    },
    { //我的页面-->使用手册-->关于享7美食
      path: '/aboutthefood',
      name: 'Aboutthefood',
      component: Aboutthefood   
    },
    { //我的页面-->使用手册-->如何入住
      path: '/howtocheckin',
      name: 'Howtocheckin',
      component: Howtocheckin   
    },
    { //我的页面-->使用手册-->如何使用
      path: '/howtouse',
      name: 'Howtouse',
      component: Howtouse   
    },
    { //我的页面-->使用手册-->如何提高客流量  
      path: '/improveService',
      name: 'ImproveService',
      component: ImproveService
    },
    { //我的页面-->使用手册-->常见问题  
      path: '/questions',
      name: 'Questions',
      component: Questions
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
    { //我的页面-->商家二维码
      path: '/ihatetheqrcode',
      name: 'Ihatetheqrcode',
      component: Ihatetheqrcode
    },
    {
      path:'/ticket',
      name:'Ticket',
      component:Ticket
    },
    {
      path:'/promotion',
      name:'Promotion',
      component:Promotion
    },
    {
      path:'/setMeal',
      name:'SetMeal',
      component:SetMeal
    },
    {
      path:'/toSetMeal',
      name:'ToSetMeal',
      component:ToSetMeal
    },
    {
      path:'/dishes',
      name:'Dishes',
      component:Dishes
    },
    {
      path:'/addDishes',
      name:'AddDishes',
      component:AddDishes
    },
    {
      path:'/actlist',
      name:'Actlist',
      component:Actlist
    },
    {
      path:'/actdetails',
      name:'Actdetails',
      component:Actdetails
    },
    {
      path:'/actsign',
      name:'Actsign',
      component:Actsign
    },
    {
      path:'/addVideo',
      name:'AddVideo',
      component:AddVideo
    },
    {
      path:'/moving',
      name:'Moving',
      component:Moving
    },
    {
      path:'/article',
      name:'Article',
      component:Article
    },
    {
      path:'/videoDateil',
      name:'VideoDateil',
      component:VideoDateil
    },
    {
      path:'/wallet',
      name:'Wallet',
      component:Wallet
    },
    {
      path:'/notes',
      name:'Notes',
      component:Notes
    },
    {
      path:'/withdraw',
      name:'Withdraw',
      component:Withdraw
    },
    {
      path:'/payment',
      name:'Payment',
      component:Payment
    },
    {
      path:'/annal',
      name:'Annal',
      component:Annal
    },
    {
      path:'/customize',
      name:'Customize',
      component:Customize
    },
    {
      path:'/withnodes',
      name:'Withnodes',
      component:Withnodes
    }
  ]
})
  
