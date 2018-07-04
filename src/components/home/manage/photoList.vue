<template>
  <div class="photo">
      <mt-header :title="name">
        <mt-button slot="left" icon="back" @click="clickback"></mt-button>
        <mt-button slot="right" @click="edit">{{isEdit ? '取消' : '编辑'}}</mt-button>
      </mt-header>
      <div class="photoBox">
          <div class="uploadBtn">
              <img src="../../../../static/images/photo.png" alt="">
              <span>上传图片</span>
              <input type="file" @change="getFile" ref="photo">
          </div>
          <div class="photoList">
              <div class="photo_item" v-for="(item,index) in list" :key="index">
                  <img class="photoUrl" :src="item.value0" alt="">
                  <img v-if="isEdit" class="photoDelete" src="../../../../static/images/cancel.png" alt="" @click="delPhoto(item.value2)">
              </div>
          </div>
      </div>
  </div>
</template>
<script>
import { Field, Toast } from "mint-ui";
import store from "@/vuex/store";
import qs from "qs";
import { mapState, mapMutations } from "vuex";
export default {
  name: "PhotoList",
  data() {
    return {
      name: "店铺照片",
      list: [],
      isEdit: false
    };
  },
  store,
  computed: {
    ...mapState(["userInfo", "shopId"])
  },
  methods: {
    ...mapMutations(["setuserInfo"]),
    clickback() {
      this.$router.push({ name: "Manage", params: {} });
    },
    getPhoto() {
      this.$axios
        .get("/api/app/shopTopPic/selectPic?shopId=" + this.shopId)
        .then(res => {
          if (res.data.code == 0) {
            this.list = res.data.data;
          }
        });
    },
    getFile: function() {
      this.isEdit = false;
      let _this = this,
        inputDOM = {};
      inputDOM = this.$refs.photo;
      this.file = inputDOM.files[0];
      this.errText = "";
      this.$emit("input", this.file);
      this.fileName = this.file.name;
      this.onChange && this.onChange(this.file, inputDOM.value);
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
          _this.addPhoto(res.data.data.id);
        })
        .catch(err => {
          Toast("系统繁忙请稍后再试");
        });
    },
    edit() {
        this.isEdit = !this.isEdit;
    },
    addPhoto(id) {
      let _parms = {
        shopId: this.shopId,
        attachementId: id
      };
      this.$axios
        .post("/api/app/shopTopPic/add", qs.stringify(_parms))
        .then(res => {
          if(res.data.code == 0) {
              this.getPhoto();
          }
        });
    },
    delPhoto(id) {
      this.$axios
        .post("/api/app/shopTopPic/delete?id=" + id)
        .then(res => {
          if(res.data.code == 0) {
              this.getPhoto();
          }
        });
    }
  },
  watch: {},
  created: function() {
    this.getPhoto();
  }
};
</script>
<style lang="less">
.photo {
  .mint-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
  }
  .photoBox {
    padding: 106px 28px 0 28px;
    box-sizing: border-box;
    .uploadBtn {
      width: 100%;
      height: 80px;
      line-height: 76px;
      text-align: center;
      border: 1px solid #fc5e2d;
      border-radius: 8px;
      box-sizing: border-box;
      color: #fc5e2d;
      font-size: 34px;
      position: relative;
      input {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        z-index: 100;
      }
      img {
        margin-top: -5px;
        width: 46px;
        height: 38px;
        vertical-align: middle;
      }
      span {
        vertical-align: middle;
      }
    }
    .photoList {
      padding-top: 36px;
      text-align: left;
      .photo_item {
        display: inline-block;
        height: 336px;
        width: 50%;
        box-sizing: border-box;
        position: relative;
        padding-bottom: 20px;
        .photoUrl {
          height: 100%;
          width: 100%;
          border-radius: 8px;
        }
        .photoDelete {
          height: 50px;
          width: 50px;
          position: absolute;
          top: 0;
          right: 0;
        }
      }
      .photo_item:nth-child(2n) {
          padding-left: 10px;
      }
      .photo_item:nth-child(2n+1) {
          padding-right: 10px;
          .photoDelete {
            right: 10px;
          }
      }
    }
  }
}
</style>