 <!-- 提现明细 -->
<template>
    <div class="notes">
        <mt-header fixed title="明细">
            <router-link slot="left" :to="{path:'wallet'}">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div style="height:40px;"></div>
        <div class="notestop" @click="handTop">
            <div :class="acttop?'actdiv':''">转出</div>
            <div :class="acttop?'':'actdiv'">转入</div>
        </div>
        <div class="conten">
            <div class="item" v-for="(item,index) in list" :key="index" :id="index">
                <div class="item-one">
                    <p class="item-p"> {{acttop?'转出':'转入'}}</p>
                    <p class="item-t">{{item.date}}</p>
                </div>
                <div class="item-two">{{item.money | changemoney}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import { Loadmore } from 'mint-ui';
Vue.component(Loadmore.name, Loadmore);
export default {
    name:'notes',
    data(){
        return{
            acttop:true,
            list:[
                {
                    bank:'建设银行',
                    card:'3461',
                    date:'2018-07-25 14:32',
                    money:'-200',
                    status:'审核中'
                },{
                    bank:'邮政银行',
                    card:'3371',
                    date:'2018-07-16 18:32',
                    money:'-1730',
                    status:'审核中'
                },{
                    bank:'民生银行',
                    card:'1198',
                    date:'2018-07-21 11:32',
                    money:'1400',
                    status:'提现成功'
                },{
                    bank:'工商银行',
                    card:'0943',
                    date:'2018-07-06 07:32',
                    money:'280',
                    status:'提现成功'
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
    methods:{
        handTop:function(){
            this.acttop = !this.acttop;
        }
    }
}
</script>

<style lang="less">
    .notes{
        position: fixed;
        width: 100%;
        height: 100%;
        background: #ebebeb;
        .notestop{
             width: 100%;
             background: #fff;
             height: 90px;
             &>div{
                 width: 49.5%;
                 float: left;
                 text-align: center;
                 height: 90px;
                 line-height: 90px;
            }
            &>div:nth-child(1){
                border-right: 1px solid #ebebeb;
            }
            .actdiv{
                color: #FC5E2D;
                border-bottom: #FC5E2D 1px solid;
            }
        }
        .conten{
            width: 100%;
            margin-top: 20px;
            background: #fff;
            .item{
                width: 694px;
                height: 100px;
                padding: 10px 28px;
                border-block-end: 1px solid #e0e0e0;
                .item-one{
                    width: 70%;
                    height: 100%;
                    float: left;
                    &>p{
                        text-align: left;
                        height: 40px;
                        line-height: 40px;
                    }
                    &>p:nth-child(1){
                        margin-top: 10px;
                    }
                }
                .item-two{
                    width: 30%;
                    height: 100px;
                    line-height: 100px;
                    float: left;
                }
                .item-left{
                    color: #808080;
                }
                .item-right{
                    float: right;
                }
                .item-two{
                    .item-right{
                        color: #FC5E2D;
                        font-size: 24px;
                    }
                }
            }
        }
    }
</style>





