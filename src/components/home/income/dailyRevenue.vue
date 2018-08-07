<template>
  <div class="DailyRevenue">
    <div id="daily_header" class="daily_header">
      <mt-header fixed title="详情" class="header_inner">
          <router-link to="/income" slot="left">
              <mt-button icon="back"></mt-button>
          </router-link>
      </mt-header>
    </div>
		<div id="content_top" class="content_top">
			<div class="content_banner">
				<div class="top_day">7月24日(今天)</div>
				<div class="top_money">
					<span>￥</span>
					<span class="money_data">300.00</span>
				</div>
				<div class="top_data">
					收款<span>3</span>笔
					，核销券数<span>24</span>张
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
          <div class="active">
            <span>全部</span>
          </div>
          <div>
            <span>享7券</span>
          </div>
          <div>
            <span>套餐券</span>
          </div>
          <div>
            <span>套餐折扣券</span>
          </div>
          <div>
            <span>10元食典券</span>
          </div>
          <div>
            <span>80元食典券</span>
          </div>
        </div>
      </div>
		</div>
    <div class="content_list">
      <div class="shadowBox" v-if="isSelected" :style="{height: shadowHeight + 'px'}"></div>
      <div class="list_inner">
        <orderItem v-if="switchFlag" v-for="(item,index) in orderObj" :key="index" :obj="item"></orderItem>
        <ticketItem v-if="!switchFlag" v-for="(item,index) in ticketObj" :key="index" :obj="item"></ticketItem>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import orderItem from "./orderItem";
import ticketItem from "./ticketItem";
import store from "@/vuex/store";
export default {
  name: "DailyRevenue",
  data() {
    return {
      switchFlag: true, //tab栏切换
      isSelected: false,     //点击option
      shadowHeight: 0,     //阴影的高度
      orderObj: [
        {
          name: "10元代金券",
          date: "2018-06-06 12:23:58",
          maney: "100.00",
          orderNum: "245125667752",
          phone: "186******21"
        },
        {
          name: "10元代金券",
          date: "2018-06-06 12:23:58",
          maney: "100.00",
          orderNum: "245125667752",
          phone: "186******21"
        }
      ],
      ticketObj: [
        {
          name: "10元代金券",
          date: "2018-06-06 12:23:58",
          maney: "1.00",
          orderNum: "245125667752",
          phone: "186******21"
        },
        {
          name: "10元代金券",
          date: "2018-06-06 12:23:58",
          maney: "1.00",
          orderNum: "245125667752",
          phone: "186******21"
        }
      ]
    };
  },
  components: {
    orderItem,
    ticketItem
  },
  created: function() {

  },
  mounted() {
    var content_top = document.getElementById("content_top");
    console.log(content_top);
    console.log(content_top.offsetHeight);
    this.shadowHeight = this.getWindowHeight() - content_top.offsetHeight - 40;
    console.log(this.shadowHeight)
  },
  watch: {},
  store,
  methods: {
    tabSwitch(id) {
      this.switchFlag = id == 1 ? true : false;
      this.isSelected = false;
    },
    selectOpt() {
      this.isSelected = !this.isSelected;
    },
    //屏幕可视高度
    getWindowHeight() {
      var windowHeight = 0;
      if (document.compatMode == "CSS1Compat") {
        windowHeight = document.documentElement.clientHeight;
      } else {
        windowHeight = document.body.clientHeight;
      }
      return windowHeight;
    }
  }
};
</script>

<style lang="less">
.DailyRevenue {
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