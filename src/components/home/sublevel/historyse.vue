<template>
  <div class="payment">
    <mt-header fixed :title="name">
        <router-link slot="left" :to="{path:'home',query:{'ind':index}}">
             
            <mt-button icon="back"></mt-button>
        </router-link>
        <mt-button slot="right" @click="billCheck">历史账单</mt-button>
    </mt-header>

    <div class="history_money">
        <b><em>{{time | formatDate}}</em>月应供服务费</b>
        <span>&yen;{{dataarr.totalService}}</span>
        <P>打款日:次月5号</P>
    </div>
    <div class="data_statistics">
        <p><span>4</span><span>月已核销</span><span>{{totalQuantity.length}}</span>张代金券，总额度<span>{{totle}}</span>元</p>
    </div>
    <div class="order_history" v-for="(item,index) in totalQuantity" :key="index">
        <div class="order_h_sublevel">
            <div class="roder_left">
                <b>{{item.couponAmount}}<span>元代金券</span></b>
                <p><span>{{item.updateTime}}</span></p>
            </div>
            <div class="roder-right">
                <span>&yen;{{practical(item.couponAmount)}}</span>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import {formatDate} from '../../../../untils/util';
import GLOBAL from '../../../../untils/config/config';
import { Header } from 'mint-ui';
import { MessageBox } from "mint-ui";
import axios from 'axios';
import qs from 'qs';
import config from '../../../../untils/config/config';
export default {
    name:'Payment',
    data(){
        return{
            totle:0,
            index:2,
            msg:'payment',
            name: "缴费服务",
            dataarr:[],
            totalQuantity:[],
            time:'',
        }
    },
    filters: {
        formatDate() {
            var date = new Date();
            let mon = date.getMonth() + 1
            let _data = formatDate(date, 'yyyy-MM-dd hh:mm')
            return mon;
        },
    },
    methods:{
        practical:function(val){
            return val/10
        },
        billCheck:function(e){
            this.$router.push('/historyofthebill')
        },
    },
    created:function(){
    var date = new Date();
    let _data = formatDate(date, 'yyyy/MM/dd')
    let obj = {
      shopId:75,
      begainTime:"2018/3/1",
      endTime:_data
    }
    let parms='',value='';
    for(var key in obj) {
      value = key+'='+obj[key]+'&';
      parms+=value;
      value=''
    }
    this.$axios.get('/api/app/hx/list?'+parms)
    .then((res) => {
       this.dataarr= res.data.data.list[0];
       this.totalQuantity = res.data.data.list;
        this.totalQuantity =  this.totalQuantity.slice(1, this.totalQuantity.length)
        // console.log("totalQuantity:",this.totalQuantity)
       for(let i=0;i<this.totalQuantity.length;i++){
           this.totle += (this.totalQuantity[i].couponAmount)*1;
       }
    })
  }
}
</script>


<style lang="less">
    .payment{
        width: 100%;
        height: 100%;
        background: #EBEBEB;
        .mint-header-title{
                font-size: 34px;
            }
        .mint-button-text{
            font-size: 30px;
            padding-right: 28px;
        }
        .history_money{
            width: 100%;
            height: 224px;
            background: #fff;
            padding-top: 88px;
            b:nth-child(1){
                font-size: 30px;
                padding: 39px 0px 14px 0px;
                display: block;
                color: #191919;
            }
            p:nth-child(3){
                font-size: 24px;
                color: #FC5E2D;
                padding-top: 12px;
            }
            span{
                font-size: 56px;
                color: #191919;
            }
            
        }
        .data_statistics{
            width: 100%;
            height: 96px;
            line-height: 96px;
            font-size: 26px;
            color: #808080;
            letter-spacing: 2px;
        }
        .order_h_sublevel:last-child{
            border-bottom: none;
        }
        .order_history{
            background: #fff;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            .order_h_sublevel{
                width: 94%;
                height: 145px;
                border-bottom: 1px solid #E0E0E0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                letter-spacing: 2px;
                .roder_left{
                    line-height: 50px;
                    text-align: left;
                    b{
                        font-size: 30px;
                    }
                    p{
                        font-size: 27px;
                        color: #929292;
                    }
                }
                .roder-right{
                    font-size: 30px;
                    padding-right: 39px;
                }
            }
        }
    }
    
</style>


