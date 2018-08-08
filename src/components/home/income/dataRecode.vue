<template>
  <div class="dataRecode">
    <div class="daily_header">
      <mt-header fixed title="数据记录" class="header_inner">
          <router-link to="/income" slot="left">
              <mt-button icon="back"></mt-button>
          </router-link>
          <mt-button slot="right">导出Excel</mt-button>
      </mt-header>
    </div>
    <div class="daily_content">
      <div class="content_top">
        <div class="top_cont">
          <div class="top_tit">
            <div class="date_inp" @click="openPicker(1)">{{startDate}}</div>
            <div class="tit_txt">至</div>
            <div class="date_inp" @click="openPicker(2)">{{endDate}}</div>
            <div class="tit_btn" @click="inquiry">查询</div>
          </div>
          <div class="top_order">收款{{order}}笔，核销券数{{qrcodeNum}}张，总计</div>
          <div class="top_money">
            <span>￥</span>
            <span class="moneyNum">{{money}}</span>
          </div>
        </div>
        <div class="top_tab">
          <span :class="switchFlag ? 'active' : ''" @click="tabSwitch(1)">订单</span>
          <span :class="switchFlag ? '' : 'active'" @click="tabSwitch(2)">核销券</span>
        </div>
        <div class="cont_select" :hidden="switchFlag">
          <div class="selected">
            <div class="selected_l" @click="selectOpt">
              <span>全部</span>
              <img :class="isSelected ? 'active' : ''" src="../../../../static/images/home_arrow.png" alt="">
            </div>
            <div class="selected_r">核销券数24</div>
          </div>
          <div class="sel_option" v-if="isSelected">
            <div :class="item.isSelected==1?'active':''" v-for="(item,index) in options" :key="index" :obj="item">
              <span>{{item.name}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="content_list">
        <div class="shadowBox" v-if="isSelected"></div>
        <div class="list_inner">
          <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :autoFill="false" ref="custom">
            <orderItem v-if="switchFlag" v-for="(item,index) in orderObj" :key="index" :obj="item"></orderItem>
            <ticketItem v-if="!switchFlag" v-for="(item,index) in ticketObj" :key="index" :obj="item"></ticketItem>
          </mt-loadmore>
        </div>
      </div>
    </div>
    <mt-datetime-picker
      type="date"
      ref="picker"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      @confirm="handleConfirm"
      >
    </mt-datetime-picker>
  </div>
</template>

<script>
import Vue from "vue";
import orderItem from "./orderItem";
import ticketItem from "./ticketItem";
import { DatetimePicker, Toast, Loadmore } from "mint-ui";
Vue.component(DatetimePicker.name, DatetimePicker, Loadmore.name, Loadmore);
import store from "@/vuex/store";
export default {
  name: "DataRecode",
  data() {
    return {
      id: 1,
      shopId: 0,
      startDate: "开始时间",
      endDate: "结束时间",
      money: 0,
      order: 0,
      qrcodeNum: 0,
      isSelected: false, //点击option
      switchFlag: true, //tab栏切换
      allLoaded: false,
      orderPage: 1,
      codePage: 1,
      rows: 5,
      options: [
        {
          name: "全部",
          isSelected: 1
        }
      ],
      orderObj: [],
      ticketObj: []
    };
  },
  created: function() {
    this.shopId = this.$route.params.shopId;
    this.money = this.$route.params.money;
    this.order = this.$route.params.orderNum;
    this.qrcodeNum = this.$route.params.qrcodeNum;
    this.startDate = this.formatDate(new Date());
    this.endDate = this.formatDate(
      new Date(new Date().setDate(new Date().getDate() + 1))
    );
    this.orderList();
    this.tickType();
  },
  components: {
    orderItem,
    ticketItem
  },
  watch: {},
  store,
  methods: {
    //营业额
    moneyNum() {
      let _this = this,
        _value =
          "shopId=" +
          this.shopId +
          "&beginTime=" +
          this.startDate +
          "&endTime=" +
          this.endDate;
      this.$axios.get("/api/app/so/totalAmount?" + _value).then(res => {
        if (res.data.code == 0 && res.data.data) {
          _this.money = res.data.data ? res.data.data : 0;
        }
      });
    },
    //订单数
    orderNum() {
      let _this = this,
        _value =
          "shopId=" +
          this.shopId +
          "&beginTime=" +
          this.startDate +
          "&endTime=" +
          this.endDate;
      this.$axios.get("/api/app/so/soAllTotle?" + _value).then(res => {
        let data = res.data;
        if (data.code == 0) {
          _this.order = data.data ? data.data : 0;
        }
      });
    },
    //核销券数
    codeList() {
      let _this = this,
        _value =
          "shopId=" +
          this.shopId +
          "&begainTime=" +
          this.startDate +
          "&endTime=" +
          this.endDate +
          "&page=" +
          this.codePage +
          "&rows=5";
      this.$axios.get("/api/app/hx/list?" + _value).then(res => {
        if (res.data.code == 0) {
          _this.qrcodeNum = res.data.data.total ? res.data.data.total : 0;
          let list = res.data.data.list;
          if (_this.codePage == 1) {
            list = list.slice(1);
          }
          for (let i = 0; i < list.length; i++) {
            // list[i].hxTime = list[i].hxTime ? list[i].hxTime : list[i].paidTime;
            // list[i].mobile = list[i].mobile ? list[i].mobile : list[i].userName;
            // list[i].mobile = _this.dealWithTel(list[i].mobile);
            _this.ticketObj.push(list[i]);
          }
        } else {
          this.allLoaded = true; // 若数据已全部获取完毕
        }
      });
    },
    //订单列表
    orderList() {
      let _this = this,
        _value =
          "shopId=" +
          this.shopId +
          "&page=" +
          this.orderPage +
          "&rows=" +
          this.rows +
          "&beginTime=" +
          this.startDate +
          "&endTime=" +
          this.endDate;
      //商家订单列表
      this.$axios
        .get("/api/app/so/myorderForShop?" + _value + "&soStatus=2")
        .then(res => {
          if (res.data.code == 0 && res.data.data.list) {
            let list = res.data.data.list;
            for (let i = 0; i < list.length; i++) {
              list[i].hxTime = list[i].hxTime
                ? list[i].hxTime
                : list[i].paidTime;
              list[i].mobile = list[i].mobile
                ? list[i].mobile
                : list[i].userName;
              list[i].mobile = _this.dealWithTel(list[i].mobile);
              _this.orderObj.push(list[i]);
            }
          }
        });
      //食典券列表
      this.$axios
        .get("/api/app/so/myorder?" + _value + "&soStatus=3")
        .then(res => {
          if (res.data.code == 0 && res.data.data) {
            let list = res.data.data;
            for (let i = 0; i < list.length; i++) {
              list[i].hxTime = list[i].hxTime
                ? list[i].hxTime
                : list[i].paidTime;
              list[i].mobile = list[i].mobile
                ? list[i].mobile
                : list[i].userName;
              list[i].mobile = _this.dealWithTel(list[i].mobile);
              _this.orderObj.push(list[i]);
            }
          }
        });
    },
    //下拉
    loadTop() {
      this.orderPage = 1;
      this.allLoaded = false;
      this.orderObj = [];
      this.orderList();
      this.$refs.custom.onTopLoaded();
    },
    //上拉
    loadBottom() {
      this.orderPage += 1;
      this.orderList();
      this.$refs.custom.onBottomLoaded();
    },
    // 核销券的种类
    tickType() {
      let _this = this,
        _value =
          "shopId=" +
          this.shopId +
          "&begainTime=" +
          this.startDate +
          "&endTime=" +
          this.endDate +
          "&isBill=1";
      //商家订单列表
      this.$axios.get("/api/app/hx/sotype?" + _value).then(res => {
        if (res.data.code == 0 && res.data.data) {
          let data = res.data.data;
          for (let i = 0; i < data.length; i++) {
            _this.options.push({
              name: data[i].skuName,
              isSelected: 0
            });
          }
        }
      });
    },
    //查询
    inquiry() {
      this.moneyNum();
      this.orderNum();
      this.codeList();
      this.orderList();
      this.tickType();
    },
    openPicker(id) {
      this.$refs.picker.open();
      this.id = id;
    },
    handleConfirm(data) {
      if (this.id == 1) {
        if (this.endDate) {
          if (
            new Date(this.formatDate(data)).getTime() >
            new Date(this.endDate).getTime()
          ) {
            Toast("开始时间不能大于结束时间");
            return false;
          }
        }
        this.startDate = this.formatDate(data);
      } else if (this.id == 2) {
        if (this.startDate) {
          if (
            new Date(this.startDate).getTime() >
            new Date(this.formatDate(data)).getTime()
          ) {
            Toast("结束时间不能小于开始时间");
            return false;
          }
        }
        this.endDate = this.formatDate(data);
      }
    },
    tabSwitch(id) {
      this.switchFlag = id == 1 ? true : false;
      this.isSelected = false;
    },
    selectOpt() {
      this.isSelected = !this.isSelected;
    },
    formatDate(data) {
      //yyyy-MM-dd
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
    //隐藏手机信息
    dealWithTel(cellValue) {
      if (Number(cellValue) && String(cellValue).length === 11) {
        var mobile = String(cellValue);
        var reg = /^(\d{3})\d{4}(\d{4})$/;
        return mobile.replace(reg, "$1****$2");
      } else {
        return cellValue;
      }
    }
  }
};
</script>

<style lang="less">
.dataRecode {
  background-color: #ebebeb;
  box-sizing: border-box;
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
    padding-top: 80px;
    height: 100%;
    box-sizing: border-box;
    .content_top {
      background-color: #fff;
      .top_cont {
        height: 336px;
        width: 100%;
        border-radius: 8px;
        .top_tit {
          padding: 36px 0 80px 0;
          font-size: 24px;
          div {
            display: inline-block;
            height: 54px;
            line-height: 54px;
          }
          .date_inp {
            width: 270px;
            height: 100%;
            border-radius: 50px;
            background-color: #f0f0f0;
            color: #808080;
          }
          .tit_txt {
            padding: 0 10px;
            color: #191919;
          }
          .tit_btn {
            padding-left: 22px;
            color: #fc5e2d;
            font-size: 28px;
          }
        }
        .top_order {
          color: #555555;
          font-size: 26px;
        }
        .top_money {
          margin-top: 40px;
          color: #e4b03f;
          font-size: 36px;
          .moneyNum {
            font-size: 48px;
            margin-left: -10px;
          }
        }
      }
      .top_tab {
        width: 100%;
        height: 80px;
        line-height: 80px;
        span {
          font-size: 28px;
          display: inline-block;
          height: 100%;
          color: #808080;
          margin: 0 46px;
          padding: 0 20px;
          box-sizing: border-box;
          &.active {
            border-bottom: 2px solid #e4b03f;
            color: #e4b03f;
          }
        }
      }
      .cont_select {
        height: 90px;
        width: 100%;
        position: relative;
        border-top: 1px solid #ebebeb;
        .selected {
          height: 100%;
          width: 100%;
          padding: 0 34px 0 28px;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          div {
            line-height: 90px;
            height: 100%;
          }
          .selected_l {
            color: #191919;
            font-size: 28px;
            img {
              margin-left: 10px;
              width: 12px;
              height: 22px;
              transform: rotate(90deg);
              &.active {
                transform: rotate(270deg);
              }
            }
          }
          .selected_r {
            color: #808080;
            font-size: 24px;
          }
        }
        .sel_option {
          padding: 22px 26px 22px 32px;
          box-sizing: border-box;
          background-color: #ebebeb;
          position: absolute;
          z-index: 100;
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          div {
            width: 33.3%;
            height: 86px;
            padding-right: 8px;
            box-sizing: border-box;
            line-height: 86px;
            font-size: 26px;
            color: #555555;
            margin-bottom: 16px;
            &.active {
              span {
                background-color: #fc712d;
                color: #fff;
              }
            }
            span {
              display: block;
              width: 100%;
              background-color: #fff;
              border-radius: 4px;
            }
          }
        }
      }
    }
    .content_list {
      width: 100%;
      position: relative;
      .shadowBox {
        width: 100%;
        height: 800px;
        background-color: #191919;
        opacity: 0.3;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 50;
      }
      .list_inner {
        width: 100%;
        padding: 20px 30px 0 30px;
        box-sizing: border-box;
      }
    }
  }
  width: 100%;
  height: 100%;
  font-family: "微软雅黑";
  font-size: 24px;
}
</style>