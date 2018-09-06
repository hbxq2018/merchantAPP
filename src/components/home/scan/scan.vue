<template>
  <div class="scan">
    <div id="bcid" class="bcid">
      <div style="height:40%"></div>
      <p class="tip">{{addre}}</p>
    </div>

    <div v-show="!usedis" class="bcid">
      <div class="tishi">
        <mt-button type="primary" @click="scanning">开始扫码</mt-button>
      </div>
    </div>
    
    <footer>
      <div class="footerleft" @click="gowrite">
        <img src="../../../../static/images/witter.png">券码核销
      </div>
      <div @click="backhome"> 
        <img src="../../../../static/images/close.png">关闭
      </div>
    </footer>
  </div>
</template>

<script>
import Vue from "vue";
import { Toast, Button } from "mint-ui";
Vue.component(Button.name, Button);
let scan = null;
export default {
  name: "Scan",
  data() {
    return {
      codeUrl: "",
      codenum: "",
      addre: "...载入中...",
      isCamera:false,
      usedis: true
    };
  },
  created:{},
  mounted: function() {
    const ua = navigator.userAgent.toLowerCase();
    if (/(iPhone|iPad|iPod|iOS)/i.test(ua)) {
      //查询ios下是否授权调用相机
      let AVCaptureDevice = plus.ios.importClass("AVCaptureDevice");
      let Status = AVCaptureDevice.authorizationStatusForMediaType("vide");
      if (3 != Status) {  //没有授权
        this.addre = "请在设置中允许使用相机";
        let btnArray = ["确定"];
        mui.confirm(" ", "请在设置中允许使用相机", btnArray, function(e) {});
      } else {
        this.isCamera = true;
        this.startRecognize();
      }
    } else if (/(Android)/i.test(ua)) {
      //查询Android下是否授权调用相机
      let cmr = plus.camera.getCamera();
      if (cmr.supportedVideoResolutions.length < 1) {  //没有授权
        this.addre = "请在设置中允许使用相机";
        let btnArray = ["确定"];
        mui.confirm(" ", "请在设置中允许使用相机", btnArray, function(e) {});
      } else {
        this.isCamera = true;
        this.startRecognize();
      }
    }
  },
  methods: {
    scanning: function() {
      this.usedis = !this.usedis;
      this.startRecognize();
    },
    //创建扫描控件
    startRecognize() {
      let that = this;
      if (!window.plus) return;
      scan = new plus.barcode.Barcode("bcid");
      console.log("scan:", scan);
      scan.onmarked = onmarked;
      that.startScan();
      function onmarked(type, result, file) {
        //二维码type=0;  条形码type=1
        console.log("type:", type);
        console.log("result:", result);
        console.log("file:", file);
        if (type == 0) {
          if (
            result.indexOf("www.hbxq001.cn") > 0 ||
            result.indexOf("www.xq0036.top") > 0
          ) {
            let arr = result.split("/");
            if (typeof (arr[arr.length - 1] * 1) == "number") {
              that.codenum = arr[arr.length - 1]; //获取券码
              that.getbycode(that.codenum);
            } else {
              Toast("不是正确的享7券");
              that.cancelScan();
              that.usedis = false;
            }
          } else {
            Toast("请扫描享7券的二维码");
            that.cancelScan();
            that.usedis = false;
          }
        } else {
          Toast("请扫描享7券的二维码");
          that.cancelScan();
          that.usedis = false;
        }
      }
    },
    //获取票券信息
    getbycode: function(val) {
      console.log("getbycode:");
      this.$axios
        .get("/api/app/cp/getByCode/" + val)
        .then(res => {
          let data = res.data;
          console.log("getbycode_res:", res);
          if (data.code == 0) {
            if (data.data.isUsed == 1) {
              Toast("券不存在或者已经被使用");
              console.log("券不存在或者已经被使用");
              this.cancelScan();
              this.usedis = false;
            } else {
              this.gowrite();
            }
          } else {
            Toast(data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //开始扫描
    startScan() {
      if (!window.plus) return;
      scan.start();
    },
    //关闭扫描
    cancelScan() {
      console.log("cancelScan");
      if (!window.plus) return;
      scan.cancel();
      this.closeScan();
    },
    //关闭条码识别控件
    closeScan() {
      console.log("closeScan");
      if (!window.plus) return;
      scan.close();
    },
    //返回home页面
    backhome() {
      console.log("backhome");
      if(this.isCamera){
        this.cancelScan();
      }
      this.$router.push({ name: "Home", params: {} });
    },
    //去核销页面
    gowrite() {
      if(this.isCamera){
        this.cancelScan();
      }
      let _parms = {};
      if (this.codenum) {
        _parms.code = this.codenum;
      }
      this.$router.push({ name: "Write", params: _parms });
    }
  },
  //销毁前运行
  beforeDestroy: function() {
    if(this.isCamera){
      this.cancelScan();
    }
  }
};
</script>
<style lang="less">
.scan {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #242628;
  .bcid {
    width: 100%;
    height: 90%;
    position: relative;
    left: 0;
    top: 0;
    // bottom: 10%;
    text-align: center;
    color: #fff;
    background: #000;
    .tishi {
      margin-top: 60%;
      button {
        margin-top: 40px;
      }
    }
  }
  footer {
    position: absolute;
    background: #242628;
    color: #fff;
    width: 100%;
    height: 100px;
    left: 0;
    bottom: 0;
    z-index: 2;
  }
  footer div {
    margin-top: 37px;
    float: left;
    width: 49%;
    text-align: center;
    height: 30px;
    line-break: 20px;
  }

  footer img {
    position: relative;
    width: 24px;
    height: 24px;
    margin-right: 10px;
    top: 5px;
  }
  .footerleft {
    border-right: 1px solid #fff;
  }
}
</style>

