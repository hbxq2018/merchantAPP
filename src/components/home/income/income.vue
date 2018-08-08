<template>
  <div class="income">
    <div class="income_header">
      <mt-header fixed title="营业数据" class="header_inner">
          <router-link to="/home" slot="left">
              <mt-button icon="back"></mt-button>
          </router-link>
      </mt-header>
    </div>
    <div class="income_content">
      <div class="content_top">
        <div class="content_top_item" v-for="(item,index) in income" :key="index">
          <div class="item_tit" @click="toDetail">
            <span>{{item.name}}</span>
            <img src="../../../../static/images/home_arrow.png" alt="">
          </div>
          <div class="item_money"><span>￥</span>{{item.money}}</div>
          <div class="item_rate">
            <span>{{item.rate}}</span>
            <img src="../../../../static/images/up.png" alt="">
          </div>
          <div class="item_order">
            <span>订单数</span>
            <span class="order_num">{{item.orderNum}}</span>
          </div>
          <div class="item_order item_qrcode">
            <span>券核销数</span>
            <span class="order_num">{{item.qrcodeNum}}</span>
          </div>
        </div>
      </div>
      <div class="content_list">
        <div class="list_item" @click="toDataRecode">
          <div class="list_item_l">
            <img src="../../../../static/images/account.png" alt="">
            <div>数据记录</div>
          </div>
          <img class="list_item_r" src="../../../../static/images/home_arrow.png" alt="">
        </div>
        <div class="list_item" @click="toDataofStore" v-if="isSub == 1">
          <div class="list_item_l">
            <img src="../../../../static/images/account_sub.png" alt="">
            <div>分店数据</div>
          </div>
          <img class="list_item_r" src="../../../../static/images/home_arrow.png" alt="">
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
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "Income",
  data() {
    return {
      isSub: 0,
      today: '',
      yesterday: '',
      income: [
        {
          name: '今日营收',
          money: '3,500.00',
          orderNum: '24',
          qrcodeNum: '30',
          rate: '16.7%'
        },
        {
          name: '昨日营收',
          money: '600.00',
          orderNum: '16',
          qrcodeNum: '12',
          rate: '4.1%'
        }
      ]
    };
  },
  store,
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    ...mapMutations(["setuserInfo"]),
    orderNum() {
      let _value = "shopId="+this.userInfo.id+"&beginTime="+this.yesterday+"&endTime=" + this.today;
      this.$axios.get(this.$GLOBAL.API+"app/so/soAllTotle?" + _value).then(res => {
        let data = res.data;
        if (data.code == 0) {
          
        }
      });
    },
    toDetail() {
      this.$router.push({
        name: "DailyRevenue"
        // params: { id: "1"}
      });
    },
    toDataRecode() {
      this.$router.push({
        name: "DataRecode"
        // params: { id: "1"}
      });
    },
    toDataofStore() {
      this.$router.push({
        name: "DataofStore"
        // params: { id: "1"}
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
    }
  },
  created() {
    this.isSub = this.userInfo.isSub;
    this.today = this.formatDate(new Date());
    this.yesterday = this.formatDate(new Date(new Date().setDate(new Date().getDate()-1)));
    this.orderNum();
  }
};
</script>

<style lang="less">
.income {
  background-color: #ebebeb;
  padding: 100px 32px 0 30px;
  box-sizing: border-box;
  .income_header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    background-color: #fc5e2d;
    .header_inner {
      height: 80px;
    }
  }
  .income_content {
    .content_top {
      width: 100%;
      height: 382px;
      border-radius: 8px;
      background-color: #fff;
      display: flex;
      flex-direction: row;
      .content_top_item {
        text-align: left;
        width: 50%;
        padding-left: 32px;
        box-sizing: border-box;
        .item_tit {
          font-size: 26px;
          color: #191919;
          margin: 38px 0;
          img {
            width: 12px;
            height: 22px;
            vertical-align: middle;
            margin-top: -2px;
          }
        }
        .item_money {
          font-size: 42px;
          color: #E4B03F;
          span {
            font-size: 36px;
          }
        }
        .item_rate {
          color: #FF0000;
          margin: 30px 0 30px 0;
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
          }
        }
        .item_qrcode {
          margin-top: 26px;
        }
      }
    }
    .content_list {
      .list_item {
        height: 124px;
        width: 100%;
        border-radius: 8px;
        padding: 0 28px 0 30px;
        box-sizing: border-box;
        background-color: #fff;
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #191919;
        .list_item_l {
          display: flex;
          flex-direction: row;
          align-items: center;
          img {
            width: 34px;
            height: 42px;
            margin-right: 22px;
          }
        }
        .list_item_r {
            width: 12px;
            height: 22px;

        }
      }
    }
  }
  width: 100%;
  height: 100%;
  font-family: "微软雅黑";
  font-size: 30px;
}
</style>