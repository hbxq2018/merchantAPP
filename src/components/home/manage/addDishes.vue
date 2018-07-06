<template>
  <div class="addDishes">
    <mt-header fixed :title="name">
        <router-link to="/dishes" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
        <mt-button slot="right" @click="save">完成</mt-button>
    </mt-header>
    <div class="form addDishesBox">
        <div class="addPicBox">
            <div class="placeHolder" v-if="!picUrl">
                <img src="../../../../static/images/camera.png" alt="">
                <p>添加菜品图片</p>
            </div>
            <img v-if="picUrl"  class="uploadPic" :src="picUrl" alt="" >
            <input v-if="this.isSign != 1" type="file" ref="foodsPic" @change="getFile">
        </div>

        <div class="form_item clearfix">
            <span class="fl">推荐菜名</span>
            <input class="fr" type="text" :disabled="isSign == 1" placeholder="例:红烧肉" v-model="skuName" maxlength="13">
        </div>
        <div class="form_area">
            <textarea name="" id="" cols="30" :disabled="isSign == 1" rows="6" placeholder="推荐菜简介..." v-model="skuInfo" maxlength="300"></textarea>
        </div>
    </div>
    <div class="addDish_bot" v-if="id">
        <div class="cancel" @click="getBack">取消</div>
        <div class="delete" @click="deleteMeal">删除</div>
    </div>
  </div>
</template>

<script>
import { MessageBox, Toast, Indicator } from "mint-ui";
import store from "@/vuex/store";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "addDishes",
  data() {
    return {
      name: "添加推荐菜",
      id: "",
      picUrl: "",
      skuName: "",
      skuInfo: "",
      isSign: "0",
      isdisabled:false
    };
  },
  store,
  computed: {
    ...mapState(["userInfo", "shopInfo"])
  },
  methods: {
    ...mapMutations(["setuserInfo", "setshopInfo"]),
    getDishes() {
      let _this = this;
      let _param =
        "id=" +
        this.id +
        "&shopId=" +
        this.userInfo.id +
        "&zanUserId=" +
        this.shopInfo.id;
      this.$axios.get("/api/app/sku/getTscForZan?" + _param).then(res => {
        if (res.data.code != 0) {
          Toast("系统繁忙请稍后再试");
          _this.id = "";
          return false;
        }
        let data = res.data.data;
        _this.skuInfo = data.skuInfo;
        _this.skuName = data.skuName;
        _this.picUrl = data.picUrl;
      });
    },
    getFile: function(e) {
      if (this.isSign == 1) {
        Toast("已报名菜品不可修改编辑！");
        return false
      } 
      Indicator.open({
        text: "图片上传中...",
        spinnerType: "triple-bounce"
      });
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
      if(!this.file) {
        return false;
      }
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
          Indicator.close();
          if (res.data.code != 0) {
            Toast("系统繁忙请稍后再试");
            return false;
          }
          _this.picUrl = res.data.data.picUrl;
        })
        .catch(err => {
          Indicator.close();
          Toast("系统繁忙请稍后再试");
        });
    },
    deleteMeal() {
      //删除该推荐菜
      let _this = this;
      if (this.isSign == 1) {
        Toast("已报名菜品不可修改和删除！");
      } else {
        MessageBox.confirm("确定删除?").then(
          action => {
            this.$axios
              .post("/api/app/sku/delete?id=" + this.id)
              .then(res => {
                if (res.data.code != 0) {
                  Toast("系统繁忙请稍后再试");
                  return false;
                }
                Toast("该商品已删除");
                _this.$router.push({ path: "/dishes" });
              })
              .catch(err => {
                Toast("系统繁忙请稍后再试");
              });
          },
          () => {}
        );
      }
    },
    getBack() {
      //返回
      this.$router.push({ path: "/dishes" });
    },
    save() {
      if(this.isSign == 1){
        return false
      }
      let _this = this,
        saveUrl = "add/?",
        _param = "";
      if (!this.picUrl) {
        Toast("请上传推荐菜图片!");
        return false;
      }
      if (!this.skuName) {
        Toast("请填写推荐菜名称!");
        return false;
      }
      if (!this.skuInfo) {
        Toast("请填写推荐菜详情!");
        return false;
      }
      let data = {
        skuType: "2",
        stockNum: "9999",
        opreatorId: this.shopInfo.id,
        shopId: this.userInfo.id,
        opreatorName: this.shopInfo.userName,
        skuName: this.skuName,
        picUrl: this.picUrl,
        skuInfo: this.skuInfo
      };
      if (_this.id) {
        data.id = _this.id;
        saveUrl = "update/?";
      }
      for (var key in data) {
        _param += key + "=" + data[key] + "&";
      }
      _param = _param.substring(0, _param.length - 1);
      this.$axios
        .post("/api/app/sku/" + saveUrl + _param)
        .then(res => {
          if (res.data.code != 0) {
            Toast("系统繁忙请稍后再试");
            return false;
          }
          Toast("添加成功");
          _this.$router.push({ path: "/dishes" });
        })
        .catch(err => {
          Toast("系统繁忙请稍后再试");
        });
    }
  },
  created: function() {
    if (this.$route.params.id) {
      this.isSign = this.$route.params.isSign;
      if(this.isSign == 1){
        this.isdisabled = true;
      }else{
        this.isdisabled= false;
      }
      this.id = this.$route.params.id;
      this.getDishes();
    }
   
  }
};
</script>
<style lang="less">
@import url(../../../common/css/common.css);
.addDishes {
  background-color: #ebebeb;
  height: 100%;
  .addDishesBox {
    padding-top: 80px;
    .addPicBox {
      height: 420px;
      box-sizing: border-box;
      background: #fff;
      padding-bottom: 20px;
      position: relative;
      overflow: hidden;
      .placeHolder {
        img {
          height: 135px;
          width: 135px;
          margin-top: 50px;
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
        z-index: 1;
      }
      .uploadPic {
        width: 100%;
        height: 100%;
        // max-width: 750px;
        // background-color: #fff;
        // background-repeat: no-repeat;
        // background-size: 100% 100%;
        // position: relative;
        // left: 0;
        // top: -60px;
        // z-index: 50;
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
        color: #b1b1b1;
        text-align: right;
        font-size: 28px;
        background: #fff;
      }
    }
    .form_area {
      textarea {
        font-size: 28px;
        width: 100%;
        min-height: 200px;
        padding: 38px 30px;
        box-sizing: border-box;
        border: 0;
        color: #b1b1b1;
        background: #fff;
      }
    }
  }
  .addDish_bot {
    background-color: #ebebeb;
    padding: 40px 0;
    box-sizing: border-box;
    display: flex;
    div {
      height: 80px;
      line-height: 80px;
      width: 50%;
      margin: 0 20px;
      border-radius: 8px;
      font-size: 30px;
    }
    .cancel {
      background-color: #fff;
      color: #555555;
    }
    .delete {
      background-color: #ff5b5b;
      color: #fff;
    }
  }
}
</style>