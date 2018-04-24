<template>
  <div class="examine">
    <img class="examine_img" src="../../../static/images/pass.png" alt="">
    <p class="examine_state">恭喜你，审核通过</p>
    <!-- <p>审核时间：预计2-3个工作日内</p> -->
    <div class="examine_btn">
        <router-link to="menu">
            <mt-button type="default">进入店铺</mt-button>
        </router-link>
    </div>
  </div>
</template>
<script>
export default {
  name:'Examine',
  data(){
      return {
          
      }
  }
}
</script>
<style lang="less">
    .examine {
        padding-top: 312px;
        font-size: 30px;
        color: #13AD17;
        letter-spacing: 4px;
        .examine_img {
            width: 100px;
            height: 100px;
        }
        .examine_state {
            margin: 20px 0 14px 0;
        }
        .examine_btn {
            padding: 430px 131px 0 131px;
            button {
                width: 100%;
                border-radius: 50px;
                height: 80px;
                line-height: 80px;
                color: #13AD17;
                border: 1px solid #13AD17;
                background-color: #fff;
                font-size: 30px;
                letter-spacing: 4px;
            }
        }
    }
</style>


