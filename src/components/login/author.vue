<template>
  <div class="author">
    授权中...
    <!-- 唤醒微信，从app中跳转至微信 -->
    <a href="#" class="dl-btn" id="download" @click="testApp('weixin://')">打开微信</a> 
  </div>
</template>
<script>
// import { getWxAuth } from "@/service/getData";
// import { GetQueryString } from "@/utils/mixin";
export default {
  data() {
    return {
      token: ""
    };
  },
  computed: {},
  created() {
    let param = 'https://hbxq001.cn/author';
    console.log(param)
    let url=encodeURIComponent(param);
    // window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf91e2a026658e78e&redirect_uri="+
    //     url+"&response_type=code&scope=snsapi_userinfo&param=123#wechat_redirect";
    // this.token = window.localStorage.getItem("user_token");
    //判断当前的url有没有token参数,如果不存在那就跳转到微信授权的url
    //就是前面说的ReturnGetCodeUrl方法
    // if (!GetQueryString("token")) {
    //   this.ReturnGetCodeUrl();
    // } else {
    //   //如果有token，如http://www.xxxx.com/h5/author?token=xxxxxxxxx&msg=200，这里的参数就是后台重定向到前台http://www.xxxx.com/h5/author，并携带的参数。这样就可以拿到我们想要的token了
    //   //判断一下后台返回的状态码msg，因为可能出现微信拿不到token的情况
    //   let msg = GetQueryString("msg");
    //   if ((msg = 200)) {
    //     this.token = GetQueryString("token");
    //     //存储token到本地
    //     window.localStorage.setItem("user_token", this.token);
    //     //获取beforeLoginUrl，我们的前端页面
    //     let url = window.localStorage.getItem("beforeLoginUrl");
    //     //跳转
    //     this.$router.push(url);
    //     //删除本地beforeLoginUrl
    //     removeLocalStorage("beforeLoginUrl");
    //   } else {
    //     //msg不是200的情况，可能跳到404的错误页面
    //   }
    // }
  },
  methods: {
    testApp(url) {        //唤醒微信，从app中跳转至微信
      let timeout, t = 1000, hasApp = true; 
      setTimeout(function () { 
        if (!hasApp) { 
            //没有安装微信
            let r=confirm("您没有安装微信，请先安装微信!");
            if (r==true){
                location.href="http://weixin.qq.com/"
            }
        }else{
            //安装微信
        }
        document.body.removeChild(ifr); 
      }, 2000) 
      
      let t1 = Date.now(); 
      let ifr = document.createElement("iframe"); 
      ifr.setAttribute('src', url); 
      ifr.setAttribute('style', 'display:none'); 
      document.body.appendChild(ifr); 
      timeout = setTimeout(function () { 
        let t2 = Date.now(); 
        if (!t1 || t2 - t1 < t + 100) { 
          hasApp = false; 
        } 
      }, t); 
    } 
    // async ReturnGetCodeUrl() {
    //   let { data } = await getWxAuth({});
    //   if (data.status == 200) {
    //     window.location.href = data.url;
    //   }
    // }
  },
  watch: {},
  components: {},
  mounted: function() {}
  // beforeRouteEnter(to, from, next) {
  //   if (!VueCookie.get("user") && !store.state.userInfo) {
  //     // 第一次访问
  //     console.log("授权登录");
  //     // 跳转到微信授权页面，微信授权地址通过服务端获得
  //     axios.post("/api/login").then(res => {
  //       let data = res.data;
  //       if (data.code === 100) {
  //         window.location.href = data.data;
  //       }
  //     });
  //   } else if (!store.state.userInfo) {
  //     // 刷新页面，获取数据存入vuex
  //     axios.get("/api/currentuser").then(res => {
  //       if (res.data.code === 100) {
  //         store.dispatch("setUserInfo", res.data.data);
  //         next();
  //       }
  //     });
  //     console.log("cookie生效期内登录");
  //     next();
  //   } else {
  //     // 已经登录
  //     console.log("已登录");
  //     next();
  //   }
  // }
};
</script>
<style lang="less">

</style>