<template>
  <div class="payment">
    <mt-header fixed title="缴费服务" class="hittop">
      <router-link slot="left" :to="{path:'home',query:{'ind':index}}">
        <mt-button icon="back"></mt-button>
      </router-link>
      <mt-button slot="right" @click="billCheck">历史账单</mt-button>
    </mt-header>

    <div class="history_money">
        <b><em>{{time | formatDate}}</em>月应缴服务费</b>
        <span>&yen;{{dataarr.totalService}}</span>
        <!-- <P>打款日:次月5号</P> -->
    </div>
    <div class="data_statistics">
        <p><span>{{time | formatDate}}</span><span>月已核销</span><span>{{total}}</span>张代金券，总额度<span>{{dataarr.totalPrice}}</span>元</p>
    </div>
    <div id="hisbeijin" class="hisbeijin"></div>
    <div class="hisbox" :style="{'-webkit-overflow-scrolling': scrollMode}">
        <ul id="history" class="history" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
          <li id="order_history" class="order_history" v-for="(item,index) in totalQuantity" :key="index">
              <div class="order_h_sublevel">
                  <div class="roder_left">
                      <b>{{item.couponAmount}}<span>元代金券</span></b>
                      <p><span>{{item.updateTime}}</span></p>
                  </div>
                  <div class="roder-right">
                      <span>&yen;{{practical(item.couponAmount)}}</span>
                  </div>
              </div>
          </li>
        </ul>
    </div>

  </div>
</template>

<script>
import { formatDate } from "../../../../untils/util";
import Vue from "vue";
import { MessageBox, Loadmore, Header,Indicator } from "mint-ui";
Vue.component(Loadmore.name, Loadmore);
import axios from "axios";
import qs from "qs";
import config from "../../../../untils/config/config";
import store from "@/vuex/store";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "Payment",
  data() {
    return {
      index: 2,
      page: 1,
      dataarr: {},
      total: "",
      totalQuantity: [],
      time: "",
      allLoaded: true,
      scrollMode: "auto",
      touchStartY: 0,
      distance: 0,
      topFlag: false, //是否到顶部
      bottomFlag: false, //是否到底部
      flag: true //节流阀
    };
  },
  filters: {
    formatDate() {
      var date = new Date();
      let mon = date.getMonth() + 1;
      let _data = formatDate(date, "yyyy-MM-dd hh:mm");
      return mon;
    }
  },
  store,
  components: {
    "v-loadmore": Loadmore
  },
  computed: {
    ...mapState(["userInfo", "shopId"])
  },
  methods: {
    practical: function(val) {
      return val / 10;
    },
    billCheck: function(e) {
      this.$router.push("/historyofthebill");
    },
    //獲取核銷數據
    getdata: function(val, type) {
      Indicator.open('数据加载中...');
      if (val == 1 || this.page ==1) {
        this.totalQuantity = [];
      }
      let date = new Date(),_this=this;
      let begain = formatDate(date, "yyyy/MM/dd");
      let _arr = begain.split("/");
      _arr[2] = "1";
      let _begainTime = _arr.join("/");

      let _end = new Date(this.$UTILS.dateConv(date)).getTime() + 86400000;
      _end = this.$UTILS.dateConv(new Date(_end));
      
      let obj = {
        shopId: this.shopId,
        begainTime: _begainTime,
        endTime: _end,
        page: val?val:this.page,
        // isBill: 1, //0未对账  1已对账
        rows: 10
      };
      let parms = "",
        _value = "";
      for (var key in obj) {
        _value += key + "=" + obj[key] + "&";
      }
      _value = _value.substring(0, _value.length - 1);
      this.$axios.get("api/app/hx/list?" + _value).then(res => {
        let _data = res.data.data;
        let lists = [];
        if (_data.list) {
          this.dataarr = _data.list[0];
          this.total = _data.total;
          lists = _data.list.slice(1, _data.list.length);
        }
        if (lists.length > 0) {
          for (let i = 0; i < lists.length; i++) {
            this.totalQuantity.push(lists[i]);
          }
          Indicator.close();
          if (lists.length < 9) {
            this.allLoaded = false;
          }
        } else {
          Indicator.close();
          this.allLoaded = false;
        }
      });
    },
    //获取顶部卷去高度
    getScrollTop() {
      var scrollTop = 0,
        bodyScrollTop = 0,
        documentScrollTop = 0;
      if (document.body) {
        bodyScrollTop = document.body.scrollTop;
      }
      if (document.documentElement) {
        documentScrollTop = document.documentElement.scrollTop;
      }
      scrollTop =
        bodyScrollTop - documentScrollTop > 0
          ? bodyScrollTop
          : documentScrollTop;
      return scrollTop;
    },
    //盒子总高度
    getScrollHeight() {
      var scrollHeight = 0,
        bodyScrollHeight = 0,
        documentScrollHeight = 0;
      if (document.body) {
        bodyScrollHeight = document.body.scrollHeight;
      }
      if (document.documentElement) {
        documentScrollHeight = document.documentElement.scrollHeight;
      }
      scrollHeight =
        bodyScrollHeight - documentScrollHeight > 0
          ? bodyScrollHeight
          : documentScrollHeight;
      return scrollHeight;
    },
    //屏幕可视高度
    getWindowHeight() {
      var windowHeight = 0;
      if (document.compatMode == "CSS1Compat") {
        windowHeight = document.documentElement.clientHeight;
      } else {
        windowHeight = document.body.clientHeight;
      }
      return windowHeight;
    },
    touchStart(e) {
      let dishesUl = document.getElementById("history");
      let bottomH =
        document.getElementById("hisbeijin").clientHeight;
      this.touchStartY = e.targetTouches[0].pageY;
      if (this.getScrollTop() == 0 && this.flag) {
        this.topFlag = true;
      } else {
        this.topFlag = false;
      }
      if (dishesUl.clientHeight < this.getWindowHeight() - bottomH - 5) {
        this.allLoaded = false;
        this.bottomFlag = false;
      }
      if (
        Math.abs(
          this.getScrollHeight() - this.getScrollTop() - this.getWindowHeight()
        ) < 5 &&
        this.allLoaded
      ) {
        this.bottomFlag = true;
      } else {
        this.bottomFlag = false;
      }
    },
    touchMove(e) {
      let dishesUl = document.getElementById("history");
      this.distance = Math.ceil(+e.targetTouches[0].pageY - this.touchStartY);
      if (this.distance > 0 && this.topFlag == true && this.flag) {
        if (this.distance > 100) {
          this.distance = 100;
        }
        dishesUl.style.transform =
          "translate3d(0px, " + this.distance + "px, 0px)";
      }
      if (this.distance < 0 && this.bottomFlag == true) {
        if (this.distance < -100) {
          this.distance = -100;
        }
        dishesUl.style.transform =
          "translate3d(0px, " + this.distance + "px, 0px)";
      }
    },
    touchEnd() {
      let dishesUl = document.getElementById("history"),
        _this = this;
      if (this.distance > 0 && this.topFlag == true && this.flag) {
        this.flag = false;
        let index = 100;
        let timer = setInterval(function() {
          if (index == 0) {
            clearInterval(timer);
            _this.flag = true;
            _this.distance = 0;
          }
          index--;
          dishesUl.style.transform = "translate3d(0px, " + index + "px, 0px)";
        }, 5);
        this.page = 1;
        this.allLoaded = true;
        this.getdata();
      }
      if (this.distance < 0 && this.bottomFlag == true) {
        let index = -100;
        let timer = setInterval(function() {
          if (index == 0) {
            clearInterval(timer);
          }
          index++;
          dishesUl.style.transform = "translate3d(0px, " + index + "px, 0px)";
        }, 5);
        ++this.page;
        this.getdata();
      }
    }
  },
  created: function() {
    const ua = navigator.userAgent.toLowerCase();
    if (/(iPhone|iPad|iPod|iOS)/i.test(ua)) {
      this.scrollMode = "touch";
    }
    this.ind = this.$route.params.ind;
    this.getdata();
  }
};
</script>


<style lang="less">
.payment {
  width: 100%;
  height: 100%;
  background: #ebebeb;
  overflow: scroll;
  .hittop{
    z-index: 2;
  }
  .mint-header-title {
    font-size: 34px;
  }
  .mint-button-text {
    font-size: 30px;
    padding-right: 28px;
  }
  .history_money {
    width: 100%;
    height: 224px;
    z-index: 1;
    background: #fff;
    background-color: #fc5e2d;
    position: fixed;
    left: 0;
    top: 80px;
    b:nth-child(1) {
      font-size: 30px;
      padding: 39px 0px 14px 0px;
      display: block;
      color: #fff;
      font-weight: 100;
    }
    // p:nth-child(3) {
    //   font-size: 24px;
    //   color: #fff;
    //   padding-top: 12px;
    // }
    span {
      font-size: 56px;
      color: #fff;
    }
  }
  .data_statistics {
    width: 100%;
    z-index: 1;
    background: #ebebeb;
    height: 96px;
    line-height: 96px;
    font-size: 26px;
    color: #808080;
    letter-spacing: 2px;
    position: fixed;
    left: 0;
    top: 300px;
  }
  .hisbeijin{
     height:317px;
  }
  .hisbox {
    margin-top:90px;
    width: 100%;
    background-color: #ebebeb;
    box-sizing: border-box;
    .history:before {
        content: "加载中..";
        position: absolute;
        left: 0;
        top: -50px;
        height: 20px;
        width: 100%;
      }
  }
  .order_h_sublevel:last-child {
    border-bottom: none;
  }
  .order_history {
    background: #fff;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .order_h_sublevel {
      width: 94%;
      height: 145px;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      letter-spacing: 2px;
      .roder_left {
        line-height: 50px;
        text-align: left;
        b {
          font-size: 30px;
        }
        p {
          font-size: 27px;
          color: #929292;
        }
      }
      .roder-right {
        font-size: 30px;
        padding-right: 39px;
      }
    }
  }
}
</style>


