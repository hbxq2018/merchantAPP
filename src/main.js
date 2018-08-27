
//import 'babel-polyfill';
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import MintUI from 'mint-ui';
import './assets/css/my-mint.css'; //全局修改mint-UI样式 
import './assets/css/iconfont/icon.css'; // 字体图标
import 'lib-flexible';
import axios from 'axios';
import GLOBAL from '../untils/config/config';
import UTILS from '../untils/util';
import clipper from '../static/Eleditor/clipper';
import './assets/util/vconsole.js';

 Vue.config.productionTip = false

 Vue.use(clipper);
 
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
