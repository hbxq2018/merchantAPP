<template>
  <div class="home">
      
      <Menu v-if="ismenu==1"></Menu>
      <Moving v-if="ismenu==2 && isflags"></Moving>
      <Mine v-if="ismenu==3"></Mine>
     
      <div :class="isflags?'h_but':'h_but_node'">
          <div :class="ismenu==1?'h_bar h_bar_active':'h_bar'" @click="gomenu">
            <div class="icon iconfont iconfont-sye">&#xe629;</div>
            <div>首页</div>
          </div>
          <div v-if="isflags" :class="ismenu==2?'h_bar h_bar_active':'h_bar'" @click="gomoving">
            <div class="icon iconfont iconfont-sye">&#xe684;</div>
            <div>动态</div>
          </div>
          <div :class="ismenu==3?'h_bar  h_bar_active':'h_bar'" @click="gomine">
            <div class="icon iconfont iconfont-sye">&#xe8a1;</div>
            <div>我的</div>
          </div>
      </div>
  </div>
</template>

<script>
import Menu from "./menu";
import Mine from "./mine";
import Moving from "./moving";
import store from "@/vuex/store";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "Home",
  data() {
    return {
      ismenu: 1,
      isflags:true
    };
  },
  components: {
    Menu,
    Mine,
    Moving
  },
  store,
  computed: {
    ...mapState(["userInfo", "shopId","ismine"])
  },
  watch:{
    ispush:function(){
      if(ispush){
        this.$router.push({ path: '/income'})
      }
    }
  },
  methods: {
    ...mapMutations(["setuserInfo","setismine"]),
    getflag:function(){
      console.log('getflag')
      mui.ajax({
          type: "get",
          dataType: "json",
          url: "https://www.hbxq001.cn/version.txt",
          data: {},
          contentType: "application/x-www-form-urlencoded;charset=UTF-8",
          success: function (data) {
            if(data.flag == 0){
              this.isflag=true;
            }else if(data.flag ==1){
              this.isflag=false;
            }
            console.log('home-isflag:',this.isflag)
          },
          error: function (xhr, type, errerThrown) {
            mui.toast("网络异常,请稍候再试");
          }
        });
    },
    gomenu: function() {
      this.setismine(1);
      this.ismenu = 1;
    },
    gomoving:function(){
      this.ismenu =2
    },
    gomine: function() {
      this.setismine(2);
      this.ismenu = 3;
    },
    //获取商家信息
    getshopinfo: function() {
      this.$axios
        .get(this.$GLOBAL.API+"shop/get/" + this.shopId)
        .then(res => {
          if (res.data.code == "0") {
            let data = res.data.data;
            this.setuserInfo(data);
          }
        });
    }
  },
  created: function() {
    // this.getflag();
    console.log('isflag123:',isflag)
    this.isflags = isflag;
    quit = true;
    if (this.$route.query.ind == 2) {
      this.ismenu = 3;
    }else if(this.$route.query.ind == 3){
      this.ismenu = 2;
    }
  }
};
</script>

<style lang="less">
.home {
  background: #fff;
  width: 100%;
  height: 100%;
  .h_but {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100px;
    z-index: 1999;
    border-top: 1px solid rgba(224, 224, 224, 1);
    background: #fff;
    .h_bar {
      display: block;
      width: 33.33%;
      height: 100%;
      text-decoration: none;
      float: left;
      text-align: center;
      font-size: 22px;
      color: #808080;
      padding-top: 20px;
    }
    .h_bar_active {
      color: #fc5e2d;
    }
  }
  .h_but_node {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100px;
    z-index: 1999;
    border-top: 1px solid rgba(224, 224, 224, 1);
    background: #fff;
    .h_bar {
      display: block;
      width: 50%;
      height: 100%;
      text-decoration: none;
      float: left;
      text-align: center;
      font-size: 22px;
      color: #808080;
      padding-top: 20px;
    }
    .h_bar_active {
      color: #fc5e2d;
    }
  }
}
</style>


