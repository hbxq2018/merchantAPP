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
          <div class="item_tit" @click="toDetail(index)">
            <span>{{item.name}}</span>
            <img src="../../../../static/images/home_arrow.png" alt="">
          </div>
          <div class="item_money"><span>￥</span>{{item.money}}</div>
          <div class="item_rate">
            <span v-if="index == 0" :class="item.rate > 0 ? '' : 'down'">{{item.rate==0?'持平':Math.abs(item.rate)+'%'}}</span>
            <img v-if="index == 0 && item.rate > 0" src="../../../../static/images/up.png" alt="">
            <img v-if="index == 0 && item.rate < 0" src="../../../../static/images/down.png" alt="">
            <img v-if="index == 0 && item.rate == 0" src="../../../../static/images/levelOff.png" alt="" style="height: 4px;vertical-align: middle;">
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
import { Toast, Loadmore, Indicator } from "mint-ui";
Vue.component(Loadmore.name, Loadmore);
import store from "@/vuex/store";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "Income",
  data() {
    return {
      isSub: 0,
      today: "",
      yesterday: "",
      tomorrow: "",
      income: [
        {
          name: "今日营收",
          money: 0,
          orderNum: 0,
          qrcodeNum: 0,
          rate: "0%"
        },
        {
          name: "昨日营收",
          money: 0,
          orderNum: 0,
          qrcodeNum: 0,
          rate: ""
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
    //营业额
    moneyNum() {
      let _this = this,
        _value =
          "shopId=" +
          this.userInfo.id +
          "&beginTime=" +
          this.today +
          "&endTime=" +
          this.tomorrow,
        _param =
          "shopId=" +
          this.userInfo.id +
          "&beginTime=" +
          this.yesterday +
          "&endTime=" +
          this.today;
      this.$axios.get("/api/app/so/totalAmount?" + _value).then(res => {
        if (res.data.code == 0 && res.data.data) {
          _this.income[0].money = res.data.data ? res.data.data : 0;
        }
      });
      this.$axios.get("/api/app/so/totalAmount?" + _param).then(res => {
        if (res.data.code == 0 && res.data.data) {
          _this.income[1].money = res.data.data ? res.data.data : 0;
        }
      });
      let today = +_this.income[0].money, yester = +_this.income[1].money;
      _this.income[0].rate = ((today - yester) / (yester == 0 ? 1 : yester) * 100).toFixed(2);
    },
    //订单数
    orderNum() {
      let _this = this,
        _value =
          "shopId=" +
          this.userInfo.id +
          "&beginTime=" +
          this.today +
          "&endTime=" +
          this.tomorrow,
        _param =
          "shopId=" +
          this.userInfo.id +
          "&beginTime=" +
          this.yesterday +
          "&endTime=" +
          this.today;
      this.$axios.get("/api/app/so/soAllTotle?" + _value).then(res => {
        let data = res.data;
        if (data.code == 0) {
          _this.income[0].orderNum = data.data ? data.data : 0;
        }
      });
      this.$axios.get("/api/app/so/soAllTotle?" + _param).then(res => {
        let data = res.data;
        if (data.code == 0) {
          _this.income[1].orderNum = data.data ? data.data : 0;
        }
      });
    },
    //核销券数
    codeNum() {
      let _this = this,
        _value =
          "shopId=" +
          this.userInfo.id +
          "&begainTime=" +
          this.today +
          "&endTime=" +
          this.tomorrow,
        _param =
          "shopId=" +
          this.userInfo.id +
          "&begainTime=" +
          this.yesterday +
          "&endTime=" +
          this.today;
      this.$axios.get("/api/app/hx/list?" + _value).then(res => {
        if (res.data.code == 0) {
          _this.income[0].qrcodeNum = res.data.data.total
            ? res.data.data.total
            : 0;
        }
      });
      this.$axios.get("/api/app/hx/list?" + _param).then(res => {
        if (res.data.code == 0) {
          _this.income[1].qrcodeNum = res.data.data.total
            ? res.data.data.total
            : 0;
        }
      });
    },
    toDetail(idx) {
      let beginTime = '', endTime = '';
      if(idx == 0) {
        beginTime = this.today;
        endTime = this.tomorrow;
      } else if(idx == 1) {
        beginTime = this.yesterday;
        endTime = this.today;
      }
      this.$router.push({
        name: "DailyRevenue",
        params: {
          shopId: this.userInfo.id,
          beginTime: beginTime,
          endTime: endTime,
          money: this.income[idx].money,
          orderNum: this.income[idx].orderNum,
          qrcodeNum: this.income[idx].qrcodeNum,
          name: this.income[idx].name
        }
      });
    },
    toDataRecode() {
      this.$router.push({
        name: "DataRecode",
        params: { 
          shopId: this.userInfo.id,
          money: this.income[0].money,
          orderNum: this.income[0].orderNum,
          qrcodeNum: this.income[0].qrcodeNum
        }
      });
    },
    toDataofStore() {
      this.$router.push({
        name: "DataofStore"
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
    this.yesterday = this.formatDate(
      new Date(new Date().setDate(new Date().getDate() - 1))
    );
    this.tomorrow = this.formatDate(
      new Date(new Date().setDate(new Date().getDate() + 1))
    );
    this.moneyNum();
    this.orderNum();
    this.codeNum();
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
          color: #e4b03f;
          span {
            font-size: 36px;
          }
        }
        .item_rate {
          color: #ff0000;
          height: 90px;
          line-height: 90px;
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