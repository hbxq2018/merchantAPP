<template>
    <div class="actdetails">
        <mt-header fixed title="活动详情">
            <router-link to="/home" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div class="actimg">
          <img :src="actdata.mainPic" alt="活动图片">
        </div>
        <div class="actname">
            <p>{{actdata.actName}}</p>
            <p>人气：{{actdata.viewNum}}</p>
        </div>
        <div class="introduction">{{actdata.actDesc}}</div>
        <div class="buttons">
            <span @click="clickdetails">活动详情</span><span @click="clicksign">马上报名</span>
        </div>
        <div class="actmore">
            <ul v-if="issign" class="moreul">
                <li class="moreli"  v-for="(item,index) in dishdata" :key="index">
                    <img :src="item.picUrl" alt="菜品图片">
                    <div class="dishinfo">
                        <p>{{item.actSkuName}}</p>
                        <p>{{item.skuCode}}号</p>
                        <p><span>活动价: ¥{{item.agioPrice}}</span><span><s>原价：¥{{item.sellPrice}}</s></span></p>
                    </div>
                    <div class="dishticket">
                        {{item.voteNum}}票
                    </div>
                </li>
            </ul>
            <img v-else :src="morebj" class="notsign" alt="没有报名">
        </div>
    </div>
</template>
<script>
import store from "@/vuex/store";
import { Toast,Indicator } from "mint-ui";
import { mapState, mapMutations, mapGetters } from "vuex";
import qs from "qs";
import { formatDate } from "../../../untils/util";
import GLOBAL from "../../../untils/config/config";
export default {
  name: "actdetails",
  data() {
    return {
      API: GLOBAL,
      issign: true,
      _type: "",
      morebj: require("../../../static/images/notsign.png"),
      actdata: {},
      dishdata: []
    };
  },
  store,
  computed: {
    ...mapState(["userInfo", "shopInfo"])
  },
  methods: {
    ...mapMutations(["setuserInfo", "setshopId", "setshopInfo"]),
    getactdata: function() {
      Indicator.open({
        spinnerType: 'triple-bounce'
      });
      let _parms = {
          id: 37,
          userId: this.shopInfo.id,
          userName: this.shopInfo.userName,
          sourceType: this._type
        },
        _value = "";
      for (var key in _parms) {
        _value += key + "=" + _parms[key] + "&";
      }
      _value = _value.substring(0, _value.length - 1);
      this.$axios.get("/api/app/act/detail?" + _value).then(res => {
        if (res.data.code == 0) {
          Indicator.close();
          this.actdata = res.data.data;
        }
      });
    },
    getdishdata: function() {
      // console.log("API:", this.API.API);
      let date = new Date(),
        begain = "",
        _end = "",
        _value = "",
        _parms = {};
      begain = formatDate(date, "yyyy/MM/dd");
      _end = new Date(this.$UTILS.dateConv(date)).getTime() + 86400000;
      _end = this.$UTILS.dateConv(new Date(_end));
      _parms = {
        actId: 37,
        beginTime: begain,
        endTime: _end,
        shopId:this.userInfo.id,
        voteUserId: this.shopInfo.id,
        isLuoxuan: 0,
        flag: "1"
      };
      for (var key in _parms) {
        _value += key + "=" + _parms[key] + "&";
      }
      _value = _value.substring(0, _value.length - 1);
      this.$axios.get("/api/app/actSku/listNewAct?" + _value).then(res => {
        if (res.data.code == 0) {
          this.dishdata = res.data.data.list;
        }
      });
    },
    clickdetails: function() {
      let obj = {
        acturl:this.actdata.actUrl,
        type:1
      }
      this.$router.push({ name: "Aboutthefood", params: obj });
    },
    clicksign: function() {
      if (this.dishdata && this.dishdata.length) {
        let len = this.dishdata.length;
        if (len > 4) {
          Toast("每家商家最多只能报名五道菜参赛，您已报名有五道菜了");
        } else {
          this.$router.push({ name: "Actsign", params: {} });
        }
      } else {
        this.$router.push({ name: "Actsign", params: {} });
      }
    }
  },
  created() {
    const ua = navigator.userAgent.toLowerCase();
    if (/(iPhone|iPad|iPod|iOS)/i.test(ua)) {
      this._type = 4;
    } else if (/(Android)/i.test(ua)) {
      this._type = 3;
      document.documentElement.style.height = this.screenHeight + "px";
      document.body.style.height = this.screenHeight + "px";
    } else {
      this._type = 2;
    }
    this.getactdata();
    this.getdishdata();
  }
};
</script>
<style lang="less">
.actdetails {
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  overflow: auto;
  height: 100%;
  background: #ebebeb;
  .actimg {
    margin-top: 80px;
    width: 100%;
    height: 420px;
    overflow: hidden;
    &>img{
      max-width: 750px;
      height: 100%;
    }
  }
  .actname {
    width: 694px;
    padding: 28px;
    height: 96px;
    background: #fff;
    border-bottom: 1px solid #e0e0e0;
    p {
      height: 48px;
      line-height: 48px;
      text-align: left;
    }
    & > p:nth-child(1) {
      color: #191919;
      font-size: 24px;
    }
    & > p:nth-child(2) {
      color: #b1b1b1;
      font-size: 22px;
    }
  }
  .introduction {
    text-indent: 2em;
    padding: 20px 0;
    width: 694px;
    min-height: 100px;
    padding: 28px;
    background: #fff;
    text-align: left;
  }
  .buttons {
    width: 100%;
    margin: 25px 0;
    & > span {
      border-radius: 24px;
      color: #fc5e2d;
      padding: 10px 20px;
      display: inline-block;
      border: 2px solid #fc5e2d;
      z-index: 2;
    }
    & > span:nth-child(1) {
      margin-right: 150px;
    }
  }
  .notsign {
    margin-top: 120px;
    width: 150px;
    height: 200px;
  }
  .actmore {
    width: 750px;
    background: #ebebeb;
    .moreul {
      width: 100%;
      background: #fff;
      .moreli {
        width: 696px;
        margin-left: 30px;
        height: 170px;
        border-bottom: 1px solid #e0e0e0;
        height: 130px;
        padding: 20px 0;
        & > img {
          float: left;
          width: 130px;
          height: 130px;
          border-radius: 10px;
        }
        .dishinfo {
          height: 130px;
          width: 400px;
          margin-left: 20px;
          float: left;
          & > p {
            text-align: left;
          }
          & > p:nth-child(1) {
            height: 48px;
            line-height: 48px;
            font-size: 36px;
            color: #191919;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          & > p:nth-child(2) {
            font-size: 22px;
            color: #555555;
          }
          & > p:nth-child(3) {
            height: 48px;
            line-height: 48px;
            & > span:nth-child(1) {
              color: #ff5252;
              line-height: 28px;
              margin-right: 20px;
            }
            & > span:nth-child(2) {
              color: #555;
              line-height: 24px;
            }
          }
        }
        .dishticket {
          width: 130px;
          height: 130px;
          float: right;
          color: #fc5e2d;
          font-size: 36px;
        }
      }
    }
  }
}
</style>



