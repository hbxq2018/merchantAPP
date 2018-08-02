
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
    name:'wallet',
    data(){
        return {
            Balance:0,
            drawmoney:0,
            lists:[
                {
                    id:0,
                    name:'提现',
                    img:require("../../../../static/images/home_arrow.png"),
                    icon:require("../../../../static/images/draw.png")
                },
                {
                    id:1,
                    name:'明细',
                    img:require("../../../../static/images/home_arrow.png"),
                    icon:require("../../../../static/images/detes.png")
                }
            ]
        }
    },
    filters: {
        changemoney:function(val){
            val = val*1;
            val=val.toFixed(2);
            let result=addCommas(val),x='', x1=0,x2=0;
            function addCommas(nStr){
                nStr += '';
                x = nStr.split('.');
                x1 = x[0];
                x2 = x.length > 1 ? '.' + x[1] : '';
                var rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
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
    methods:{
        getBalance:function(){  //钱包余额
            this.$axios.get("api/app/account/balance?userId="+this.shopInfo.id).then(res=>{
                if(res.data.code == 0){
                    this.Balance = res.data.data;
                }
            })
        },
        getdrawAmount:function(){  //可提现金额
            let _value = 'soStatus=2&isDui=0&shopId='+this.shopInfo.shopId;
            this.$axios.get("api/app/so/totalAmount?"+_value).then(res=>{
                if(res.data.code == 0){
                    this.drawmoney = res.data.data;
                }
            })
        },
        handclick:function(e){
            const id = e.currentTarget.id;
            console.log(id)
            if(id == 0){
                this.$router.push('/withdraw')
            }else if(id == 1){
                this.$router.push('/notes')
            }
        }
    },
    created:function(){
        this.getBalance();
        this.getdrawAmount();
    }
}
</script>

<style lang="less">
    .wallet{
        position: fixed;
        width: 100%;
        height: 100%;
        background: #ebebeb;
        .watll-top{
            padding: 80px 28px 0 28px;
            width: 694px;
            height: 285px;
            background: #F14915;
            .balance{
                color: #FFF9F7;
                width: 100%;
                font-size: 24px;
                padding: 45px 0 52px 0;
                text-align: left;
            }
            .digital{
                color: #fff;
                width: 100%;
                font-size: 112px;
                margin-bottom: 42px;
                text-align: left;
            }
        }
        .available{
            padding: 0px 28px 0 28px;
            width: 694px;
            height:70px;
            text-align: left;
            line-height: 70px;
            color: #FFF9F7;
            background:#F14915;
        }
        .list{
            width: 750px;
            height: 160px;
            background: #fff;
            .item-color img{
                width: 100%;
                height: 100%;
            }
            
            .list-item{
                padding: 0px 28px 0 28px;
                width:694px;
                float: left;
                text-align: left;
                height: 80px;
                border-block-end: 1px solid #e0e0e0;
                .item-color{
                    width: 34px;
                    height: 34px;
                    margin: 23px 23px 23px 0;
                    float: left;
                }
                .item-name{
                    float: left;
                    height: 100%;
                    line-height: 80px;
                    color: #252525;
                    font-size: 30px;
                }
                .item-more{
                    width: 12px;
                    height: 22px;
                    margin-top: 29px;
                    float: right;
                }
            }
        }
    }
</style>




