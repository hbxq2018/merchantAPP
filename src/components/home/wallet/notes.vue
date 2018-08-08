 <!-- 提现明细 -->
<template>
    <div class="notes">
        <mt-header fixed title="明细">
            <router-link slot="left" :to="{path:'wallet'}">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div style="height:80px;"></div>
        <div class="notestop" @click="handTop">
            <div :class="acttop?'actdiv':''">转出</div>
            <div :class="acttop?'':'actdiv'">转入</div>
        </div>
        <!-- <div style="height:90px;"></div> -->
        <div class="conten">
             <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :autoFill="false" ref="notesmore">
                <ul>
                    <li class="item" v-for="(item,index) in list" :key="index" :id="index">
                        <div class="item-one">
                            <p class="item-p"> {{acttop?'转出':'转入'}}</p>
                            <p class="item-t">{{item.createTime}}</p>
                        </div>
                        <div class="item-two">{{item.operateAmount | changemoney}}</div>
                    </li>
                </ul>
            </mt-loadmore>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import { Loadmore } from "mint-ui";
import store from "@/vuex/store";
import { mapState, mapMutations } from "vuex";
Vue.component(Loadmore.name, Loadmore);
export default {
  name: "notes",
  data() {
    return {
      acttop: true,
      allLoaded: false,
      page: 1,
      operateType: 1,
      list: []
    };
  },
  store,
  computed: {
    ...mapState(["shopInfo", "userInfo"])
  },
  filters: {
      //数字格式化
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
     //时间格式化
    rendDate: function(val) {
      val = new Date(val);
      val =
        val.getFullYear() +
        "-" +
        (val.getMonth() + 1) +
        "-" +
        val.getDate() +
        " " +
        val.getHours() +
        ":" +
        val.getMinutes();
      return val;
    }
  },
  methods: {
    //下拉
    loadTop() {
      this.page = 1;
      this.allLoaded = false;
      this.list = [];
      this.getDatelist();
      this.$refs.notesmore.onTopLoaded();
    },
    //上拉
    loadBottom() {
      this.page += 1;
      this.getDatelist();
      this.$refs.notesmore.onBottomLoaded();
    },
    //获取列表数据
    getDatelist: function() {
      let _parms = {
          userId: this.shopInfo.id,
          operateType: this.operateType,
          page: this.page,
          row: 10
        },
        _value = "";
      for (var key in _parms) {
        _value += key + "=" + _parms[key] + "&";
      }
      this.$axios.get(this.$GLOBAL.API+"app/account/listTrading?" + _value).then(res => {
        if (res.data.code == 0) {
          if (res.data.data.list && res.data.data.list.length > 0) {
            let _list = res.data.data.list;
            for (let i in _list) {
              this.list.push(_list[i]);
            }
          } else {
            this.allLoaded = true; // 若数据已全部获取完毕
          }
        } else {
          this.allLoaded = true; // 若数据已全部获取完毕
        }
      });
    },
    //切换收入支出
    handTop: function() {
      this.page = 1;
      this.allLoaded = false;
      this.list = [];
      this.acttop = !this.acttop;
      if (this.acttop) {
        this.operateType == 1;
      } else {
        this.operateType == 2;
      }
      this.getDatelist();
    }
  },
  created: function() {
    this.getDatelist();
  }
};
</script>

<style lang="less">
.notes {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #ebebeb;
  overflow: scroll;
  .notestop {
    position: fixed;
    left: 0;
    top: 80px;
    width: 100%;
    background: #fff;
    height: 90px;
    z-index: 9999;
    & > div {
      width: 49.5%;
      float: left;
      text-align: center;
      height: 90px;
      line-height: 90px;
    }
    & > div:nth-child(1) {
      border-right: 1px solid #ebebeb;
    }
    .actdiv {
      color: #fc5e2d;
      border-bottom: #fc5e2d 1px solid;
    }
  }
  .conten {
    width: 100%;
    margin-top: 20px;
    background: #fff;
    .item {
      width: 694px;
      height: 100px;
      padding: 10px 28px;
      border-block-end: 1px solid #e0e0e0;
      .item-one {
        width: 70%;
        height: 100%;
        float: left;
        & > p {
          text-align: left;
          height: 40px;
          line-height: 40px;
        }
        & > p:nth-child(1) {
          margin-top: 10px;
        }
      }
      .item-two {
        width: 30%;
        height: 100px;
        line-height: 100px;
        float: left;
      }
      .item-left {
        color: #808080;
      }
      .item-right {
        float: right;
      }
      .item-two {
        .item-right {
          color: #fc5e2d;
          font-size: 24px;
        }
      }
    }
  }
}
</style>





