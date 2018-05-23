<template>
  <div class="billCheck">
        <mt-header fixed title="历史账单">
          <router-link to="/historyse" slot="left">
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
                  <b>{{(index)}}<span>月账单</span></b>
                  <p>&yen;{{item?item.totalPrice:'0'}}</p>
              </div>
              <div class="roder-right">
                  <span>详情</span>
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
import { InfiniteScroll } from "mint-ui";
import store from "@/vuex/store";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "billCheck",
  data() {
    return {
      time: "",
      data: []
    };
  },
  filters: {
    formatDate() {
      var date = new Date();
      let mon = date.getFullYear();
      let _data = formatDate(date, "yyyy-MM-dd hh:mm");
      return mon;
    }
  },
  store,
  computed: {
    ...mapState(["userInfo", "shopId"])
  },
  methods: {
    particularsDetails: function(ind) {
      let obj = {ind:ind}
      this.$router.push({ name: "DetailsSon", params: obj });
    },
    moreyear:function(){
      console.log('moreyear')
    }
  },
  created: function() {
    let _this = this;
    let _date = new Date();
    let _start =_this.$UTILS.dateConv(_date);
    let arr = _start.split("/");
    arr[1]= '01';
    arr[2] = "01";
    _start = arr.join("/");
    let _end = new Date(_this.$UTILS.dateConv(_date)).getTime() + 86400000;
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
    this.$axios.get("/apiapp/hx/listAmount?" + value).then(res => {
      if (res.data.code == 0) {
        _this.data = res.data.data;
      }
    });
  }
};
</script>

<style lang="less">
.billCheck {
  width: 100%;
  height:94%;
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
      margin-left:5%;
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


