<template>
  <div class="DailyRevenue" :class="isSelected ? '' : 'active'">
    <div id="daily_header" class="daily_header">
      <mt-header fixed title="详情" class="header_inner">
          <router-link :to="toBackup" slot="left">
              <mt-button icon="back"></mt-button>
          </router-link>
      </mt-header>
    </div>
		<div id="content_top" class="content_top">
			<div class="content_banner">
				<div class="top_day">{{beginTime}}({{name}})</div>
				<div class="top_money">
					<span>￥</span>
					<span class="money_data">{{money}}</span>
				</div>
				<div class="top_data">
					收款<span>{{orderNum}}</span>笔
					，核销券数<span>{{totalCodeNum}}</span>张
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
</template>

<script>
import Vue from "vue";
import orderItem from "./orderItem";
import ticketItem from "./ticketItem";
import { Loadmore , Indicator } from "mint-ui";
Vue.component(Loadmore.name, Loadmore);
export default {
  name: "DailyRevenue",
  data() {
    return {
      toBackup: "/income",
      shopId: 0,
      beginTime: "",
      endTime: "",
      money: "",
      orderNum: "",
      name: "",
      totalCodeNum: 0,
      subCodeNum: 0,
      switchFlag: true, //tab栏切换
      isSelected: false, //点击option
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
  components: {
    orderItem,
    ticketItem
  },
  created: function() {
    this.shopId = this.$route.params.shopId;
    this.beginTime = this.$route.params.beginTime;
    this.endTime = this.$route.params.endTime;
    this.money = this.$route.params.money;
    this.orderNum = this.$route.params.orderNum;
    this.totalCodeNum = this.subCodeNum = this.$route.params.qrcodeNum;
    this.name = this.$route.params.name.substring(0, 2);
    this.orderList();
    if(this.$route.params.sub == 1) {
      this.toBackup = "/dataofStore";
    }
  },
  methods: {
    //核销券数
    codeList() {
      Indicator.open('数据加载中...');
      let _this = this,
        _value =
          "shopId=" +
          this.shopId +
          "&begainTime=" +
          this.beginTime +
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
      let _this = this,isSuccess = false,
        _value =
          "shopId=" +
          this.shopId +
          "&page=" +
          this.orderPage +
          "&rows=" +
          this.rows +
          "&beginTime=" +
          this.beginTime +
          "&endTime=" +
          this.endTime;
      //商家订单列表
       Indicator.open('数据加载中...');
       setTimeout(() => {
          if(!isSuccess){
            isSuccess = false;
            Indicator.close();
            Toast("网络异常，请检查网络连接")
          }
        }, Delay);
      if (!this.shopListLoad) {
        this.$axios
          .get("/api/app/so/myorderForShop?" + _value + "&soStatus=2")
          .then(res => {
            isSuccess = true;
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
            }
          });
      }
      if (!this.listLoad) {
        //食典券列表
        this.$axios
          .get("/api/app/so/myorder?" + _value + "&soStatus=3")
          .then(res => {
            isSuccess = true;
            Indicator.close();
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
          this.beginTime +
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
        this.codePage = 1;
        this.ticketObj = [];
        this.options = [];
        this.tickType();
      }
      this.codeList();
    },
    selectOpt() {
      this.isSelected = !this.isSelected;
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
.DailyRevenue {
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
  .content_top {
    background-color: #fff;
    padding-top: 80px;
    .content_banner {
      height: 260px;
      text-align: center;
      .top_day {
        color: #191919;
        padding: 38px 0 26px 0;
      }
      .top_money {
        font-size: 40px;
        color: #e4b03f;
        .money_data {
          font-size: 60px;
          margin-left: -10px;
        }
      }
      .top_data {
        padding-top: 26px;
        color: #808080;
        span {
          color: #000;
          padding: 0 6px;
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
  width: 100%;
  height: 100%;
  font-family: "微软雅黑";
  font-size: 24px;
}
</style>