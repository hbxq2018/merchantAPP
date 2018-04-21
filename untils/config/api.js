import MyHttp from './request.js';
import { myStore } from '../tools/store';

//所有的请求
const ALL_API = {
  userlist: { //示例
    method: 'POST', 
    url: 'user/list'
  },
}
const Api = new MyHttp({}, ALL_API);

export default Api;