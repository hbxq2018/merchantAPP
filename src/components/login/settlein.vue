<template>
  <div class="settle">
      <mt-header title="商家入驻">
          <router-link to="/process" slot="left">
              <mt-button icon="back"></mt-button>
          </router-link>
      </mt-header>
      
      <div class="settle_head">
          <img src="../../../static/images/setting_head.png" alt="">
      </div>
      <p class="form_title">商户信息</p>
      <div class="form">
          <mt-field label="申请人" placeholder="输入申请人姓名" v-model="username"></mt-field>
          <mt-field label="联系方式" placeholder="输入手机或电话号码" type="tel" v-model="phone"></mt-field>
          <mt-field label="店铺名称" placeholder="输入店铺的全称" type="url" v-model="shopname"></mt-field>
          <mt-field label="详细地址" placeholder="定位选择详细地址" type="number" v-model="address"></mt-field>
          <mt-field label="经营品类" placeholder="选择经营品类" type="" v-model="type"></mt-field>
          <!-- <mt-cell-swipe
            title="经营品类"
            :right="[
              {
                content: '火锅',
                style: { background: 'red', color: '#fff' },
                handler: () => this.$messagebox('火锅')
              },
              {
                content: '川菜',
                style: { background: 'red', color: '#fff' },
                handler: () => this.$messagebox('川菜')
              }
            ]"></mt-cell-swipe> -->
      </div>
      <p class="form_title">提交资质</p>
      <div class="qualification">
        <div class="q_item clearfix">
          <p class="q_item_l fl">营业执照</p>
          <div class="q_item_r fl">
            <p>上传营业执照</p>
            <img src="../../../static/images/add.png" alt="">
          </div>
        </div>
        <div class="q_item clearfix">
          <p class="q_item_l fl">卫生许可证</p>
          <div class="q_item_r fl">
            <p>上传卫生许可证</p>
            <img src="../../../static/images/add.png" alt="">
          </div>
        </div>
        <div class="q_item clearfix">
          <p class="q_item_l fl">门头照</p>
          <div class="q_item_r fl">
            <p>上传门头照(限1张)</p>
            <img src="../../../static/images/add.png" alt="">
          </div>
        </div>
      </div>
      <div class="submitBox">
        <div class="agreement">
          <span>同意</span>
          <router-link to="Agreement">
            <mt-button type="default">《享7商家服务协议》</mt-button>
          </router-link>
        </div>
        <div class="submit_btn">
          <!-- <span>提交申请</span> -->
          <router-link to="home">
              <mt-button type="default">提交申请</mt-button>
          </router-link>
        </div>
        <p>入驻过程如有问题可拨打400-100-111</p>
      </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Field, CellSwipe } from "mint-ui";
Vue.component(CellSwipe.name, CellSwipe);
Vue.component(Field.name, Field);
export default {
  name: "Settle",
  data() {
    return {
      username: "",
      phone: "",
      shopname: "",
      address: "",
      type: ""
    };
  }
};
</script>

<style lang="less">
.settle {
  width: 100%;
  background-color: #ebebeb;
  color: #b1b1b1;
  .mint-header {
    width: 100%;
    height: 88px;
    line-height: 88px;
    background-color: #fc5e2d;
    font-size: 34px;
    position: absolute;
    top: 0;
    left: 0;
    letter-spacing: 4px;
    .is-left {
      i {
        font-size: 44px;
      }
    }
  }
  .settle_head {
    margin-top: 87px;
    img {
      width: 100%;
    }
  }
  .form_title {
    height: 52px;
    line-height: 52px;
    text-align: left;
    padding-left: 29px;
    box-sizing: border-box;
  }
  .form {
    .mint-cell {
      height: 100px;
      line-height: 100px;
      .mint-cell-wrapper {
        border-bottom: 1px solid #e0e0e0;
        font-size: 30px;
        padding-left: 28px;
        .mint-cell-title {
          text-align: left;
          margin-right: 59px;
          width: 120px;
          color: #000;
          span {
            display: inline-block;
            width: 100%;
          }
        }
        .mint-cell-value {
          input {
            font-size: 28px;
          }
          i {
            font-size: 40px;
          }
        }
      }
    }
  }
  .qualification {
    background-color: #fff;
    font-size: 30px;
    .q_item {
      height: auto;
      width: 100%;
      padding: 28px 0 28px 28px;
      box-sizing: border-box;
      border-bottom: 1px solid #E0E0E0;
      .q_item_l {
        text-align: left;
        width: 120px;
        padding-right: 60px;
        color: #000;
      }
      .q_item_r {
        text-align: left;
        img {
          margin-top: 28px;
          width: 210px;
          height: 210px;
        }
      }
    }
  }
  .submitBox {
    margin-top: 20px;
    background-color: #fff;
    padding: 25px 31px;
    .agreement {
      text-align: left;
      font-size: 28px;
      .mint-button--default {
        border: 0;
        background-color: #fff;
        box-shadow: 0 0 0 #fff;
        font-size: 28px;
        color: #FC5E2D;
      }
    }
    .submit_btn {
      width: 100%;
      height: 90px;
      line-height: 90px;
      background-color: #FC5E2D;
      border-radius: 10px;
      color: #fff;
      font-size: 36px;
      margin: 19px 0;
    }
  }
}
</style>


