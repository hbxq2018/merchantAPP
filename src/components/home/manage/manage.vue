<template>
  <div class="manage">
      <mt-header :title="name">
        <mt-button slot="left" icon="back" @click="clickback"></mt-button>
        <mt-button slot="right" @click="save">保存</mt-button>
      </mt-header> 
      <div class="manage_cont">
        <div class="man_info">商户信息</div>
        <mt-cell v-for="(item,index) in formdata" :key="index" :id='index' :title="item.name" :to="{path:item.to,query:{'ind':index,'name':item.name,'value':item.value}}" is-link :value="setvalue(item.value)" @click="clickformli"></mt-cell>
        <div class="man_info">商家照片</div>
        <div class="manage_photo">
          <div class="photo_item">
            <div class="photo_item_l fl">门头照<span class="photo_tips">(点击图片更换)</span></div>
            <div class="photo_item_r fr">
              <img class="photo_url" :src="indexUrl" alt="">
              <!-- <span class="loadin"><span class="line"></span><span class="inloadin"></span></span> -->
              <input type="file" @change="getFile(1)" ref="door">
            </div>
          </div>
          <div class="photo_item">
            <div class="photo_item_l fl">Logo<span class="photo_tips">(点击图片更换)</span></div>
            <div class="photo_item_r fr">
              <img class="photo_url" :src="logoUrl" alt="">
              <!-- <span class="loadin" v-if="img2"><span class="line"></span><span class="inloadin"></span></span> -->
              <input type="file" @change="getFile(2)" ref="Logo">
            </div>
          </div>
          <div class="photo_item photo_list" @click="shopImgList">
            <div class="photo_item_l fl">店铺图片</div>
            <div class="photo_item_r fr">
              <span>{{photoNum}}张</span>
              <img class="photo_arrow" src="../../../../static/images/home_arrow.png" alt="">
            </div>
          </div>
        </div>
        <div class="man_info">推荐菜管理</div>
        <mt-cell title="推荐菜" is-link :to="{path:'/dishes',query:{type:1}}"></mt-cell>
        <div class="man_info">员工管理</div>
        <div class="hexiaoyuan">
            <i class="man_hexiao">核销员</i>
            <i class="man_add" @click="clickadd" v-if="ismain">+添加</i>
        </div>
        <ul class="man_write" v-if="writedata">
            <li class="man_lis" v-for="(item,index) in writedata" :key="index" >
              <img class="man_src" :src="item.iconUrl" :alt="item.name">
            <span class="man_name">{{set(item)}}</span>
            <span class="nam_del" @click="clickdel" :id="index" v-if="ismain">删除</span>
            </li>
        </ul>
      </div>
  </div>
</template>
<script>
import { MessageBox, Toast } from "mint-ui";
import store from "@/vuex/store";
import { mapState, mapMutations } from "vuex";
export default {
  name: "Manage",
  data() {
    return {
      msg: "店铺管理",
      name: "恩施映像",
      formdata: [
        {
          name: "联系电话",
          to: "/edit",
          value: ""
        },
        {
          name: "经营品类",
          to: "/edit",
          value: ""
        },
        {
          name: "环境分类",
          to: "/edit",
          value: ""
        },
        {
          name: "详细地址",
          to: "/edit",
          value: ""
        },
        {
          name: "店铺简介",
          to: "/edit",
          value: ""
        },
        {
          name: "其他信息",
          to: "/other",
          value: ""
        }
      ],
      issave: true,
      writedata: [],
      ismain: false,
      indexUrl: require("../../../../static/images/home_arrow.png"),
      logoUrl: require("../../../../static/images/home_arrow.png"),
      img1: false,
      img2: false,
      photoNum: 0
    };
  },
  store,
  computed: {
    ...mapState(["userInfo", "shopId", "shopInfo"])
  },
  methods: {
    ...mapMutations(["setuserInfo"]),
    //查询当前用户是否是当前商家的主账号
    account: function() {
      let obj = { shopId: this.userInfo.id },
        _value = "",
        hxdata = {};
      for (var key in obj) {
        _value += key + "=" + obj[key] + "&";
      }
      _value = _value.substring(0, _value.length - 1);
      this.$axios
        .get("/api/app/shopCashier/adminByShopId?" + _value)
        .then(res => {
          if (res.data.code == "0") {
            if (res.data.data && res.data.data.id) {
              if (res.data.data.cashierId == this.shopInfo.id) {
                this.ismain = true;
              }
            } else {
              this.ismain = false;
            }
          }
        });
    },
    //返回home页面
    clickback: function() {
      if (this.issave) {
        this.$router.push({ name: "Home", params: {} });
      } else {
        MessageBox.confirm("是否确定放弃修改?").then(
          action => {
            this.$router.push({ name: "Home", params: {} });
          },
          () => {
            // MessageBox('提示', '是否放弃保存修改内容？');
          }
        );
      }
    },
    //电话号码格式化
    set: function(val) {
      if (val.nickName) {
        return val.nickName;
      } else if (val.userName) {
        let name = val.userName.substr(0, 3) + "****" + val.userName.substr(7);
        return name;
      }
    },
    //保存修改信息
    save: function() {
      let userdata = this.userInfo,
        _address = "";
      // _address = userdata.address.replace(/\^/g, "%5e");
      MessageBox.confirm("确定进行保存?").then(
        action => {
          let obj = {
            id: userdata.id,
            phone: userdata.phone,
            mobile: userdata.mobile,
            address: userdata.address,
            shopInfo: userdata.shopInfo,
            locationX: userdata.locationX,
            locationY: userdata.locationY,
            businessCate: userdata.businessCate,
            shopHours: userdata.shopHours,
            otherService: userdata.otherService,
            indexUrl: userdata.indexUrl,
            logoUrl: userdata.logoUrl
          };
          let _value = "";
          for (var key in obj) {
            _value += key + "=" + obj[key] + "&";
          }
          _value = _value.substring(0, _value.length - 1);
          this.$axios.post("/api/app/shop/update?" + _value).then(res => {
            if (res.data.code == "0") {
              MessageBox("提示", "保存成功");
              this.issave = true;
              this.getshopinfo();
            }
          });
        },
        () => {
          MessageBox("提示", "是否放弃保存修改内容？");
        }
      );
    },
    //获取商家信息
    getshopinfo: function() {
      this.$axios.get("/api/app/shop/get/" + this.shopId).then(res => {
        if (res.data.code == "0") {
          let data = res.data.data;
          this.setuserInfo(data);
        }
      });
    },
    //进入修改页面
    clickformli: function(e) {
      const ind = e.currentTarget.id;
      let obj = {};
      this.issave = false;
      for (let i = 0; i < this.formdata.length; i++) {
        if (ind == this.formdata[i].id) {
          obj = this.formdata[i];
          this.$router.push({
            name: "/edit",
            params: { id: obj.id, name: obj.name }
          });
        }
      }
    },
    clickadd: function() {
      MessageBox.prompt("输入要添加核销员的注册电话").then(
        ({ value, action }) => {
          if (action == "confirm") {
            if (value) {
              const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
              if (!reg.test(value)) {
                MessageBox("提示", "手机号输入错误");
              } else {
                this.inquire(value, "add");
              }
            } else {
              MessageBox("提示", "请输入核销员手机号");
            }
          }
        },
        () => {}
      );
    },
    inquire: function(value, type) {
      //查询要添加的用户是否已经是核销员
      let obj1 = { mobile: value },
        _value1 = "",
        hxdata = {};
      for (var key in obj1) {
        _value1 += key + "=" + obj1[key] + "&";
      }
      _value1 = _value1.substring(0, _value1.length - 1);
      this.$axios.get("/api/app/user/findUserByMobile?" + _value1).then(res => {
        if (res.data.code == "0") {
          hxdata = res.data.data;
          if (hxdata.userType == 2 && hxdata.shopId) {
            if (type == "del") {
              this.deleteHxUser(value);
              this.shopCashier(hxdata, 2);
            } else {
              MessageBox("提示", "该用户已是核销员，请勿重复添加");
            }
          } else {
            if (type == "add") {
              this.addHxUser(value);
              this.shopCashier(hxdata, 1);
            }
          }
        } else {
          MessageBox("提示", res.data.message);
        }
      });
    },
    //跳转至店铺照片
    shopImgList() {
      this.$router.push({ name: "PhotoList", params: {} });
    },
    addHxUser: function(value) {
      let obj = {
        shopId: this.shopId,
        mobile: value
      };
      let _value = "";
      for (var key in obj) {
        _value += key + "=" + obj[key] + "&";
      }
      _value = _value.substring(0, _value.length - 1);
      this.$axios.post("/api/app/user/addHxUser?" + _value).then(res => {
        if (res.data.code == "0") {
          this.getWritelist(1);
        } else {
          MessageBox("提示", res.data.message);
        }
      });
    },
    shopCashier: function(data, type) {
      let obj = {
        cashierId: data.id,
        cashierName: data.userName,
        shopId: this.userInfo.id,
        parentId: this.shopInfo.id
      };
      let _value = "",
        url = "";
      for (var key in obj) {
        _value += key + "=" + obj[key] + "&";
      }
      _value = _value.substring(0, _value.length - 1);
      if (type == 1) {
        url = "app/shopCashier/add?";
      } else if (type == 2) {
        url = "app/shopCashier/delete?";
      }
      this.$axios.post("/api/" + url + _value).then(res => {
        if (res.data.code == "0") {

        } else {
          // MessageBox("提示", res.data.message);
        }
      });
    },
    clickdel: function(e) {
      const ind = e.currentTarget.id;
      let [...arr] = this.writedata;
      if (arr[ind].mobile == this.shopInfo.mobile) {
        MessageBox("提示", "不可以删除主账号");
      } else {
        MessageBox.confirm("确定要删除吗？").then(
          action => {
            if (action == "confirm") {
              // this.inquire(arr[ind].mobile,'del')
              this.deleteHxUser(arr[ind].mobile);
              this.shopCashier(arr[ind], 2);
            }
          },
          () => {}
        );
      }
    },
    deleteHxUser: function(value) {
      let obj = {
        shopId: this.shopId,
        mobile: value
      };
      let _value = "";
      for (var key in obj) {
        _value += key + "=" + obj[key] + "&";
      }
      _value = _value.substring(0, _value.length - 1);
      this.$axios.post("/api/app/user/deleteHxUser?" + _value).then(res => {
        if (res.data.code == "0") {
          this.getWritelist(2);
        }
      });
    },
    setvalue: function(val) {
      if (val && val.length > 13) {
        let str = val.substring(0, 13) + "...";
        return str;
      } else {
        return val;
      }
    },
    getWritelist: function(val) {
      //获取核销员列表
      this.$axios
        .post("/api/app/user/listForShopId?shopId=" + this.shopId)
        .then(res => {
          if (res.data.code == "0") {
            this.writedata = res.data.data;
            if (val == "1") {
              Toast("添加成功");
            } else if (val == "2") {
              Toast("删除成功");
            }
          }
        });
    },
    setformdata: function() {
      if (this.userInfo) {
        let shopdata = this.userInfo,
          _arr = [];
        let _address = this.userInfo.address;
        if (_address.indexOf("-") > 0) {
          _arr = _address.split("-");
        }
        let ind = shopdata.businessCate.indexOf("/");
        let val1 = shopdata.businessCate.slice(0, ind);
        let val2 = shopdata.businessCate.slice(
          ind + 1,
          shopdata.businessCate.length
        );
        this.name = shopdata.shopName;
        if (shopdata.phone && shopdata.phone != "null") {
          this.formdata[0].value = shopdata.phone;
        } else {
          this.formdata[0].value = shopdata.mobile;
        }
        if (shopdata.shopInfo && shopdata.shopInfo != "null") {
          this.formdata[4].value = shopdata.shopInfo;
        } else {
          this.formdata[4].value = "";
        }
        this.formdata[1].value = val1;
        this.formdata[2].value = val2;
        this.formdata[3].value = _arr[3] ? _arr[3] : shopdata.address;
        this.indexUrl = shopdata.indexUrl;
        this.logoUrl = shopdata.logoUrl;
      }
    },
    getFile: function(e) {
      let _this = this,
        inputDOM = {};
      if (e == 1) {
        _this.img1 = true;
        inputDOM = this.$refs.door;
      } else if (e == 2) {
        _this.img2 = true;
        inputDOM = this.$refs.Logo;
      }
      this.file = inputDOM.files[0];
      this.errText = "";
      this.$emit("input", this.file);
      if(!this.file) {
        return false;
      }
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
          if (e == 1) {
            let indexUrl = '';
            _this.img1 = false;
            _this.indexUrl = res.data.data.smallPicUrl;
            indexUrl = _this.indexUrl + "7loogindexUrl";
            _this.setuserInfo(indexUrl);
          } else if (e == 2) {
            let logoUrl = '';
            _this.img2 = false;
            _this.logoUrl = res.data.data.smallPicUrl;
            logoUrl = _this.logoUrl + "7looglogoUrl";
            _this.setuserInfo(logoUrl);
          }
          Toast("上传成功");
        })
        .catch(err => {
          Toast("系统繁忙请稍后再试");
        });
    },
    getPhoto() {
      this.$axios
        .get("/api/app/shopTopPic/selectPic?shopId=" + this.shopId)
        .then(res => {
          if (res.data.code == 0) {
            this.photoNum = res.data.data.length;
          }
        });
    }
  },
  created: function() {
    this.account();
    this.getPhoto();
    if (this.writedata.length < 1) {
      this.getWritelist();
    }
    if (!this.formdata[0].value) {
      this.setformdata();
    }
    if (this.$route.query.address) {
      let adr = this.$route.query;
      this.address = adr.Province + adr.City + adr.county + adr.address;
      (this.locationX = adr.lng),
        (this.locationY = adr.lat),
        (this.city = adr.City);
    }
    if (this.$route.params.ind) {
      let obj = this.$route.params;
      this.formdata[obj.ind].value = obj.value;
    }
  }
};
</script>
<style lang="less">
@import "mint-ui/lib/style.css";
@import url(../../../common/css/common.css);
.manage {
  .mint-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
  }
  .manage_cont {
    padding-top: 80px;
  }
  .man_info {
    background: #ebebeb;
    height: 68px;
    line-height: 68px;
    text-align: left;
    padding-left: 20px;
    font-size: 28px;
    color: #b1b1b1;
  }
  .manage_photo {
    background-color: #fff;
    padding: 0 26px;
    .photo_item {
      border-bottom: 1px solid #e0e0e0;
      padding: 26px 0;
      overflow: hidden;
      .photo_item_l {
        line-height: 120px;
        color: #191919;
        font-size: 30px;
        .photo_tips {
          color: #B1B1B1;
          font-size: 24px;
          margin-left: 12px;
        }
      }
      .photo_item_r {
        position: relative;
        .photo_url {
          width: 120px;
          height: 120px;
        }
        // .loadin {
        //   display: inline-block;
        //   width: 60px;
        //   height: 60px;
        //   position: relative;
        //   // left: 32px;
        //   // top: 32px;
        //   background: rgb(136, 124, 124);
        //   border-radius: 50%;
        //   animation: mymove 1.5s linear infinite;
        //   -webkit-animation: mymove 1.5s linear infinite; /*Safari and Chrome*/
        //   .line {
        //     position: relative;
        //     left: 25px;

        //     display: inline-block;
        //     width: 20px;
        //     height: 40px;
        //     background: #fff;
        //     z-index: 1;
        //   }
        //   .inloadin {
        //     display: inline-block;
        //     width: 40px;
        //     height: 40px;
        //     position: relative;
        //     top: 10px;
        //     left: -10px;
        //     background: #fff;
        //     border-radius: 50%;
        //   }
        // }
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
    .photo_list {
      height: 100px;
      line-height: 100px;
      padding: 0;
      .photo_item_l {
        line-height: 100px;
      }
      .photo_item_r {
        color: #808080;
        font-size: 30px;
        span {
          padding-right: 12px;
        }
      }
      .photo_arrow {
        width: 12px;
        height: 22px;
      }
    }
  }
  .hexiaoyuan {
    padding: 29px 20px;
    border-bottom: 1px solid #e0e0e0;
    height: 40px;
    i {
      font-style: normal;
    }
    .man_hexiao {
      float: left;
      color: #191919;
      font-size: 30px;
    }
    .man_add {
      float: right;
      font-size: 30px;
      color: #fc5e2d;
      height: 100%;
    }
  }
  .man_write {
    padding: 0;
    .man_lis {
      list-style-type: none;
      height: 60px;
      padding: 20px;
      .man_src {
        width: 66px;
        height: 66px;
        border-radius: 50%;
        float: left;
      }
      span {
        line-height: 60px;
        color: #808080;
      }
      .man_name {
        float: left;
        margin-left: 20px;
      }
      .nam_del {
        float: right;
      }
    }
  }
}
</style>


