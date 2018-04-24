<template>
  <div class="payment">
    <mt-header :title="name">
        <router-link to="/home" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
        <mt-button slot="right">历史账单</mt-button>
    </mt-header>

    <div class="history_money">
        <P><em>{{data.time}}</em>{{data.time1}}</P>
        <span>&yen;{{data.theAmountOf}}</span>
        <P>打款日:次月5号</P>
    </div>
    <div class="data_statistics">
        <p><span>{{data1.time}}</span><span>月已核销</span><span>{{data1.time1}}</span>张代金券，总额度<span>{{data1.time2}}</span>元</p>
    </div>
    <div class="order_history" v-for="(item,index) in data2" :key="index">
        <div class="order_h_sublevel">
            <div class="roder_left">
                <b>{{item.tiStockFaceValueme}}</b>
                <p>{{item.time}}<span>{{item.time1}}</span></p>
            </div>
            <div class="roder-right">
                <span>&yen;{{item.money}}</span>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { Header } from 'mint-ui';
import { MessageBox } from "mint-ui";
export default {
    name:'Payment',
    data(){
        return{
            msg:'payment',
            name: "缴费服务",
            data:{
                time:'4',
                time1:'月应供服务费',
                theAmountOf:'244.05'
            },
            data1:{
                time:'4',
                time1:'13413',
                time2:'24445.05'
            },
            data2:[
                {
                tiStockFaceValueme:'10元代金券',
                time:'2018-4-24',
                time1:'12:45:23',
                money:'1.5',
            },
            {
                tiStockFaceValueme:'10元代金券',
                time:'2018-4-24',
                time1:'12:45:23',
                money:'1.5',
            },
            {
                tiStockFaceValueme:'10元代金券',
                time:'2018-4-24',
                time1:'12:45:23',
                money:'1.5',
            },
            ],
        }
    },
    // billCheck:function(){
    //     console.log('11')
    // }
}
</script>


<style lang="less">
    body{
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
            p:nth-child(1){
                font-size: 30px;
                padding: 39px 0px 14px 0px;
            }
            p:nth-child(3){
                font-size: 24px;
                color: #FC5E2D;
                padding-top: 12px;
            }
            span{
                font-size: 56px;
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


