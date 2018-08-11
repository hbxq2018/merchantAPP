<template>
  <div class="dataRecode" :class="isSelected ? '' : 'active'">
    <div class="daily_header">
      <mt-header fixed title="数据记录" class="header_inner">
          <router-link :to="toBackup" slot="left">
              <mt-button icon="back"></mt-button>
          </router-link>
          <mt-button slot="right" @click="ExcelDown">导出Excel</mt-button>
      </mt-header>
    </div>
    <div class="daily_content">
      <div class="content_top">
        <div class="top_cont">
          <div class="top_tit">
            <div class="date_inp" @click="openPicker(1)">{{startDate}}</div>
            <div class="tit_txt">至</div>
            <div class="date_inp" @click="openPicker(2)">{{endTime}}</div>
            <div class="tit_btn" @click="inquiry">查询</div>
          </div>
          <div class="top_order">收款{{order}}笔，核销券数{{totalCodeNum}}张，总计</div>
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
              <span>{{selectedName}}</span>
              <img :class="isSelected ? 'active' : ''" src="../../../../static/images/home_arrow.png" alt="">
            </div>
            <div class="selected_r">核销券数{{subCodeNum}}</div>
          </div>
          <div class="sel_option" v-if="isSelected">
            <div :class="item.isSelected==1?'active':''" v-for="(item,index) in options" :key="index" :obj="item">
              <span @click="selectedType(item.skuId)">{{item.skuName}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="content_list">
        <div class="shadowBox" v-if="isSelected"></div>
        <div class="list_inner">
          <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :autoFill="false" ref="dataRecode">
            <ul>
              <orderItem v-if="switchFlag" v-for="(item,index) in orderObj" :key="index" :obj="item"></orderItem>
              <ticketItem v-if="!switchFlag" v-for="(item,index) in ticketObj" :key="index" :obj="item"></ticketItem>
            </ul>
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
      :startDate = 'mindata'
      @confirm="handleConfirm"
      >
    </mt-datetime-picker>
  </div>
</template>

<script>
import Vue from "vue";
import orderItem from "./orderItem";
import ticketItem from "./ticketItem";
import { DatetimePicker, Toast, Loadmore , Indicator } from "mint-ui";
Vue.component(DatetimePicker.name, DatetimePicker, Loadmore.name, Loadmore);
export default {
  name: "DataRecode",
  data() {
    return {
      toBackup: "/income",
      id: 1,
      shopId: 0,
      startDate: "开始时间",
      endTime: "结束时间",
      mindata:"",
      money: 0,
      order: 0,
      totalCodeNum: 0,
      subCodeNum: 0,
      isSelected: false, //点击option
      switchFlag: true, //tab栏切换
      allLoaded: false, //是否禁止上拉加载
      shopListLoad: false, //是否禁止加载myorderForShop
      listLoad: false, //是否禁止加载myorder
      orderPage: 1,
      codePage: 1,
      rows: 5,
      skuId: "",
      selectedName: "全部",
      options: [],
      orderObj: [],
      ticketObj: []
    };
  },
  created: function() {
    let _mindata = new Date(new Date().getTime() -86400000 * 365*2);
    this.mindata = new Date(_mindata);
    this.shopId = this.$route.params.shopId;
    this.money = this.$route.params.money;
    this.order = this.$route.params.orderNum;
    this.totalCodeNum = this.subCodeNum = this.$route.params.qrcodeNum;
    this.startDate = this.formatDate(new Date());
    this.endTime = this.formatDate(
      new Date(new Date().setDate(new Date().getDate() + 1))
    );
    this.orderList();
    if(this.$route.params.sub == 1) {
      this.toBackup = "/dataofStore";
    }
  },
  components: {
    orderItem,
    ticketItem
  },
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
          this.endTime;
      this.$axios.get("/api/app/so/totalAmount?" + _value).then(res => {
        if (res.data.code == 0) {
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
          this.endTime;
      this.$axios.get("/api/app/so/soAllTotle?" + _value).then(res => {
        let data = res.data;
        if (data.code == 0) {
          _this.order = data.data ? data.data : 0;
        }
      });
    },
    //核销券数
    codeList() {
      Indicator.open('数据加载中...');
      let _this = this,
        _value =
          "shopId=" +
          this.shopId +
          "&begainTime=" +
          this.startDate +
          "&endTime=" +
          this.endTime +
          "&page=" +
          this.codePage +
          "&rows=5";
      if (this.skuId) {
        _value += "&skuId=" + this.skuId;
      }
      this.$axios.get("/api/app/hx/list?" + _value).then(res => {
        Indicator.close();
        if (_this.skuId == "") {
          _this.totalCodeNum = _this.subCodeNum = res.data.data.total
            ? res.data.data.total
            : 0;
        } else {
          _this.subCodeNum = res.data.data.total ? res.data.data.total : 0;
        }
        if (_this.switchFlag == false) {
          if (res.data.code == 0 && res.data.data.list != null) {
            let list = res.data.data.list;
            list = list.slice(1);
            for (let i = 0; i < list.length; i++) {
              _this.ticketObj.push(list[i]);
            }
            _this.allLoaded = list.length < 5 ? true : false;
          } else {
            _this.allLoaded = true;
          }
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
          this.endTime;
      //商家订单列表
      if (!this.shopListLoad) {
        Indicator.open('数据加载中...');
        this.$axios
          .get("/api/app/so/myorderForShop?" + _value + "&soStatus=2")
          .then(res => {
            Indicator.close();
            if (res.data.code == 0 && res.data.data.list != null) {
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
              _this.shopListLoad = list.length < 5 ? true : false;
            } else {
              _this.shopListLoad = true;
              // _this.allLoaded = true;
            }
          });
      }
      if (!this.listLoad) {
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
              _this.listLoad = list.length < 5 ? true : false;
            } else {
              _this.listLoad = true;
            }
          });
      }
      if (this.shopListLoad && this.listLoad) {
        this.allLoaded = true;
      }
    },
    //下拉
    loadTop() {
      this.allLoaded = false;
      if (this.switchFlag) {
        this.orderPage = 1;
        this.shopListLoad = false;
        this.listLoad = false;
        this.orderObj = [];
        this.orderList();
      } else {
        this.codePage = 1;
        this.ticketObj = [];
        this.codeList();
      }
      this.$refs.dataRecode.onTopLoaded();
    },
    //上拉
    loadBottom() {
      if (this.switchFlag) {
        this.orderPage += 1;
        this.orderList();
      } else {
        this.codePage += 1;
        this.codeList();
      }
      this.$refs.dataRecode.onBottomLoaded();
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
          this.endTime;
      //商家订单列表
      this.$axios.get("/api/app/hx/sotype?" + _value).then(res => {
        if (res.data.code == 0 && res.data.data) {
          let data = res.data.data;
          _this.options = [
            {
              skuId: "",
              skuName: "全部",
              isSelected: 1
            }
          ];
          for (let i = 0; i < data.length; i++) {
            _this.options.push({
              skuId: data[i].skuId,
              skuName: data[i].skuName,
              isSelected: 0
            });
          }
        }
      });
    },
    //查询对应核销券的数据
    selectedType(id) {
      this.isSelected = false;
      this.allLoaded = false;
      this.skuId = id;
      this.codePage = 1;
      this.ticketObj = [];
      this.codeList();
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i].skuId == this.skuId) {
          this.options[i].isSelected = 1;
          this.selectedName = this.options[i].skuName;
        } else {
          this.options[i].isSelected = 0;
        }
      }
    },
    //查询
    inquiry() {
      this.isSelected = false;
      this.allLoaded = false;
      this.moneyNum();
      this.orderNum();
      if (this.switchFlag) {
        this.orderPage = 1;
        this.orderObj = [];
        this.shopListLoad = false;
        this.listLoad = false;
        this.orderList();
      } else {
        this.skuId = "";
        this.selectedName = "全部";
        this.codePage = 1;
        this.ticketObj = [];
        this.tickType();
      }
      this.codeList();
    },
    openPicker(id) {
      this.$refs.picker.open();
      this.id = id;
    },
    //判断时间大小
    handleConfirm(data) {
      if (this.id == 1) {
        if (this.endTime) {
          if (
            new Date(this.formatDate(data)).getTime() >
            new Date(this.endTime).getTime()
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
        this.endTime = this.formatDate(data);
      }
    },
    //切换banner
    tabSwitch(id) {
      this.switchFlag = id == 1 ? true : false;
      this.isSelected = false;
      this.allLoaded = false;
      if (this.switchFlag) {
        this.orderPage = 1;
        this.orderObj = [];
        this.shopListLoad = false;
        this.listLoad = false;
        this.orderList();
      } else {
        this.skuId = "";
        this.selectedName = "全部";
        this.codePage = 1;
        this.ticketObj = [];
        this.tickType();
      }
      this.codeList();
    },
    selectOpt() {
      this.isSelected = !this.isSelected;
    },
    //导出Excel
    ExcelDown() {
      let _this = this,
        _Url =
          "/api/app/so/soDetailExport?&shopId=" +
          this.shopId +
          "&soStatus=2&beginTime=" +
          this.startDate +
          "&endTime=" +
          this.endTime;
      mui.plusReady(function() {
        var dtask = plus.downloader.createDownload(
          _Url,
          { filename: "_downloads/" },
          function(d, status) {
            // 下载完成
            if (status == 200) {
              mui.toast("下载成功");
              var btnArray = ["否", "是"]; //弹框消息确认是否打开附件
              mui.confirm("是否打开附件查看？", "下载成功", btnArray, function(
                e
              ) {
                if (e.index == 1) {
                  //打开附件
                  plus.runtime.openFile(d.filename, {}, function(e) {
                    plus.nativeUI.alert("无法打开此文件：" + e.emssage);
                  });
                } else {
                  //不打开
                }
              });
            } else {
              mui.toast("下载失败，请检查网络是否连接");
            }
          }
        );
        dtask.start();
        mui.toast("正在下载中...");
      });
    },
    //yyyy-MM-dd
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
  position: fixed;
  background-color: #ebebeb;
  box-sizing: border-box;
  height: 100%;
  &.active {
    overflow: scroll;
  }
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
        height: 740px;
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