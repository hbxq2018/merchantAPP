<template>
  <div class="scan">
    <div id="bcid">
      <div style="height:40%"></div>
      <p class="tip">...载入中...</p>
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
import { Toast } from "mint-ui";
let scan = null;
export default {
  name: "Scan",
  data() {
    return {
      codeUrl: "",
      codenum: ""
    };
  },
  created: function() {},
  mounted: function() {
    this.startRecognize();
  },
  methods: {
    //创建扫描控件
    startRecognize() {
      let that = this;
      if (!window.plus) return;
      scan = new plus.barcode.Barcode("bcid");
      scan.onmarked = onmarked;
      that.startScan();
      function onmarked(type, result, file) {
        if (type == 0) {
          let arr = result.split("/");
          console.log("arr:", arr);
          console.log("arr.length-1:", arr[arr.length - 1]);
          console.log(typeof arr[arr.length - 1]);
          if (typeof (arr[arr.length - 1] * 1) == "number") {
            that.codenum = arr[arr.length - 1]; //获取券码
            that.getbycode(that.codenum);
          } else {
            console.log("不是正确的券码");
          }
        } else {
          console.log("请扫描二维码");
        }
      }
    },
    getbycode: function(val) { //获取票券信息
      this.$axios
        .get("/api/app/cp/getByCode/" + val)
        .then(res => {
          let data = res.data;
          console.log('res:',res)
          if (data.code == 0) {
            if(data.data.isUsed == 1){
              Toast("券不存在或者已经被使用");
            }else{
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
    startScan() {//开始扫描
      if (!window.plus) return;
      scan.start();
    },
    
    cancelScan() {//关闭扫描
      if (!window.plus) return;
      scan.cancel();
      this.closeScan();
    },
   
    closeScan() { //关闭条码识别控件
      if (!window.plus) return;
      scan.close();
    },
    
    backhome() {//返回home页面
      this.cancelScan();
      this.$router.push({ name: "Home", params: {} });
    },
   
    gowrite(){ //去核销页面
      this.cancelScan();
      let _parms = {}
      if(this.codenum){
        _parms.code=this.codenum
      }
      console.log('_parms:',_parms)
      this.$router.push({ name: "Write", params:_parms });
    }
  }
};
</script>
<style lang="less">
.scan {
  height: 100%;
  color: #fff;
  #bcid {
    width: 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 80px;
    text-align: center;
    color: #fff;
    background: #ccc;
  }
  footer {
    position: absolute;
    background: #242628;
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

