<template>
  <div>
      {{msg}}
       <router-link to="">
            <mt-button type="default">首页</mt-button>
        </router-link>
         <router-link to="mine">
            <mt-button type="default">我的</mt-button>
        </router-link>
  </div>
</template>

<script>
export default {
    name: 'Login',
    data(){
        return {
            msg:'login'
        }
    }
}
</script>


