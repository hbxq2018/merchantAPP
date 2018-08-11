 <!-- 提现明细 -->
<template>
    <div class="withnotes">
        <mt-header fixed :title="title">
            <mt-button icon="back" slot="left"  @click="goback"></mt-button>
        </mt-header>

        <div class="conten" v-show="list.length>0">
            <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :autoFill="false" ref="widthloadmore">
                <ul v-if="list">
                   <li class="item" v-for="(item,index) in list" :key="index" :id="item.id" @click="handlist">
                        <p class="item-one">
                            余额提现 <span class="item-left">(卡后四位-{{item.accountName}})</span> 
                            <span class="item-right">{{item.cashAmount | changemoney}}</span>
                        </p>
                        <p class="item-two">
                            <span class="item-left">{{item.createTime | rendDate}}</span>
                            <span class="item-right">{{item.applyStatus | rendStatus}}</span>
                        </p>
                    </li>
                </ul>
            </mt-loadmore>
        </div>
        <img v-if="list.length==0" class="empty" src="../../../../static/images/zhanweitu.png" alt="空空如也">

        <mt-popup
          v-model="carrying"
          popup-transition="popup-fade">
            <div class="modal" @click="closemodal">
              <div class="carrying">
                  <div class="carrleft">
                      <p class="left-pone">提现</p>
                      <p class="left-ptwo">{{actdata.createTime | rendDate}}</p>
                  </div>
                  <div class="carrright">¥{{actdata.cashAmount | changemoney}}</div>
              </div>
              <div class="carr-cont">
                  <div class="cstop">
                      <div class="carleft">
                          <div class="round actload"></div>
                          <div class="erect actload"></div>
                      </div>
                      <div class="carright">
                          <p>已发起提现申请，等待银行处理</p>
                          <p>{{actdata.createTime | rendDate}}</p>
                      </div>
                  </div>
                  <div class="csbottom">
                      <div class="carleft">
                          <div :class="actdata.applyStatus==2?'erect actload':'erect'"></div>
                          <div :class="actdata.applyStatus==2?'round actload':'round'"></div>
                      </div>
                      <div class="carright carrtwo">
                          <p>{{actdata.applyStatus | rendStatus}}</p>
                          <p v-if="actdata.applyStatus==2">预计到账时间{{actdata.arrivalTime | rendDate}}</p>
                      </div>
                  </div>
              </div>
            </div>
        </mt-popup>

        
    </div>
</template>

<script>
import Vue from "vue";
import { Loadmore,Popup,Indicator } from "mint-ui";
import store from "@/vuex/store";
import { mapState, mapMutations } from "vuex";
Vue.component(Loadmore.name, Loadmore);
export default {
  name: "notes",
  data() {
    return {
      carrying: false,
      allLoaded: false,
      page: 1,
      title: "提现记录",
      list: [],
      actdata: {}
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
     //翻译状态
    rendStatus: function(val) {
      /**
       * 审批状态 1 待审批 2 审批通过 3 审批不通过 4 取消 5 终止
       */
      if (val == 1) {
        return "待审批";
      } else if (val == 2) {
        return "审批通过";
      } else if (val == 3) {
        return "审批不通过";
      } else if (val == 4) {
        return "取消";
      } else if (val == 5) {
        return "终止";
      }
    },
    //时间格式化
    rendDate: function(val) {
      if(val){//兼容IOS
        val = val.replace(/\-/g, '/');
      }else{
        return false
      }
      val = new Date(val);
      
      let month = val.getMonth() + 1;
      let strDate = val.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }

      val =val.getFullYear() + "-" + month+ "-" + strDate +
      " " + val.getHours() +":" + val.getMinutes()+":" + val.getSeconds();

      return val;
    }
  },
  methods: {
    //点击某条数据，查看该数据详情
    handlist: function(e) {
      let id = e.currentTarget.id;
      for (let i in this.list) {
        if (id == this.list[i].id) {
          this.actdata = this.list[i];
          this.carrying = true;
        }
      }
    },
    //点击左上角返回图标
    goback: function() {
      if (this.carrying) {
        this.carrying = false;
      } else {
        this.$router.push("/withdraw");
      }
    },
    closemodal:function(){
      this.carrying = !this.carrying;
    },
     //下拉
    loadTop() {
      this.page = 1;
      this.allLoaded = false;
      this.list = [];
      this.gettxlist();
      this.$refs.widthloadmore.onTopLoaded();
    },
    //上拉
    loadBottom() {
      this.page += 1;
      this.gettxlist();
      this.$refs.widthloadmore.onBottomLoaded();
    },
     //查询提现记录数据
    gettxlist() {
      Indicator.open('数据加载中...');
      let _parms = {
          userId: this.shopInfo.id,
          page: this.page,
          row: 10
        },
        _value = "",_this = this;
      for (var key in _parms) {
        _value += key + "=" + _parms[key] + "&";
      }
      _value = _value.substring(0, _value.length - 1);
      this.$axios.get("/api/app/tx/list?" + _value).then(res => {
        Indicator.close();
        if (res.data.code == 0) {
          if (res.data.data.list && res.data.data.list.length > 0) {
            let _list = res.data.data.list;
            for (let i in _list) {
              let _createTime= _list[i].createTime;
              _createTime = _createTime.replace(/\-/g, '/');
              _createTime=new Date(_createTime);
              _createTime.setTime(_createTime.getTime() + 86400 * 2 * 1000);
              _createTime =this.formatDate(_createTime);
              _list[i].arrivalTime = _createTime;
              _list[i].accountName = _list[i].accountName.substr(
                _list[i].accountName.length - 4,
                4
              );
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
    // yyyy-mm-dd hh:MM:ss
    formatDate:function(date){
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let Hours = date.getHours();
      let Minutes = date.getMinutes();
      let Seconds = date.getSeconds();
      let currentdate = date.getFullYear() + "-" + month + "-" + strDate+" "+Hours+":"+Minutes+":"+Seconds;
      return currentdate;
    }
  },
  created: function() {
    this.gettxlist();
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
  .empty{
    width: 50%;
    margin-top: 40%;
  }
  
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
  .mint-popup{
    border-radius: 30px;
  }
  .carrying {
    width: 100%;
    height: 90px;
    padding: 15px 0 15px 0;
    border-radius: 30px;
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
    height: 305px;
    padding: 38px 16px;
    margin-top: 20px;
    background: #fff;
    border-radius: 30px;
    & > div {
      width: 100%;
      height: 122.5px;
      position: relative;
    }
    .round {
      width: 30px;
      height: 30px;
      background: #b1b1b1;
      border-radius: 50%;
    }
    .erect {
      width: 4px;
      height: 92px;
      background: #b1b1b1;
      position: relative;
      left: 13px;
    }
    .actload {
      background: #fc5e2d;
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
    .carrtwo{
      margin-top: 90px;
    }
  }
}
</style>





