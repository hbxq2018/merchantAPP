// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import MintUI from 'mint-ui';
import './assets/css/my-mint.css'; //全局修改mint-UI样式  
import 'lib-flexible';
import axios from 'axios';
import GLOBAL from '../untils/config/config';
import UTILS from '../untils/util';
require('./assets/util/vconsole.js');
Vue.prototype.$axios = axios;
Vue.prototype.$GLOBAL = GLOBAL;
Vue.prototype.$UTILS = UTILS;

Vue.use(MintUI);
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})