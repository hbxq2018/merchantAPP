<template>
  <div class="process">
        {{msg}}
        <router-link to="settlein">
            <mt-button type="default">下一页面</mt-button>
        </router-link>
  </div>
</template>
<script>
export default {
  name: "Process",
  data(){
      return {
          msg:'process'
      }
  }
}
</script>
<style lang="less">
    .process{
        position:fixed;
        left:0;
        top:0;
        width:100%;
        height:100%;
        overflow:auto;
        background-color:#fc5e2d;        
    }
</style>


