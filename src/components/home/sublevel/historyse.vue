<template>
  <div class="payment">
        <mt-header title="缴费服务"><router-link to="/home" slot="left">
        <mt-button icon="back"></mt-button></router-link></mt-header>
  </div>
</template>

<script>
import { MessageBox } from "mint-ui";
export default {
    name:'payment',
    data(){
        return{
            msg:'payment',
          data:{
              
          },
        }
    }
}
</script>


<style lang="less">

</style>


