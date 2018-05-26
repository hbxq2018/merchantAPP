<template>
  <div class="payment">
    <mt-header fixed title="缴费服务">
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
    <div class="loadBottom hisbox" :style="{'-webkit-overflow-scrolling': scrollMode}">
        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"  ref="loadmore">    
            <div class="order_history" v-for="(item,index) in totalQuantity" :key="index">
                <div class="order_h_sublevel">
                    <div class="roder_left">
                        <b>{{item.couponAmount}}<span>元代金券</span></b>
                        <p><span>{{item.updateTime}}</span></p>
                    </div>
                    <div class="roder-right">
                        <span>&yen;{{practical(item.couponAmount)}}</span>
                    </div>
                </div>
            </div>
        </mt-loadmore>
    </div>

  </div>
</template>

<script>
import { formatDate } from "../../../../untils/util";
import Vue from "vue";
import { MessageBox, Loadmore, Header } from "mint-ui";
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
      pag:'1',
      dataarr: {},
      total: "",
      totalQuantity: [],
      time: "",
      allLoaded: false,
      scrollMode: "auto" //移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动  
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
      'v-loadmore':Loadmore
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
    getdata: function(val,type) { //獲取核銷數據
      if(val == 1){
          this.totalQuantity = [];
      } 
      let date = new Date();
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
        page:val,
        rows:10
      };
      let parms = "",
        _value = "";
      for (var key in obj) {
        _value += key + "=" + obj[key] + "&";
      }
      _value = _value.substring(0, _value.length - 1);
      this.$axios.get("/api/app/hx/list?" + _value).then(res => {
        let _data = res.data.data;
        let lists=[];
        if (_data.list) {
          this.dataarr = _data.list[0];
          this.total = _data.total;
          lists = _data.list.slice(1, _data.list.length);
        }
        if(lists.length>0){
            for(let i=0;i<lists.length;i++){
                this.totalQuantity.push(lists[i])
            }
        }else{
            this.allLoaded = true;
        }
        
       
        if(type == 'top'){
            this.$refs.loadmore.onTopLoaded();
        }else if(type == 'bot'){
            this.$refs.loadmore.onBottomLoaded();
        }
      });
    },
    loadTop: function() {//下拉加载
      this.pag = 1;
      this.allLoaded = false;
      this.getdata(this.pag,'top')
    },
    loadBottom: function() {// 上拉加载
      ++this.pag;
      this.getdata(this.pag,'bot')
    }
  },
  created: function() {
    const ua = navigator.userAgent.toLowerCase();
    if (/(iPhone|iPad|iPod|iOS)/i.test(ua)) {
      this.scrollMode = 'touch';
    }
    this.getdata(this.pag)
  }
};
</script>


<style lang="less">
.payment {
  width: 100%;
  height: 100%;
  background: #ebebeb;
  overflow:scroll;
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
    background: #fff;
    padding-top: 88px;
    position: absolute;
    background-color: #fc5e2d;
      color: #fff;
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
    height: 96px;
    line-height: 96px;
    font-size: 26px;
    color: #808080;
    position: absolute;
    top: 312px;
    letter-spacing: 2px;
  }
  .hisbox{
    position: absolute;
    top: 400px;
    width: 100%;
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


