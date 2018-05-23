<template>
    <div class="income">
		<div class="income_top">
        <mt-header title="营业数据" class="income_header">
            <router-link to="/home" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
            <mt-button @click="turnmore(1)" slot="right" class="income_header_date">{{actday}}</mt-button>
        </mt-header>
        <div class="income_banner">
            <div class="income_banner_data">
                <p class="income_data_num">￥{{totalPrice}}</p>
                <p>营业额</p>
            </div>
            <div class="income_banner_data">
                <p class="income_data_num">{{total}}</p>
                <p>核销券数</p>
            </div>
        </div>
        <div class="income_operate">
            <div class="income_operate_result">
                <p>{{start}} -- {{end}}</p>
                <p>
                    <span>营业额：￥{{totalPrice}}元</span>
                    <span>核销券数：{{total}}张</span>
                </p>
            </div>
            <div class="income_operate_time" @click="turnmore(2)">
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
                <div @click.stop="openPicker(1)">开始时间：<span>{{start}}</span></div>
                <div @click.stop="openPicker(2)">结束时间：<span>{{end}}</span></div>
            </div>
            <div class="selbut">
                <div class="close" @click="close">取消</div>
                <div class="cfrm" @click="cfrm">确定</div>
            </div>
        </div>
    </div>
    <div class="filling"></div>
    <div class="loadBottom" :style="{'-webkit-overflow-scrolling': scrollMode}">
      <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"  ref="loadmore">
        <div class="income_list">
          <ul>
              <li class="income_li" v-for="(item,index) in votes" :key='index' :id='item.id' @click="getliid">
                  <div class="income_li_l">
                      <div class="face_value">
                          {{item.couponAmount}}元
                      </div>
                  </div>
                  <div class="income_li_r">
                      <div class="income_amount">
                          <p>消费金额</p>
                          <p>￥{{item.paidAmount}}</p>
                      </div>
                      <div class="income_date">{{item.updateTime}}</div>
                  </div>
              </li>
          </ul>
        </div>
      </mt-loadmore>
    </div>

    <mt-datetime-picker
            ref="picker"
            type="date"
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
import { DatetimePicker, Toast,Loadmore } from "mint-ui";
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(Loadmore.name, Loadmore);
import store from "@/vuex/store";
import { mapState, mapMutations } from "vuex";
export default {
  name: "Income",
  data() {
    return {
      start: "",
      end: "",
      actval: "",
      total: "",
      pickerValue: "",
      Visible: true,
      ismore: false,
      actday: "",
      isselectday: false,
      isselecttime: false,
      maxdata: "",
      mindata: "",
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
      totalPrice: "",
      pag:1,
      allLoaded: false,
      scrollMode: "auto"
    };
  },
  created: function() {
    let _this = this;
    const ua = navigator.userAgent.toLowerCase();
      if (/(iPhone|iPad|iPod|iOS)/i.test(ua)) {
        this.scrollMode = 'touch';
      }
    let _date = new Date();
    let _mindata =
      new Date(_this.$UTILS.dateConv(_date)).getTime() - 86400000 * 365;
    this.mindata = new Date(_mindata);
    let _maxdata =
      new Date(_this.$UTILS.dateConv(_date)).getTime() + 86400000 * 365 * 3;
    this.maxdata = new Date(_maxdata);

    let _start = new Date(_this.$UTILS.dateConv(_date)).getTime();
    _start = _this.$UTILS.dateConv(new Date(_start));
    let _end = new Date(_this.$UTILS.dateConv(_date)).getTime() + 86400000;
    _end = _this.$UTILS.dateConv(new Date(_end));

    this.start = _start;
    this.end = _end;
    this.oldstart = _start;
    this.oldend = _end;
    this.pag = 1;
    this.getdata(_start, _end,this.pag);
    this.actday = this.days[0].title;
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
      this.allLoaded = false;
      let _this = this,date = _this.$UTILS.dateConv(this.pickerValue);
      if (this.actval == 1) {
        this.start = date;
      } else if (this.actval == 2) {
        this.end = date;
      }
    },
    setdate: function(val) {
      if (val) {
        let arr = val.split("/");
        return arr[0] + "年" + arr[1] + "月" + arr[2] + "日";
      }
    },
    close: function() {
      this.start = "";
      this.end = "";
    },
    cfrm: function() {
      if (this.start && this.end) {
        let _start = new Date(this.start);
        let _end = new Date(this.end);
        let pag = 1;
        _start = _start.getTime();
        _end = _end.getTime();
        this.oldstart = this.start;
        this.oldend =this.end;
        if (_end > _start) {
          this.getdata(this.start, this.end,this.pag);
        } else {
          Toast("结束时间不能小于开始时间");
        }
      } else if (!this.start || !this.end) {
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
    getliid: function(e) {
      let id = e.currentTarget.id;
      this.$router.push({ name: "Writeoff", params: { id: id } });
    },
    selectday: function(e) {
      let _this = this;
      this.actday = e.currentTarget.id;
      let _date = new Date();
      let _start = "",_deff = 60 * 60 * 24 * 1000;
      let _end = new Date(_this.$UTILS.dateConv(_date)).getTime() + _deff * 1;
      _end = _this.$UTILS.dateConv(new Date(_end));
      this.end = _end; 
      this.pag=1;
      this.allLoaded = false;
      this.oldend = _end;
      if (this.actday == "今日") {
        _start = new Date(_this.$UTILS.dateConv(_date)).getTime();
        _start = _this.$UTILS.dateConv(new Date(_start));
        this.start = _start;
        this.oldstart = _start;
        this.getdata(_start, _end,this.pag);
      } else if (this.actday == "7日") {
        _start = new Date(_this.$UTILS.dateConv(_date)).getTime() - _deff * 7;
        _start = _this.$UTILS.dateConv(new Date(_start));
        this.start = _start;
        this.oldstart = _start;
        this.getdata(_start, _end,this.pag);
      } else if (this.actday == "15日") {
        _start = new Date(_this.$UTILS.dateConv(_date)).getTime() - _deff * 15;
        _start = _this.$UTILS.dateConv(new Date(_start));
        this.start = _start;
        this.oldstart = _start;
        this.getdata(_start, _end,this.pag);
      }
    },
    getdata: function(start, end,val,type) {
      // console.log("oldstart:",this.oldstart)
      // console.log('start:',start)
      // console.log('oldend:',this.oldend)
      // console.log('end:',end)
      // console.log('val',val)
      if(this.oldstart != start || this.oldend != end || val == 1){
        // console.log('vates')
        this.votes = [];
      }
      let obj = {
        shopId: this.shopId,
        begainTime: start,
        endTime: end,
        page:val,
        rows:10
      };
      this.oldstart == start;
      this.oldend == end;
      let _value = "";
      for (var key in obj) {
        _value += key + "=" + obj[key] + "&";
      }
      _value = _value.substring(0, _value.length - 1);
      this.$axios.get("/api/app/hx/list?" + _value).then(res => {
        if (res.data.code == "0") {
          let _data = res.data.data;
          this.total = _data.total;
          this.totalPrice = 0;
          if (_data.list) {
            this.totalPrice = _data.list[0].totalPrice;
            let arr = _data.list.splice(0, 1);
            if(_data.list.length>0){
              for(let j=0;j<_data.list.length;j++){
                this.votes.push(_data.list[j])
              }
            }else{
                this.allLoaded = true;
            }
          }
          if(type == 'top'){
            this.$refs.loadmore.onTopLoaded();
          }else if(type == 'bot'){
              this.$refs.loadmore.onBottomLoaded();
          }
        }
      });
    },
    loadTop: function() {//下拉加载
      this.pag = 1;
      this.allLoaded = false;
      this.getdata(this.start,this.end,this.pag,'top')
    },
    loadBottom: function() {// 上拉加载
      ++this.pag;
      this.getdata(this.start,this.end,this.pag,'bot')
    }
  }
};
</script>

<style lang="less">
.income {
  .income_top {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
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
  .income_banner {
    margin-top: -1px;
    background-color: #fc5e2d;
    display: flex;
    height: 264px;
    color: #fff;
    .income_banner_data {
      flex: direction-flex;
      width: 50%;
      height: 100%;
      padding-top: 60px;
      box-sizing: border-box;
      p {
        font-size: 30px;
      }
      .income_data_num {
        margin-bottom: 20px;
        font-size: 54px;
      }
    }
  }
  .income_operate {
    height: 120px;
    padding: 20px 41px;
    box-sizing: border-box;
    background-color: #ebebeb;
    display: flex;
    & > div {
      flex: direction-flex;
      justify-content: space-between;
    }
    .income_operate_result {
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
    .income_operate_time {
      text-align: right;
      width: 10%;
      img {
        margin-top: 15px;
        width: 47px;
        height: 47px;
      }
    }
  }
  .income_list {
    background-color: #fff;
    ul {
      padding: 0;
      margin: 0;
      li {
        display: flex;
        padding: 16px 40px;
        box-sizing: border-box;
        text-align: left;
        & > div {
          flex: direction-flex;
          justify-content: space-between;
        }
        .income_li_l {
          width: 18%;
          .face_value {
            height: 90px;
            width: 90px;
            background-color: #fc5e2d;
            border-radius: 50%;
            color: #fff;
            text-align: center;
            line-height: 90px;
            font-size: 32px;
          }
        }
        .income_li_r {
          width: 82%;
          .income_amount {
            display: flex;
            padding: 5px 0 12px 0;
            box-sizing: border-box;
            p {
              flex: direction-flex;
              justify-content: space-between;
              font-size: 30px;
              color: #1f1f1f;
              font-weight: 600;
            }
            p:first-child {
              width: 80%;
            }
            p:last-child {
              width: 20%;
              text-align: right;
              color: #fc5e2d;
            }
          }
          .income_date {
            font-size: 26px;
            color: #929292;
          }
        }
      }
    }
  }
  .mobox {
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
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
      .adays:nth-last-child(1){
        border: none;
      }
    }
  }
  .filling{
    width: 100%;
    height: 465px;
    background: red;
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
        span{
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