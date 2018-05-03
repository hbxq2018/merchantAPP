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
        <mt-field label="店铺名称" placeholder="输入店铺的全称" type="text" v-model="shopname"></mt-field>
        <!-- <mt-field label="详细地址" placeholder="定位选择详细地址" type="number" v-model="address"></mt-field> -->
        <div class="category clearfix">
          <router-link to="shopMap">
            <div class="category_l">详细地址</div>
            <div class="category_r">
              <span class="category_text fl">定位选择详细地址</span>
              <span class="category_arrow fr"></span>
            </div>
          </router-link>
        </div>
        <div class="category clearfix">
          <router-link to="category">
            <div class="category_l">经营品类</div>
            <div class="category_r">
              <span class="category_text fl">选择经营品类</span>
              <span class="category_arrow fr"></span>
            </div>
          </router-link>
        </div>
    </div>
    <p class="form_title">提交资质</p>
    <div class="qualification">
      <div class="q_item clearfix">
        <p class="q_item_l fl">营业执照</p>
        <div class="q_item_r fl">
          <p>上传营业执照</p>
          <div class="files">
            <img src="../../../static/images/add.png" alt="">
            <input type="file" v-on:change="getFile">
          </div>
        </div>
      </div>
      <div class="q_item clearfix">
        <p class="q_item_l fl">卫生许可证</p>
        <div class="q_item_r fl">
          <p>上传卫生许可证</p>
          <div class="files">
            <img src="../../../static/images/add.png" alt="">
            <input type="file" v-on:change="getFile">
          </div>
        </div>
      </div>
      <div class="q_item clearfix">
        <p class="q_item_l fl">门头照</p>
        <div class="q_item_r fl">
          <p>上传门头照(限1张)</p>
          <div class="files">
            <img src="../../../static/images/add.png" alt="">
            <input type="file" v-on:change="getFile">
          </div>
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
        <router-link to="examine">
            <mt-button type="default">提交申请</mt-button>
        </router-link>
      </div>
      <p>入驻过程如有问题可拨打400-100-111</p>
    </div>
    <!-- <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet> -->
  </div>
</template>
<script>
import Vue from "vue";
import { Field, CellSwipe, Actionsheet } from "mint-ui";
Vue.component(Field.name, Field);
Vue.component(CellSwipe.name, CellSwipe);
Vue.component(Actionsheet.name, Actionsheet);
export default {
  name: "Settle",
  data() {
    return {
      username: "",
      phone: "",
      shopname: "",
      address: "",
      type: "",
      imgUrl: "../../../static/images/add.png"
      // actions: [
      //   {
      //     name: '拍照',
      //     method: function() {
      //       console.log('拍照');
      //     }
      //   },
      //   {
      //     name: '从相册中选择',
      //     method: function() {
      //       console.log('从相册中选择');
      //     }
      //   }
      // ],
      // sheetVisible: false
    };
  },
  methods: {
    // add: function(){
    //   this.sheetVisible = !this.sheetVisible;
    // }
    getFile: function(e) {
      console.log(e.target.files);
      // this.imgUrl = e.target.files[0].name
    },
    addMap() {
      this.$router.push({name: 'ShopMap'});
    }
  },
  created() {
    //获取到category的参数值
    console.log(this.$route.params.category)
  }
};
</script>

<style lang="less">
.settle {
  width: 100%;
  background-color: #ebebeb;
  color: #b1b1b1;
  .settle_head {
    margin-top: -1px;
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
          width: 160px;
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
    .category {
      background-color: #fff;
      width: 100%;
      height: 100px;
      line-height: 100px;
      font-size: 30px;
      color: #000;
      padding: 0 15px 0 28px;
      box-sizing: border-box;
      .category_l {
        float: left;
        height: 100%;
        width: 25%;
        text-align: left;
      }
      .category_r {
        float: right;
        height: 100%;
        width: 75%;
        .category_text {
          font-size: 28px;
          color: #b1b1b1;
        }
        .category_arrow {
          width: 40px;
          height: 40px;
          position: relative;
          margin-top: 35px;
          &:after,
          &:before {
            content: "";
            position: absolute;
            top: 0;
          }
          &:after {
            left: 0px;
            border-left: 15px solid #fff;
            border-right: 15px solid transparent;
            border-top: 15px solid transparent;
            border-bottom: 15px solid transparent;
          }
          &:before {
            left: 2px;
            border-left: 15px solid #b1b1b1;
            border-right: 15px solid transparent;
            border-top: 15px solid transparent;
            border-bottom: 15px solid transparent;
          }
        }
      }
    }
    // .category:hover {     //经营品类点击样式
    //   background-color: #ebebeb;
    // }
  }
  .qualification {
    background-color: #fff;
    font-size: 30px;
    .q_item {
      height: auto;
      width: 100%;
      padding: 28px 0 28px 28px;
      box-sizing: border-box;
      border-bottom: 1px solid #e0e0e0;
      .q_item_l {
        text-align: left;
        width: 120px;
        padding-right: 60px;
        color: #000;
      }
      .q_item_r {
        text-align: left;
        .files {
          margin-top: 28px;
          width: 210px;
          height: 210px;
          position: relative;
          img {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
          }
          input {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
            z-index: 100;
          }
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
        color: #fc5e2d;
      }
    }
    .submit_btn {
      button {
        box-shadow: 0 0 0 #fc5e2d;
        font-size: 36px;
        width: 100%;
        height: 90px;
        line-height: 90px;
        background-color: #fc5e2d;
        border-radius: 10px;
        color: #fff;
        font-size: 36px;
        margin: 19px 0;
      }
    }
  }
}
</style>


