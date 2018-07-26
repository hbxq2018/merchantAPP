<template>
  <div class="home">
      
      <Menu v-if="ismenu==1"></Menu>
      <Moving v-if="ismenu==2 && isflag"></Moving>
      <Mine v-if="ismenu==3"></Mine>
     
      <div :class="isflag?'h_but':'h_but_node'">
          <div :class="ismenu==1?'h_bar h_bar_active':'h_bar'" @click="gomenu">
            <div class="icon iconfont iconfont-sye">&#xe629;</div>
            <div>首页</div>
          </div>
          <div v-if="isflag" :class="ismenu==2?'h_bar h_bar_active':'h_bar'" @click="gomoving">
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
      isflag:true
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
      this.$axios
      .get("/api/act/flag")
      .then(res => {
        // 1不显示  0 显示 
        if(res.data.data == 1){
          this.isflag = false;
        }else if(res.data.data == 0){
          this.isflag = true;
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
        .get("/api/shop/get/" + this.shopId)
        .then(res => {
          if (res.data.code == "0") {
            let data = res.data.data;
            this.setuserInfo(data);
          }
        });
    }
  },
  created: function() {
    console.log(this.$route.query.ind)
    this.getflag();
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


