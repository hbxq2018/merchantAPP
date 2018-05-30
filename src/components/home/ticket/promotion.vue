<template>
  <div class="promotion">
    <mt-header :title="name">
        <router-link to="/home" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
    </mt-header>
    <div class="promotionBox">
        <div class="promotion_list clearfix" v-for="(item,index) in list" :key="index" :id="item.id">
            <router-link :to="item.href">
                <img class="icon fl" :src="item.url" alt="">
                <div class="text fl">
                    <p>{{item.name}}</p>
                    <p>{{item.info}}</p>
                </div>
                <div class="arrow fr"></div>
            </router-link>
        </div>
    </div>
  </div>
</template>

<script>
import { Picker,Toast } from "mint-ui";
import store from '@/vuex/store'
import {mapState,mapMutations,mapGetters} from 'vuex'
export default {
  name: "Ticket",
  data() {
    return {
      name: "优化推广",
      list: [
          {
              url: require('../../../../static/images/ticket.png'),
              name: '享7券',
              info: '选择享7券，设置满减门槛',
              href: '/ticket'
          },
          {
              url: require('../../../../static/images/setMeal.png'),
              name: '套餐',
              info: '任意搭配套餐，大优惠力度，吸引更多消费者',
              href: '/setMeal'
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
    
  },
  created: function() {
    
  }
};
</script>
<style lang="less">
@import url(../../../common/css/common.css);
.promotion {
    height: 100%;
    .promotionBox {
        height: 100%;
        margin-top: -80px;
        padding-top: 80px;
        box-sizing: border-box;
        background-color: #EBEBEB;
        .promotion_list {
            height: 140px;
            width: 100%;
            background-color: #fff;
            padding: 30px 28px;
            box-sizing: border-box;
            margin-bottom: 20px;
            .icon {
                width: 80px;
                height: 80px;
                margin-right: 20px;
            }
            .text {
                text-align: left;
                color: #555555;
                font-size: 30px;
                p:nth-child(2) {
                    color: #B1B1B1;
                    margin-top: 8px;
                    font-size: 24px;
                }
            }
            .arrow {
                position: relative;
                width: 30px;
                height: 30px;
                margin-top: 25px;
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
}
</style>