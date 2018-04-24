<template>
  <div class="home">
      <Menu v-if="ismenu"></Menu>
      <Mine v-if="!ismenu"></Mine>
      <div class="h_but">
          <div :class="ismenu?'h_bar h_bar_active':'h_bar'" @click="gomenu">首页
            <!-- <button class="but_rout"></button> -->
          </div>
          <div :class="ismenu?'h_bar':'h_bar  h_bar_active'" @click="gomine">我的
            <!-- <button class="but_rout"></button> -->
          </div>
      </div>
  </div>
</template>

<script>
import Menu from './menu'
import Mine from './mine'
export default {
  name: "Home",
  data() {
    return {
        ismenu:true
    };
  },
  components: {
    Menu,
    Mine
  },
  methods:{
      gomenu:function(){
          this.ismenu= true;
      },
      gomine:function(){
          this.ismenu= false;
      }
  }
};
</script>

<style lang="less">
.home {
  & > .h_but {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 98px;
    border-top: 1px solid rgba(224, 224, 224, 1);
    & > .h_bar {
      display: block;
      width: 50%;
      height: 100%;
      text-decoration: none;
      float: left;
      text-align: center;
      line-height: 98px;
      font-size: 22px;
      color: #808080;
    }
    &>.h_bar_active{
        color: #FC5E2D;
    }
  }
}
</style>


