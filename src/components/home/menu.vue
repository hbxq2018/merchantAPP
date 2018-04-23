<template>
  <div class="menu">
      <div class="menu_top">
           <img class="eaves" src="../../../static/images/eaves.png" alt="顶部图片">
            <div class="info">
                <img class="avatar" :src='userdata.src' alt="用户头像">
                <div class="username">
                    <p class="name">{{userdata.name}}</p>
                    <p class="heat">人气{{userdata.heat}}</p>
                </div>
            </div>
      </div>
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
    name: 'Menu',
    data(){
        return {
            msg:'menu',
            userdata:{
                src:'../../../static/images/timg (2).jpg',
                name:'恩施映像',
                heat:'1382',
            }
        }
    }
}
</script>

<style lang="less">
    .menu{
        .menu_top{
            width: 100%;
            &>.eaves{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 111px;
            }
            &>.info{
                height: 133px;
                padding-top: 134px;
                padding-left:39px;
                padding-right: 39px;
                background: #FC5E2D;
                &>.avatar{
                    width: 100px;
                    height: 100px;
                    float: left;
                    border-radius: 50%;
                    margin-left: 31px;
                }
                &>.username{
                    height: 100px;
                    p{
                        height: 50px;
                        line-height: 50px;
                        
                    }
                }
            }
        }
    }
</style>



