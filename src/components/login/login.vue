<template>
    <div class="login">
        <img class="login_background" src="../../../static/images/background.png" alt="" />
        <div class="login_Box">
			<div class="login_icon">
				<img class="" src="../../../static/images/aboutMe.png" alt="" />
			</div>
			<form class="login_form">
				<div class="login_form_tele">
					<input type="number" class="login_form_inp" placeholder="请输入手机号" v-model="telephone">
					<button id="securityCode" class="securityCode" :class="timeFlag ? '' : 'active'" @click.stop="securityCode">{{veridyBtn}}</button>
				</div>
				<div class="login_form_code">
					<input type="number" class="login_form_inp" placeholder="请输入验证码" v-model="password">
				</div>
				<div class="login_form_btn">
					<button type="button" @click="verification"></button>
				</div>
			</form>
			<div class="othor_login">
				<p class="othor_login_text">————<span>其他登陆方式</span>————</p>
				<div id="returnIcon" class="othor_login_type">
					<img class="login_weixin" src="../../../static/images/wx-icon.png" alt="" />
				</div>
			</div>
		</div>
    </div>
</template>

<script>
import GLOBAL from "../../../untils/config/config";
import { Toast } from 'mint-ui';
import axios from 'axios';
import qs from 'qs';
import store from '@/vuex/store'
import {mapState,mapMutations,mapGetters} from 'vuex'
export default {
  name: "Login",
  data() {
    return {
      API: GLOBAL.GLOBAL_API_DOMAIN,
      movieArr:[],
      veridyBtn: "获取验证码",     
      telephone: "",     //手机号
      password: "",      //验证码
      veridyTime: "",    //获取验证码的时间
      verifyCode: "",     //验证码
      timeFlag: true
    };
  },
  store,
  computed:{
    ...mapState(['userInfo','shopInfo']),
  },
  methods: {
    ...mapMutations(['setuserInfo','setshopId','setshopInfo']),
    isNull(value) {  
      let flag = false;   
      if(value == 'null' || value == null || value == '' || value == undefined || value == []) {
        flag = true;
      }
      return flag;
    },
    securityCode() {      //获取验证码
      let _this = this;
      if(!this.timeFlag) { return false; }
      if(!this.isNull(this.telephone)) {
        let _parms = {
          shopMobile: this.telephone
        };
        // this.$GLOBAL.API  <==>  /api/
        this.$axios.post('/api/app/sms/sendForShopAppRegister', qs.stringify(_parms))
        .then(res => {
          let data = res.data;
          if(data.code == 0) {
            let minutes = "", senconds = "", countdown = 600;
            _this.timeFlag = false;
            _this.verifyCode = data.data.verifyId;
            console.log(data.data.verifyId)
            let timer = setInterval(() => {
              countdown--;
              if(countdown == 0) {
                _this.veridyBtn = "获取验证码";
                clearInterval(timer);
                _this.timeFlag = true;
                return false;
              }
              minutes = Math.floor(countdown / 60) >= 1 ? Math.floor(countdown / 60) + '分' : '';
              senconds = countdown % 60 == 0 ? '' : countdown % 60 + '秒';
              _this.veridyBtn = minutes + senconds + "后发送验证码";
            }, 1000);
          } else {
            _this.timeFlag = false;
            Toast("系统繁忙，请稍后再试");
          }
        })
        .catch(err => {
          console.log(err);
        })
      } else {
        Toast('请填写手机号');
      }
    }, 
    verification() {          //判断输入验证码是否正确 
      let _parms = {
        shopMobile: this.telephone,
        smsContent: this.password
      },
      value = '', _this = this;
      for(var key in _parms) {
        value += key + '=' + _parms[key] + '&';
      }
      value = value.substring(0, value.length-1);
      this.$axios.get('/api/app/sms/isVerifyForShopApp?' + value, qs.stringify(_parms))
      .then(res => {
        if(res.data.data == 0) {
          _this.signIn();
        } else {
          Toast('输入信息有误');
        }
      })
      .catch(err => {
        console.log(err);
      })
    },
    signIn() {         //商家注册
      let _this = this;
      this.$axios.get('/api/app/user/findUserByMobile?mobile=' + this.telephone)
      .then(res => {
        console.log('res11：',res.data);
        this.setshopInfo(res.data.data)
        if(res.data.code == 0) {
          console.log('loginres:',res)
          if(res.data.data == null) {     //新用户为null
            console.log('添加新用户');
            _this.addShop();
          } else if(res.data.data.userType == 1 && !_this.isNull(res.data.data.mobile)) {
            _this.searchByUserId(res.data.data.id);
          } else if(res.data.data.userType == 2 && !_this.isNull(res.data.data.mobile)) {     //商家
            _this.setshopId(res.data.data.shopId)    
            _this.getshopinfo(res.data.data.shopId)
            _this.$router.push({name: 'Home'});
          }
        }
      })
      .catch(err => {
        console.log(err);
      })
    },
    addShop() {      //添加商户
      let _this = this, _parms = {mobile: this.telephone};
      this.$axios.post('/api/app/user/addShopAppUser', qs.stringify(_parms))
      .then(res => {
        if(res.data.code == 0) {
          _this.$router.push({name: 'Process', params: {id: res.data.data}});
        }
      })
      .catch(err => {
        console.log(err);
      })
    },
    getshopinfo:function(id){ //获取商家信息
      this.$axios.get('/api/shop/get/'+id)
      .then((res) => {
        if(res.data.code ==  '0'){
          let data = res.data.data;
          console.log(data)
          this.setuserInfo(data)
        }
      })
    },
    searchByUserId(id) {     //判断商家是否在审核中
      let _this = this;
      this.$axios.get('/api/app/shopEnter/searchByUserId?userId=' + id)
      .then((res) => {
        console.log(res);
        if(res.data.code == 0){
          //0待审核  1审核通过  2审核不通过
          let status = res.data.data.status;
          if(status == 0) {
            _this.$router.push({name: 'Examine', params: {status: status}});
          } else if(status == 1) {
            _this.$router.push({name: 'Examine', params: {status: status}});
          } else if(status == 2) {
            _this.$router.push({name: 'Examine', params: {status: status}});
          }
        }
      })
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import url(../../common/css/common.css);
.login {
  width: 100%;
  height: 100%;
  background-color: #fc5e2d;
  font-family: "微软雅黑";
  position: relative;
  font-size: 30px;
  .login_background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .login_Box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // z-index: 100;
    .login_icon {
      text-align: center;
      padding: 88px 0;
      img {
        height: 116px;
        width: 116px;
      }
    }
    .login_form {
      width: 100%;
      .login_form_tele,
      .login_form_code {
        margin-bottom: 72px;
        width: 100%;
        padding: 0 58px;
        box-sizing: border-box;
        color: #fc5e2d;
        .login_form_inp {
          height: 90px;
          width: 100%;
          padding: 0 42px;
          box-sizing: border-box;
          border-radius: 50px;
          box-shadow: 1px 5px 5px rgba(148, 37, 2, 0.7);
          border: 0;
        }
      }
      .login_form_tele {
        position: relative;
        margin-bottom: 45px;
        .securityCode {
          position: absolute;
          right: 100px;
          top: 0;
          height: 90px;
          line-height: 90px;
          font-size: 24px;
          z-index: 5;
          background:none;
          border: none;
        }
        .securityCode.active {
          color: #b1b1b1;
        }
      }
      .login_form_btn {
        button {
          width: 80px;
          height: 80px;
          border: 0;
          background: #fc5e2d url(../../../static/images/enter.png) no-repeat
            center center;
          background-size: 80px 80px;
        }
      }
    }
    .othor_login {
      width: 100%;
      position: fixed;
      bottom: 0;
      left: 0;
      .othor_login_text {
        color: #fff;
        font-size: 28px;
        span {
          margin: 0 40px;
        }
      }
      .othor_login_type {
        margin: 40px 0 65px 0;
        img {
          width: 80px;
          height: 80px;
        }
      }
    }
  }
}
</style>


