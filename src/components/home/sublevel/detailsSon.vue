<template>
  <div class="detailsSon">
      <mt-header fixed :title="name">
        <router-link to="/historyofthebill" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
      </mt-header>
      <div v-if="!first.totalService" class="nodata">本月没有产生服务费</div>
      <div v-else>
        <div class="detailsSon_top">
            <p>{{payment}}</p>
            <span>本月服务费：<em>&yen;{{first.totalService}}</em></span>
            <!-- <img src="../../../../static/images/murcielagoimg.png" alt="赞图标"> -->
        </div>
        <div class="murcielago">
            <p>本月已核销<span>{{total}}</span>张代金券，总额度<span>{{first.totalPrice}}</span>元</p>
        </div>
            <div class="loadBottom" :style="{'-webkit-overflow-scrolling': scrollMode}">
        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"  ref="loadmore"> 
        <div class="order_history" v-for="(item,index) in writedata" :key="index">
            <div class="order_h_sublevel">
                <div class="roder_left">
                    <b>{{item.couponAmount}}<span>元代金券</span></b>
                    <p>{{item.updateTime}}</p>
                </div>
                <div class="roder-right">
                    <span>&yen;{{item.couponAmount/10}}</span>
                </div>
            </div>
        </div>
        </mt-loadmore>
    </div>
     </div>
  </div>
</template>

<script>
import store from "@/vuex/store";
import Vue from "vue";
import {Loadmore } from "mint-ui";
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
      pag:1,
      allLoaded: false,
      scrollMode: "auto"
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
    getdata: function(val,type) { //獲取核銷數據
      if(val == 1){
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
        if (res.data.code == 0) {
          this.total = res.data.data.total;
          if (res.data.data.list) {
            let _data = res.data.data.list;
            this.first = _data[0];
            _data = _data.slice(1, _data.length);
            if(_data.length>0){
                for(let i=0;i<_data.length;i++){
                    this.writedata.push(_data[i]);
                }
            }else{
                 this.allLoaded = true;
            }
          }
          if(type == 'top'){
            this.$refs.loadmore.onTopLoaded();
          }else if(type == 'bot'){
            this.$refs.loadmore.onBottomLoaded();
          }
        }
      });
    },
    loadTop: function() {//下拉加载
      this.pag = 1;
      this.getdata(this.pag,'top')
    },
    loadBottom: function() {// 上拉加载
      ++this.pag;
      this.getdata(this.pag,'bot')
    }
  },
  created: function() {
    this.ind = this.$route.params.ind;
    this.getdata(this.pag)
  }
};
</script>

<style lang="less">
.detailsSon {
  width: 100%;
  height: 100%;
  background: #ebebeb;
  .nodata {
    margin-top: 80px;
    text-align: center;
    color: red;
    font-size: 35px;
  }
  .detailsSon_top {
    width: 100%;
    height: 224px;
    background: #fff;
    letter-spacing: 2px;
    line-height: 60px;
    position: relative;
    overflow: hidden;
    padding-top: 88px;
    p {
      font-size: 40px;
      color: #fc5e2d;
      padding-top: 60px;
    }
    span {
      font-size: 30px;
    }
    img {
      width: 183px;
      height: 183px;
      position: absolute;
      top: 108px;
      right: -10px;
    }
  }
  .murcielago {
    width: 100%;
    background: #ebebeb;
    height: 96px;
    font-size: 26px;
    color: #808080;
    line-height: 96px;
    letter-spacing: 2px;
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


