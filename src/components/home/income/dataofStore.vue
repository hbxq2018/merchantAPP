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
            <span>2018-07-01</span>
            <span>至</span>
            <span>2018-07-01</span>
        </div>
        <div class="top_order">订单数23412，核销券数124552，总计</div>
        <div class="top_money">
          <span>￥</span>
          <span class="moneyNum">301,240.00</span>
        </div>
      </div>
      <div class="content_list">
        <div class="list_num">分店(4)</div>
        <div class="list_item">
          <div class="item_top">
            <span class="item_top_l">小龙坎火锅</span>
            <span>历史数据</span>
          </div>
          <div class="item_cont">
            <div class="item_cont_sub">
              <div class="item_tit">
                <span>今日营收</span>
                <img src="../../../../static/images/home_arrow.png" alt="">
              </div>
              <div class="item_money"><span>￥</span>3,500.00</div>
              <div class="item_rate">
                <span>16.7%</span>
                <img src="../../../../static/images/up.png" alt="">
              </div>
              <div class="item_order">
                <span>订单数</span>
                <span class="order_num">30</span>
              </div>
              <div class="item_order item_qrcode">
                <span>券核销数</span>
                <span class="order_num">24</span>
              </div>
            </div>
            <div class="item_cont_sub">
              <div class="item_tit">
                <span>今日营收</span>
                <img src="../../../../static/images/home_arrow.png" alt="">
              </div>
              <div class="item_money"><span>￥</span>3,500.00</div>
              <div class="item_rate"></div>
              <div class="item_order">
                <span>订单数</span>
                <span class="order_num">30</span>
              </div>
              <div class="item_order item_qrcode">
                <span>券核销数</span>
                <span class="order_num">24</span>
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
Vue.component(Loadmore.name, Loadmore);
import store from "@/vuex/store";
import { mapState, mapMutations } from "vuex";
export default {
  name: "DataofStore",
  data() {
    return {
      income: [
        {
          name: "今日营收",
          money: "3,500.00",
          orderNum: "24",
          qrcodeNum: "30",
          rate: "16.7%"
        },
        {
          name: "昨日营收",
          money: "600.00",
          orderNum: "16",
          qrcodeNum: "12",
          rate: "4.1%"
        }
      ]
    };
  },
  created: function() {},
  components: {
    newtime: function() {
      return (newtime = this.start + this.end);
    }
  },
  watch: {},
  store,
  computed: {
    ...mapState(["shopId"])
  },
  methods: {}
};
</script>

<style lang="less">
.dataofStore {
  background-color: #ebebeb;
  box-sizing: border-box;
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
        .item_top {
          display: flex;
          justify-content: space-between;
          height: 66px;
          line-height: 66px;
          padding: 0 28px 0 32px;
          color: #FC5E2D;
          font-size: 24px;
          border-bottom: 1px solid #E0E0E0;
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