<template>
  <div class="toSetMeal">
    <mt-header :title="name">
        <router-link to="/setMeal" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
        <mt-button slot="right" @click="save">完成</mt-button>
    </mt-header>
    <div class="form toSetMealBox">
        <div class="addPicBox">
            <div class="placeHolder">
                <img src="../../../../static/images/camera.png" alt="">
                <p>添加商品图片</p>
            </div>
            <img class="uploadPic" :src="uploadUrl" alt="" v-if="uploadUrl">
            <input type="file" ref="foodsPic" @change="getFile">
        </div>
        <div class="form_name form_item clearfix">
            <span class="fl">套餐名称</span>
            <input class="fr" type="text" placeholder="例:双人餐" v-model="setMealName" maxlength="13">
        </div>
        <div class="form_price">
            <div class="form_item clearfix">
                <span class="fl">原价</span>
                <input class="fr" type="text" placeholder="请输入原价（元）" v-model="sellPrice" maxlength="13">
                <p class="form_line"></p>
            </div>
            <div class="form_item clearfix">
                <span class="fl">优惠价</span>
                <input class="fr" type="text" placeholder="请输入优惠价格（元）" v-model="agioPrice" maxlength="13">
            </div>
        </div>
        <div class="form_other">
            <p class="form_item_tit">主菜</p>
            <div class="form_inner">
                <div class="form_item clearfix">
                    <span class="fl">菜品名称</span>
                    <input class="fr" type="text" placeholder="例如：麻婆豆腐（1份）" v-model="dishName1" maxlength="13">
                </div>
                <div class="form_item clearfix">
                    <span class="fl">价格</span>
                    <input class="fr" type="text" placeholder="请输入原价" v-model="dishPrice1" maxlength="13">
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
                    <input class="fr" type="text" placeholder="例如：饮料、凉菜（1份）" v-model="otherDishName1" maxlength="13">
                </div>
                <div class="form_item clearfix">
                    <span class="fl">价格</span>
                    <input class="fr" type="text" placeholder="请输入原价" v-model="otherDishPrice1" maxlength="13">
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
                    <input class="fr" type="text" placeholder="例如：免费提供餐巾纸" v-model="reMarkName1" maxlength="13">
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
import qs from "qs";
import {mapState,mapMutations,mapGetters} from 'vuex'
export default {
  name: "toSetMeal",
  data() {
    return {
      name: "添加套餐",
      uploadUrl: "",
      setMealName: "",
      sellPrice: "",
      agioPrice: "",
      dishName1: "",
      dishPrice1: "",
      otherDishName1: "",
      otherDishPrice1: "",
      reMarkName1: ""
    };
  },
  store,
  computed:{
    ...mapState(['shopInfo', 'userInfo']),
  },
  methods: {
     ...mapMutations(['setshopInfo', 'setuserInfo']),
    getFile: function(e) {
      //上传图片
      let _this = this,
        inputDOM = {};
      console.log(e);
      inputDOM = this.$refs.foodsPic;
      console.log(inputDOM);
      // 通过DOM取文件数据
      this.file = inputDOM.files[0];
      this.errText = "";
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
          _this.uploadUrl = res.data.data.picUrl;
        })
        .catch(err => {
          Toast("系统繁忙请稍后再试");
        });
    },
    save() {
        // if(!this.uploadUrl) {
        //     Toast('请上传套餐图片!');
        //     return false;
        // }
        // if(!this.setMealName) {
        //     Toast('请填写套餐名称!');
        //     return false;
        // }
        // if(!this.sellPrice || !this.agioPrice) {
        //     Toast('请填写套餐价格!');
        //     return false;
        // }
        // if(!this.dishName1 || !this.dishPrice1 || !this.otherDishName1 || !this.otherDishPrice1 || !this.reMarkName1) {
        //     Toast('请填写套餐详情!');
        //     return false;
        // }
        
        let data = {
            picUrl: this.uploadUrl,
            skuName: this.setMealName,
            skuType: "5",
            stockNum: "9999",
            opreatorId: this.shopInfo.id,
            shopId: this.userInfo.id,
            opreatorName: this.shopInfo.userName,
            sellPrice: this.sellPrice,
            agioPrice: this.agioPrice,
            inPrice: "20",
            skuInfo: [
                {
                    dish: this.dishName1,
                    price: this.dishPrice1

                },
                {
                    dish: this.otherDishName1,
                    price: this.otherDishPrice1

                },
                {
                    dish: this.reMarkName1,
                    price: 0
                }
            ]
        }
        console.log(data);
        let _param = "", skuInfo = "";
        for(let key in data) {
            if(key == "skuInfo") {
                // let skuInfo = "[";
                // for(let i = 0; i < data["skuInfo"].length; i++) {
                //     let skuStr = data["skuInfo"][i];
                //     skuInfo += "{";
                //     for(var k in skuStr) {
                //         skuInfo += k + ":" + skuStr[k] + ",";
                //     }
                //     skuInfo = skuInfo.substring(0, skuInfo.length - 1);
                //     skuInfo += "}";
                //     skuInfo += ","
                //     skuInfo = skuInfo.substring(0, skuInfo.length - 1);
                // }
                // skuInfo += "]";
                console.log(JSON.stringify(data[key]))
                _param += key + "=" + JSON.stringify(data[key]) + "&";
            } else {
                _param += key + "=" + data[key] + "&";
            }
        }
        _param = _param.substring(0, _param.length - 1);
        this.$axios
        .post("/api/app/sku/add/?" + _param)
        .then(res => {
          if (res.data.code != 0) {
            Toast("系统繁忙请稍后再试");
            return false;
          }
          console.log(res);
        })
        .catch(err => {
          Toast("系统繁忙请稍后再试");
        });
    }
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
            height: 312px;
            box-sizing: border-box;
            background-color: #fff;
            margin-bottom: 20px;
            padding-top: 60px;
            position: relative;
            .placeHolder {
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
            input {
                width: 100%;
                height: 100%;
                background-color: #fff;
                opacity: 0;
                position: absolute;
                left: 0;
                top: 0;
                z-index: 100;
            }
            .uploadPic {
                width: 100%;
                height: 100%;
                background-color: #fff;
                position: absolute;
                left: 0;
                top: 0;
                z-index: 50;
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