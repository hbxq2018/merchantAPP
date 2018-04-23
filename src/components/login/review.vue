<template>
  <div class="review">
      {{msg}}
        <router-link to="menu">
            <mt-button type="default">进入主页面</mt-button>
        </router-link>
  </div>
</template>
<script>
export default {
  name:'Review',
  data(){
      return {
          msg:"审核页面"
      }
  }
}
</script>

