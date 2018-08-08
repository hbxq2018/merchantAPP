<template>
    <div class="ihatetheqrcode">
        <mt-header fixed title="店铺二维码"><router-link slot="left" :to="{path:'home',query:{'ind':index}}">
        <mt-button icon="back"></mt-button></router-link></mt-header>
        <div class="Standing one">
            <div class="homepage">
                <div><span>店铺主页</span></div>
                <img v-if='imgs.商家详情无背景图' @touchstart="savepage(1)" @touchend="clearLoop" :src="imgs.商家详情无背景图" alt="店铺主页二维码图片">
                <div>长按保存二维码</div>
            </div>
        </div>
        <div class="Standing eventual">
            <div class="homepage">
                <div><span>支付二维码</span></div>
                <img v-if='imgs.商家买单无背景图' @touchstart="savepage(2)" :src="imgs.商家买单无背景图" alt="支付二维码图片">
                <div>长按保存二维码</div>
            </div>
        </div>
    </div>
</template>

<script>
import store from "@/vuex/store";
import { mapState, mapMutations, mapGetters} from "vuex";
import {Indicator} from "mint-ui";
export default {
  name: "Ihatetheqrcode",
  data() {
    return {
      index: 2,
      msg: "Manual",
      imgs:{}
    };
  },
  store,
  computed: {
    ...mapState(["userInfo", "shopInfo"])
  },
  methods: {
    ...mapMutations(["setuserInfo", "setshopId", "setshopInfo"]),
    getshopinfo: function() {
      //获取商家信息
      this.$axios.get("/app/shop/CreateCode" + this.shopId).then(res => {
        if (res.data.code == "0") {
          let data = res.data.data;
          this.setuserInfo(data);
        }
      });
    },
    getshopimgs:function(){
      Indicator.open({
        text: '图片加载中...',
        spinnerType: 'fading-circle'
      })
      this.$axios.get(this.$GLOBAL.API+"app/shop/CreateCode?id=" + this.userInfo.id+'&shopCode='+this.userInfo.shopCode).then(res => {
        if(res.data.code == 0){
            Indicator.close();
            this.imgs = res.data.data;
        }
      });
    },
    savepage: function(val) {
      let _this = this;
      clearInterval(this.Loop); //再次清空定时器，防止重复注册定时器
      this.Loop = setTimeout(function() {
        _this.downloadIamge("canvas", name,val);
      }, 1000);
    },
    clearLoop() {
      clearInterval(this.Loop);
    },
    downloadIamge(selector, name,val) {
      // 通过选择器获取img元素
      var img = document.querySelector(selector),url = '';
      // 将图片的src属性作为URL地址
      if(val ==1){
        url = this.imgs.商家详情有背景图;
      }else if(val ==2){
        url = this.imgs.商家买单有背景图;
      }
      var a = document.createElement("a");
      var event = new MouseEvent("click");
      a.download = name || name;
      a.href = url;
      a.dispatchEvent(event);
    }
  },
   created() {
    this.getshopimgs();
  }
};
</script>
<style lang="less">
.ihatetheqrcode {
  width: 100%;
  height: auto;
  padding-top: 100px;
  background-color: #fc5e2d;
  .Standing {
    height: 540px;
    display: flex;
    margin-top: 60px;
    align-items: center;
    justify-content: center;
    .homepage {
      width: 514px;
      height: 514px;
      background-color: #fff;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      span {
        font-size: 30px;
        margin-top: 40px;
      }
      img {
        width: 420px;
        height: 420px;
        -webkit-touch-callout: default;
      }
      .preserve {
        width: 180px;
        height: 52px;
        text-align: center;
        border: 1px solid #fc5e2d;
        background-color: #fff;
        color: #fc5e2d;
        font-size: 30px;
        letter-spacing: 2px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }
    }
    .homepage div {
      height: 80px;
      line-height: 80px;
    }
  }
  .one {
    margin-top: 30px;
  }
  .eventual {
    padding-bottom: 60px;
  }
}
</style>