
 <!-- 钱包页面 -->
<template>
    <div class="wallet">

        <mt-header fixed title="钱包">
            <router-link slot="left" :to="{path:'home',query:{'ind':2}}">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>

        <div class="watll-top">
            <p class="balance">钱包余额（元）</p>
            <p class="digital">{{Balance | changemoney}}</p>
        </div>

        <div class="available">可提现金额：<span>{{drawmoney | changemoney}}元</span></div>

        <div class="list">
            <div class="list-item" v-for="(item,index) in lists" :key='index' :id="item.id" @click="handclick">
                <div class="item-color">
                    <img :src="item.icon" :alt="item.name">
                </div>
                <div class="item-name">{{item.name}}</div>
                <img class="item-more" :src="item.img" alt="更多"> 
            </div>
        </div>

        
    </div>
</template>

<script>
import store from "@/vuex/store";
import { mapState, mapMutations } from "vuex";
export default {
  name: "wallet",
  data() {
    return {
      Balance: 0,
      drawmoney: 0,
      ismain:false,
      mainId:'',
      lists: [
        {
          id: 0,
          name: "提现",
          img: require("../../../../static/images/home_arrow.png"),
          icon: require("../../../../static/images/draw.png")
        },
        {
          id: 1,
          name: "明细",
          img: require("../../../../static/images/home_arrow.png"),
          icon: require("../../../../static/images/detes.png")
        }
      ]
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
    ...mapState(["userInfo", "shopInfo"])
  },
  methods: {
    //查询当前用户是否是当前商家的主账号
    account: function() {
      this.$axios
        .get("/api/app/shopCashier/adminByShopId?shopId=" +this.userInfo.id)
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.data && res.data.data.id) {
                this.mainId = res.data.data.cashierId;
                this.getBalance();
                this.getdrawAmount();
              if (res.data.data.cashierId != this.shopInfo.id) {
                this.ismain = true;
                this.lists = this.lists.slice(1);
              }
            } else {
              this.ismain = false;
            }
          }
        });
    },
    //查询钱包余额
    getBalance: function() {
      this.$axios
        .get("/api/app/account/balance?userId=" + this.mainId)
        .then(res => {
          if (res.data.code == 0) {
            this.Balance = res.data.data;
          }
        });
    },
    //查询可提现金额
    getdrawAmount: function() {
      let _this = this;
      this.$axios
        .get("/api/app/tx/selectCashTime?shopId=" + this.userInfo.id)
        .then(res => {
          //查询开始时间
          if (res.data.code == 0) {
            let begtime = "",
              _beginTime = "",
              _endTime = "";
            if (res.data.data && res.data.data.endTime) {
              begtime = res.data.data.endTime;
              begtime = begtime.replace(/\-/g, "/");
            } else {
              begtime = 1514736000 * 1000; //首次提现以2018-01-01 0：00：00为开始时间
            }
            begtime = new Date(begtime);
            _beginTime = this.formatDate(begtime);

            let today = new Date();
            _endTime = this.formatDate(today);
            let _value =
              "soStatus=2&isDui=0&shopId=" +
              this.shopInfo.shopId +
              "&beginTime=" +
              _beginTime +
              "&endTime=" +
              _endTime;
            this.$axios.get("/api/app/so/totalAmount?" + _value).then(res => {
              if (res.data.code == 0) {
                this.drawmoney = res.data.data;
              }
            });
          }
        });
    },
    //点击提现或明细
    handclick: function(e) {
      const id = e.currentTarget.id;
      if (id == 0) {
        //提现
        // this.$router.push("/withdraw");
        this.$router.push({ name: "Withdraw", params: {mainId:this.mainId} });
      } else if (id == 1) {
        //明细
        this.$router.push({ name: "Notes", params: {mainId:this.mainId} });
        // this.$router.push("/notes");
      }
    },
    //yyyy-mm-dd
    formatDate(date) {
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentdate = date.getFullYear() + "/" + month + "/" + strDate;
      return currentdate;
    }
  },
  created: function() {
      this.account();
  }
};
</script>

<style lang="less">
.wallet {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #ebebeb;
  .watll-top {
    padding: 80px 28px 0 28px;
    width: 694px;
    height: 285px;
    background: #f14915;
    .balance {
      color: #fff9f7;
      width: 100%;
      font-size: 24px;
      padding: 45px 0 52px 0;
      text-align: left;
    }
    .digital {
      color: #fff;
      width: 100%;
      font-size: 112px;
      margin-bottom: 42px;
      text-align: left;
    }
  }
  .available {
    padding: 0px 28px 0 28px;
    width: 694px;
    height: 70px;
    text-align: left;
    line-height: 70px;
    color: #fff9f7;
    background: #f14915;
  }
  .list {
    width: 750px;
    min-height: 80px;
    // background: #fff;
    .item-color img {
      width: 100%;
      height: 100%;
    }

    .list-item {
      padding: 0px 28px 0 28px;
      width: 694px;
      float: left;
      text-align: left;
      height: 80px;
      background: #fff;
      border-block-end: 1px solid #e0e0e0;
      .item-color {
        width: 34px;
        height: 34px;
        margin: 23px 23px 23px 0;
        float: left;
      }
      .item-name {
        float: left;
        height: 100%;
        line-height: 80px;
        color: #252525;
        font-size: 30px;
      }
      .item-more {
        width: 12px;
        height: 22px;
        margin-top: 29px;
        float: right;
      }
    }
  }
}
</style>




