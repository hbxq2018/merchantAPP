<template>
  <div class="billCheck">
        <mt-header fixed title="历史账单">
          <router-link slot="left" :to="{path:'payment'}">
            <mt-button icon="back"></mt-button>
          </router-link>
        </mt-header>
        <div class="top_distance" v-if="data">
          <div class="check_top">
            <div class="check_top_time" ><span>2018</span>年</div>
            <div class="income_operate_time" @click="moreyear">
                <!-- <img src="../../../../static/images/calendar.png" alt=""> -->
            </div>
          </div>
          <div class="check_center" v-for="(item,index) in data" :key="index"  v-if="item" @click="particularsDetails(index)">
            <div class="checkCtSublevel">
              <div class="roder_left">
                  <b>{{data.length-index}}<span>月账单</span></b>
                  <p>&yen;{{item.totalService | changemoney}}</p>
              </div>
              <div class="roder-right">
                  <span :class="!item.isBill?'actspan':''">{{item.isBill?'已缴清':item.totalService?'待打款':''}}</span>
                  <img src="../../../../static/images/home_arrow.png" alt="账单详情图标">
              </div>
            </div>
          </div>
        </div>
        <div  v-if="!data" class="top_distance">暂无数据</div>
  </div>
</template>

<script>
import { formatDate } from "../../../../untils/util";
import { InfiniteScroll, Indicator,Toast } from "mint-ui";
import store from "@/vuex/store";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "billCheck",
  data() {
    return {
      time: "",
      data: [],
      today:'',
      index: 2
    };
  },
  filters: {
    formatDate() {
      let date = this.today;
      let mon = date.getFullYear();
      let _data = formatDate(date, "yyyy-MM-dd hh:mm");
      return mon;
    },
    changemoney:function(val){
      val = val*1;
      val=val.toFixed(2);
      let result=addCommas(val),x='', x1=0,x2=0;
      function addCommas(nStr){
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + ',' + '$2');
        } 
        val = x1 + x2;
        return val;
      }
      return result;
    }
  },
  store,
  computed: {
    ...mapState(["userInfo", "shopId"])
  },
  methods: {
    particularsDetails: function(ind) {
      let _ind = this.data.length - ind,
        isbill = this.data[ind].isBill,
        money = this.data[ind].totalService,
        totalNoService = this.data[ind].totalNoService;
      let obj = {
        ind: _ind,
        isBill: isbill,
        money: money,
        totalNoService: totalNoService
      };
      this.$router.push({ name: "DetailsSon", params: obj });
    },
    moreyear: function() {
      console.log("moreyear");
    }
  },
  created: function() {
    Indicator.open("数据加载中...");
    let _this = this,_date = new Date(),isSuccess = false;
    let _start =_this.$UTILS.dateConv(_date);
    let arr = _start.split("/");
    arr[1]= '01';
    arr[2] = "01";
    _start = arr.join("/");
    //  let _end = new Date(_this.$UTILS.dateConv(_date)).getTime() + 86400000;
    let _end = new Date(_this.$UTILS.dateConv(_date)).getTime();
    _end = _this.$UTILS.dateConv(new Date(_end));
    let obj = {
      shopId: this.shopId,
      begainTime: _start,
      endTime: _end
    };
    let parms = "",value = "";
    for (var key in obj) {
      value += key + '=' + obj[key] + '&';
    }
    value = value.substring(0, value.length-1);
    setTimeout(() => {
      if (!isSuccess) {
        isSuccess = false;
        Indicator.close();
        Toast("网络异常，请检查网络连接");
      }
    }, Delay);
    this.$axios.get("/api/app/hx/listAmount?" + value).then(res => {
      Indicator.close();
      isSuccess = true;
      if (res.data.code == 0) {
        let _data =[];
         for(key in res.data.data){
           _data.push(res.data.data[key])
         }
        _data.reverse();
        _this.data = _data;
      }
    });
  }
};
</script>

<style lang="less">
.billCheck {
  width: 100%;
  height: 94%;
  padding-top: 10%;
  background: #ebebeb;

  .check_top {
    width: 100%;
    height: 80px;
    background: #ebebeb;
    display: flex;
    justify-content: center;
    align-items: center;
    letter-spacing: 2px;
    .check_top_time {
      width: 90%;
      height: 80px;
      text-align: left;
      margin-left: 5%;
      line-height: 80px;
      font-size: 30px;
      color: #808080;
    }
    .income_operate_time {
      text-align: right;
      width: 10%;
      margin-right: 30px;
      img {
        margin-top: 15px;
        width: 47px;
        height: 47px;
      }
    }
  }
  .check_center {
    width: 100%;
    height: 145px;
    background: #fff;
    display: flex;
    justify-content: flex-end;
    .checkCtSublevel {
      width: 95%;
      height: 145px;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      letter-spacing: 2px;
      .roder_left {
        line-height: 50px;
        text-align: left;
        b {
          font-size: 30px;
        }
        p {
          font-size: 27px;
          color: #929292;
        }
      }
      .roder-right {
        font-size: 28px;
        padding-right: 39px;
        color: #b1b1b1;
        span {
          vertical-align: margin;
          font-size: 28px;
          color: #b1b1b1;
        }
        .actspan {
          color: #fc5e2d;
        }
        img {
          width: 12px;
          height: 22px;
          padding-left: 21px;
          vertical-align: margin;
        }
      }
    }
  }
}
</style>


