<template>
  <div class="dishes">
    <mt-header :title="name">
        <router-link to="/manage" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
    </mt-header>
    <div class="dishesBox">
        <div class="dishes_list clearfix" v-for="(item,index) in list" :key="index" :id="item.id" @click="toAddDishes">
            <img class="icon fl" src="../../../../static/images/noPass.png" alt="">
            <div class="text fl">
                <p>{{item.name}}</p>
                <p>{{item.info}}</p>
            </div>
            <div class="arrow fr"></div>
        </div>
    </div>
    <div class="dishesBottom" @click="toAddDishes">
        <span>+</span>
        <span>添加推荐菜</span>
    </div>
  </div>
</template>

<script>
import { Picker,Toast } from "mint-ui";
import store from '@/vuex/store'
import {mapState,mapMutations,mapGetters} from 'vuex'
export default {
  name: "dishes",
  data() {
    return {
      name: "推荐菜管理",
      list: [
          {
              id: 1,
              name: '水煮鱼',
              info: '水煮鱼简介水煮鱼简介水煮鱼简介水煮鱼简介水煮鱼简介水煮鱼简介水煮鱼简介水煮鱼简介水煮鱼简介'
          },
          {
              id: 2,
              name: '水煮鱼',
              info: '水煮鱼简介水煮鱼简介水煮鱼简介水煮鱼简介水煮鱼简介水煮鱼简介水煮鱼简介水煮鱼简介水煮鱼简介'
          }
      ]
    };
  },
  store,
  computed:{
    ...mapState(['userInfo','shopId']),
  },
  methods: {
     ...mapMutations(['setuserInfo']),
     toAddDishes() {
         this.$router.push({path: '/addDishes', params: {}})
     }
  },
  created: function() {
    
  }
};
</script>
<style lang="less">
@import url(../../../common/css/common.css);
 .dishes {
    height: 100%;
    .dishesBox {
        height: 100%;
        margin-top: -80px;
        padding-top: 80px;
        box-sizing: border-box;
        background-color: #EBEBEB;
        .dishes_list {
            height: 170px;
            width: 100%;
            background-color: #fff;
            padding: 20px 30px;
            box-sizing: border-box;
            margin-bottom: 20px;
            .icon {
                width: 130px;
                height: 130px;
                margin-right: 20px;
            }
            .text {
                text-align: left;
                color: #191919;
                p:nth-child(1) {
                    font-size: 36px;
                    font-weight: 600;
                }
                p:nth-child(2) {
                    width: 460px;
                    margin-top: 12px;
                    color: #B1B1B1;
                    font-size: 22px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    display:-webkit-box; 
                    -webkit-box-orient:vertical;
                    -webkit-line-clamp:2; 
                    line-height: 35px;
                }
            }
            .arrow {
                position: relative;
                width: 30px;
                height: 30px;
                margin-top: 50px;
                &:before, &:after {
                    position: absolute;
                    top: 0;
                    content: '';
                    display: block;
                    border-top: 15px solid transparent;
                    border-right: 15px solid transparent;
                    border-bottom: 15px solid transparent;
                }
                &:before {
                    left: 5px;
                    border-left: 15px solid #B1B1B1;
                }
                &:after {
                    left: 0px;
                    border-left: 15px solid #fff;
                }
            }
        }
    }
    .dishesBottom {
        vertical-align: middle;
        position: fixed;
        left: 0;
        bottom: 0;
        height: 110px;
        line-height: 110px;
        width: 100%;
        color: #FC5E2D;
        font-size: 30px;
        text-align: center;
        background-color: #fff;
        span {
            vertical-align: middle;
            display: inline-block;
            height: 110px;
            line-height: 110px;
        }
        span:first-child {
            font-size: 60px;
        }
    }
}   
</style>