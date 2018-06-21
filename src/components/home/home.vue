<template>
  <div class="home">
      
      <Menu v-if="ismenu"></Menu>
      <Mine v-if="!ismenu"></Mine>
     
      <div class="h_but">
          <div :class="ismenu?'h_bar h_bar_active':'h_bar'" @click="gomenu">
            <div class="icon iconfont iconfont-sye">&#xe663;</div>
            <div>首页</div>
          </div>
          <div :class="ismenu?'h_bar':'h_bar  h_bar_active'" @click="gomine">
            <div class="icon iconfont iconfont-sye">&#xe646;</div>
            <div>我的</div>
          </div>
      </div>
  </div>
</template>

<script>
import Menu from "./menu";
import Mine from "./mine";
import store from "@/vuex/store";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "Home",
  data() {
    return {
      ismenu: true
    };
  },
  components: {
    Menu,
    Mine
  },
  store,
  computed: {
    ...mapState(["userInfo", "shopId"])
  },
  watch:{
    ispush:function(){
      if(ispush){
        this.$router.push({ path: '/income'})
      }
    }
  },
  methods: {
    ...mapMutations(["setuserInfo"]),
    gomenu: function() {
      this.ismenu = true;
    },
    gomine: function() {
      this.ismenu = false;
    },
    getshopinfo: function() {
      //获取商家信息
      this.$axios
        .get("api/shop/get/" + this.shopId)
        .then(res => {
          if (res.data.code == "0") {
            let data = res.data.data;
            this.setuserInfo(data);
          }
        });
    }
  },
  created: function() {
    // this.getshopinfo();
    // console.log("userInfo:",this.userInfo)
    if (this.$route.query.ind == "2") {
      this.ismenu = false;
    }
    
    // if (ispush) {
    //   console.log("ispush:", ispush);
    //   this.$router.push({ path: '/income'})
    // }
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


