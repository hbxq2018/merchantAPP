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
        <mt-field label="申请人" placeholder="输入申请人姓名" type="text" v-model="userName"></mt-field>
        <mt-field label="联系方式" placeholder="输入手机或电话号码" type="number" v-model="phone"></mt-field>
        <mt-field label="店铺名称" placeholder="输入店铺的全称" type="text" v-model="shopName"></mt-field>
        <div class="category clearfix" @click="addrSlide">
          <div class="category_l">详细地址</div>
          <div class="category_r">
            <span class="category_text fl">{{address}}</span>
            <span class="category_arrow fr"></span>
          </div>
        </div>
        <div class="category clearfix" @click="clidkmilieu">
          <div class="category_l">环境分类</div>
          <div class="category_r">
            <span class="category_text fl">{{milieuTxt}}</span>
            <span class="category_arrow fr"></span>
          </div>
        </div>
        <div class="category clearfix" @click="cateSlide">
          <div class="category_l">经营品类</div>
          <div class="category_r">
            <span class="category_text fl">{{categoryTxt}}</span>
            <span class="category_arrow fr"></span>
          </div>
        </div>
    </div>
    <p class="form_title">提交资质</p>
    <div class="qualification">
      <div class="q_item clearfix">
        <p class="q_item_l fl">营业执照</p>
        <div class="q_item_r fl">
          <p>上传营业执照</p>
          <div class="files">
            <img :src="licenseUrl" alt="">
            <input type="file" @change="getFile(1)" ref="license">
          </div>
        </div>
      </div>
      <div class="q_item clearfix">
        <p class="q_item_l fl">卫生许可证</p>
        <div class="q_item_r fl">
          <p>上传卫生许可证</p>
          <div class="files">
            <img :src="healthUrl" alt="">
            <input type="file" @change="getFile(2)" ref="health">
          </div>
        </div>
      </div>
      <div class="q_item clearfix">
        <p class="q_item_l fl">门头照</p>
        <div class="q_item_r fl">
          <p>上传门头照(限1张)</p>
          <div class="files">
            <img :src="ShopPhotoUrl" alt="">
            <input type="file" @change="getFile(3)" ref="ShopPhoto">
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
      <div class="submit_btn" @click="submitForm">
        <mt-button type="default">提交申请</mt-button>
      </div>
      <p>入驻过程如有问题可拨打400-100-111</p>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import axios from "axios";
import qs from "qs";
import { Field, Toast } from "mint-ui";
import store from "@/vuex/store";
import { mapState, mapMutations } from "vuex";
Vue.component(Field.name, Field);
export default {
  name: "Settle",
  data() {
    return {
      id: "",
      userName: "",
      phone: "",
      ismobile:true, //联系方式是否是手机号 
      shopName: "",
      address: "定位选择详细地址",
      isSeleAdd: false, //是否选择地址
      locationX: "",
      locationY: "",
      city: "",
      categoryTxt: "选择经营品类",
      milieuTxt: "选择环境分类",
      isSelected: false, //是否选择经营品类
      defaultPic: require('../../../static/images/add.png'),   //默认图片
      licenseUrl: "",
      healthUrl: "",
      ShopPhotoUrl: ""
    };
  },
  store,
  computed: {
    ...mapState(["newUserInfo",'shopInfo'])
  },
  methods: {
    ...mapMutations(["setNewUserInfo"]),
    cateSlide() {
      //跳转选择经营品类
      this.setdata();
      if (this.isSelected) {
        this.$router.push({
          name: "Category",
          params: { id: "1", txt: this.categoryTxt }
        });
      } else {
        this.$router.push({ name: "Category", params: { id: "1" } });
      }
    },
    clidkmilieu() {
      this.$router.push({
        name: "Category",
        params: { id: "2", txt: this.milieuTxt }
      });
    },
    setdata(){
      this.setNewUserInfo({
        userName: this.userName,
        phone: this.phone,
        shopName: this.shopName,
        address: this.address,
        isSeleAdd: this.isSeleAdd, //是否选择地址
        milieuTxt: this.milieuTxt,
        locationX: this.locationX,
        locationY: this.locationY,
        city: this.city,
        licenseUrl: this.licenseUrl,
        healthUrl: this.healthUrl,
        ShopPhotoUrl: this.ShopPhotoUrl,
        id:this.id
      });
    },
    addrSlide() {
      //跳转选择位置
      this.setdata();
      this.$router.push({ path: "shopMap", query: { ind: "1" } });
    },
    getFile: function(e) {
      //上传图片
      let _this = this,
        inputDOM = {};
      // console.log(e);
      if (e == 1) {
        inputDOM = this.$refs.license;
      } else if (e == 2) {
        inputDOM = this.$refs.health;
      } else if (e == 3) {
        inputDOM = this.$refs.ShopPhoto;
      }
      // console.log(inputDOM);
      // 通过DOM取文件数据
      this.file = inputDOM.files[0];
      this.errText = "";
      // let size = Math.floor(this.file.size / 1024);
      // if (size > '') {
      //     // 这里可以加个文件大小控制
      //     return false
      // }
      // 触发这个组件对象的input事件
      this.$emit("input", this.file);
      // 这里就可以获取到文件的名字了
      this.fileName = this.file.name;
      // 这里加个回调也是可以的
      this.onChange && this.onChange(this.file, inputDOM.value);
      // this.imgPreview(this.file);
      let form = new FormData();
      form.append("file", this.file, this.file.name);
      form.append("userName", "test");
      this.$axios
        .post("/api/app/img/upload", form)
        .then(res => {
          if (res.data.code != 0) {
            Toast("系统繁忙请稍后再试");
            return false;
          }
          if (e == 1) {
            _this.licenseUrl = res.data.data.smallPicUrl;
          } else if (e == 2) {
            _this.healthUrl = res.data.data.smallPicUrl;
          } else if (e == 3) {
            _this.ShopPhotoUrl = res.data.data.smallPicUrl;
          }
        })
        .catch(err => {
          Toast("系统繁忙请稍后再试");
        });
    },
    imgPreview(file) {
      //图片预览
      let _this = this;
      // 看支持不支持FileReader
      if (!file || !window.FileReader) return;

      if (/^image/.test(file.type)) {
        // 创建一个reader
        var reader = new FileReader();
        // 将图片将转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function() {
          _this.imgUrl = this.result;
        };
      }
    },
    addMap() {
       this.setdata();
      //跳转至地图定位页面
      this.$router.push({ name: "ShopMap" });
    },
    submitForm() {//提交表单
      if (this.isNull(this.userName)) {
        Toast("请输入姓名");
        return false;
      }
      if (this.isNull(this.phone)) {
        Toast("请输入联系方式");
        return false;
      }
      let RegExp = /^((0\d{2,3}\d{7,8})|(1[3584]\d{9}))$/;
      let Reg1 = /^(0\d{2,3}\d{7,8})$/;
      let Reg2 = /^(1[3584]\d{9})$/;
      if (Reg1.test(this.phone)) {
        this.ismobile = false;
      }else if(Reg2.test(this.phone)){
        this.ismobile = true;
      }else{
         Toast("请输入联系方式");
         return false
      }
      if (this.isNull(this.shopName)) {
        Toast("请输入店铺名称");
        return false;
      }
      if (this.isNull(this.address) || this.address == '"定位选择详细地址"') {
        Toast("请输入详细地址");
        return false;
      }
      if(this.isNull(this.categoryTxt) || this.categoryTxt =='选择经营品类') {
        Toast('请输入经营品类');
        return false;
      } 
      if(this.isNull(this.milieuTxt) || this.milieuTxt =='选择环境分类') {
        Toast('请输入环境分类');
        return false;
      }
      if (this.isNull(this.licenseUrl) || this.licenseUrl == this.defaultPic) {
        Toast("请上传营业执照");
        return false;
      }
      if (this.isNull(this.healthUrl) || this.healthUrl == this.defaultPic) {
        Toast("请上传卫生许可证");
        return false;
      }
      if (this.isNull(this.ShopPhotoUrl) || this.ShopPhotoUrl == this.defaultPic) {
        Toast("请上传门头照");
        return false;
      }
      let _parms = {
        userName: this.userName,
        shopName: this.shopName,
        address: this.address,
        businessCate: this.categoryTxt + "/" + this.milieuTxt,
        licensePic: this.licenseUrl,
        healthPic: this.healthUrl,
        doorPic: this.ShopPhotoUrl,
        locationX: this.locationX,
        locationY: this.locationY,
        city: this.city,
        userId: this.id?this.id:this.shopInfo.id
      };
      if(this.ismobile){
        _parms.mobile = this.phone;
      }else{
        _parms.phone = this.phone;
      }
    
      this.$axios
        .post("/api/app/shopEnter/add", qs.stringify(_parms))
        .then(res => {
          if (res.data.code != 0) {
            Toast(res.data.message);
            return false;
          }
          if (res.data.code == 0) {
            Toast("提交成功，请等待审核");
            setTimeout(function(){
              this.$router.push({name: "Examine",params:{status:0}})
            },1500)
          }
        })
        .catch(err => {
          Toast("系统繁忙请稍后再试");
        });
    },
    isNull(value) {
      let flag = false;
      if (
        value == "null" ||
        value == null ||
        value == "" ||
        value == undefined ||
        value == []
      ) {
        flag = true;
      }
      return flag;
    }
  },
  created() {
    this.licenseUrl = this.healthUrl = this.ShopPhotoUrl = this.defaultPic;
    for (var key in this.newUserInfo) {
      this[key] = this.newUserInfo[key];
    }
    if (this.$route.query.address) {
      let adr = this.$route.query;
      this.address = adr.Province + adr.City + adr.county + adr.address;
      (this.locationX = adr.lng),
        (this.locationY = adr.lat),
        (this.city = adr.City);
      this.isSeleAdd = true;
    }
    //获取到category的参数值

    if (this.$route.params.category) {
      if (this.$route.params.ismin) {
        this.milieuTxt = this.$route.params.category;
      } else {
        this.categoryTxt = this.$route.params.category;
        this.isSelected = true;
      }
    }
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
    }
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
        width: 23%;
        text-align: left;
      }
      .category_r {
        float: right;
        height: 100%;
        width: 77%;
        .category_text {
          height: 100%;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 28px;
          color: #b1b1b1;
          text-align: left;
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


