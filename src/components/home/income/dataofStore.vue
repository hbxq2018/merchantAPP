<template>
  <div class="dataofStore">
    <div class="daily_header">
      <mt-header fixed title="分店数据" class="header_inner">
          <router-link to="/income" slot="left">
              <mt-button icon="back"></mt-button>
          </router-link>
      </mt-header>
    </div>
    <div class="daily_content">
      <div class="content_top">
        <div class="top_day">
            <span>{{today}}(今日)</span>
            <!-- <span>至</span>
            <span>{{tomorrow}}</span> -->
        </div>
        <div class="top_order">订单数{{totalOrder}}，核销券数{{totalCode}}，总计</div>
        <div class="top_money">
          <span>￥</span>
          <span class="moneyNum">{{totalMoney}}</span>
        </div>
      </div>
      <div class="content_list">
        <div class="list_num">分店({{subList.length}})</div>
        <div class="list_item" v-for="(item,index) in subList" :key="index">
          <div class="item_top">
            <span class="item_top_l">{{item.shopName}}</span>
            <span @click="historyData(item.id)">历史数据</span>
          </div>
          <div class="item_cont">
            <div class="item_cont_sub">
              <div class="item_tit" @click="incomeDetail(1, item.id, '今日')">
                <span>今日营收</span>
                <img src="../../../../static/images/home_arrow.png" alt="">
              </div>
              <div class="item_money"><span>￥</span>{{item.soAmount}}</div>
              <div class="item_rate">
                <span :class="item.rate > 0 ? '' : 'down'">{{item.rate==0?'持平':Math.abs(item.rate)+'%'}}</span>
                <img v-if="item.rate > 0" src="../../../../static/images/up.png" alt="">
                <img v-if="item.rate < 0" src="../../../../static/images/down.png" alt="">
                <img v-if="item.rate == 0" src="../../../../static/images/levelOff.png" alt="" style="height: 4px;vertical-align: middle;">
              </div>
              <div class="item_order">
                <span>订单数</span>
                <span class="order_num">{{item.solist}}</span>
              </div>
              <div class="item_order item_qrcode">
                <span>券核销数</span>
                <span class="order_num">{{item.soWriteoffList}}</span>
              </div>
            </div>
            <div class="item_cont_sub">
              <div class="item_tit" @click="incomeDetail(2, item.id, '昨日')">
                <span>昨日营收</span>
                <img src="../../../../static/images/home_arrow.png" alt="">
              </div>
              <div class="item_money"><span>￥</span>{{item.preSoAmount}}</div>
              <div class="item_rate"></div>
              <div class="item_order">
                <span>订单数</span>
                <span class="order_num">{{item.preSolist}}</span>
              </div>
              <div class="item_order item_qrcode">
                <span>券核销数</span>
                <span class="order_num">{{item.preSoWriteoffList}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { DatetimePicker, Toast, Loadmore, Indicator } from "mint-ui";
Vue.component(DatetimePicker.name, DatetimePicker);
import store from "@/vuex/store";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "DataofStore",
  data() {
    return {
      today: "",
      yesterday: "",
      tomorrow: "",
      subList: [],
      totalMoney: 0,
      totalOrder: 0,
      totalCode: 0
    };
  },
  store,
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    ...mapMutations(["setuserInfo"]),
    // 查询分店数据
    subbranch() {
      let _this = this,
        _val =
          "id=" +
          _this.userInfo.id +
          "&beginTime=" +
          _this.today +
          "&endTime=" +
          _this.tomorrow,
        _param =
          "id=" +
          this.userInfo.id +
          "&beginTime=" +
          this.yesterday +
          "&endTime=" +
          this.today;
      this.$axios.get("/api/app/shop/getByShopId?" + _val).then(res => {
        if (res.data.code == 0) {
          let data = res.data.data;
          _this.totalMoney = _this.changemoney(data[0].allsoAmount);
          _this.totalOrder = data[0].allsolist;
          _this.totalCode = data[0].allsoWritelist;
           for (let i = 0; i < data.length; i++) {
            _this.subList.push({
              id: data[i].id,
              shopName: data[i].shopName,
              soAmount: _this.changemoney(data[i].soAmount),
              solist: data[i].solist,
              soWriteoffList: data[i].soWriteoffList,
              preSoAmount: "",
              preSolist: "",
              preSoWriteoffList: ""
            });
          }
          _this.$axios.get("/api/app/shop/getByShopId?" + _param).then(res => {
            if (res.data.code == 0) {
              let list = res.data.data;
              for (let i = 0; i < list.length; i++) {
                _this.subList[i].preSoAmount = _this.changemoney(list[i].soAmount);
                _this.subList[i].preSolist = list[i].solist;
                _this.subList[i].preSoWriteoffList = list[i].soWriteoffList;
                let today = +_this.subList[i].soAmount, yester = +_this.subList[i].preSoAmount;
                _this.subList[i].rate = ((today - yester) / (yester == 0 ? 1 : yester) * 100).toFixed(2);
              }
            }
          });
        }
      });
    },
    //查看历史数据
    historyData(id) {
      let money = "", orderNum = "", qrcodeNum = "";
      for(let i = 0; i < this.subList.length; i++) {
        if(this.subList[i].id == id) {
          money = this.subList[i].soAmount;
          orderNum = this.subList[i].solist;
          qrcodeNum = this.subList[i].soWriteoffList;
        }
      }
      this.$router.push({
        name: "DataRecode",
        params: { 
          shopId: id,
          money: money,
          orderNum: orderNum,
          qrcodeNum: qrcodeNum
        }
      });
    },
    // 查看今日/昨日数据
    incomeDetail(time, id, dateName) {
      let money = "", orderNum = "", qrcodeNum = "";
      for(let i = 0; i < this.subList.length; i++) {
        if(this.subList[i].id == id) {
          money = dateName == '今日' ? this.subList[i].soAmount : this.subList[i].preSoAmount;
          orderNum = dateName == '今日' ? this.subList[i].solist : this.subList[i].preSolist;
          qrcodeNum = dateName == '今日' ? this.subList[i].soWriteoffList : this.subList[i].preSoWriteoffList;
        }
      }
      this.$router.push({
        name: "DailyRevenue",
        params: {
          shopId: id,
          beginTime: time == 1 ? this.today : this.yesterday,
          endTime: time == 1 ? this.tomorrow : this.today,
          money: money,
          orderNum: orderNum,
          qrcodeNum: qrcodeNum,
          name: dateName
        }
      });
    },
    //yyyy-MM-dd时间转换
    formatDate(data) {
      var month = data.getMonth() + 1;
      var strDate = data.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = data.getFullYear() + "-" + month + "-" + strDate;
      return currentdate;
    },
    //money转化
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
  created() {
    this.today = this.formatDate(new Date());
    this.yesterday = this.formatDate(
      new Date(new Date().setDate(new Date().getDate() - 1))
    );
    this.tomorrow = this.formatDate(
      new Date(new Date().setDate(new Date().getDate() + 1))
    );
    this.subbranch();
  }
};
</script>

<style lang="less">
.dataofStore {
  background-color: #ebebeb;
  height: auto !important;
  .daily_header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 80px;
    z-index: 1000;
    background-color: #fc5e2d;
    .header_inner {
      height: 80px;
    }
  }
  .daily_content {
    padding: 108px 32px 0 30px;
    .content_top {
      background-color: #fff;
      height: 344px;
      width: 100%;
      border-radius: 8px;
      .top_day {
        padding: 52px 0 60px 0;
        color: #191919;
      }
      .top_order {
        color: #555555;
        font-size: 26px;
      }
      .top_money {
        margin-top: 50px;
        color: #e4b03f;
        font-size: 36px;
        .moneyNum {
          font-size: 48px;
          margin-left: -10px;
        }
      }
    }
    .content_list {
      padding: 0;
      box-sizing: border-box;
      .list_num {
        height: 72px;
        line-height: 72px;
        text-align: center;
        color: #555555;
        font-size: 26px;
      }
      .list_item {
        background-color: #fff;
        border-radius: 8px;
        margin-bottom: 20px;
        .item_top {
          display: flex;
          justify-content: space-between;
          height: 66px;
          line-height: 66px;
          padding: 0 28px 0 32px;
          color: #fc5e2d;
          font-size: 24px;
          border-bottom: 1px solid #e0e0e0;
          .item_top_l {
            color: #191919;
            font-size: 28px;
            font-weight: 600;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            width: 460px;
            text-align: left;
          }
        }
        .item_cont {
          display: flex;
          flex-direction: row;
          height: 392px;
          width: 100%;
          .item_cont_sub {
            text-align: left;
            width: 50%;
            padding-left: 32px;
            box-sizing: border-box;
            .item_tit {
              font-size: 26px;
              color: #191919;
              margin: 46px 0 38px 0;
              img {
                width: 12px;
                height: 22px;
                vertical-align: middle;
                margin-top: -4px;
              }
            }
            .item_money {
              font-size: 42px;
              color: #e4b03f;
              margin-left: -6px;
              span {
                font-size: 36px;
              }
            }
            .item_rate {
              color: #ff0000;
              height: 92px;
              line-height: 92px;
              font-size: 24px;
              .down {
                color: #16db32;
              }
              img {
                width: 22px;
                height: 20px;
              }
            }
            .item_order {
              font-size: 24px;
              color: #808080;
              .order_num {
                color: #191919;
                margin-left: 22px;
                font-weight: 600;
              }
            }
            .item_qrcode {
              margin-top: 26px;
            }
          }
        }
      }
    }
  }
  width: 100%;
  height: 100%;
  font-family: "微软雅黑";
  font-size: 24px;
}
</style>