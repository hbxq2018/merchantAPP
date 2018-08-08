<template>
  <div class="toSetMeal">
    <mt-header fixed :title="name">
        <router-link to="/setMeal" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
        <mt-button slot="right" @click="save">完成</mt-button>
    </mt-header>
    <div class="form toSetMealBox">
        <div class="addPicBox">
            <div class="placeHolder" v-if="!picUrl">
                <img src="../../../../static/images/camera.png" alt="">
                <p>添加商品图片</p>
            </div>
            <img class="uploadPic" :src="picUrl" alt="" v-if="picUrl">
            <input type="file" ref="foodsPic" @change="getFile">
        </div>
        <div class="form_name form_item clearfix">
            <span class="fl">套餐名称</span>
            <input class="fr" type="text" placeholder="例:双人餐" v-model="skuName" maxlength="13">
        </div>
        <div class="form_price">
            <div class="form_item clearfix">
                <span class="fl">原价</span>
                <input class="fr" type="number" placeholder="请输入原价（元）" v-model="sellPrice" maxlength="13">
                <p class="form_line"></p>
            </div>
            <div class="form_item clearfix">
                <span class="fl">优惠价</span>
                <input class="fr" type="number" placeholder="请输入优惠价格（元）" v-model="agioPrice" maxlength="13">
            </div>
        </div>
        <div class="form_other">
            <p class="form_item_tit">主菜</p>
            <div class="form_inner">
                <div class="form_inner_li" v-for="(item,index) in mainObj" :key="index">
                    <div class="form_item clearfix">
                        <span class="fl">菜品名称</span>
                        <input class="fr" type="text" placeholder="例如：麻婆豆腐(1份)" v-model="item.dish" maxlength="13">
                    </div>
                    <div class="form_item clearfix">
                        <span class="fl">价格</span>
                        <input class="fr" type="number" placeholder="请输入原价" v-model="item.price" maxlength="13">
                    </div>
                </div>
            </div>
            <div class="form_btns">
                <div class="form_btn" @click="removeGroup(1)">
                    <img src="../../../../static/images/cancelIcon.png" alt="">
                    删除该组
                </div>
                <div class="form_btn" @click="addGroup(1)">
                    <img src="../../../../static/images/addIcon.png" alt="">
                    添加一组
                </div>
            </div>
        </div>
        <div class="form_other">
            <p class="form_item_tit">其他(选填)</p>
            <div class="form_inner">
                <div class="form_inner_li" v-for="(item,index) in otherObj" :key="index">
                    <div class="form_item clearfix">
                        <span class="fl">菜品名称</span>
                        <input class="fr" type="text" placeholder="例如：饮料、凉菜(1份)" v-model="item.dish" maxlength="13">
                    </div>
                    <div class="form_item clearfix">
                        <span class="fl">价格</span>
                        <input class="fr" type="number" placeholder="请输入原价" v-model="item.price" maxlength="13">
                    </div>
                </div>
            </div>
            <div class="form_btns">
                <div class="form_btn" @click="removeGroup(2)">
                    <img src="../../../../static/images/cancelIcon.png" alt="">
                    删除该组
                </div>
                <div class="form_btn" @click="addGroup(2)">
                    <img src="../../../../static/images/addIcon.png" alt="">
                    添加一组
                </div>
            </div>
        </div>
        <div class="form_other">
            <p class="form_item_tit">备注(选填)</p>
            <div class="form_inner">
                <div class="form_inner_li" v-for="(item,index) in remarkObj" :key="index">
                    <div class="form_item remark clearfix">
                        <span class="fl">菜品名称</span>
                        <input class="fr" type="text" placeholder="例如：免费提供餐巾纸" v-model="item.dish" maxlength="13">
                    </div>
                </div>
            </div>
            <div class="form_btns">
                <div class="form_btn" @click="removeGroup(3)">
                    <img src="../../../../static/images/cancelIcon.png" alt="">
                    删除该组
                </div>
                <div class="form_btn" @click="addGroup(3)">
                    <img src="../../../../static/images/addIcon.png" alt="">
                    添加一组
                </div>
            </div>
        </div>
    </div>
    <div class="toSetMeal_bot" v-if="id">
        <div class="cancel" @click="getBack">取消</div>
        <div class="delete" @click="deleteMeal">删除</div>
    </div>
  </div>
</template>

<script>
import { MessageBox, Toast, Indicator } from "mint-ui";
import store from "@/vuex/store";
import qs from "qs";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "toSetMeal",
  data() {
    return {
      id: "",
      name: "添加套餐",
      picUrl: "",
      skuName: "",
      sellPrice: "",
      agioPrice: "",
      mainObj: [{ dish: "", price: "" }],
      otherObj: [{ dish: "", price: "" }],
      remarkObj: [{ dish: "" }]
    };
  },
  store,
  computed: {
    ...mapState(["shopInfo", "userInfo"])
  },
  methods: {
    ...mapMutations(["setshopInfo", "setuserInfo"]),
    getSingleMeal() {
      //查询单个套餐
      let _this = this;
      let _param =
        "id=" +
        this.id +
        "&shopId=" +
        this.userInfo.id +
        "&zanUserId=" +
        this.shopInfo.id;
      this.$axios.get(this.$GLOBAL.API+"app/sku/getAgio?" + _param).then(res => {
        if (res.data.code != 0) {
          Toast("系统繁忙请稍后再试");
          _this.id = "";
          return false;
        }
        let data = res.data.data;
        _this.picUrl = data.picUrl;
        _this.skuName = data.skuName;
        _this.sellPrice = data.sellPrice;
        _this.agioPrice = data.agioPrice;
        let skuInfo = data.skuInfo.split("@");
        _this.mainObj = JSON.parse(skuInfo[0]);
        _this.otherObj = JSON.parse(skuInfo[1]);
        _this.remarkObj = JSON.parse(skuInfo[2]);
      });
    },
    getFile: function(e) {
      Indicator.open({
        text: "图片上传中...",
        spinnerType: "triple-bounce"
      });
      //上传图片
      //上传图片
      let _this = this,
        inputDOM = {};
      inputDOM = this.$refs.foodsPic;
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
        .post(this.$GLOBAL.API+"app/img/upload", form)
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
    addGroup(id) {
      //添加一组
      if (id == 1) {
        if (
          this.mainObj[this.mainObj.length - 1].dish &&
          this.mainObj[this.mainObj.length - 1].price
        ) {
          this.mainObj.push({ dish: "", price: "" });
        } else {
          Toast("请先填完以上两项");
        }
      } else if (id == 2) {
        if (
          this.otherObj[this.otherObj.length - 1].dish &&
          this.otherObj[this.otherObj.length - 1].price
        ) {
          this.otherObj.push({ dish: "", price: "" });
        } else {
          Toast("请先填完以上两项");
        }
      } else if (id == 3) {
        if (this.remarkObj[this.remarkObj.length - 1].dish) {
          this.remarkObj.push({ dish: "" });
        } else {
          Toast("请先填完以上一项");
        }
      }
    },
    removeGroup(id) {
      //删除该组
      let obj = {};
      if (id == 1) {
        obj = this.mainObj;
      } else if (id == 2) {
        obj = this.otherObj;
      } else if (id == 3) {
        obj = this.remarkObj;
      }
      if (obj.length > 1) {
        obj.splice(obj.length - 1, 1);
      } else {
        Toast("仅剩一项了,不能再删了");
      }
    },
    deleteMeal() {      //删除该套餐
      let _this = this;          
      MessageBox.confirm("确定删除?").then(
        action => {
          this.$axios
          .post(this.$GLOBAL.API+"app/sku/delete?id=" + this.id)
          .then(res => {
            if (res.data.code != 0) {
              Toast("系统繁忙请稍后再试");
              return false;
            }
            Toast("该商品已删除");
            _this.$router.push({path: '/setMeal'})
          })
          .catch(err => {
            Toast("系统繁忙请稍后再试");
          });
        },
        () => {
          
        }
      );
    },
    getBack() {
        this.$router.push({ path: "/setMeal" });
    },
    save() {       //提交套餐
      let _this = this, skuInfo = "", saveUrl = "add/?", _param = "";
      if (!this.picUrl) {
        Toast("请上传套餐图片!");
        return false;
      }
      if (!this.skuName) {
        Toast("请填写套餐名称!");
        return false;
      }
      if (!this.sellPrice || !this.agioPrice) {
        Toast("请填写套餐价格!");
        return false;
      }
      for (let i = 0; i < this.mainObj.length; i++) {
        if (!this.mainObj[i].dish || !this.mainObj[i].price) {
          Toast("请把主菜填写完整!");
          return false;
        }
      }
      skuInfo = JSON.stringify(this.mainObj) + "@" + JSON.stringify(this.otherObj) + "@" + JSON.stringify(this.remarkObj);
      skuInfo = skuInfo.replace(/\{/g, "%7b");
      skuInfo = skuInfo.replace(/\}/g, "%7d");
      let data = {
        picUrl: this.picUrl,
        skuName: this.skuName,
        skuType: "5",
        stockNum: "9999",
        opreatorId: this.shopInfo.id,
        shopId: this.userInfo.id,
        opreatorName: this.shopInfo.userName,
        sellPrice: this.sellPrice,
        agioPrice: this.agioPrice,
        inPrice: "20",
        skuInfo: skuInfo
      };
      if(_this.id) {
          data.id = _this.id;
          saveUrl = "update/?"
      }
      for (let key in data) {
        _param += key + "=" + data[key] + "&";
      }
      _param = _param.substring(0, _param.length - 1);
      this.$axios
        .post(this.$GLOBAL.API+"app/sku/" + saveUrl + _param)
        .then(res => {
          if (res.data.code != 0) {
            Toast("系统繁忙请稍后再试");
            return false;
          }
          Toast("该商品已成功添加");
          _this.$router.push({ path: "/setMeal" });
        })
        .catch(err => {
          Toast("系统繁忙请稍后再试");
        });
    }
  },
  created: function() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      this.getSingleMeal();
    }
  }
};
</script>
<style lang="less">
@import url(../../../common/css/common.css);
.toSetMeal {
  background-color: #ebebeb;
  height: 100%;
  .toSetMealBox {
    padding-top: 80px;
    .addPicBox {
      height: 420px;
      box-sizing: border-box;
      background-color: #fff;
      margin-bottom: 20px;
      padding-top: 60px;
      position: relative;
      overflow: hidden;
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
        max-width: 750px;
        background-color: #fff;
        background-repeat: no-repeat;  
        background-size: 100% 100%; 
        position: relative;
        left: 0;
        top: -60px;
      }
    }
    .form_name {
      padding: 0 30px;
    }
    .form_name,
    .form_price {
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
        background-color: #e0e0e0;
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
        color: #b1b1b1;
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
          content: "";
          position: absolute;
          left: 0;
          top: 28px;
          width: 8px;
          height: 28px;
          background-color: #fc5e2d;
        }
      }
      .form_inner {
        .form_inner_li {
          box-sizing: border-box;
          border: 2px solid #e0e0e0;
          border-bottom: 0;
        }
        .remark {
          border-bottom: 0 !important;
        }
        .form_item {
          padding: 0 22px 0 26px;
          &:nth-child(1) {
            border-bottom: 2px solid #e0e0e0;
          }
        }
      }
      .form_btns {
        height: 82px;
        line-height: 82px;
        text-align: center;
        border: 1px solid #e0e0e0;
        background-color: #fafafa;
        display: flex;
        .form_btn {
          flex-direction: row;
          width: 50%;
          height: 100%;
          box-sizing: border-box;
          &:nth-child(1) {
            border-right: 1px solid #e0e0e0;
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
  .toSetMeal_bot {
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