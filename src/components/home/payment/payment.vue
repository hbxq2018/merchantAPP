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
        <div :class="lists.length?'pay-cont':'pay-cont actpay-cont'">
          <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :autoFill="false" ref="payment">
            <ul v-if="lists.length>0">
              <li class="item" v-for="(item,index) in lists" :key='index' :id='index'>
                  <div class="item-left">
                      <p class="left-one">{{item.skuName}}</p>
                      <p class="left-two">{{item.updateTime ? item.updateTime : item.createTime}}</p>
                  </div>
                  <div class="item-right">{{item.servicePrice | changemoney}}</div>
              </li>
            </ul>
            <img v-else class="empty" src="../../../../static/images/zhanweitu.png" alt="空空如也">
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
      _this.lists=[];
      this.$axios
        .get(
          "/api/app/serviceAmount/selectByShopId?shopId=" +
            this.userInfo.id
        )
        .then(res => {
          if (res.data.code == 0) {
            //使用查询到的结束时间做为入参的开始时间，入参结束时间则今天（当前日期_endTime），但显示结束时间使用昨天（当前日期的前一天）
            if (res.data.data) {
              let newstart = res.data.data.endTime; 
              newstart = ((new Date(newstart)).getTime()- 24 * 60 * 60 * 1000); 
              newstart = new Date(newstart);
              _this.beginTime =  _this.formatDate(newstart);
              _this._startTime = res.data.data.endTime;
            }else{
              _this.beginTime = "2018-01-01"; 
              _this._startTime = "2018-01-01";
            }
          }
          let yesterday = new Date();
          _this._endTime = _this.formatDate(new Date());
          yesterday.setTime(yesterday.getTime() - 24 * 60 * 60 * 1000);
          this.endTime =  _this.formatDate(yesterday);


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
          _this._endTime;
      _this.$axios
        .get("/api/app/hx/amount?" + _value)
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
        _this._endTime +
        "&page=" +
        this.page +
        "&rows=10";
      this.$axios.get("/api/app/hx/list?" + _value).then(res => {
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
      if (this.money <= 0) {
        Toast("暂不需要缴纳服务费");
      } else {
        let id = "wxpay";// 微信支付
        this.pay(id);
      }
    },
    //支付
    pay(id) {
      // 从服务器请求支付订单
      let _this = this;
      var WXPAYSERVER =
        "/api/app/wxpay/payForShopApp?shopId=" +
        this.userInfo.id +
        "&servicePrice="+this.money+
        "&beginTime=" +
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
            for (var i in channels) {
              if (channels[i].id == "wxpay") {
                wxChannel = channels[i];
                channel = wxChannel;
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {//3
                  switch (xhr.readyState) {
                      // 1\2\3\4
                    case 4:
                      if (xhr.status == 200) {
                        let obj = JSON.parse(xhr.responseText);
                        plus.payment.request(
                          channel,
                          obj.data,
                          function(result) {
                            console.log("result:", result);
                            plus.nativeUI.alert("支付成功: ", function() {
                              _this.getBeginTime();
                              back();
                            });
                          },
                          function(error) {
                            console.log("error:", error);
                            let str = error.message,msg='';
                            if(str.indexOf("-1") != -1){
                              msg = '一般错误，请联系客服';
                            }else if(str.indexOf("-2") != -1){
                              msg = '支付取消，请重新支付';
                            }else if(str.indexOf("-3") != -1){
                              msg = '发送失败，请稍后再试';
                            }else if(str.indexOf("-4") != -1){
                              msg = '认证被否决';
                            }else if(str.indexOf("-5") != -1){
                              msg = '不支持错误';
                            }
                            if(msg){
                              _this.getBeginTime();
                              plus.nativeUI.alert(msg);
                            }
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
                xhr.open("POST", PAYSERVER);//1
                xhr.send();//2
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
      //选择自定义时间查询只可查询（看），不能进行缴费等其它操作
      this.$router.push("/customize");
    },
    //yyyy-MM-dd
    formatDate(data) {
      let month = data.getMonth() + 1;
      let strDate = data.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentdate = data.getFullYear() + "-" + month + "-" + strDate;
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
    .empty{
      width: 50%;
      margin-top: 20%;
    }
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
  .actpay-cont{
    background: none;
  }
}
</style>













