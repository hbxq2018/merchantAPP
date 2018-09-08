<template>
    <div class="fdetails">
        <mt-header fixed title="活动详情">
            <router-link to="/fresh" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div class="fcontent">
            <div class="conTop">
                <span>主题</span>
                <span>9.8元品阳澄湖大闸蟹</span>
            </div>

            <div class="claim">
                <p>店铺参与要求</p>
                <ul>
                    <li>1、9.8元品阳澄湖大闸蟹；</li>
                    <li>2、9.8元品阳澄湖大闸蟹阳澄湖大闸蟹阳澄湖大闸蟹阳
阳澄湖大闸蟹阳澄湖大闸蟹澄湖大闸蟹；</li>
                    <li>1、9.8元品阳澄湖大闸蟹；</li>
                </ul>
            </div>

            <div class="claim">
                <p>规则要求</p>
                <ul>
                    <li>1、9.8元品阳澄湖大闸蟹；</li>
                    <li>2、9.8元品阳澄湖大闸蟹阳澄湖大闸蟹阳澄湖大闸蟹阳
阳澄湖大闸蟹阳澄湖大闸蟹澄湖大闸蟹；</li>
                    <li>1、9.8元品阳澄湖大闸蟹；</li>
                </ul>
            </div>

            <div class="debut" @click="handPate">{{isSign?'终止活动':'参与活动'}}</div>
        </div>
    </div>
</template>
<script>
import { Toast, Indicator, MessageBox } from "mint-ui";
import store from "@/vuex/store";
import { mapState, mapMutations } from "vuex";
export default {
  name: "fdetails",
  data() {
    return {
      freshId: "",
      isSign:false
    };
  },
    store,
  computed: {
    ...mapState(["userInfo", "shopId", "shopInfo"])
  },
  methods:{
      //点击参与活动
      handPate(){
        console.log('issign:',this.isSign);
        let _this = this;
        if(this.isSign){
            MessageBox.confirm("是否确认退出活动？").then(action => {
                if (action == "confirm") {
                    _this.exchange();
                }
            })
        }else{
           _this.exchange();
        }
      },
      //数据交互
      exchange(){
        let _parms ={},_value="",_Url="";
        _parms = {
            skuType:1,
            shopId:this.userInfo.id
        };
        if(this.isSign){
            _Url = "/api/app/sku/deleteSkuAllocation?";
        }else{
            _Url = "/api/app/sku/addSKuAllocation?";
            _parms.opreatorId = this.shopInfo.id;
            _parms.opreatorName = this.shopInfo.userName;
             
        }
        for (var key in _parms) {
          _value += key + "=" + _parms[key] + "&";
        }
        _value = _value.substring(0, _value.length - 1);
        this.$axios.post( _Url+ _value).then(res => {
            if (res.data.code == 0) {
                if(this.isSign){
                    Toast("退出活动成功！")
                }else{
                    Toast("参与活动成功！")
                }
                this.isSign = !this.isSign;
              console.log('fresh_res:',res)
            }
        });
      }
  },
  created() {
    console.log(this.$route.params.id);
    this.freshId = this.$route.params.id;
    this.isSign = this.$route.params.isSign;
    console.log('issign11:',this.isSign);
    console.log("freshId:", this.freshId);
    console.log('userInfo:',this.userInfo)
    console.log('shopInfo:',this.shopInfo)
  }
};
</script>

<style lang="less">
.fdetails {
  width: 100%;
  height: 100%;
  background: rgba(235, 235, 235, 1);
  overflow: scroll;
  .fcontent {
    width: 100%;
    margin-top: 80px;
    .conTop {
      width: 676px;
      padding: 0 37px;
      height: 88px;
      line-height: 88px;
      background: #fff;
      color: #000;
      span:nth-child(1) {
        float: left;
      }
      span:nth-child(2) {
        float: right;
      }
    }
    .claim{
      width: 676px;
      padding:37px;
      background: #fff;
      margin-top: 20px;
      text-align: left;
      color: #191919;
      font-size: 30px;
      font-weight:400;
      ul{
          width: 100%;
          margin-top: 28px;
          li{
              color: #808080;
              font-size: 28px;
              line-height: 46px;
          }
      }
    }
    .debut{
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 88px;
        background: #FC5E2D;
        text-align: center;
        line-height: 88px;
        color: #fff;
        font-size: 30px;
    }
  }
}
</style>

