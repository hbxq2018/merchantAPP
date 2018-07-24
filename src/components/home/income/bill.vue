<template>
    <div class="bill">
    <div class="bill_top">
        <mt-header fixed title="营业数据" class="bill_header">
            <router-link :to="{path:'/income',query:{start:start,end:end,actday:actday}}" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
            <mt-button @click="turnmore(1)" slot="right" class="bill_header_date">{{actday}}</mt-button>
        </mt-header>
        <div class="bill_operate">
            <div class="bill_operate_result">
                <p>{{start}} -- {{end}}</p>
                <p>
                    <span>核销券数：{{orderNum}}张</span>
                    <span>服务费：￥{{totalCost}}元</span>
                </p>
            </div>
            <div class="bill_operate_time" @click="turnmore(2)">
                <img src="../../../../static/images/calendar.png" alt="">
            </div>
        </div>
    </div>
        
    <div class="mobox" @click="closemore" v-show="ismore">
        <div class="triangle" v-show="isselectday"></div>
        <ul class="moreday" v-show="isselectday">
            <li class="adays" v-for="(item,index) in days" :key='index' :id='item.title' @click="selectday">{{item.title}}</li>
        </ul>
        <div class="select" v-show="isselecttime">
            <div class="select_top">
                <span class="stleft">选择起始时间</span>
            </div>
            <div class="date">
                <div @click.stop="openPicker(1)">开始时间：<span>{{temstart}}</span></div>
                <div @click.stop="openPicker(2)">结束时间：<span>{{temend}}</span></div>
            </div>
            <div class="selbut">
                <div class="close"  @click="closemore">取消</div>
                <div class="cfrm" @click="cfrm">确定</div>
            </div>
        </div>
    </div>

    <div class="filling" id="filling"></div>

    <div class="loadBottom billbox" :style="{'-webkit-overflow-scrolling': scrollMode}">
      <ul v-if="votes.length>0" id="bill" class="billul" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
          <li class="bill_li" v-for="(item,index) in votes" :key='index' :id='item.id' @click="getliid">
              <div class="bill_li_name">{{item.skuName}}</div>
              <div class="bill_li_info">
                  <div class="left">
                      <p>券码</p>
                      <p>券状态</p>
                      <p>服务费</p>
                      <p>核销时间</p>
                  </div>
                  <div class="right">
                      <p>{{item.couponCode}}</p>
                      <p>{{item.userName}}</p>
                      <p>{{item.servicePrice}}</p>
                      <p>{{item.updateTime}}</p>
                  </div>
              </div>
          </li>
          <li class="loadingBox" v-if="loadFlag">加载中..</li>
      </ul>
      <img v-else class="emtpy" :src="url" alt="什么都没有">
    </div>

    <mt-datetime-picker
            ref="picker"
            type="date"
            v-if="maxdata"
            year-format="{value} 年"
            month-format="{value} 月"
            date-format="{value} 日"
            v-model="pickerValue"
            :startDate = 'mindata'
            :endDate = 'maxdata'
            @confirm="handleConfirm"
        >
    </mt-datetime-picker>

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
  name: "Bill",
  data() {
    return {
      start: "",
      end: "",
      temstart: "",
      temend: "",
      actval: "",
      orderNum: "0",
      totalCost: 0,
      pickerValue: "",
      Visible: true,
      ismore: false,
      actday: "",
      isselectday: false,
      isselecttime: false,
      maxdata: "",
      mindata: "",
      url: require('../../../../static/images/zhanweitu.png'),
      days: [
        {
          title: "今日"
        },
        {
          title: "7日"
        },
        {
          title: "15日"
        }
      ],
      votes: [],
      page: 1,
      allLoaded: true,
      scrollMode: "auto",
      touchStartY: 0,
      distance: 0,
      topFlag: false, //是否到顶部
      bottomFlag: false, //是否到底部
      flag: true, //节流阀
      loadFlag: false,
      today: ""
    };
  },
  created: function() {
    let _this = this;
    const ua = navigator.userAgent.toLowerCase();
    if (/(iPhone|iPad|iPod|iOS)/i.test(ua)) {
      this.scrollMode = "touch";
    }

    this.$axios.get("/api/app/act/getDate").then(res => {
      res.data.data = res.data.data.replace(/(-)/g, "/");
      this.today = res.data.data;
      let _date = new Date(this.today);
      // this.today =_date;
      let _mindata =
        new Date(_this.$UTILS.dateConv(new Date(_date))).getTime() -
        86400000 * 365;
      this.mindata = new Date(_mindata);
      let _maxdata =
        new Date(_this.$UTILS.dateConv(new Date(_date))).getTime() +
        86400000 * 365 * 3;
      this.maxdata = new Date(_maxdata);

      let _start = new Date(_this.$UTILS.dateConv(new Date(_date))).getTime();
      _start = _this.$UTILS.dateConv(new Date(_start));
      let _end =
        new Date(_this.$UTILS.dateConv(new Date(_date))).getTime() + 86400000;
      _end = _this.$UTILS.dateConv(new Date(_end));

      if (this.$route.query.start) {
        _start = this.$route.query.start;
        _end = this.$route.query.end;
        this.actday = this.$route.params.actday;
      }
      if (this.$route.params.start) {
        _start = this.$route.params.start;
        _end = this.$route.params.end;
        this.actday = this.$route.params.actday;
      }
      this.start = _start;
      this.end = _end;
      this.temstart = _start;
      this.temend = _end;

      this.getdata();
      if (!this.actday) {
        this.actday = this.days[0].title;
      }
    });
  },
  components: {
    newtime: function() {
      return (newtime = this.start + this.end);
    }
  },
  watch: {
    newtime: function() {
      this.page = 1;
      this.getdata();
    }
  },
  store,
  computed: {
    ...mapState(["shopId"])
  },
  methods: {
    openPicker(val) {
      this.actval = val;
      this.$refs.picker.open();
    },
    handleConfirm() {
      this.allLoaded = true;
      let _this = this,
        date = _this.$UTILS.dateConv(this.pickerValue);
      if (this.actval == 1) {
        this.temstart = date;
      } else if (this.actval == 2) {
        this.temend = date;
      }
    },
    setdate: function(val) {
      if (val) {
        let arr = val.split("/");
        return arr[0] + "年" + arr[1] + "月" + arr[2] + "日";
      }
    },
    // 时间判断
    closemore: function() {
      this.temend = this.end;
      this.temstart = this.start;
    },
    cfrm: function() {
      if (this.temstart && this.temend) {
        let _start = new Date(this.temstart);
        let _end = new Date(this.temend);
        this.page = 1;
        _start = _start.getTime();
        _end = _end.getTime();
        // this.oldstart = this.start;
        // this.oldend =this.end;
        if (_end > _start) {
          this.end = this.temend;
          this.start = this.temstart;
          this.getdata(this.start, this.end);
        } else {
          Toast("结束时间不能小于开始时间");
          this.temend = this.end;
          this.temstart = this.start;
        }
      } else if (!this.temstart || !this.temend) {
        Toast("请选择开始时间或结束时间");
      }
    },
    turnmore: function(val) {
      this.ismore = true;
      if (val == 1) {
        this.isselectday = true;
      } else if (val == 2) {
        this.isselecttime = true;
        this.pickerVisible = true;
      }
    },
    closemore: function() {
      this.ismore = false;
      this.isselectday = false;
      this.isselecttime = false;
    },
    // 跳转至详情
    getliid: function(e) {
      let id = e.currentTarget.id;
      let obj = {
        id: id,
        type: 2,
        start: this.start,
        end: this.end,
        actday: this.actday
      };
      for (let i = 0; i < this.votes.length; i++) {
        if (this.votes[i].id == id) {
          obj.skuName = this.votes[i].skuName;
          obj.servicePrice = this.votes[i].servicePrice;
        }
      }
      this.$router.push({ name: "Writeoff", params: obj });
    },
    // 选择日期
    selectday: function(e) {
      this.allLoaded = true;
      let _this = this,
        _date = this.today;
      this.actday = e.currentTarget.id;
      let _start = "",
        _deff = 60 * 60 * 24 * 1000;
      let _end =
        new Date(_this.$UTILS.dateConv(new Date(_date))).getTime() + _deff * 1;
      _end = _this.$UTILS.dateConv(new Date(new Date(_date)));
      this.end = _end;
      this.page = 1;
      // this.oldend = _end;
      this.votes = [];
      if (this.actday == "今日") {
        _start = new Date(_this.$UTILS.dateConv(new Date(_date))).getTime();
        _start = _this.$UTILS.dateConv(new Date(_start));
        this.start = _start;
        this.getdata();
      } else if (this.actday == "7日") {
        _start =
          new Date(_this.$UTILS.dateConv(new Date(_date))).getTime() -
          _deff * 7;
        _start = _this.$UTILS.dateConv(new Date(_start));
        this.start = _start;
        this.getdata();
      } else if (this.actday == "15日") {
        _start =
          new Date(_this.$UTILS.dateConv(new Date(_date))).getTime() -
          _deff * 15;
        _start = _this.$UTILS.dateConv(new Date(_start));
        this.start = _start;
        this.getdata();
      }
    },
    //获取列表数据
    getdata: function(start, end, val) {
      // Indicator.open("数据加载中...");
      let obj = {
          shopId: this.shopId,
          begainTime: start ? start : this.start,
          endTime: end ? end : this.end,
          page: val ? val : this.page,
          rows: 10
        },
        _value = "";
      for (var key in obj) {
        _value += key + "=" + obj[key] + "&";
      }
      _value = _value.substring(0, _value.length - 1);
      this.$axios.get("/api/app/hx/list?" + _value).then(res => {
        if (res.data.code == "0") {
          this.loadFlag = false;
          let _data = res.data.data;
          this.orderNum = _data.total ? _data.total : 0;
          if (_data.list) {
            if (_data.list.length > 0) {
              if (this.page == 1) {
                this.votes = [];
                this.totalCost = _data.list[0].totalService;
              }
              _data.list = _data.list.slice(1, _data.list.length);
              for (let j = 0; j < _data.list.length; j++) {
                if (/^1[34578]\d{9}$/.test(_data.list[j].userName)) {
                  _data.list[j].userName =
                    _data.list[j].userName.substring(0, 3) +
                    "******" +
                    _data.list[j].userName.substring(9, 11);
                }
                // Indicator.close();
                this.votes.push(_data.list[j]);
              }
              if (_data.list.length < 10) {
                this.allLoaded = false;
              }
            } else {
              // Indicator.close();
              this.allLoaded = false;
            }
          } else {
            // Indicator.close();
            this.allLoaded = false;
          }
        } else {
          // Indicator.close();
        }
      });
    },

    //获取顶部卷去高度
    getScrollTop() {
      var scrollTop = 0,
        bodyScrollTop = 0,
        documentScrollTop = 0;
      if (document.body) {
        bodyScrollTop = document.body.scrollTop;
      }
      if (document.documentElement) {
        documentScrollTop = document.documentElement.scrollTop;
      }
      scrollTop =
        bodyScrollTop - documentScrollTop > 0
          ? bodyScrollTop
          : documentScrollTop;
      return scrollTop;
    },
    //盒子总高度
    getScrollHeight() {
      var scrollHeight = 0,
        bodyScrollHeight = 0,
        documentScrollHeight = 0;
      if (document.body) {
        bodyScrollHeight = document.body.scrollHeight;
      }
      if (document.documentElement) {
        documentScrollHeight = document.documentElement.scrollHeight;
      }
      scrollHeight =
        bodyScrollHeight - documentScrollHeight > 0
          ? bodyScrollHeight
          : documentScrollHeight;
      return scrollHeight;
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
    },
    touchStart(e) {
      let dishesUl = document.getElementById("bill");
      let bottomH = document.getElementById("filling").clientHeight;
      this.touchStartY = e.targetTouches[0].pageY;
      if (this.getScrollTop() == 0 && this.flag) {
        this.topFlag = true;
      } else {
        this.topFlag = false;
      }
      if (dishesUl.clientHeight < this.getWindowHeight() - bottomH - 5) {
        this.allLoaded = false;
        this.bottomFlag = false;
      }

      if (
        Math.abs(
          this.getScrollHeight() - this.getScrollTop() - this.getWindowHeight()
        ) < 5 &&
        this.allLoaded
      ) {
        this.bottomFlag = true;
      } else {
        this.bottomFlag = false;
      }
    },
    touchMove(e) {
      let dishesUl = document.getElementById("bill");
      this.distance = Math.ceil(+e.targetTouches[0].pageY - this.touchStartY);
      if (this.distance > 0 && this.topFlag == true && this.flag) {
        if (this.distance > 100) {
          this.distance = 100;
        }
        dishesUl.style.transform =
          "translate3d(0px, " + this.distance + "px, 0px)";
      }
      if (this.distance < 0 && this.bottomFlag == true) {
        if (this.distance < -100) {
          this.distance = -100;
        }
        dishesUl.style.transform =
          "translate3d(0px, " + this.distance + "px, 0px)";
      }
    },
    touchEnd() {
      let dishesUl = document.getElementById("bill"),
        _this = this;
      if (this.distance > 0 && this.topFlag == true && this.flag) {
        this.flag = false;
        let index = 100;
        let timer = setInterval(function() {
          if (index == 0) {
            clearInterval(timer);
            _this.flag = true;
            _this.distance = 0;
          }
          index--;
          dishesUl.style.transform = "translate3d(0px, " + index + "px, 0px)";
        }, 5);
        this.page = 1;
        this.allLoaded = true;
        this.getdata();
      }
      if (this.distance < 0 && this.bottomFlag == true) {
        let index = -100;
        let timer = setInterval(function() {
          if (index == 0) {
            clearInterval(timer);
          }
          index++;
          dishesUl.style.transform = "translate3d(0px, " + index + "px, 0px)";
        }, 5);
        ++this.page;
        this.getdata();
      }
    }
  }
};
</script>

<style lang="less">
.bill {
  background-color: #ebebeb;
  .bill_top {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
  }
  p {
    margin: 0;
  }
  width: 100%;
  height: 100%;
  font-family: "微软雅黑";
  position: relative;
  font-size: 30px;
  .iconimg {
    //   margin-top:10px;
    transform: rotate(90deg);
    border: 1px solid red;
  }
  .bill_operate {
    margin-top: 82px;
    height: 120px;
    padding: 20px 41px;
    box-sizing: border-box;
    background-color: #fff;
    display: flex;
    & > div {
      flex: direction-flex;
      justify-content: space-between;
    }
    .bill_operate_result {
      text-align: left;
      width: 90%;
      p:first-child {
        font-size: 32px;
        color: #1f1f1f;
      }
      p:last-child {
        font-size: 24px;
        color: #808080;
        span:first-child {
          margin-right: 39px;
        }
      }
    }
    .bill_operate_time {
      text-align: right;
      width: 10%;
      img {
        margin-top: 15px;
        width: 47px;
        height: 47px;
      }
    }
  }

  .billul {
    padding: 0;
    padding-top: 30px;
    margin: 0;
    position: relative;
    &:before {
      content: "加载中...";
      position: absolute;
      left: 0;
      top: -50px;
      height: 20px;
      width: 100%;
    }
    &:after{
        content: "加载中...";
        position: relative;
        left: 0;
        top: 50px;
        height: 20px;
        width: 100%;
    }
    li {
      margin: 0 30px 20px 30px;
      padding: 30px;
      box-sizing: border-box;
      text-align: left;
      background-color: #fff;
      color: #555555;
      font-size: 22px;
      .bill_li_name {
        font-size: 30px;
        color: #191919;
        font-weight: 600;
        width: 100%;
        margin-bottom: 20px;
      }
      .bill_li_info {
        width: 100%;
        clear: both;
        content: "";
        display: block;
        overflow: hidden;
        .left {
          float: left;
          p {
            margin-bottom: 10px;
          }
          p:last-child {
            margin-bottom: 0;
          }
        }
        .right {
          float: left;
          margin-left: 20px;
          p {
            margin-bottom: 10px;
          }
          p:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
    .loadingBox {
      background-color: #ebebeb;
      text-align: center;
      height: 30px;
      line-height: 30px;
      width: 100%;
      padding: 0;
      margin: 0;
      display: block;
      position: absolute;
      bottom: -30px;
      left: 0;
    }
  }

  .mobox {
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1001;
    overflow: auto;
    height: 100%;
    background: rgba(0, 0, 0, 0.44);
    font-size: 30px;
    .triangle {
      width: 0px;
      height: 0px;
      border-right: 15px solid rgba(0, 0, 0, 0);
      border-bottom: 15px solid #fff;
      border-left: 15px solid rgba(0, 0, 0, 0);
      float: right;
      margin-top: 65px;
      margin-right: 43px;
    }
    .moreday {
      width: 126px;
      height: 220px;
      background: #fff;
      float: right;
      margin-right: -70px;
      margin-top: 79px;
      border-radius: 20px;
      .adays {
        width: 80%;
        margin-left: 10%;
        height: 70px;
        line-height: 70px;
        font-style: normal;
        border-bottom: 1px solid #b1b1b1;
      }
      .adays:nth-last-child(1) {
        border: none;
      }
    }
  }
  .filling {
    width: 100%;
    height: 200px;
  }
  .billbox {
    background-color: #ebebeb;
  }
  .select {
    width: 672px;
    height: 350px;
    background: #fff;
    position: absolute;
    top: 50%;
    z-index: 5;
    left: 50%;
    margin-left: -336px;
    margin-top: -275px;
    .select_top {
      width: 100%;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
    .date {
      width: 100%;
      height: 144px;
      div {
        height: 70px;
        line-height: 70px;
        text-align: left;
        width: 80%;
        margin-left: 10%;
        span {
          color: #fc5e2d;
        }
      }
    }
    .selbut {
      width: 100%;
      height: 103px;
      border-top: 1px solid #e0e0e0;
      div {
        float: left;
        height: 100%;
        width: 49.8%;
        line-height: 103px;
        text-align: center;
      }
      .close {
        border-right: 1px solid #e0e0e0;
      }
    }
  }
}
</style>