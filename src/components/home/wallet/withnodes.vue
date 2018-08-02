 <!-- 提现明细 -->
<template>
    <div class="withnotes">
        <mt-header fixed :title="title">
            <mt-button icon="back" slot="left"  @click="goback"></mt-button>
        </mt-header>

        <div class="conten" v-show="!carrying">
            <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
                <ul>
                   <li class="item" v-for="(item,index) in list" :key="index" :id="index" @click="handlist">
                        <p class="item-one">
                            余额提现 <span class="item-left">({{item.bank}}-{{item.card}})</span> 
                            <span class="item-right">{{item.money | changemoney}}</span>
                        </p>
                        <p class="item-two">
                            <span class="item-left">{{item.date}}</span>
                            <span class="item-right">{{item.status}}</span>
                        </p>
                    </li>
                </ul>
            </mt-loadmore>
        </div>

        <div v-if="carrying">
            <div class="carrying">
                <div class="carrleft">
                    <p class="left-pone">提现</p>
                    <p class="left-ptwo">2018-07-27 14:21</p>
                </div>
                <div class="carrright">{{money | changemoney}}</div>
            </div>
            <div class="carr-cont">
                <div class="cstop">
                    <div class="carleft">
                        <div class="round actload"></div>
                        <div class="erect actload"></div>
                    </div>
                    <div class="carright">
                        <p>已发起提现申请，等待银行处理</p>
                        <p>2018-07-27 14:21</p>
                    </div>
                </div>
                <div class="csbottom">
                    <div class="carleft">
                        <div class="erect"></div>
                        <div class="round"></div>
                    </div>
                    <div class="carright">
                        <p>到账成功</p>
                        <p>预计到账时间2018-07-28 23:59</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import { Loadmore } from "mint-ui";
Vue.component(Loadmore.name, Loadmore);
export default {
  name: "notes",
  data() {
    return {
      carrying:false,
      allLoaded:false,
      allLoaded:false,
      title:'提现记录',
      money: 2312,
      list: [
        {
          bank: "建设银行",
          card: "3461",
          date: "2018-07-25 14:32",
          money: "200",
          status: "审核中"
        },
        {
          bank: "邮政银行",
          card: "3371",
          date: "2018-07-16 18:32",
          money: "1730",
          status: "审核中"
        },
        {
          bank: "民生银行",
          card: "1198",
          date: "2018-07-21 11:32",
          money: "1400",
          status: "提现失败"
        },
        {
          bank: "工商银行",
          card: "0943",
          date: "2018-07-06 07:32",
          money: "280",
          status: "提现成功"
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
  methods: {
    handlist: function(e) {
      let id = e.currentTarget.id;
      this.carrying = true;
      for (let i in this.list) {
        this.money = this.list[id].money;
        this.title='提现详情';
      }
    },
    goback: function() {
      if (this.carrying) {
        this.title='提现记录';
        this.carrying = false;
      } else {
        this.$router.push("/withdraw");
      }
    },
    loadTop() {
        console.log('loadTop')
        this.allLoaded = false;
        this.list=this.list.slice(0,4);
        this.$refs.loadmore.onTopLoaded();
    },
    loadBottom() {
        console.log('loadBottom123')
        for(let i in this.list){
            this.list[i].money = this.list[i].money*1+1;
            this.list.push(this.list[i])
        }
        console.log(this.list.length)
        if(this.list.length>30){
            this.allLoaded = true;
        }
        // this.allLoaded = true;// 若数据已全部获取完毕
        this.$refs.loadmore.onBottomLoaded();
    }
  }
};
</script>

<style lang="less">

.withnotes {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #ebebeb;
  overflow: scroll;
  .conten {
    width: 100%;
    padding-top: 80px;
    background: #fff;
    .item {
      width: 694px;
      height: 100px;
      padding: 10px 28px;
      border-block-end: 1px solid #e0e0e0;
      & > p {
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: left;
        color: #191919;
        font-size: 30px;
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
  .carrying {
    width: 100%;
    height: 90px;
    padding: 95px 0 15px 0;
    background: #fff;
    .carrleft {
      width: 400px;
      height: 100%;
      margin-left: 37px;
      float: left;
      & > p {
        text-align: left;
        width: 100%;
        height: 40px;
        line-height: 40px;
      }
    }
    .carrright {
      width: 100px;
      height: 100%;
      float: right;
      line-height: 90px;
      margin-right: 37px;
    }
  }
  .carr-cont {
    width: 674px;
    height: 245px;
    padding: 38px 56px;
    margin-top: 20px;
    background: #fff;
    & > div {
      width: 100%;
      height: 122.5px;
      position: relative;
    }
    .round{
        width: 30px;
        height: 30px;
        background: #B1B1B1;
        border-radius: 50%;
    } 
    .erect{
        width: 4px;
        height: 92px;
        background: #B1B1B1;
        position: relative;
        left: 13px;
    }
    .actload{
        background: #FC5E2D;
    }
    
    .carleft {
      width: 10%;
      height: 100%;
      float: left;
    }
    .carright {
      width: 90%;
      height: 100%;
      float: left;
      & > p {
        text-align: left;
      }
      p:nth-child(1) {
        color: #fc5e2d;
      }
      p:nth-child(2) {
        margin-top: 20px;
      }
    }
  }
}
</style>





