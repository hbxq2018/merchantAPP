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
            <!-- <mt-field type="text" :disabled="isSign == 1" placeholder="例:红烧肉" v-model="skuName" :attr="{ maxlength: 13 }"></mt-field> -->
        </div>
        <div class="form_area">
            <textarea cols="30" :disabled="isSign == 1" rows="6" placeholder="推荐菜简介..." v-model="skuInfo" maxlength="300"></textarea>
          <!-- <mt-field label="" :disabled="isSign == 1"  placeholder="推荐菜简介..." type="textarea" rows="4" v-model="skuInfo" :attr="{ maxlength: 300 }"></mt-field> -->
        </div>
    </div>
    <div class="addDish_bot" v-if="id">
        <div class="cancel" @click="getBack">取消</div>
        <div class="delete" @click="deleteMeal">删除</div>
    </div>
  </div>
</template>

<script>
// import { untils } from "../../../../untils/util";
var untils = require("../../../../untils/util.js")
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
  watch:{
    skuInfo:function(){
      let reg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]/g;
      let reg2 = /([\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF])|(\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6])|(\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g;
      this.skuInfo = this.skuInfo.replace(reg, '');
       this.skuInfo = this.skuInfo.replace(reg2, '');
    }
  },
  methods: {
    ...mapMutations(["setuserInfo", "setshopInfo"]),
    //查询
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
    //上传图片
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
    //删除该推荐菜
    deleteMeal() {
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
    //返回
    getBack() {
      this.$router.push({ path: "/dishes" });
    },
    //保存
    save() {
      let _skuInfo='';
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
      console.log('data:',data);
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
            Toast("不支付表情符号输入");
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
    console.log('untils:',untils)
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
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  .mint-header{
    z-index: 9999;
    position: relative;
  }
  .addDishesBox {
    // padding-top: 80px;
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
        top: 80px;
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