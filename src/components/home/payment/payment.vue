<template>
    <div class="payment">
        <mt-header fixed title="缴服务费">
          <router-link slot="left" :to="{path:'home',query:{'ind':2}}">
            <mt-button icon="back"></mt-button>
          </router-link>
        </mt-header>

        <div class="pay-top">
            <p class="top-one">应缴服务费（元）</p>
            <p class="top-two">{{money | changemoney}}</p>
            <mt-button class="topPay" @click.native="handPayment" type="primary">立即交费</mt-button>
            <p class="top-three">
                <span @click="handRecord">缴费记录</span>
                <span>|</span>
                <span @click="handBill">月份账单</span>
            </p>
        </div>
        <div class="pay-date">
            <div class="date-left">
                <p class="date-pone">{{beginTime | changetime}}至{{endTime | changetime}}</p>
                <p class="data-ptwo">服务费{{total}}笔，共{{money | changemoney}}元</p>
            </div>
            <div class="date-right" @click="handdate">
                <img class="sel-date" src="../../../../static/images/calendar.png" alt="选择时间">
                <p class="data-pthree">自定义查询</p>
            </div>
        </div>
        <div class="pay-cont">
          <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :autoFill="false" ref="payment">
            <ul>
              <li class="item" v-for="(item,index) in lists" :key='index' :id='index'>
                  <div class="item-left">
                      <p class="left-one">{{item.skuName}}</p>
                      <p class="left-two">{{item.updateTime ? item.updateTime : item.createTime}}</p>
                  </div>
                  <div class="item-right">{{item.servicePrice | changemoney}}</div>
              </li>
            </ul>
          </mt-loadmore>
        </div>
    </div>
</template>

<script>
import store from "@/vuex/store";
import { Toast } from "mint-ui";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "payment",
  data() {
    return {
      money: 0,
      total: 0,
      beginTime: "2018-01-01",
      endTime: "",
      _startTime: "",
      _endTime: "",
      page: 1,
      allLoaded: false,
      lists: []
    };
  },
  filters: {
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
    },
    changetime: function(val) {
      let arr = val.split(" ");
      return arr[0];
    }
  },
  store,
  computed: {
    ...mapState(["userInfo", "shopInfo"])
  },
  methods: {
    ...mapMutations(["setuserInfo"]),
    //通过shopId查询商家的缴费记录(通过此接口来判断发起缴纳服务费的开始时间和结束时间)
    getBeginTime() {
      let _this = this;
      this.$axios
        .get(
          this.$GLOBAL.API +
            "app/serviceAmount/selectByShopId?shopId=" +
            this.userInfo.id
        )
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.data) {
              _this.beginTime = res.data.data.beginTime;
              _this.endTime = res.data.data.endTime;
              _this._startTime = res.data.data.beginTime;
              _this._endTime = res.data.data.endTime;
            }
          }
          _this.amount();
          _this.amountList();
        });
    },
    //查询某个时间段的服务费信息
    amount() {
      let _this = this,
        _value =
          "shopId=" +
          this.userInfo.id +
          "&begainTime=" +
          _this.beginTime +
          "&endTime=" +
          _this.endTime;
      _this.$axios
        .get(this.$GLOBAL.API + "app/hx/amount?" + _value)
        .then(res => {
          if (res.data.code == 0) {
            let service = res.data.data[1].totalNoService;
            _this.money = service ? service : 0;
          }
        });
    },
    //获取列表数据
    amountList() {
      let _this = this;
      let _value =
        "shopId=" +
        this.userInfo.id +
        "&begainTime=" +
        _this.beginTime +
        "&endTime=" +
        _this.endTime +
        "&page=" +
        this.page +
        "&rows=10";
      this.$axios.get(this.$GLOBAL.API + "app/hx/list?" + _value).then(res => {
        let data = res.data;
        if (data.code == 0) {
          _this.total = data.data.total;
          if (data.data.list && data.data.list.length > 0) {
            let _list = data.data.list;
            if (_this.page == 1) {
              _list = _list.slice(1);
            }
            for (let i = 0; i < _list.length; i++) {
              if (_list[i].skuName && _list[i].servicePrice) {
                _this.lists.push(_list[i]);
              }
            }
          } else {
            this.allLoaded = true; // 若数据已全部获取完毕
          }
        } else {
          this.allLoaded = true; // 若数据已全部获取完毕
        }
      });
    },
    //点击立即交费
    handPayment: function() {
      // console.log(this._startTime, this._endTime, this.money);
      // console.log("userInfo:",this.shopInfo);
      // console.log('shopInfo:',this.userInfo)
      // if (this.money <= 0) {
      //   Toast("暂不需要缴纳服务费");
      // } else {

      let id = "wxpay";
      this.pay(id);
      // }
    },
    //支付
    pay(id) {
      // 从服务器请求支付订单
      var WXPAYSERVER =
        this.$GLOBAL.API +
        "app/wxpay/payForShopApp?shopId=" +
        this.userInfo.id +
        "&servicePrice=0.1&beginTime=" +
        this._startTime +
        "&endTime=" +
        this._endTime +
        "&userId=" +
        this.shopInfo.id;
      var PAYSERVER = "";
      var channel = null; //支付通道
      var wxChannel = null; // 微信支付

      PAYSERVER = WXPAYSERVER;
      mui.plusReady(function() {
        // 获取支付通道
        plus.payment.getChannels(
          function(channels) {
            console.log('channels:',channels)
            for (var i in channels) {
              if (channels[i].id == "wxpay") {
                wxChannel = channels[i];
                channel = wxChannel;
                console.log('channel:',channel)
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                  switch (xhr.readyState) {
                    case 4:
                      if (xhr.status == 200) {
                        plus.payment.request(
                          channel,
                          xhr.responseText,
                          function(result) {
                            console.log('result:',result)
                            plus.nativeUI.alert("支付成功: ", function() {
                              back();
                            });
                          },
                          function(error) {
                            console.log('error:',error)
                            plus.nativeUI.alert("支付失败：" + error.code);
                          }
                        );
                      } else {
                        alert("获取订单信息失败！");
                      }
                      break;
                      default:
                      break;
                  }
                };
                xhr.open("POST", PAYSERVER);
                xhr.send();
              } else {
                aliChannel = channels[i];
              }
            }
          },
          function(e) {
            alert("获取支付通道失败：" + e.message);
          }
        );
      });
    },
    //点击缴费记录
    handRecord: function() {
      this.$router.push("/annal");
    },
    //点击月份账单
    handBill: function() {
      this.$router.push("/historyofthebill");
    },
    //点击日历图标
    handdate: function() {
      this.$router.push("/customize");
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
    //下拉
    loadTop() {
      this.page = 1;
      this.allLoaded = false;
      this.lists = [];
      this.amountList();
      this.$refs.payment.onTopLoaded();
    },
    //上拉
    loadBottom() {
      this.page += 1;
      this.amountList();
      this.$refs.payment.onBottomLoaded();
    }
  },
  created() {
    this.endTime = this.formatDate(new Date());
    this.getBeginTime();
  }
};
</script>

<style lang="less">
.payment {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #ebebeb;
  overflow: scroll;
  .mint-header,
  .pay-top,
  .pay-date {
    position: fixed;
    z-index: 100;
  }
  .mint-header {
    z-index: 101;
  }
  .pay-top {
    padding-top: 80px;
    width: 100%;
    height: 444px;
    background: #fff;
    .top-one {
      color: #191919;
      font-size: 28px;
      text-align: center;
      padding-top: 60px;
    }
    .top-two {
      color: #191919;
      font-size: 60px;
      text-align: center;
      margin-top: 35px;
      margin-bottom: 61px;
    }
    .topPay {
      width: 694px;
      background: #fc5e2d;
    }
    .top-three {
      color: #5972a1;
      font-size: 30px;
      text-align: center;
      margin-top: 31px;
    }
    .top-three span:nth-child(2) {
      margin: 0 40px;
    }
  }
  .pay-date {
    width: 672px;
    padding: 0 39px;
    height: 113px;
    top: 524px;
    background: #ebebeb;
    .date-left {
      width: 70%;
      height: 100%;
      float: left;
      & > p {
        text-align: left;
        height: 40px;
        line-height: 40px;
      }
      .date-pone {
        margin-top: 16.5px;
        color: #191919;
        font-size: 28px;
      }
      .data-ptwo {
        color: #808080;
        font-size: 24px;
      }
    }
    .date-right {
      width: 27%;
      height: 100%;
      float: right;
      position: relative;
      .sel-date {
        width: 54px;
        height: 46px;
        margin-top: 19px;
        float: right;
        display: block;
      }
      .data-pthree {
        color: #5972a1;
        font-size: 20px;
        position: relative;
        top: 75px;
        left: 90px;
      }
    }
  }
  .pay-cont {
    width: 672px;
    padding: 0 39px;
    position: relative;
    top: 637px;
    z-index: 50;
    background: #fff;
    .item {
      width: 100%;
      height: 90px;
      padding: 15px 0;
      .item-left {
        width: 70%;
        height: 100%;
        float: left;
        & > p {
          width: 100%;
          overflow: hidden;
          text-align: left;
        }
        .left-one {
          height: 50px;
          line-height: 50px;
          color: #191919;
          font-size: 30px;
        }
        .left-two {
          height: 40px;
          line-height: 40px;
          color: #808080;
          font-size: 24px;
        }
      }
      .item-right {
        width: 28%;
        height: 100%;
        line-height: 120px;
        color: #191919;
        font-size: 36px;
        overflow: hidden;
        float: right;
        text-align: right;
      }
    }
  }
}
</style>













