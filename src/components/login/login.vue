<template>
    <div class="login">
        <img class="login_background" src="../../../static/images/background.png" alt="" />
        <div class="login_Box">
			<div class="login_icon">
				<img class="" src="../../../static/images/aboutMe.png" alt="" />
			</div>
			<form class="login_form">
				<div class="login_form_tele">
					<input type="number" class="login_form_inp" max="11" placeholder="请输入手机号" v-model="telephone">
					<span id="securityCode" class="securityCode" :class="timeFlag ? '' : 'active'" @click="securityCode">{{veridyBtn}}</span>
				</div>
				<div class="login_form_code">
					<input type="number" class="login_form_inp" max="4" placeholder="请输入验证码" v-model="password" @keyup.enter="verification">
				</div>
				<div class="login_form_btn">
          <img src="../../../static/images/enter.png" alt="登录" @click="verification">
				</div>
			</form>
			<div class="othor_login" v-if="!isSignWX">
				<p class="othor_login_text">————<span>其他登录方式</span>————</p>
				<div id="returnIcon" class="othor_login_type">
					<img class="login_weixin" src="../../../static/images/wx-icon.png" alt="" @click="weixinLogin"/>
				</div>
			</div>
		</div>
    </div>
</template>
<script>
import Vue from "vue";
import GLOBAL from "../../../untils/config/config";
import { Toast, Button } from "mint-ui";
Vue.component(Button.name, Button);
import qs from "qs";
import store from "@/vuex/store";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      API: GLOBAL.GLOBAL_API_DOMAIN,
      screenHeight: document.body.clientHeight,
      isfrist: true,
      movieArr: [],
      veridyBtn: "获取验证码",
      telephone: "", //手机号
      password: "", //验证码
      veridyTime: "", //获取验证码的时间
      verifyCode: "", //验证码
      timeFlag: true,
      _type: "2", //来源   1小程序 2H5 3安卓 4IOS
      openId: "", //微信openId
      unionId: "", //微信unionId
      sex: 0, //微信用户性别
      nickName: "", //昵称
      iconUrl: "", //头像
      isSignWX: false, //是否登陆微信
      wxType: 0, //微信返回信息的格式
      isinme: false
    };
  },
  store,
  computed: {
    ...mapState(["userInfo", "shopInfo"])
  },
  methods: {
    ...mapMutations(["setuserInfo", "setshopId", "setshopInfo"]),
    isNull(value) {
      let flag = false;
      if (
        value == "null" ||
        value == null ||
        value == "" ||
        value == undefined ||
        value == []
      ) {
        flag = true;
      }
      return flag;
    },
    securityCode() {
      //获取验证码
      let _this = this;
      if (!this.timeFlag) {
        return false;
      }
      _this.timeFlag = false;
      let RegExp = /^(1[3584]\d{9})$/;
      if (RegExp.test(this.telephone)) {
        // this.$GLOBAL.API  <==> /api/    上线时所有替换
        this.$axios
          .post(
            "/api/app/sms/sendForShopAppRegister?shopMobile=" + this.telephone
          )
          .then(res => {
            let data = res.data;
            if (data.code == 0) {
              let minutes = "",
                senconds = "",
                countdown = 60;
              _this.verifyCode = data.data.verifyId;
              let timer = setInterval(() => {
                countdown--;
                if (countdown == 0) {
                  _this.veridyBtn = "获取验证码";
                  clearInterval(timer);
                  _this.timeFlag = true;
                  return false;
                }
                minutes =
                  Math.floor(countdown / 60) >= 1
                    ? Math.floor(countdown / 60) + "分"
                    : "";
                senconds = countdown % 60 == 0 ? "" : countdown % 60 + "秒";
                _this.veridyBtn = minutes + senconds + "后重发验证码";
              }, 1000);
            } else {
              _this.timeFlag = false;
              Toast("系统繁忙，请稍后再试");
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        _this.timeFlag = true;
        this.telephone = "";
        Toast("请填写正确的手机号");
      }
    },
    verification() {
      //判断输入验证码是否正确
      let _parms = {},
        _this = this,
        value = "";
      if (!this.telephone) {
        Toast("请输入电话号码");
      } else if (!this.password) {
        Toast("请输入短信验证码");
      } else {
        (_parms = {
          shopMobile: this.telephone,
          smsContent: this.password
        }),
          (value = ""),
          (_this = this);
        for (var key in _parms) {
          value += key + "=" + _parms[key] + "&";
        }
        value = value.substring(0, value.length - 1);
        this.$axios
          .get("/api/app/sms/isVerifyForShopApp?" + value, qs.stringify(_parms))
          .then(res => {
            if (res.data.code == 0) {
              if (_this.wxType == 0) {
                _this.signIn();
              } else {
                _this.addWXInfo();
              }
            } else {
              Toast("输入信息有误");
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    signIn(val) {
      //商家注册
      let _this = this;
      let mobile = val ? val : this.telephone;
      this.$axios
        .get("/api/app/user/findUserByMobile?mobile=" + mobile)
        .then(res => {
          _this.setshopInfo(res.data.data);
          if (res.data.code == 0) {
            if (res.data.data == null) {
              //新用户为null
              _this.addShop(); //商家注册
            } else if (
              res.data.data.userType == 1 &&
              !_this.isNull(res.data.data.mobile)
            ) {
              _this.searchByUserId(res.data.data.id);
            } else if (
              res.data.data.userType == 2 &&
              !_this.isNull(res.data.data.mobile)
            ) {
              //商家
              localStorage.setItem("userId", res.data.data.id);
              mui.plusReady(function() {
                var tool = new igexinTool();
                tool.bindAlias(res.data.data.id);
              });
              _this.setshopId(res.data.data.shopId);
              _this.getshopinfo(res.data.data.shopId);
              if (!val) {
                _this.$router.push({ name: "Home" });
              }
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addWXInfo() {
      let _this = this;
      let _parms = {
        mobile: this.telephone,
        openId: this.openId,
        unionId: this.unionId //微信unionId
      };
      this.$axios
        .post("/api/app/user/addAppUser", qs.stringify(_parms))
        .then(res => {
          if (res.data.code == 0) {
            _this.upDateUserInfo();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    upDateUserInfo() {
      let _this = this;
      //1小程序 2H5 3安卓 4IOS
      let _parms = {
        sourceType: this._type,
        mobile: this.telephone,
        nickName: this.nickName,
        iconUrl: this.iconUrl,
        sex: this.sex
      };
      this.$axios
        .post("/api/app/user/updateByMobile", qs.stringify(_parms))
        .then(res => {
          console.log(res);
          if (res.data.code == 0) {
            _this.signIn();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addShop() {
      //获取到微信用户信息后，先用openId去查询是否有信息，如果没有就调添加用户接口addAppUser
      //添加商户
      let _this = this;
      let _parms = { mobile: this.telephone, sourceType: this._type };
      this.$axios
        .post("/api/app/user/addShopAppUser", qs.stringify(_parms))
        .then(res => {
          if (res.data.code == 0) {
            _this.$router.push({
              name: "Process",
              params: { id: res.data.data }
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getshopinfo: function(id) {
      //获取商家信息
      let _this = this;
      this.$axios.get("/api/shop/get/" + id).then(res => {
        if (res.data.code == "0") {
          let data = res.data.data;
          this.$router.push({ name: "Home" });
          _this.setuserInfo(data);
        }
      });
    },
    searchByUserId(id) {
      //判断商家是否在审核中
      let _this = this;
      this.$axios
        .get("/api/app/shopEnter/searchByUserId?userId=" + id)
        .then(res => {
          if (res.data.code == 0) {
            //0待审核  1审核通过  2审核不通过
            console.log(res.data.data);
            if (res.data.data && _this.isNull(res.data.data.status)) {
              let status = res.data.data.status;
              if (status == 0) {
                _this.$router.push({
                  name: "Examine",
                  params: { status: status }
                });
              } else if (status == 1) {
                _this.$router.push({
                  name: "Examine",
                  params: { status: status }
                });
              } else if (status == 2) {
                _this.$router.push({
                  name: "Examine",
                  params: { status: status }
                });
              }
            } else {
              _this.$router.push({ name: "Process", params: {} });
            }
          }
        });
    },
    weixinLogin() {
      if (window.plus) {
        this.plusFunc();
      } else {
        document.addEventListener("plusready", this.plusFunc(), false);
      }
    },
    plusFunc() {
      //微信获取用户信息
      let _this = this;
      let auths = [];
      plus.oauth.getServices(
        function(services) {
          auths = services;
          var s;
          for (var i = 0; i < auths.length; i++) {
            if (auths[i].id == "weixin") {
              s = auths[i];
              break;
            }
          }
          console.log("ssss:", s);
          if (!s.authResult) {
            s.login(
              function(e) {
                console.log("登陆认证成功！");
                s.getUserInfo(
                  function(e) {
                    var josnStr = JSON.stringify(s.userInfo);
                    var jsonObj = s.userInfo;
                    console.log("获取用户信息成功：" + josnStr);
                    //通过openId查询用户信息
                    _this.sex = s.userInfo.sex;
                    _this.nickName = s.userInfo.nickname;
                    _this.iconUrl = s.userInfo.headimgurl;
                    _this.openId = s.userInfo.openid;
                    _this.unionId = s.userInfo.unionid
                      ? s.userInfo.unionid
                      : "";
                    _this.isSignWX = true;
                    // _this.$axios.get("/api/app/user/findByOpenId/" + _this.openId, {})
                    _this.$axios
                      .get(
                        "/api/app/user/findByOpIdAndUnId/?openId=" +
                          _this.openId +
                          "&unionId=" +
                          _this.unionId,
                        {}
                      )
                      .then(res => {
                        let data = res.data,
                          type = 0; //type为1是表示无数据，2表示有数据无手机号/昵称/头像，3数据完整
                        console.log(data);
                        if (data.code == 0) {
                          if (
                            data.data == null ||
                            data.data == "" ||
                            data.data == undefined ||
                            !data.data.mobile
                          ) {
                            _this.wxType = 1;
                            Toast("微信授权成功,请绑定手机号");
                          } else {
                            Toast("微信登陆成功");
                            _this.telephone = data.data.mobile;
                            _this.upDateUserInfo();
                          }
                        }
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  },
                  function(e) {
                    console.log(
                      "获取用户信息失败：" + e.message + " - " + e.code
                    );
                  }
                );
              },
              function(e) {
                console.log("登陆认证失败！");
              }
            );
          } else {
            console.log("已经登陆认证！");
            s.login(
              function(e) {
                console.log("登陆认证成功！");
                s.getUserInfo(
                  function(e) {
                    var josnStr = JSON.stringify(s.userInfo);
                    var jsonObj = s.userInfo;
                    console.log("获取用户信息成功：" + josnStr);
                    //通过openId查询用户信息
                    _this.sex = s.userInfo.sex;
                    _this.nickName = s.userInfo.nickname;
                    _this.iconUrl = s.userInfo.headimgurl;
                    _this.openId = s.userInfo.openid;
                    _this.unionId = s.userInfo.unionid
                      ? s.userInfo.unionid
                      : "";
                    _this.isSignWX = true;
                    // _this.$axios.get("/api/"app/user/findByOpenId/" + _this.openId, {})
                    _this.$axios
                      .get(
                        "/api/app/user/findByOpIdAndUnId/?openId=" +
                          _this.openId +
                          "&unionId=" +
                          _this.unionId,
                        {}
                      )
                      .then(res => {
                        let data = res.data,
                          type = 0; //type为1是表示无数据，2表示有数据无手机号/昵称/头像，3数据完整
                        console.log(data);
                        if (data.code == 0) {
                          if (
                            data.data == null ||
                            data.data == "" ||
                            data.data == undefined ||
                            !data.data.mobile
                          ) {
                            _this.wxType = 1;
                            Toast("微信授权成功,请绑定手机号");
                          } else {
                            Toast("微信登陆成功");
                            _this.telephone = data.data.mobile;
                            _this.upDateUserInfo();
                          }
                        }
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  },
                  function(e) {
                    console.log(
                      "获取用户信息失败：" + e.message + " - " + e.code
                    );
                  }
                );
              },
              function(e) {
                console.log("登陆认证失败！");
              }
            );
          }
        },
        function(e) {
          console.log("获取登陆服务列表失败：" + e.message + " - " + e.code);
        }
      );
    },
    setScroll() {
      const ua = navigator.userAgent.toLowerCase();
      if (/(iPhone|iPad|iPod|iOS)/i.test(ua)) {
        this._type = 4;
      } else if (/(Android)/i.test(ua)) {
        this._type = 3;
        document.documentElement.style.height = this.screenHeight + "px";
        document.body.style.height = this.screenHeight + "px";
      } else {
        this._type = 2;
      }
    }
  },
  created() {
    let _this = this,
      _arr = [],
      _audio = null;
    this.setScroll();
    let userId = localStorage.getItem("userId");
    if (userId) {
      console.log(userId)
      this.$axios.get("/api/app/user/get/" + userId).then(res => {
        if (
          res.data.code == "0" &&
          res.data.data != null &&
          res.data.data != "null"
        ) {
          this.signIn(res.data.data.mobile);
        }
      });
    } else {
      console.log("no Id");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import "mint-ui/lib/style.css";
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
          background: none;
          border: none;
        }
        .securityCode.active {
          color: #b1b1b1;
        }
      }
      .login_form_btn {
        width: 168px;
        height: 124px;
        margin-left: 280px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .othor_login {
      width: 100%;
      position: absolute;
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


