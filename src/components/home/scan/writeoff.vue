<template>
  <div class="write">
    <mt-header title="核销" >
        <router-link to="/scan" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
    </mt-header>
    <div class="content">
        <mt-field v-if="!isscan" class="code" v-model="value" :attr="{ maxlength: 12 }" placeholder="请输入券码" type="text"></mt-field>
        <!-- <mt-field class="code" v-model="original" :label="label1" :placeholder="plac" type="number"></mt-field>
        <div class="code money skuk"><span slot="left">{{ticket.skuName}}</span>  <span>-{{ticket.couponAmount}}</span></div>
        <div class="code money"><span slot="left">实际需付款（元）</span>  <span v-if="diffs>0">{{diffs}}</span></div> -->


        <div class="code money"><span slot="left">顾客信息</span><span slot="right">{{setnum(ticket.userName)}}</span></div>
        <div class="code money"><span slot="left">券信息</span><span slot="right">{{ticket.skuName}}</span></div>
        <button :class="isdiff?'actbutton subbutton':'subbutton'" type="submit" @click="submit">确认核销</button>
    </div>
</div>
</template>
<script>
import { Field, Toast ,MessageBox } from "mint-ui";
import store from "@/vuex/store";
import { mapState, mapMutations } from "vuex";
export default {
  name: "Write",
  data() {
    return {
      value: "",
      original: "",
      code: "",
      label1: "消费金额（元）：",
      plac: "输入消费金额",
      ticket: {},
      isscan: false,
      isdiff: false,
      qual: true,
      diff: "",
      diffs: 0
    };
  },
  store,
  computed: {
    ...mapState(["userInfo", "shopId","newUserInfo",'shopInfo'])
  },
  watch: {
    value: function() {
      if (this.value.length == 4 || this.value.length == 9) {
        this.value += " ";
      }
      if (this.value.length == 12) {
        this.code = this.value;
        this.code = this.code.replace(/\s+/g, "");
        this.getbycode(this.code);
      }
    },
    original: function() {
      let dir = this.original - this.ticket.couponAmount;
      this.diffs = dir;
      if (dir > 0) {
        this.isdiff = true;
      } else {
        this.isdiff = false;
      }
    }
  },
  methods: {
    submit: function() {
      let _this = this;
      // if (!this.isdiff) {
      //   Toast("不符合核销条件，请重新输入");
      // } else {
        this.ticket.shopAmount = this.original;
        let _ticket = this.ticket;
        console.log('_ticket:',_ticket)
        console.log('shopInfo:',this.shopInfo)
        console.log('shopInfo:',this.userInfo)
        let obj = {
          soId: _ticket.soId, //订单id	Long
          shopId: this.userInfo.id, //商家id	Long
          shopName: this.userInfo.shopName, //店铺名称	Date  
          shopAmount: _ticket.couponAmount, //消费总额	BigDecimal
          couponId: _ticket.id, //电子券id	Long
          couponCode: _ticket.couponCode, //电子券code	String
          skuId: _ticket.skuId, //商品id	Long
          couponAmount: _ticket.couponAmount, //电子券面额	BigDecimal
          userId: _ticket.userId, //消费人id	Long
          userName: _ticket.userName, //消费人账号	String
          cashierId: this.shopInfo.id, //收银id	Long
          cashierName: this.shopInfo.userName //收银账号	String
        }
        console.log("obj:",obj)
       
        let _value='';
        for(var key in obj) {
            _value += key + '=' + obj[key] + '&';
        }
        _value = _value.substring(0, _value.length-1);

        this.$axios.post("/api/app/hx/add?"+_value)
            .then((res) => {
              console.log('res:',res)
              if(res.data.code == '0'){
                  MessageBox.alert('核销成功！').then(action => {
                    _this.$router.push({ name: "Scan", params: {} });
                  });
              }else{
                MessageBox.alert(res.data.message).then(action => {
                  _this.$router.push({ name: "Scan", params: {} });
                });
              }
            })
      // }
    },
    getbycode: function(val) { //获取票券信息
      this.$axios
        .get("/api/app/cp/getByCode/" + val)
        .then(res => {
          let data = res.data;
          console.log('res:',res)
          if (data.code == 0) {
            if(data.data.isUsed == 1){
              Toast("券不存在或者已经被使用");
               setTimeout(function(){
                _this.$router.push({ name: "Scan", params: {} });
              },2000)
              return false
            }
            let Dis = "折扣";
            if (data.data.skuName.indexOf(Dis) > 0) {
              this.label1 = "输入折后金额";
              this.plac = "折后金额(元)";
              this.searchShopId();
            }
            this.isdiff = true;
            this.ticket = data.data
          } else {
            Toast(data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    setnum:function(val){
      if(val){
          val = val.substr(0, 3) + "****" + val.substr(7);
      }
      return val
    },
    searchShopId: function() {//查询商家是否参加某一活动
      let _this = this;
      this.$axios
        .get("/api/app/actshop/searchForShopId?userId=" + this.shopId)
        .then(res => {
          console.log("res:", res);
          if (res.data.code == "-1") {
            Toast(res.data.message);
            this.qual = false;
            this.value = "";
            this.label1 = "消费金额（元）：";
            this.plac = "输入消费金额";
            this.ticket = {};
            setTimeout(function(){
                _this.$router.push({ name: "Scan", params: {} });
            },2000)
          }
        });
    }
  },
  created: function() {
    if (this.$route.params.code) {
      this.code = this.$route.params.code;
      this.getbycode(this.code);
      this.isscan = true;
    }
  }
};
</script>
<style lang="less">
.content {
  background: #ebebeb;
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  margin-top: 11%;
  z-index: 1;
  padding-top: 20px;
  .code {
    width: 90%;
    margin-left: 5%;
    margin-top: 2%;
    text-align: center;
    .mint-cell-title {
      width: 400px;
    }
  }
  .money {
    width: 90%;
    height: 80px;
    line-height: 80px;
    font-size: 30px;
    span {
      display: block;
    }
    span:nth-child(1) {
      width: 50%;
      text-align: left;
      float: left;
      margin-left: 15px;
    }
    span:nth-child(2) {
      float: right;
      text-align: right;
      min-width: 50px;
      margin-right: 20px;
    }
  }
  .skuk {
    color: #fc512d;
  }
  .subbutton {
    width: 90%;
    margin: 20px 0;
    text-align: center;
    height: 80px;
    line-height: 80px;
    font-size: 30px;
    border-radius: 10px;
    border: none;
    color: #fff;
    background-color: #D8D8D8;
  }
  .actbutton {
    background: #fc512d;
  }
}
</style>




