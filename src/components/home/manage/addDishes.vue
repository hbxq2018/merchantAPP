<template>
  <div class="addDishes">
    <mt-header :title="name">
        <router-link to="/dishes" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
        <mt-button slot="right" @click="save">完成</mt-button>
    </mt-header>
    <div class="form addDishesBox">
        <div class="addPicBox">
            <div class="placeHolder">
                <img src="../../../../static/images/camera.png" alt="">
                <p>添加菜品图片</p>
            </div>
            <img class="uploadPic" :src="uploadUrl" alt="" v-if="uploadUrl">
            <input type="file" ref="foodsPic" @change="getFile">
        </div>

        <div class="form_item clearfix">
            <span class="fl">推荐菜名</span>
            <input class="fr" type="text" placeholder="例:红烧肉" v-model="setMealName" maxlength="13">
        </div>
        <div class="form_area">
            <textarea name="" id="" cols="30" rows="10" placeholder="推荐菜简介..." v-model="skuInfo" maxlength="300"></textarea>
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
      uploadUrl: "",
      setMealName: "",
      skuInfo: ""
    };
  },
  store,
  computed:{
    ...mapState(['userInfo','shopInfo'])
  },
  methods: {
     ...mapMutations(['setuserInfo', 'setshopInfo']),
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
        let _this = this,
        data = {
            skuType: "2",
            stockNum: "9999",
            opreatorId: this.shopInfo.id,
            shopId: this.userInfo.id,
            opreatorName: this.shopInfo.userName,
            skuName: this.setMealName,
            picUrl: this.uploadUrl,
            skuInfo: this.skuInfo
        }, _param = "";
        for(var key in data) {
            _param += key + "=" + data[key] + "&"
        }
        _param = _param.substring(0, _param.length - 1);
        this.$axios
        .post("/api/app/sku/add?" + _param)
        .then(res => {
          if (res.data.code != 0) {
            Toast("系统繁忙请稍后再试");
            return false;
          }
          Toast("添加成功");
          _this.$router.push({path: "/dishes"})
        })
        .catch(err => {
          Toast("系统繁忙请稍后再试");
        });
    }
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