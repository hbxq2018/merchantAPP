<template>
    <div class="ihatetheqrcode">
        <mt-header title="店铺二维码"><router-link slot="left" :to="{path:'home',query:{'ind':index}}">
        <mt-button icon="back"></mt-button></router-link></mt-header>
        <div class="Standing one">
            <div class="homepage">
                <div><span>店铺主页</span></div>
                <img src="https://xq-1256079679.file.myqcloud.com/shopcode_ShopInfo242542.jpg" alt="">
                <div><a href="#" id="dainija" @click="preservess"><button class="preserve">保存图片</button></a></div>
            </div>
        </div>
        <div class="Standing eventual">
            <div class="homepage">
                <div><span>支付二维码</span></div>
                <img src="https://xq-1256079679.file.myqcloud.com/shopcode_ShopInfo242542.jpg" alt="">
                <div><a href=""><button  class="preserve">保存图片</button></a></div>
            </div>
        </div>
    </div>
</template>

<script>
import store from "@/vuex/store";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "Ihatetheqrcode",
  data() {
    return {
      index: 2,
      msg: "Manual"
    };
  },
  computed: {
    ...mapState(["userInfo", "shopInfo"])
  },
  methods: {
    ...mapMutations(["setuserInfo", "setshopId", "setshopInfo"]),
    // preservess: function(e) {
    //   document.getElementsById("dainija").href =
    //     "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528092487640&di=74fd26c701c600238645d08c3954c4e0&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01635d571ed29832f875a3994c7836.png%40900w_1l_2o_100sh.jpg";
    // }
    getshopinfo: function() {
      //获取商家信息
      this.$axios.get("/app/shop/CreateCode" + this.shopId).then(res => {
        if (res.data.code == "0") {
          let data = res.data.data;
          this.setuserInfo(data);
        }
      });
    }
  }
};
</script>
<style lang="less">
.ihatetheqrcode {
  width: 100%;
  height: auto;
  background-color: #fc5e2d;
  .Standing {
    height: 640px;
    display: flex;
    align-items: center;
    justify-content: center;
    .homepage {
      width: 614px;
      height: 614px;
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
      height: 90px;
      line-height: 90px;
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

