<template>
  <div class="mine">
      <div class="mine_top">
          <img class="u_img" :src="data.src" alt="用户头像">
          <p class="u_name">{{data.name}}</p>
      </div>
  </div>
</template>

<script>
export default {
  name:'Mine',
  data(){
      return{
          msg:'mine',
          data:{
              src: "../../../static/images/timg (2).jpg",
              name:'用户名称'
          }
      }
  }
}
</script>
<style lang="less">
    .mine{
        .mine_top{
            width: 100%;
            height: 288px;
            background: #FC5E2D;
            .u_img{
                width: 114px;
                height: 114px;
                border-radius: 50%;
                background: #C7C5C5;
                position: relative;
                margin-top: 57px;
            }
            .u_name{
                color: #fff;
                font-size: 36px;
            }
        }
    }
</style>


