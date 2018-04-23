<template>
  <div class="settle">
      {{msg}}
    <router-link to="review">
            <mt-button type="default">下一页面</mt-button>
        </router-link>
  </div>
</template>
<script>
export default {
  name:'Settle',
  data(){
      return {
          msg:"表单页面"
      }
  }
}
</script>

<style lang="less">
    .settle{
        width: 100%;
        background: yellow;
        min-height: 400px;
        color: blueviolet;
        font-size: 44px;
    }
</style>


