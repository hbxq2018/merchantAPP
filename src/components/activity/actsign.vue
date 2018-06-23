<template>
    <div class="actsign">
        <mt-header fixed title="活动报名">
            <router-link to="/actdetails" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
            <mt-button slot="right" @click="savesign">完成</mt-button>
        </mt-header>
        <div class="signcell">
            <!-- <mt-cell title="标题文字" icon="more" value="带 icon"></mt-cell> -->
            <mt-cell title="招牌菜" is-link :value="fascia" :to="{path:'/dishes',query:{type:2}}"></mt-cell>
            <mt-cell title="原价" :value="Original"><input type="number" :placeholder="Original" v-model="Original"></mt-cell>
            <mt-cell title="活动价" :value="Activity"><input type="number" :placeholder="Activity" v-model="Activity"></mt-cell>
            <mt-cell title="平台售价" :value="platform"></mt-cell>
        </div>
        <div class="directions">
            <div class="direleft">例：</div>
            <div class="direright">
            原价40元、活动价20元、平台售价21元；<br>
                结算商家收20元、享7平台收取消费者1元。<br>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from "vue";
import { Field, Toast } from "mint-ui";
Vue.component(Field.name, Field);
import store from "@/vuex/store";
import { mapState, mapMutations, mapGetters } from "vuex";
import { formatDate } from "../../../untils/util";
export default {
  name: "actsign",
  data() {
    return {
      skugId: "",
      len: "",
      isfirst:true,
      fascia: "选择招牌菜",
      Original: "请输入原价(元)",
      Activity: "请输入活动价(元)",
      platform: "享7平台价格"
    };
  },
  store,
  computed: {
    ...mapState(["userInfo", "shopInfo"])
  },
  watch: {
    fascia:function(){
      this.isfirst= true;
    },
    Original: function() {
      this.isfirst= true;
      if(this.Original == 0){
        this.Original = "请输入原价(元)"
      }
      if (this.Original != "请输入原价(元)") {
        this.Original = Math.round(this.Original);
        if(!isNaN(this.Activity * 1) && !isNaN(this.Original * 1)){
          if (this.Activity * 1 > this.Original * 1) {
            Toast("活动价不能高于原价");
            // this.Original = "请输入原价(元)"
            this.Activity = "请输入活动价(元)";
            this.platform = "享7平台价格";
          } else {
            this.platform = this.Activity * 1 + 1;
          }
        }
      }
    },
    Activity: function() {
      this.isfirst= true;
      if(this.Activity ==0){
        this.Activity = "请输入活动价(元)"
      }
      if (this.Activity != "请输入活动价(元)") {
        this.Activity = Math.round(this.Activity);
        if (this.Activity * 1 > this.Original * 1) {
          Toast("活动价不能高于原价");
          this.Activity = "请输入活动价(元)";
          this.platform = "享7平台价格";
        } else {
          this.platform = this.Activity * 1 + 1;
        }
      } else {
        this.Activity = "请输入活动价(元)";
        this.platform = "享7平台价格";
      }
    }
  },
  methods: {
    ...mapMutations(["setuserInfo", "setshopId", "setshopInfo"]),
    //生成券
    savesign: function() {
      if(!this.isfirst){
        return false
      }
      this.isfirst= false;
      let obj = {},
        _value = "";
      if (this.fascia == "选择招牌菜" || !this.fascia) {
        Toast("请选择要报名的菜品");
        this.fascia == "选择招牌菜";
      }else if (this.Original == "请输入原价(元)" || !this.Original) {
        Toast("请输入菜品原价(元)");
        this.fascia == "请输入原价(元)";
      }else if (this.Activity == "请输入活动价(元)" || !this.Activity) {
        Toast("请输入活动价(元)");
        this.Activity == "请输入活动价(元)";
      } else {
        obj = {
          skuName: this.platform + "元食典券",
          skuType: 3,
          stockNum: 9999,
          opreatorId: this.shopInfo.id,
          opreatorName: this.shopInfo.userName,
          sellPrice: this.Original,
          inPrice: 20,
          agioPrice: this.Activity
        };
        for (var key in obj) {
          _value += key + "=" + obj[key] + "&";
        }
        _value = _value.substring(0, _value.length - 1);
        this.$axios.post("/api/app/sku/addSku?" + _value).then(res => {
          if (res.data.code == 0) {
            this.skuupdata();
            this.getdishdata();
            this.skugId = res.data.data;
          }
        });
      }
    },
    //更新菜品信息
    skuupdata: function() {
      let obj = {},
        _value = "";
      if (this.fascia == "选择招牌菜" || !this.fascia) {
        Toast("请选择要报名的菜品");
        this.fascia == "选择招牌菜";
      }else if (this.Original == "请输入原价(元)" || !this.Original) {
        Toast("请输入菜品原价(元)");
        this.fascia == "请输入原价(元)";
      }else if (this.Activity == "请输入活动价(元)" || !this.Activity) {
        Toast("请输入活动价(元)");
        this.Activity == "请输入活动价(元)";
      } else {
        obj = {
          skuName: this.fascia,
          skuType: 2,
          stockNum: 9999,
          opreatorId: this.shopInfo.id,
          opreatorName: this.shopInfo.userName,
          sellPrice: this.Original,
          inPrice: "20",
          agioPrice: this.Activity,
          shopId: this.shopInfo.shopId,
          id: this.dishid
        };
        for (var key in obj) {
          _value += key + "=" + obj[key] + "&";
        }
        _value = _value.substring(0, _value.length - 1);
        this.$axios.post("/api/app/sku/update?" + _value).then(res => {
          if (res.data.code == 0) {
            this.insertByRules();
          }
        });
      }
    },
    //查询已报名菜品数量
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
          // this.dishdata = res.data.data.list;
           let len = res.data.data.list.length;
            if (len > 4) {
              console.log('2222')
              Toast("每家商家最多只能报名五道菜参赛，您已报名有五道菜了");
              this.$router.push({ name: "Actdetails", params: {} });
            } 
        }
      });
    },
    //新增活动推荐菜信息
    insertByRules: function() {
      let obj = {},
        _value = "";
      obj = {
        actId: 37,
        shopId: this.shopInfo.shopId,
        skuId: this.dishid,
        skugId: this.skugId,
        ruleType: 3,
        ruleDesc: "原价" + this.Original + "现价" + this.platform + "元",
        manAmount: this.Original,
        jianAmount: this.platform
      };
      for (var key in obj) {
        _value += key + "=" + obj[key] + "&";
      }
      _value = _value.substring(0, _value.length - 1);
      this.$axios.post("/api/app/actSku/insertByRules?" + _value).then(res => {
        if (res.data.code == 0) {
          Toast("报名成功！");
          this.resetdata();
          this.getdishdata()
        } else {
          Toast(res.data.message);
          this.resetdata();
        }
      });
    },
    //重置数据
    resetdata: function() {
      this.skugId = "";
      this.fascia = "选择招牌菜";
      this.Original = "请输入原价(元)";
      this.Activity = "请输入活动价(元)";
      this.platform = "享7平台价格";
    },
    //校验数据
    checkdata: function() {
      if (this.fascia == "选择招牌菜" || !this.fascia) {
        Toast("请选择要报名的菜品");
        this.fascia == "选择招牌菜";
      }
      if (this.Original == "请输入原价(元)" || !this.Original) {
        Toast("请输入菜品原价(元)");
        this.fascia == "请输入原价(元)";
      }
      if (this.Activity == "请输入活动价(元)" || !this.Activity) {
        Toast("请输入此菜品原价(元)");
        this.Activity == "请输入活动价(元)";
      } else {
        return true;
      }
    },
    //查询已报名菜品
    getdishdata: function() {
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
          let _list = res.data.data.list;
          console.log('list:',_list)
          if( _list && _list.length>4){
            console.log('111111111')
              this.$router.push({ name: "Actdetails", params: {} });
          }
        }
      });
    }
  },
  created: function() {
    if (this.$route.params.name) {
      this.fascia = this.$route.params.name;
      this.isfirst= true;
    }
    if (this.$route.params.id) {
      this.dishid = this.$route.params.id;
    }
  }
};
</script>
<style lang="less">
.actsign {
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  overflow: auto;
  height: 100%;
  background: #ebebeb;
  .signcell {
    padding-top: 80px;
    input {
      border: none;
      text-align: right;
    }
    .mint-cell:nth-child(1),
    .mint-cell:nth-child(4) {
      margin: 20px 0;
    }
  }
  .directions {
    width: 100%;
    height: 100px;
    color: #fc5e2d;
    font-size: 24px;
    text-align: left;
    margin-top: 28px;
    .direleft {
      width: 50px;
      float: left;
      height: 100%;
      margin-left: 20px;
    }
    .direright {
      width: 500px;
      height: 100%;
      float: left;
    }
  }
}
</style>





