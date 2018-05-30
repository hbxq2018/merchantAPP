<template>
  <div class="addDishes">
    <mt-header :title="name">
        <router-link to="/dishes" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
    </mt-header>
    <div class="form addDishesBox">
        <div class="addPicBox">
            <img src="../../../../static/images/camera.png" alt="">
            <p>添加菜品图片</p>
        </div>
        <div class="form_item clearfix">
            <span class="fl">推荐菜名</span>
            <input class="fr" type="text" placeholder="例:红烧肉" v-model="setMealName" maxlength="13">
        </div>
        <div class="form_area">
            <textarea name="" id="" cols="30" rows="10" placeholder="推荐菜简介..." maxlength="300"></textarea>
        </div>
    </div>
  </div>
</template>

<script>
import { Picker,Toast } from "mint-ui";
import store from '@/vuex/store'
import {mapState,mapMutations,mapGetters} from 'vuex'
export default {
  name: "addDishes",
  data() {
    return {
      name: "添加套餐",
      setMealName: ""
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
.addDishes {
    background-color: #EBEBEB;
    height: 100%;
    .addDishesBox {
        .addPicBox {
            padding-top: 60px;
            height: 312px;
            box-sizing: border-box;
            background-color: #fff;
            margin-bottom: 20px;
            img {
                height: 135px;
                width: 135px;
            }
            p {
                margin-top: 5px;
                color: #808080;
                font-size: 28px;
            }
        }
        .form_item {
            height: 98px;
            line-height: 98px;
            width: 100%;
            padding: 0 30px;
            background-color: #fff;
            font-size: 30px;
            box-sizing: border-box;
            margin-bottom: 20px;
            span {
                color: #191919;
            }
            input {
                width: 70%;
                border: 0;
                height: 100%;
                color: #B1B1B1;
                text-align: right;
                font-size: 28px;
            }
        }
        .form_area {
            textarea {
                font-size: 28px;
                width: 100%;
                height: 500px;
                padding: 38px 30px;
                box-sizing: border-box;
                border: 0;
                color: #B1B1B1;
            }
        }
    }
}
</style>