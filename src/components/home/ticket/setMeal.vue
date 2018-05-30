<template>
  <div class="setMeal">
    <mt-header :title="name">
        <router-link to="/promotion" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
    </mt-header>
    <div class="setMealBox">
        <div class="setMeal_list clearfix" v-for="(item,index) in list" :key="index" :id="item.id" @click="toSetMeal(item.id)">
            <img class="icon fl" src="../../../../static/images/noPass.png" alt="">
            <div class="text fl">
                <p>{{item.name}}</p>
                <p>
                    <span>折后价 ￥{{item.discountPrice}}元</span>
                    <span>门市价 ￥{{item.realPrice}}元</span>
                </p>
                <p>发布日期：{{item.date}}</p>
            </div>
            <div class="arrow fr"></div>
        </div>
    </div>
    <div class="setMealBottom" @click="toSetMeal()">
        <span>+</span>
        <span>添加套餐</span>
    </div>
  </div>
</template>

<script>
import { Picker,Toast } from "mint-ui";
import store from '@/vuex/store'
import {mapState,mapMutations,mapGetters} from 'vuex'
export default {
  name: "setMeal",
  data() {
    return {
      name: "套餐",
      list: [
          {
              id: 1,
              name: '豪华双人套餐',
              realPrice: '128',
              discountPrice: '108',
              date: '2018-05-30'
          },
          {
              id: 2,
              name: '豪华单人套餐',
              realPrice: '68',
              discountPrice: '58',
              date: '2018-06-05'
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
    toSetMeal(id) {
        this.$router.push({ name: "ToSetMeal", params: {id: id} });
    }
  },
  created: function() {
    
  }
};
</script>
<style lang="less">
@import url(../../../common/css/common.css);
.setMeal {
    height: 100%;
    .setMealBox {
        height: 100%;
        margin-top: -80px;
        padding-top: 80px;
        box-sizing: border-box;
        background-color: #EBEBEB;
        .setMeal_list {
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
                    // margin-top: 10px;
                    font-size: 36px;
                    font-weight: 600;
                }
                p:nth-child(2) {
                    margin-top: 12px;
                    span:nth-child(1) {
                        color: #FF5252;
                        font-size: 30px;
                    }
                    span:nth-child(2) {
                        color: #555555;
                        font-size: 24px;
                    }
                }
                p:nth-child(3) {
                    color: #B1B1B1;
                        font-size: 22px;
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
    .setMealBottom {
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