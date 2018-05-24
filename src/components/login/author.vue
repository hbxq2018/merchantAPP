<template>
  <div class="author">
    授权中...
    <img :src="headImage" alt="">
  </div>
</template>
<script>
import GLOBAL from "../../../untils/config/config";
import { Toast } from "mint-ui";
import qs from "qs";
export default {
  data() {
    return {
      API: GLOBAL.GLOBAL_API_DOMAIN,
      headImage: ''
    };
  },
  computed: {},
  created() {
    if(window.plus){
        // 在这里调用5+ API
        // console.log("window.plus="+JSON.stringify(window.plus));
        this.plusFunc();
    }else{
        document.addEventListener( "plusready", this.plusFunc(), false );
    }
  },
  methods: {
    plusFunc() {     //微信获取用户信息
    let _this = this;
      let auths = [];
      plus.oauth.getServices(function(services) {
          auths = services;
          var s;
          for (var i = 0; i < auths.length; i++) {
              if (auths[i].id == "weixin") {
                  s = auths[i];
                  break;
              }
          }
          if (!s.authResult) {
              s.login(function(e) {
                  console.log("登录认证成功！");
                  // var s;
                  // for (var i = 0; i < auths.length; i++) {
                  //     if (auths[i].id == "weixin") {
                  //         s = auths[i];
                  //         break;
                  //     }
                  // }
                  console.log("s="+JSON.stringify(s));
                  // if (!s.authResult) {
                  //     console.log("未授权登录！");
                  // } else {
                  s.getUserInfo(function(e) {
                      var josnStr = JSON.stringify(s.userInfo);
                      var jsonObj = s.userInfo;
                      console.log("获取用户信息成功：" + josnStr);
                      Toast("授权成功...");
                      _this.headImage = jsonObj.headimgurl;
                      //通过openId查询用户信息
                      let openId = "o16Di01-jZ8yxr5AliPQpSp7a4uQ";
                      _this.$axios.get(_this.$GLOBAL.API+"app/user/findByOpenId/" + openId, {})
                      .then(res => {
                          console.log(res);
                      }).catch(err => {
                          console.log(err);
                      });
                      setTimeout(function() {
                        _this.$router.push({
                            name: "Login",
                            params: {openId: openId}
                        });
                      }, 2000);
                      // console.log(jsonObj.headimgurl);
                      // for (var i in auths) {
                      //   var s = auths[i];
                      //   if (s.authResult) {
                      //       s.logout(function(e) {
                      //           console.log("注销登录认证成功！");
                      //       }, function(e) {
                      //           console.log("注销登录认证失败！");
                      //       });
                      //   }
                      // }
                  }, function(e) {
                      alert("获取用户信息失败：" + e.message + " - " + e.code);
                  });
                  // }
              }, function(e) {
                  console.log("登录认证失败！");
              });
          } else {
              console.log("已经登录认证！");
          }
      }, function(e) {
          alert("获取登录服务列表失败：" + e.message + " - " + e.code);
      });
    }
  }
};
</script>
<style lang="less">

</style>