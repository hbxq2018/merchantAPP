<template>
    <div class="customize">
        <mt-header fixed title="自定义查询">
          <router-link slot="left" :to="{path:'payment'}">
            <mt-button icon="back"></mt-button>
          </router-link>
        </mt-header>
        <div class="legend">目前仅支持查询最多31天数据</div>
        <mt-field label="开始时间" placeholder="选择开始时间" type="date" v-model="beginTime"></mt-field>
        <mt-field label="结束时间" placeholder="选择结束时间" type="date" v-model="endTime"></mt-field>
        <div class="inquiry" @click="inquiry">查询</div>
        
        <div class="cus-date" v-if="isShow">
            <p class="date-pone">{{_beginTime}}至{{_endTime}}</p>
            <p class="date-ptwo">服务费{{total}}笔，共{{money | changemoney}}元</p>
        </div>
        
        <div class="cus-cont">
          <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :autoFill="false" ref="custom">
            <ul>
              <li class="item" v-for="(item,index) in lists" :key="index">
                  <div class="item-left">
                      <p class="leftpone">{{item.skuName}}</p>
                      <p class="lefttwo">{{item.updateTime ? item.updateTime : item.createTime}}</p>
                  </div>
                  <div class="item-right">{{item.servicePrice | changemoney}}</div>
              </li>
            </ul>
          </mt-loadmore>
        </div>
    </div>
</template>

<script>
import { Toast } from "mint-ui";
import store from "@/vuex/store";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "customize",
  data() {
    return {
      beginTime: "",
      endTime: "",
      _beginTime: "",
      _endTime: "",
      money: 0,
      total: 0,
      isShow: false,
      allLoaded: false,
      page: 1,
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
      let d1 = this.beginTime,
        d2 = this.endTime,
        diff = 0;
      if (new Date(d1.replace(/-/g, "/")) < new Date(d2.replace(/-/g, "/"))) {
        diff = new Date(d2.replace(/-/g, "/"))-new Date(d1.replace(/-/g, "/"));
        if(diff < 2678410000){
          this.lists = [];
          this.amount();
          this.amountList();
          this.isShow = true;
        }else{
          this.beginTime = "";
          this.endTime = "";
          Toast("最多查询31天的数据");
        }
      } else {
        this.beginTime = "";
        this.endTime = "";
        Toast("开始时间不得比结束时间晚");
      }
    },
    //获取已核销总额与总数量
    amount() {
      let _this = this,
        _value =
          "shopId=" +
          this.userInfo.id +
          "&begainTime=" +
          _this.beginTime +
          "&endTime=" +
          _this.endTime;
          _this._beginTime = _this.beginTime;
          _this._endTime = _this.endTime;
      _this.$axios.get(this.$GLOBAL.API+"app/hx/amount?" + _value).then(res => {
        if (res.data.code == 0) {
          let service = res.data.data[1].totalNoService;
          _this.money = service ? service : 0;
        }
      });
    },
    //获取核销列表数据
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
      _this.$axios.get(this.$GLOBAL.API+"app/hx/list?" + _value).then(res => {
        let data = res.data;
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
    }
  }
};
</script>

<style lang="less">
.customize {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #ebebeb;
  .legend {
    width: 674px;
    padding: 80px 38px 0 38px;
    height: 62px;
    line-height: 62px;
    color: #555;
    font-size: 24px;
    text-align: left;
  }
  .inquiry {
    width: 100%;
    height: 100px;
    line-height: 100px;
    font-size: 30px;
    background: #fff;
    text-align: center;
    color: #fc5e2d;
  }
  .cus-date {
    width: 674px;
    height: 80px;
    padding: 17px 38px;
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
}
</style>

