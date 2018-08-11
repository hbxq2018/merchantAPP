<template>
    <div class="annal">
        <mt-header fixed title="缴费记录">
          <router-link slot="left" :to="{path:'payment'}">
            <mt-button icon="back"></mt-button>
          </router-link>
        </mt-header>
        <div :class="list.length?'ann-cont':'ann-cont actann-cont'">
          <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :autoFill="false" ref="annal">
            <ul v-if="list.length>0">
              <li class="item" v-for="(item,index) in list" :key="index" :id='index'>
                  <div class="item-left">
                      <p class="left-one">缴费</p>
                      <p class="left-two">{{item.updateTime}}</p>
                  </div>
                  <div class="item-right">
                      {{item.servicePrice  | changemoney}}
                  </div>
              </li>
            </ul>
            <img v-else class="empty" src="../../../../static/images/zhanweitu.png" alt="空空如也">
          </mt-loadmore>
        </div>
    </div>
</template>

<script>
import store from "@/vuex/store";
import { mapState, mapMutations, mapGetters } from "vuex";
import { Indicator } from "mint-ui";
export default {
  name: "annal",
  data() {
    return {
      beginTime: "",
      endTime: "",
      page: 1,
      allLoaded: false,
      list: []
    };
  },
  filters: {
    changemoney: function(val) {
      val = val * 1;
      val = val.toFixed(2);
      let result = addCommas(val),
        x = "",
        x1 = 0,
        x2 = 0;
      function addCommas(nStr) {
        nStr += "";
        x = nStr.split(".");
        x1 = x[0];
        x2 = x.length > 1 ? "." + x[1] : "";
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
          x1 = x1.replace(rgx, "$1" + "," + "$2");
        }
        val = x1 + x2;
        return val;
      }
      return result;
    }
  },
  store,
  computed: {
    ...mapState(["userInfo","shopInfo"])
  },
  methods: {
    ...mapMutations(["setuserInfo"]),
    //获取缴费记录列表数据
    amountList() {
      Indicator.open('数据加载中...');
      let _this = this;
      this.$axios
      // .get("/api/app/serviceAmount/allByShopId?shopId="+this.userInfo.id+"&&page="+this.page+"&rows=10")
        .get("/api/app/serviceAmount/allByShopId?shopId="+this.shopInfo.shopId+"&page="+this.page+"&rows=10")
        .then(res => {
          Indicator.close();
          if (res.data.code == 0) {
            if (res.data.data && res.data.data.length > 0) {
              let _list = res.data.data;
              for (let i in _list) {
                this.list.push(_list[i]);
              }
            } else {
              console.log('23')
              this.allLoaded = true; // 若数据已全部获取完毕
            }
          } else {
            this.allLoaded = true; // 若数据已全部获取完毕
          }
        });
    },
    //下拉
    loadTop() {
      this.page = 1;
      this.allLoaded = false;
      this.list = [];
      this.amountList();
      this.$refs.annal.onTopLoaded();
    },
    //上拉
    loadBottom() {
      this.page += 1;
      this.amountList();
      this.$refs.annal.onBottomLoaded();
    }
  },
  created() {
    this.amountList();
  }
};
</script>

<style lang="less">
.annal {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #ebebeb;
  overflow: scroll;
  .ann-cont {
    padding-top: 80px;
    width: 100%;
    background: #fff;
    .empty{
      width: 50%;
      margin-top: 40%;
    }
    .item {
      width: 676px;
      height: 90px;
      padding: 15px 37px;
      border-bottom: 1px solid #ebebeb;
      .item-left {
        width: 70%;
        height: 100%;
        float: left;
        & > p {
          height: 40px;
          line-height: 40px;
          text-align: left;
          overflow: hidden;
        }
      }
      .item-right {
        text-align: right;
        width: 30%;
        height: 100%;
        line-height: 90px;
        color: #191919;
        font-size: 36px;
        float: right;
      }
    }
  }
  .actann-cont{
    background: none;
  }
}
</style>








