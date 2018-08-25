<template>
    <div class="cutedit">
        <mt-header fixed title="编辑砍价拼菜">
            <mt-button slot="left" icon="back" @click="clickback"></mt-button>
            <mt-button slot="right" @click="saveDish">保存</mt-button>
        </mt-header>
        
        <div class="editcontent">
            <div class="addPicBox">
                <div class="loImg" v-if="!singleData.picUrl">
                    <img id="loadimg" src='../../../../static/images/camera.png' alt="添加商品图片">
                    <!-- <p>添加商品图片</p> -->
                </div>
                <img id="loadimg" class="uploadPic" :src='singleData.picUrl' alt="" v-if="singleData.picUrl">
                <input type="file"  @change="change($event)">
                <!-- <input type="file" name="cover" accept="image/*" capture="camera" @change="change($event)"> -->
            </div>
            <div class="form_name form_item clearfix">
                <span class="fl">商品名称</span>
                <input class="fr" type="text" placeholder="例:宫保鸡丁" v-model="singleData.skuName" maxlength="13">
            </div>
            <div class="form_price">
                <div class="form_item clearfix" @click="editDateil">
                    <span class="fl">详情（选填）</span>
                    <img  class="frimg" src="../../../../static/images/home_arrow.png" alt="更多">
                </div>
             </div>
            <div class="form_price">
                <div class="form_item clearfix">
                    <span class="fl">原价（元）</span>
                    <input class="fr" type="number" id="sell" placeholder="请输入原价" v-model="sellPrice" v-on:blur="sellblur()" maxlength="6">
                    <p class="form_line"></p>
                </div>
                <div class="form_item clearfix">
                    <span class="fl">底价（元）</span>
                    <input class="fr" type="number" id="agio" placeholder="请输入底价" v-model="agioPrice" v-on:blur="agioblur()" maxlength='6'>
                    <p class="form_line"></p>
                </div>
                <div class="form_item clearfix">
                    <span class="fl">库存(默认上架15份)</span>
                    <input class="fr" type="number" placeholder="请输入库存(份)" disabled="disabled" v-model="stockNum" maxlength="3">
                    <p class="form_line"></p>
                </div>
            </div>
            <div class="reveal" v-show="singleData.sellPrice || singleData.agioPrice">
                <span class="fl">平台展示价格</span>
                <span class="ri2">底价{{singleData.agioPrice?singleData.agioPrice*1+1:1}}</span>
                <span class="ri1">原价{{singleData.sellPrice}}</span>
            </div>
            <div class="legind">
                <p class="lep1">示例：商家实际收款 = 消费者实际购买价格 - 1.5元服务费 </p>
                <p class="lep2">（1.5元服务费 = 0.5元商家 + 1元消费者）</p>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import { MessageBox, Toast, Indicator, Popup } from "mint-ui";
import store from "@/vuex/store";
import { mapState, mapMutations } from "vuex";
Vue.component(Popup.name, Popup);
export default {
  name: "cutedit",
  data() {
    return {
      ispopup: false,
      deImg:require('../../../../static/images/camera.png'),
      singleData:{ //单个数据
        picUrl: "", //菜品图片
        agioPrice: "", //底价
        sellPrice: "", //原价
        skuName: "", //菜品名称
        stockNum: 15, //库存
        specification: "", //规格
        isDeleted:0,
        skuInfo:""//详情
      },
      isStock:false,
      picUrl:'',
      dishId: "", //单个数据ID
      sellPrice:'',
      agioPrice:'',
      stockNum:15,
      Infos: []
    };
  },
  store,
  computed: {
    ...mapState(["shopInfo", "userInfo","cutdObj"])
  },
  watch:{
    sellPrice:function(){  //原价
      if(this.sellPrice == ''){
        this.singleData.sellPrice=''
        return false;
      }
      if(this.sellPrice.length>6 || this.sellPrice>10000){
        var inputSell = document.getElementById("sell");
        inputSell.blur();
        this.sellPrice = this.singleData.sellPrice;
        return false;
        // this.sellPrice=this.sellPrice.slice(0,9)
      }
      let _sell = this.sellPrice*1;
      if(_sell<0){
        _sell='';
        this.sellPrice=_sell;
        this.singleData.sellPrice = _sell;
        Toast('请正确输入价格');
        return false;
      }

      if(/^\d+(\.\d{1,1})?$/.test(_sell)){
        this.singleData.sellPrice = _sell;
      }else{
        var inputSell = document.getElementById("sell");
        inputSell.blur();
        _sell = Math.floor(_sell * 10) / 10;
        this.sellPrice = _sell;
        this.singleData.sellPrice = _sell;
      }
    },
    agioPrice:function(){  //底价
      if(this.agioPrice == ''){
        this.singleData.agioPrice = '';
        return false;
      }
      if(this.agioPrice.length>6 || this.agioPrice>10000){
        var inputSell = document.getElementById("agio");
        inputSell.blur();
        this.agioPrice = this.singleData.agioPrice;
        return false;
        
        // this.agioPrice=this.agioPrice.slice(0,9)
      }
      let _agi = this.agioPrice*1;
      if(_agi<0){
        _agi='';
        this.agioPrice=_agi;
        this.singleData.agioPrice = _agi;
        Toast('请正确输入价格');
        return false;
      }
      if(/^\d+(\.\d{1,1})?$/.test(_agi)){
        this.singleData.agioPrice = _agi;
      }else{
        var inputAgio = document.getElementById("agio");
        inputAgio.blur();
        // _agi = _agi.toFixed(2);
        _agi = Math.floor(_agi * 10) / 10;
        this.agioPrice = _agi;
        this.singleData.agioPrice = _agi;
      }
      if(this.sellPrice){
        if(this.agioPrice*1>=this.sellPrice*1*0.6+0.1){
          let diff = this.sellPrice*1*0.6;
          diff = Math.floor(diff * 10) / 10;
          this.agioPrice = '请输入底价';
          this.singleData.agioPrice = '';
          Toast('底价不应大于原价的60%,建议小于'+diff+'元')
        }
      }
    },
    stockNum:function(){  //库存
      if(this.stockNum == ''){
        return false;
      }
      if(this.stockNum.length>3){
        this.stockNum=this.stockNum.slice(0,3)
      }
      let _inv = this.stockNum*1;
      this.singleData.stockNum = _inv;
      if(_inv<=0){
        this.stockNum='';
        this.singleData.stockNum = '';
        Toast('请正确输入库存，不应该小于0')
      }
      if(String(_inv).indexOf('.')>-1){
        _inv = Math.floor(_inv * 1) / 1;
        this.stockNum = _inv;
        this.singleData.stockNum = _inv;
        // Toast('请正确输入库存');
      }
    }
  },
  methods: {
    ...mapMutations(["setcutdObj"]),
    //添加图片
    change( event ) {
      let image = document.getElementById('loadimg'); //预览对象
      this.clip(event , {
        resultObj : image,
        aspectRatio : 1
      })
    },
    //返回
    clickback: function() {
      let image = document.getElementById('loadimg');
      let reg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;
      let _imgsrc = image.src,isdefaut = true;
      if(reg.test(_imgsrc) || !_imgsrc){  //判断图片是否是base64格式 如果图片是base64格式，则表示图片是默认图片，
        isdefaut = false;
      }else{
        isdefaut = true;
      }
      if (
        this.singleData.picUrl ||
        this.singleData.agioPrice ||
        this.singleData.sellPrice ||
        this.singleData.skuName ||
        this.singleData.stockNum ||
        isdefaut
      ) {
        let _str = this.dishId?'修改':'编辑';
        MessageBox.confirm(
          "未保存，是否确定退出"
        ).then(action => {
          if (action == "confirm") {
            this.singleData = {};
            this.setcutdObj(this.singleData);
            this.$router.push({ name: "Cutdish", params: {} });
          }
        });
      } else {
        this.singleData = {};
        this.$router.push({ name: "Cutdish", params: {} });
      }
    },
    //base64 转图片  适合后台不接收base64
    base64ToBlob:function (imageData) {
      let self = this;
      let arr = imageData.split(',');
      let mime = arr[0].match(/:(.*?);/)[1] || 'image/png';
      // 去掉url的头，并转化为byte
      let bytes = window.atob(arr[1]);
      // 处理异常,将ascii码小于0的转换为大于0
      let ab = new ArrayBuffer(bytes.length);
      // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
      let ia = new Uint8Array(ab);

      for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }

      return new Blob([ab], {
        type: mime
      });
    },
    sellblur:function(){  //焦点离开原价输入框
      if(this.sellPrice*1<2.6){
        this.sellPrice = '';
        this.singleData.sellPrice='';
        Toast('原价不得小于2.6元');
      }
    },
    agioblur:function(){
      if(this.agioPrice*1<0.5){
        this.agioPrice = '';
        this.singleData.agioPrice='';
        this.isStock = true;
        Toast('底价不得小于0.5元');
      }
    },
    //保存
    saveDish: function() {
      let image = document.getElementById('loadimg'); 
      let reg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;
      let _imgsrc = image.src;
      
      if(reg.test(_imgsrc) || !_imgsrc){  //如果图片是base64格式，则表示图片是默认图片，
        Toast("请上传菜品图片");
        return false;
      }else{
       this.singleData.picUrl = _imgsrc;
      }
      if (!this.singleData.skuName) {
        Toast("请输入菜品名称");
        return false;
      }
      if (!this.singleData.sellPrice ||this.singleData.sellPrice==0) {
        Toast("请输入菜品原价");
        return false;
      }
      if (!this.singleData.agioPrice ||this.singleData.agioPrice==0) {
        if(!this.isStock){
          Toast("请输入菜品底价");
        }
        return false;
      }
      if(this.singleData.agioPrice*1>=this.singleData.sellPrice*1*0.6+0.1){
       this.singleData.agioPrice = '';
       this.agioPrice='';
       let diff = this.singleData.sellPrice*1*0.6;
       diff = Math.floor(diff * 10) / 10;
        Toast('底价不应大于原价的60%,建议小于'+diff+'元');
        return false;
      }
      if (!this.singleData.stockNum ||this.singleData.stockNum==0) {
        Toast("请输入菜品库存量");
        return false;
      }
      
      if (this.dishId) {
        //更新
        this.getUpdate();
      } else {
        //新增
        let obj1 = {},
          obj2 = {},
          _value1 = "",
          _value2 = "",
          _info = "";
          
        obj1 = {
          skuName: this.singleData.agioPrice*1+1 + "元砍价券",
          skuType: 4,
          stockNum:15,
          opreatorId: this.shopInfo.id,
          inPrice: 20,
          agioPrice: this.singleData.agioPrice*1+1,
          opreatorName: this.shopInfo.userName,
          sellPrice: this.singleData.agioPrice*1+1,
        };
        for (var key in obj1) {
          _value1 += key + "=" + obj1[key] + "&";
        }
        _value1 = _value1.substring(0, _value1.length - 1);
        obj2 = {
          skuName:this.singleData.skuName,
          skuType: 6,
          stockNum:15,//this.singleData.stockNum,
          opreatorId: this.shopInfo.id,
          opreatorName: this.shopInfo.userName,
          sellPrice: this.singleData.sellPrice,
          inPrice: 20,
          picUrl: this.singleData.picUrl,
          agioPrice: this.singleData.agioPrice*1+1,
          skuInfo:this.singleData.skuInfo,
          shopId: this.userInfo.id
        };
        
        for (var key in obj2) {
          _value2 += key + "=" + obj2[key] + "&";
        }
        _value2 = _value2.substring(0, _value2.length - 1);
         
        Indicator.open("菜品保存中...");
        this.$axios.post("/api/app/sku/addSkuForKj?" + _value1).then(res => {
          if (res.data.code == 0) {
            console.log("新增砍价券成功 ");
            this.$axios.post("/api/app/sku/add?" + _value2).then(res => {
              if (res.data.code == 0) {
                console.log("新增砍价菜成功 ");
                Indicator.close();
                Toast("保存成功！");
                this.singleData = {};
                this.setcutdObj(this.singleData);
                this.$router.push({ name: "Cutdish", params: {} });
              }
            });
          }
        });
      }
    },
    //更新
    getUpdate: function() {
      let _parms = {},
        _info = "",
        _value = "";
      _parms = {
        skuName: this.singleData.skuName,
        skuType: 6,
        stockNum:15,// this.singleData.stockNum,
        opreatorId: this.shopInfo.id,
        opreatorName: this.shopInfo.userName,
        sellPrice: this.singleData.sellPrice,
        inPrice: 20,
        picUrl: this.singleData.picUrl,
        agioPrice: this.singleData.agioPrice*1+1,
        skuInfo:this.singleData.skuInfo,
        shopId: this.userInfo.id,
        id: this.dishId,
        isDeleted: this.singleData.isDeleted*1
      };
      for (var key in _parms) {
        _value += key + "=" + _parms[key] + "&";
      }
      _value = _value.substring(0, _value.length - 1);
      Indicator.open("数据保存中...");
      setTimeout(() => {
          Indicator.close();
      }, 15000);
      this.$axios.post("/api/app/sku/update?" + _value).then(res => {
        if (res.data.code == 0) {
          Indicator.close();
          Toast("保存成功！");
          this.singleData = {};
          this.setcutdObj(this.singleData);
          this.$router.push({ name: "Cutdish", params: {} });
        }
      });
    },
    //上传图片
    getFile: function(e) {
      let _this = this,
        inputDOM = {};
      inputDOM = this.$refs.foodsPic;
      // 通过DOM取文件数据
      this.file = inputDOM.files[0];
      if (!this.file) {
        Indicator.close();
        return false;
      } else {
        Indicator.open({
          text: "图片上传中...",
          spinnerType: "triple-bounce"
        });
      }
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
    //获取单个数据
    getSingle: function(id) {
      let _value =
        "Id=" +
        id +
        "&zanUserId=" +
        this.shopInfo.id +
        "&shopId=" +
        this.userInfo.id;
      this.$axios.get("/api/app/sku/getKjc?" + _value).then(res => {
        if (res.data.code == 0) {
          let _data = res.data.data;
          for (let key in _data) {
            for (let ind in this.singleData) {
              if (key == ind) {
                this.singleData[ind] = _data[key]
              }
            }
          }
          // this.stockNum = _data.stockNum;
          this.agioPrice = _data.agioPrice*1-1;
          this.sellPrice = _data.sellPrice;
          
        }
      });
    },
    //编辑详情
    editDateil: function() {
      // let str = this.Infos
      let image = document.getElementById('loadimg'); 
      let reg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;
      let _imgsrc = image.src;
      
      if(reg.test(_imgsrc) || !_imgsrc){  //如果图片是base64格式，则表示图片是默认图片，
      }else{
       this.singleData.picUrl = _imgsrc;
      }
      this.setcutdObj(this.singleData);
      this.$router.push({ name: "EditList", params: {str:this.singleData.skuInfo,dishId:this.dishId} });
    },
  },
  created: function() {
    if (this.$route.params.id) {
      let id = this.$route.params.id;
      this.dishId = id;
      this.getSingle(id);
    }

    if(this.$route.params.dishId){
      this.dishId = this.$route.params.dishId;
    }

    for (let key in this.cutdObj) {
      for (let ind in this.singleData) {
        if (key == ind) {
          this.singleData[ind] = this.cutdObj[key]
        }
      }
    }

    if(this.singleData.stockNum){
      this.stockNum = this.singleData.stockNum;
    }
    if(this.singleData.agioPrice){
      this.agioPrice = this.singleData.agioPrice;
    }
    if(this.singleData.sellPrice){
      this.sellPrice = this.singleData.sellPrice;
    }
  


    if (this.$route.params.info) {
      let _info = this.$route.params.info;
      if(_info == 1){
        this.singleData.skuInfo= '';
      }else{
        this.singleData.skuInfo= _info;
      }
    }
  }
};
</script>

<style lang="less" scoped>
    h3{
        text-align: center;
    }
    h1, h2 {
      font-weight: normal;
    }

    ul {
      list-style-type: none;
      padding: 0;
    }

    li {
      display: inline-block;
      margin: 0 10px;
    }

    a {
      color: #42b983;
    }
.cutedit {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #ebebeb;
  overflow: scroll;
  .mint-header{
    z-index: 99999;
    position: absolute;
    left: 0;
    top: 0;
  }
  .editcontent {
    z-index: 100;
    .addPicBox {
      height: 420px;
      box-sizing: border-box;
      background-color: #fff;
      margin-top: 80px;
      margin-bottom: 20px;
      padding-top: 60px;
      position: relative;
      overflow: hidden;
      .loImg {
        img {
          max-width:342px;
          height:342px;
          position: relative;
          top: -30px;
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
        // max-width: 750px;
        max-width:342px;
        height:342px;
        background-color: #fff;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        position: relative;
        left: 0;
        top: -30px;
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
        input[disabled]{background:#fff;opacity:1;}
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
      .frimg {
        background: #fff;
        width: 15px;
        height: 25px;
        margin-top: 40px;
        float: right;
      }
      span {
        color: #191919;
      }
      input {
        width: 60%;
        border: 0;
        height: 100%;
        color: #b1b1b1;
        text-align: right;
        font-size: 28px;
      }
    }
    .reveal {
      color: #808080;
      background: #dbdbdb;
      width: 688px;
      padding: 0 31px;
      height: 66px;
      line-height: 66px;
      margin-top: -20px;
      .ri1,
      .ri2 {
        float: right;
      }
      .ri1 {
        margin-right: 28px;
      }
    }
    .legind {
      color: #808080;
      width: 688px;
      padding: 0 31px;
      font-size: 22px;
      text-align: left;
      margin-top: 20px;
    }
  }
}
</style>




