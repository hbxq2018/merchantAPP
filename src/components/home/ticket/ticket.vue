<template>
  <div class="ticket">
    <mt-header :title="name">
        <router-link to="/home" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
        <mt-button slot="right" @click="addticket">+添加</mt-button>
    </mt-header>
    <ul>
        <li class="tic" v-for="(item,index) in ticketlist" :key="index">
            <span class="text">满</span>
            <span class="teval">{{item.full}}</span>
            <span class="text">减</span>
            <span class="teval">{{item.inPrice}}</span>
            <button class="deltic" :id='item.id' @click="delticket">删除</button>
        </li>
    </ul>

    <div v-show="isadd" class="model_box">
        <div class="settic">
            <div class="settop">
                <span>满</span>
                <input class="money" type="number" placeholder="输入金额" v-model="money">
                <span>减</span>
                <mt-picker :slots="slots" :visibleItemCount='3' @change="onValuesChange"></mt-picker>
            </div>
            <div class="butclose" @click="butclose">取消</div>
            <div class="butcfim" @click="butcfim">确定</div>
        </div>
    </div>
  </div>
</template>

<script>
import { Picker,Toast } from "mint-ui";
import store from '@/vuex/store'
import {mapState,mapMutations,mapGetters} from 'vuex'
export default {
  name: "Ticket",
  data() {
    return {
      msg: "ticket",
      name: "享7券",
      isadd: false,
      slots: [
        {
          values: []
        }
      ],
      money: "",
      skulist: [],
      ticketlist: [],
      actvalue: {}
    };
  },
  watch: {
    money: function() {
      this.money = this.money.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
    }
  },
  store,
  computed:{
    ...mapState(['userInfo','shopId']),
  },
  methods: {
     ...mapMutations(['setuserInfo']),
    onValuesChange(picker, values) {
      if (values[0] > values[1]) {
        picker.setSlotValue(1, values[0]);
      }
      for (let i in this.skulist) {
        if (values == this.skulist[i].inPrice) {
          this.actvalue = this.skulist[i];
        }
      }
    },
    addticket: function() {
      this.isadd = true;
    },
    butclose: function() {
      this.money = "";
      this.actvalue = {};
      this.isadd = false;
    },
    butcfim: function() {
      if(!this.money){
        Toast("请输入金额");
      }else if(!this.actvalue.id){
        Toast("请选择满减金额");
      }else if(this.money && this.actvalue.id) {
        let desc = "满" + this.money + "减" + this.actvalue.inPrice + "元";
        let obj = {
          skuId: this.actvalue.id,
          skuCode: this.actvalue.skuCode,
          skuName: this.actvalue.skuName,
          ruleType: 1,
          ruleDesc: desc,
          shopId: this.shopId
        };
        let _value = "";
        for (var key in obj) {
          _value += key + "=" + obj[key] + "&";
        }
        _value = _value.substring(0, _value.length - 1);
        this.$axios.post("/api/app/pnr/add?" + _value).then(res => {
          if (res.data.code == "0") {
            this.money = '';
            this.actvalue = {};
            Toast("添加成功");
            this.getticketlist();
          }
        });
        this.isadd = false;
      }
    },
    delticket: function(e) {
      const ind = e.currentTarget.id;
      this.$axios.get("/api/app/pnr/delete/" + ind).then(res => {
        if (res.data.code == "0") {
          Toast("删除成功");
          this.getticketlist();
        }
      });
    },
    getticketlist: function() {
      this.$axios.get("/api/app/pnr/selectByShopId?shopId=" + this.shopId)
        .then(res => {
          if (res.data.code == "0") {
            let data = res.data.data;
            for (let i in data) {
              data[i].ruleDesc = data[i].ruleDesc.substr(1);
              let arr = data[i].ruleDesc.split("减");
              data[i].full = arr[0];
            }
            this.ticketlist = data;
          }
        });
    },
    getskulist: function() {
      this.$axios.get("/api/app/sku/list").then(res => {
        if (res.data.code == "0") {
          let data = res.data.data.list;
          let _arr = [];
          for (let i in data) {
            _arr.push(data[i].inPrice);
          }
          this.skulist = data;
          this.slots[0].values = _arr;
        }
      });
    }
  },
  created: function() {
    this.getskulist();
    this.getticketlist();
  }
};
</script>
<style lang="less">
.ticket {
  ul {
    margin: 0;
    padding: 0;
    width: 100%;
    .tic {
      width: 663px;
      height: 110px;
      line-height: 110px;
      padding: 0 40px 0 47px;
      background: rgba(255, 255, 255, 1);
      border-bottom: 1px solid rgba(235, 235, 235, 1);
    }
    .text,
    .teval {
      display: block;
      float: left;
      width: 111px;
      text-align: center;
      font-size: 36px;
      overflow: hidden;  
          text-overflow: ellipsis; 
          white-space: nowrap; 
    }
    .text {
      font-size: 30px;
      color: #fc5e2d;
    }
    .deltic {
      font-size: 30px;
      color: #808080;
      border: none;
      background: none;
      float: right;
      height: 110px;
      line-height: 110px;
    }
  }
  .model_box {
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    overflow: auto;
    height: 100%;
    background: rgba(0, 0, 0, 0.44);
    font-size: 30px;
    .settic {
      width: 672px;
      height: 351px;
      background: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -336px;
      margin-top: -175.5px;
      .settop {
        width: 100%;
        height: 247px;
        line-height: 247px;
        font-size: 30px;
        color: #191919;
        border-bottom: 1px solid #e0e0e0;
        .money {
          width: 150px;
          margin: 0 30px;
          border: none;
        }
        .picker {
          width: 100px;
          position: absolute;
          top: 30px;
          right: 50px;
        }
        .picker-selected {
          color: #fc5e2d;
        }
      }
      .butclose,
      .butcfim {
        width: 49.8%;
        height: 103px;
        line-height: 103px;
        color: #191919;
        float: left;
      }
      .butclose {
        border-right: 1px solid #e0e0e0;
      }
    }
  }
}
</style>

