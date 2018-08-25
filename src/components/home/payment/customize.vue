<template>
    <div class="customize">
        <mt-header fixed title="自定义查询">
          <router-link slot="left" :to="{path:'payment'}">
            <mt-button icon="back"></mt-button>
          </router-link>
        </mt-header>
        <div class="legend">目前仅支持查询最多31天数据</div>
        <div class="seldate">
          <div class="iqudate" @click="openPicker(1)"><div class="iquleft">开始时间</div>{{beginTime}}</div>
          <div class="iqudate" @click="openPicker(2)"><div class="iquleft">结束时间</div>{{endTime}}</div>
        </div>
       
        <div class="inquiry" @click="inquiry">查询</div>
        
        <div class="cus-date" v-if="isShow">
            <p class="date-pone">{{_beginTime}}至{{_endTime}}</p>
            <p class="date-ptwo">服务费{{total}}笔，共{{money | changemoney}}元</p>
        </div>
        
        <div :class="lists.length>0?'cus-cont':'cus-cont actcus-cont'">
          <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :autoFill="false" ref="custom">
            <ul v-if="lists.length>0">
              <li class="item" v-for="(item,index) in lists" :key="index">
                  <div class="item-left">
                      <p class="leftpone">{{item.skuName}}</p>
                      <p class="lefttwo">{{item.updateTime ? item.updateTime : item.createTime}}</p>
                  </div>
                  <div class="item-right">{{item.servicePrice | changemoney}}</div>
              </li>
            </ul>
            <img v-else class="empty" src="../../../../static/images/zhanweitu.png" alt="空空如也">
          </mt-loadmore>
        </div>
        
        <mt-datetime-picker
          type="date"
          ref="custpicker"
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
import { Toast , DatetimePicker , Indicator } from "mint-ui";
import store from "@/vuex/store";
import Vue from "vue";
Vue.component(DatetimePicker.name, DatetimePicker);
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "customize",
  data() {
    return {
      beginTime: "请选择开始时间",
      endTime: "请选择结束时间",
      _beginTime: "",
      _endTime: "",
      mindata:"",
      money: 0,
      total: 0,
      isShow: false,
      allLoaded: false,
      pickerVisible:true,
      page: 1,
      actId:1,
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
    }
  },
  store,
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    ...mapMutations(["setuserInfo"]),
    //点击查询
    inquiry: function() {  
      //选择自定义时间查询只可查询（看），不能进行缴费等其它操作
      let d1 = this.beginTime,
        d2 = this.endTime,
        diff = 0;
      d2 = new Date(this.endTime);
      d2.setTime(d2.getTime() + 24 * 60 * 60 * 1000);
      d2 =this.formatDate(d2);
      if (new Date(d1.replace(/-/g, "/")) < new Date(d2.replace(/-/g, "/"))) {
        diff = new Date(d2.replace(/-/g, "/"))-new Date(d1.replace(/-/g, "/"));
        if(diff < 2678410000){//2678410000=60*60*24*1000+
          this.lists = [];
          this.page = 1;
          this.amount();
          this.amountList();
          this.isShow = true;
        }else{
          this.beginTime = "请选择开始时间";
          this.endTime = "请选择结束时间";
          Toast("最多查询31天的数据");
        }
      } else {
        this.beginTime = "请选择开始时间";
        this.endTime = "请选择结束时间";
        Toast("开始时间不得比结束时间晚");
      }
    },
    //获取已核销总额与总数量
    amount() {
      let _this = this,_tomorrow='', _value ='';
      _tomorrow = new Date(this.endTime);
      _tomorrow.setTime(_tomorrow.getTime() + 24 * 60 * 60 * 1000);
      _tomorrow =this.formatDate(_tomorrow);
      _value =
        "shopId=" +
        this.userInfo.id +
        "&begainTime=" +
        _this.beginTime +
        "&endTime=" +
        _tomorrow;
        _this._beginTime = _this.beginTime;
      _this._endTime = _this.endTime;
      _this.$axios.get("/api/app/hx/amount?" + _value).then(res => {
        if (res.data.code == 0) {
          let service = res.data.data[1].totalService;
          _this.money = service ? service : 0;
        }
      });
    },
    //获取核销列表数据
    amountList() {
      Indicator.open("数据加载中...");
      let _this = this,_tomorrow='',_value='';
      _tomorrow = new Date(this.endTime);
      _tomorrow.setTime(_tomorrow.getTime() + 24 * 60 * 60 * 1000);
      _tomorrow =this.formatDate(_tomorrow);
      _value =
        "shopId=" +
        this.userInfo.id +
        "&begainTime=" +
        _this.beginTime +
        "&endTime=" +
        _tomorrow +
        "&page=" +
        this.page +
        "&rows=10";
      _this.$axios.get("/api/app/hx/list?" + _value).then(res => {
        let data = res.data;
        Indicator.close();
        if (data.code == 0) {
          _this.total = data.data.total;
          let _list = data.data.list;
          if (_list && _list.length>0) {
            for (let i = 0; i < _list.length; i++) {
              if(_list[i].shopName && _list[i].skuName){
                _this.lists.push(_list[i]);
                
              }
            }
          }else {
            this.allLoaded = true; // 若数据已全部获取完毕
          }
        }
      });
    },
     //下拉
    loadTop() {
      this.page = 1;
      this.allLoaded = false;
      this.lists = [];
      this.amountList();
      this.$refs.custom.onTopLoaded();
    },
    //上拉
    loadBottom() {
      this.page += 1;
      this.amountList();
      this.$refs.custom.onBottomLoaded();
    },
    openPicker(id) {
      this.$refs.custpicker.open();
      this.actId = id;
    },
    //判断时间大小
    handleConfirm(data) {
      if (this.actId == 1) {
        if (this.endTime) {
          if (
            new Date(this.formatDate(data)).getTime() >
            new Date(this.endTime).getTime()
          ) {
            Toast("开始时间不能大于结束时间");
            return false;
          }
        }
        this.beginTime = this.formatDate(data);
      } else if (this.actId == 2) {

        console.log('dataa;',data)
        if (this.beginTime) {
          if (
            new Date(this.beginTime).getTime() >
            new Date(this.formatDate(data)).getTime()
          ) {
            Toast("结束时间不能小于开始时间");
            return false;
          }
        }
        this.endTime = this.formatDate(data);
      }
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
    }
  },
  created:function(){
    let _mindata = new Date(new Date().getTime() -86400000 * 365*2);
    this.mindata = new Date(_mindata);
  }
};
</script>

<style lang="less">
.customize {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #ebebeb;
  overflow: scroll;
  .legend {
    position: fixed;
    top: 80px;
    width: 674px;
    padding: 0px 38px 0 38px;
    height: 62px;
    line-height: 62px;
    color: #555;
    font-size: 24px;
    text-align: left;
    background: #ebebeb;
    z-index: 100;
  }
  .seldate{
    position: fixed;
    top: 140px;
    width: 100%;
    height: 200px;
    z-index: 100;
    background: #fff;
    .iqudate{
      width: 100%;
      height:49%;
      text-align: center;
      line-height: 100px;
      border-bottom: 2px solid #ebebeb;
      .iquleft{
        width: 30%;
        height: 100%;
        float: left;
      }
    }
  }
  .inquiry {
    position: fixed;
    left: 0;
    top: 340px;
    width: 100%;
    height: 100px;
    line-height: 100px;
    font-size: 30px;
    background: #fff;
    text-align: center;
    color: #fc5e2d;
    z-index: 100;
  }
  .cus-date {
    position: fixed;
    top: 440px;
    left: 0;
    width: 674px;
    height: 80px;
    padding: 17px 38px;
    background: #ebebeb;
    z-index: 100;
    & > p {
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: left;
    }
    .date-pone {
      color: #191919;
      font-size: 28px;
    }
    .date-ptwo {
      color: #808080;
      font-size: 24px;
    }
  }
  .cus-cont {
    width: 100%;
    background: #fff;
    margin-top: 580px;
    .empty{
      width: 50%;
      margin-top: 20%;
    }
    .item {
      width: 674px;
      height: 110px;
      padding: 17px 38px;
      .item-left {
        float: left;
        width: 70%;
        & > p {
          text-align: left;
          height: 55px;
          line-height: 55px;
        }
        .leftpone {
          color: #1f1f1f;
          font-size: 30px;
        }
        .lefttwo {
          color: #929292;
          font-size: 27px;
        }
      }
      .item-right {
        float: right;
        text-align: right;
        width: 30%;
        height: 100%;
        line-height: 110px;
      }
    }
  }
  .actcus-cont{
    background: none;
  }
}
</style>

