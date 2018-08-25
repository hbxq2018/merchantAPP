<template>
  <div class="setMeal">
    <mt-header :title="name">
        <router-link to="/promotion" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
    </mt-header>
    <!-- <div id="setMealBox" class="setMealBox" :style="{'-webkit-overflow-scrolling': scrollMode}"> -->
        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :autoFill="false" ref="mealmore">
            <ul v-if="list.length>0" id="setMealUl" class="setMealUl" >
                <li class="setMeal_list clearfix" v-for="(item,index) in list" :key="index" :id="item.id" @click="toSetMeal(item.id)">
                    <img class="icon fl" :src="item.picUrl" alt="">
                    <div class="text fl">
                        <p>{{item.skuName}}</p>
                        <p>
                            <span>折后价 ￥{{item.agioPrice}}元</span>
                            <span>门市价 ￥{{item.sellPrice}}元</span>
                        </p>
                        <p>发布日期：{{item.updateTime}}</p>
                    </div>
                    <div class="arrow fr"></div>
                </li>
            </ul>
            <img v-else class="emtpy" :src="url" alt="什么都没有">
        </mt-loadmore>
        
    <!-- </div> -->
    <div id="setMealBottom" class="setMealBottom" @click="toSetMeal()">
        <span>+</span>
        <span>添加套餐</span>
    </div>
  </div>
</template>

<script>
import { Picker, Toast, Indicator } from "mint-ui";
import store from "@/vuex/store";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "setMeal",
  data() {
    return {
      name: "套餐",
      url: require("../../../../static/images/zhanweitu.png"),
      list: [],
      page: 1,
      allLoaded: false,
      scrollMode: "auto",
      touchStartY: 0,
      distance: 0,
      topFlag: false, //是否到顶部
      bottomFlag: false, //是否到底部
      flag: true //节流阀
    };
  },
  store,
  computed: {
    ...mapState(["userInfo", "shopId"])
  },
  methods: {
    ...mapMutations(["setuserInfo"]),
    //获取列表数据
    setMealList() {
      let _this = this,
        _param = "",
        isSuccess = false;
      _param = "shopId=" + this.userInfo.id + "&page=" + this.page + "&rows=8";
      Indicator.open("数据加载中...");
      setTimeout(() => {
        if (!isSuccess) {
          isSuccess = false;
          Indicator.close();
          Toast("网络异常，请检查网络连接");
        }
      }, Delay);
      this.$axios.get("/api/app/sku/agioList?" + _param).then(res => {
        isSuccess = true;
        Indicator.close();
        if (res.data.code == 0) {
          let lists = res.data.data.list;
          if (_this.page == 1) {
            _this.list = [];
          }
          if (lists && lists.length > 0) {
            for (let i = 0; i < lists.length; i++) {
              lists[i].updateTime = _this.switchDate(lists[i].updateTime);
              _this.list.push(lists[i]);
            }
            if (lists.length < 8) {
              _this.allLoaded = true;
            }
          } else {
            _this.allLoaded = true;
            Toast("暂无数据");
          }
        } else {
          _this.allLoaded = true;
        }
      });
    },
    //去详情页面
    toSetMeal(id) {
      this.$router.push({ name: "ToSetMeal", params: { id: id } });
    },
     //下拉
    loadTop() {
      this.page = 1;
      this.allLoaded = false;
      this.list = [];
      this.setMealList();
      this.$refs.mealmore.onTopLoaded();
    },
    //上拉
    loadBottom() {
      this.page += 1;
      this.setMealList();
      this.$refs.mealmore.onBottomLoaded();
    },
     //转换日期
    switchDate(s) {
      let dateStr = new Date(s);
      let yearStr = dateStr.getFullYear();
      let monthStr = +dateStr.getMonth() + 1;
      let dayStr =
        dateStr.getDate() > 9 ? dateStr.getDate() : "0" + dateStr.getDate();
      monthStr = monthStr > 9 ? monthStr : "0" + monthStr;
      return yearStr + "-" + monthStr + "-" + dayStr;
    }
  },
  created: function() {
    const ua = navigator.userAgent.toLowerCase();
    if (/(iPhone|iPad|iPod|iOS)/i.test(ua)) {
      this.scrollMode = "touch";
    }
    this.setMealList();
  }
};
</script>
<style lang="less">
@import url(../../../common/css/common.css);
.setMeal {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #ebebeb;
  overflow: scroll;
  .setMealUl {
    width: 100%;
    // margin-top: 80px;
    position: relative;
    &:before {
      content: "加载中..";
      position: absolute;
      left: 0;
      top: -50px;
      height: 20px;
      width: 100%;
    }
    .setMeal_list {
      height: 170px;
      width: 100%;
      background-color: #fff;
      padding: 20px 30px;
      box-sizing: border-box;
      margin-bottom: 20px;
      .icon {
        width: 130px;
        height: 130px;
        margin-right: 20px;
      }
      .text {
        text-align: left;
        color: #191919;
        p:nth-child(1) {
          font-size: 36px;
          font-weight: 600;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          width: 420px;
        }
        p:nth-child(2) {
          margin-top: 12px;
          span:nth-child(1) {
            color: #ff5252;
            font-size: 30px;
          }
          span:nth-child(2) {
            color: #555555;
            font-size: 24px;
          }
        }
        p:nth-child(3) {
          color: #b1b1b1;
          font-size: 22px;
        }
      }
      .arrow {
        position: relative;
        width: 30px;
        height: 30px;
        margin-top: 50px;
        &:before,
        &:after {
          position: absolute;
          top: 0;
          content: "";
          display: block;
          border-top: 15px solid transparent;
          border-right: 15px solid transparent;
          border-bottom: 15px solid transparent;
        }
        &:before {
          left: 5px;
          border-left: 15px solid #b1b1b1;
        }
        &:after {
          left: 0px;
          border-left: 15px solid #fff;
        }
      }
    }
  }
  .setMealBottom {
    vertical-align: middle;
    position: fixed;
    left: 0;
    bottom: 0;
    height: 110px;
    line-height: 110px;
    width: 100%;
    color: #fc5e2d;
    font-size: 30px;
    text-align: center;
    background-color: #fff;
    span {
      vertical-align: middle;
      display: inline-block;
      height: 110px;
      line-height: 110px;
    }
    span:first-child {
      font-size: 60px;
    }
  }
}
</style>