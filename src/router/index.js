import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/login/login'
import Income from '@/components/income'
import Process from '@/components/login/process'
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
    }
  ]
})
