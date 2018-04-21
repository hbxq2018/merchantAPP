<template>
  <div class="settle">
      {{msg}}
  </div>
</template>
<script>
export default {
  name:'Settle',
  data(){
      return {
          msg:"Settle in"
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


