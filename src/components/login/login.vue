<template>
    <div class="login">
        <img class="login_background" src="../../../static/images/background.png" alt="" />
        <div class="login_Box">
			<div class="login_icon">
				<img class="" src="../../../static/images/aboutMe.png" alt="" />
			</div>
			<form class="login_form">
				<div class="login_form_tele">
					<input type="text" class="login_form_inp" placeholder="请输入手机号" v-model="telephone">
					<span id="securityCode" class="securityCode" @click="securityCode">获取验证码</span>
				</div>
				<div class="login_form_code">
					<input type="text" class="login_form_inp" placeholder="请输入验证码">
				</div>
				<div class="login_form_btn">
					<router-link to="Process">
						<button type="button"></button>
					</router-link>
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
export default {
  name: "Login",
  data() {
    return {
      API: GLOBAL.GLOBAL_API_DOMAIN,
      telephone: ""
    };
  },
  methods: {
    securityCode() {
      console.log(this.telephone);
      // let _parms = {
      //   shopMobile: this.telephone
      // };
      // this.$axios.get(this.API+"app/sms/sendForShopAppRegister",_parms).then(res=>{
      //   console.log(res.data);
      // });
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


