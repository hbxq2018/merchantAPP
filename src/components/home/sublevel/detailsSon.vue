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
        <p>本月服务费：¥{{money | changemoney}}</p>
      </div>
      <div class="detailsSon_top"  v-if="isbill != 1">
        <p>{{this.$route.params.ind}}月剩余应缴服务费</p>
        <p>¥{{diff  | changemoney}}</p>
        <p>本月总服务费¥{{money}}，已缴¥{{service  | changemoney}}</p>
      </div>
      <div class="murcielago" v-if="first.totalService">
          <p>本月已核销<span>{{total}}</span>张代金券</p>
      </div>
    </div>
    <div class="detasbj" id="detasbj"></div>
    <div class="detabox" :style="{'-webkit-overflow-scrolling': scrollMode,height:oDvheight}">
      <!-- <ul v-if="writedata.length>0" id="detasonul" class="detasonul" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd"> -->
         <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :autoFill="false" ref="sonmore">
             <ul v-if="writedata.length>0">
	        <li class="order_history" v-for="(item,index) in writedata" :key="index">
	            <div class="order_h_sublevel">
	                <div class="roder_left">
	                    <!-- <b>{{item.couponAmount}}<span>元代金券</span></b> -->
	                    <b>{{item.skuName}}</b>
	                    <p>{{item.updateTime}}</p>
	                </div>
	                <div class="roder-right">
	                    <span>&yen;{{item.servicePrice | changemoney}}</span>
	                </div>
	            </div>
	        </li>
      	     </ul>
      	     <img v-else class="emtpy" :src="url" alt="什么都没有">
         </mt-loadmore>
      
    </div>
  </div>
</template>

<script>
import store from "@/vuex/store";
import Vue from "vue";
import { Loadmore ,Indicator ,Toast} from "mint-ui";
Vue.component(Loadmore.name, Loadmore);
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  data() {
    return {
      payment: "",
      diff:'',
      total: "",
      first: {},
      writedata: [],
      url: require('../../../../static/images/zhanweitu.png'),
      ind: 1,
      page: 1,
      service:0,
      totalNoService:0,
      isbill:0,
      allLoaded: false,
      oDvheight:'0px',
      scrollMode: "auto"
    };
  },
  store,
  filters: {
    changemoney:function(val){
      val = val*1;
      val=val.toFixed(2);
      let result=addCommas(val),x='', x1=0,x2=0;
      function addCommas(nStr){
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + ',' + '$2');
        } 
        val = x1 + x2;
        return val;
      }
      return result;
    }
  },
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
      let _start = "2018/" + this.ind + "/01",isSuccess = false;
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
      setTimeout(() => {
      if (!isSuccess) {
          isSuccess = false;
          Indicator.close();
          Toast("网络异常，请检查网络连接");
        }
      }, Delay);
      this.$axios.get("/api/app/hx/list?" + _value).then(res => {
        isSuccess= true;
        Indicator.close();
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
              if (_data.length < 9) {
                this.allLoaded = false;
              }
            } else {
              Toast("没有更多数据了");
              this.allLoaded = true;
            }
          } else {
            this.allLoaded = true;
          }
        }
      });
    },
    //下拉
    loadTop() {
      this.page = 1;
      this.allLoaded = false;
      this.list = [];
      this.getdata();
      this.$refs.sonmore.onTopLoaded();
    },
    //上拉
    loadBottom() {
      this.page += 1;
      this.getdata();
      this.$refs.sonmore.onBottomLoaded();
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
    this.diff = (this.money*1-this.service*1).toFixed(2);
    this.getdata(this.pag);
  }
};
</script>

<style lang="less">
.detailsSon {
  width: 100%;
  height: 100%;
  background: #ebebeb;
  overflow: scroll;
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
  .detasbj{
    width: 100%;
    height: 412px;
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


