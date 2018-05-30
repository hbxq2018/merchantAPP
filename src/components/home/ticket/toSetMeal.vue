<template>
  <div class="toSetMeal">
    <mt-header :title="name">
        <router-link to="/setMeal" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
    </mt-header>
    <div class="form toSetMealBox">
        <div class="addPicBox">
            <img src="../../../../static/images/camera.png" alt="">
            <p>添加商品图片</p>
        </div>
        <div class="form_name form_item clearfix">
            <span class="fl">套餐名称</span>
            <input class="fr" type="text" placeholder="例:双人餐" v-model="setMealName" maxlength="13">
        </div>
        <div class="form_price">
            <div class="form_item clearfix">
                <span class="fl">原价</span>
                <input class="fr" type="text" placeholder="请输入原价（元）" v-model="setMealName" maxlength="13">
                <p class="form_line"></p>
            </div>
            <div class="form_item clearfix">
                <span class="fl">优惠价</span>
                <input class="fr" type="text" placeholder="请输入优惠价格（元）" v-model="setMealName" maxlength="13">
            </div>
        </div>
        <div class="form_other">
            <p class="form_item_tit">主菜</p>
            <div class="form_inner">
                <div class="form_item clearfix">
                    <span class="fl">菜品名称</span>
                    <input class="fr" type="text" placeholder="例如：麻婆豆腐（1份）" v-model="setMealName" maxlength="13">
                </div>
                <div class="form_item clearfix">
                    <span class="fl">价格</span>
                    <input class="fr" type="text" placeholder="请输入原价" v-model="setMealName" maxlength="13">
                </div>
            </div>
            <div class="form_btns">
                <div class="form_btn">
                    <img src="../../../../static/images/cancelIcon.png" alt="">
                    删除该组
                </div>
                <div class="form_btn">
                    <img src="../../../../static/images/addIcon.png" alt="">
                    添加一组
                </div>
            </div>
        </div>
        <div class="form_other">
            <p class="form_item_tit">其他</p>
            <div class="form_inner">
                <div class="form_item clearfix">
                    <span class="fl">菜品名称</span>
                    <input class="fr" type="text" placeholder="例如：饮料、凉菜（1份）" v-model="setMealName" maxlength="13">
                </div>
                <div class="form_item clearfix">
                    <span class="fl">价格</span>
                    <input class="fr" type="text" placeholder="请输入原价" v-model="setMealName" maxlength="13">
                </div>
            </div>
            <div class="form_btns">
                <div class="form_btn">
                    <img src="../../../../static/images/cancelIcon.png" alt="">
                    删除该组
                </div>
                <div class="form_btn">
                    <img src="../../../../static/images/addIcon.png" alt="">
                    添加一组
                </div>
            </div>
        </div>
        <div class="form_other">
            <p class="form_item_tit">备注</p>
            <div class="form_inner">
                <div class="form_item remark clearfix">
                    <span class="fl">菜品名称</span>
                    <input class="fr" type="text" placeholder="例如：免费提供餐巾纸" v-model="setMealName" maxlength="13">
                </div>
            </div>
            <div class="form_btns">
                <div class="form_btn">
                    <img src="../../../../static/images/cancelIcon.png" alt="">
                    删除该组
                </div>
                <div class="form_btn">
                    <img src="../../../../static/images/addIcon.png" alt="">
                    添加一组
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { Picker,Toast } from "mint-ui";
import store from '@/vuex/store'
import {mapState,mapMutations,mapGetters} from 'vuex'
export default {
  name: "toSetMeal",
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
    console.log(this.$route.params.id)
  }
};
</script>
<style lang="less">
@import url(../../../common/css/common.css);
.toSetMeal {
    background-color: #EBEBEB;
    height: 100%;
    .toSetMealBox {
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
        .form_name {
            padding: 0 30px;
        }
        .form_name, .form_price {
            margin-bottom: 20px;
        }
        .form_price {
            background-color: #fff;
            padding: 0 30px;
            .form_item {
                position: relative;
            }
            .form_line {
                height: 2px;
                width: 100%;
                background-color: #E0E0E0;
                position: absolute;
                bottom: 0;
                left: 0;
            }
        }
        .form_item {
            height: 98px;
            line-height: 98px;
            width: 100%;
            background-color: #fff;
            font-size: 30px;
            box-sizing: border-box;
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
        .form_other {
            color: #191919;
            font-size: 28px;
            background-color: #fff;
            text-align: left;
            padding: 0 30px 30px 30px;
            box-sizing: border-box;
            .form_item_tit {
                height: 84px;
                line-height: 84px;
                position: relative;
                padding-left: 28px;
                &:after {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 28px;
                    width: 8px;
                    height: 28px;
                    background-color: #FC5E2D;
                }
            }
            .form_inner {
                box-sizing: border-box;
                border: 2px solid #E0E0E0;
                .remark {
                    border-bottom: 0!important;
                }
                .form_item {
                    padding: 0 22px 0 26px;
                    &:nth-child(1) {
                        border-bottom: 2px solid #E0E0E0;
                    }
                }
            }
            .form_btns {
                height: 82px;
                line-height: 82px;
                text-align: center;
                border: 1px solid #E0E0E0;
                border-top: 0;
                background-color: #FAFAFA;
                display: flex;
                .form_btn {
                    flex-direction: row;
                    width: 50%;
                    height: 100%;
                    box-sizing: border-box;
                    &:nth-child(1) {
                        border-right: 1px solid #E0E0E0;
                    }
                    img {
                        height: 34px;
                        width: 34px;
                        vertical-align: middle;
                    }
                }
            }
        }
    }
}
</style>