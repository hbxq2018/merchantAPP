<template>
  <div class="detailsSon">
    <div class="details" id="sonbeijin">
      <mt-header fixed :title="name">
        <router-link to="/historyofthebill" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
      </mt-header>
      <div v-if="isbill == 1" class="nodata">
        <p>本月服务已缴清</p>
        <p>本月服务费：¥{{money}}</p>
      </div>
      <div class="detailsSon_top"  v-if="isbill != 1">
        <p>4月剩余应缴服务费</p>
        <p>¥{{money}}</p>
        <p>本月总服务费¥{{money}}，已缴¥{{service}}</p>
      </div>
      <div class="murcielago" v-if="first.totalService">
          <p>本月已核销<span>{{total}}</span>张代金券</p>
      </div>
    </div>

    <div v-if="first.totalService" class="detabox" :style="{'-webkit-overflow-scrolling': scrollMode}">
      <ul id="detasonul" class="detasonul" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
        <li class="order_history" v-for="(item,index) in writedata" :key="index">
            <div class="order_h_sublevel">
                <div class="roder_left">
                    <b>{{item.couponAmount}}<span>元代金券</span></b>
                    <p>{{item.updateTime}}</p>
                </div>
                <div class="roder-right">
                    <span>&yen;{{item.servicePrice}}</span>
                </div>
            </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import store from "@/vuex/store";
import Vue from "vue";
import { Loadmore ,Indicator} from "mint-ui";
Vue.component(Loadmore.name, Loadmore);
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  data() {
    return {
      payment: "",
      total: "",
      first: {},
      writedata: [],
      ind: 1,
      page: 1,
      service:0,
      totalNoService:0,
      isbill:0,
      allLoaded: true,
      scrollMode: "auto",
      touchStartY: 0,
      distance: 0,
      topFlag: false, //是否到顶部
      bottomFlag: false, //是否到底部
      flag: true //节流阀
    };
  },
  store,
  computed: {
    ...mapState(["shopId"]),
    name() {
      return `${this.$route.params.ind}月账单详情`;
    }
  },
  methods: {
    //獲取核銷數據
    getdata: function( type) {
      Indicator.open('数据加载中...');
      if (this.page == 1) {
        this.writedata = [];
      }
      let _start = "2018/" + this.ind + "/01";
      let _end = "";
      let _ind = this.ind * 1 + 1;
      if (_ind < 13) {
        _end = "2018/" + _ind + "/01";
      } else {
        _end = "2018/01/01";
      }
      let obj = {
        shopId: this.shopId,
        begainTime: _start,
        endTime: _end,
        page: this.page,
        rows: 10
      };
      if(this.isbill ==1){
        obj.isBill=1;
      }
      let parms = "",
        _value = "";
      for (var key in obj) {
        _value += key + "=" + obj[key] + "&";
      }
      _value = _value.substring(0, _value.length - 1);
      this.$axios.get("api/app/hx/list?" + _value).then(res => {
        if (res.data.code == 0) {
          this.total = res.data.data.total;
          if (res.data.data.list) {
            let _data = res.data.data.list;
            this.first = _data[0];
            _data = _data.slice(1, _data.length);
            if (_data.length > 0) {
              for (let i = 0; i < _data.length; i++) {
                this.writedata.push(_data[i]);
              }
              Indicator.close();
              if (_data.length < 9) {
                this.allLoaded = false;
              }
            } else {
              this.allLoaded = false;
            }
          } else {
            Indicator.close();
            this.allLoaded = false;
          }
        }else{
          Indicator.close();
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
      let dishesUl = document.getElementById("detasonul");
      let bottomH = document.getElementById("sonbeijin").clientHeight;
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
      let dishesUl = document.getElementById("detasonul");
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
      let dishesUl = document.getElementById("detasonul"),
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
    this.isbill = this.$route.params.isBill;
    this.money = this.$route.params.money;
    this.totalNoService = this.$route.params.totalNoService;
    this.service=(this.money*1-this.totalNoService*1).toFixed(2);
    this.getdata(this.pag);
  }
};
</script>

<style lang="less">
.detailsSon {
  width: 100%;
  height: 100%;
  background: #ebebeb;
  .nodata {
    width: 100%;
    height: 224px;
    padding-top: 80px;
    text-align: center;
    font-size: 35px;
    background: #fff;
    p{margin: 16px 0;}
    p:nth-child(1){
      color: #FC5E2D;
      font-size: 40px;
      margin-top: 40px;
    }
    p:nth-child(2){
      color: #191919;
      font-size: 30px;
    }
  }
  .detailsSon_top {
    width: 100%;
    height: 224px;
    background: #fff;
    padding-top: 80px;
    p{margin: 20px 0;}
    p:nth-child(1){
      color: #191919;
      font-size: 30px;
    }
    p:nth-child(2){
      color: #191919;
      font-size: 56px;
    }
    p:nth-child(3){
      color:#FC5E2D;
      font-size: 24px;
    }
  }
  .details {
    width: 100%;
    height: 412px;
    z-index: 99999;
    position: fixed;
  }
  .songe{
    width: 100%;
    height: 420px;
  }
  .murcielago {
    width: 100%;
    position: fixed;
    top: 300px;
    background: #ebebeb;
    height: 96px;
    font-size: 26px;
    color: #808080;
    line-height: 96px;
    letter-spacing: 2px;
  }
  .detabox {
    width: 100%;
    padding-top:400px; 
    .detasonul:before {
        content: "加载中..";
        position: absolute;
        left: 0;
        top: -50px;
        height: 20px;
        width: 100%;
      }
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


