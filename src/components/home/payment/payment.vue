<template>
    <div class="payment">
        <mt-header fixed title="缴服务费">
          <router-link slot="left" :to="{path:'home',query:{'ind':2}}">
            <mt-button icon="back"></mt-button>
          </router-link>
        </mt-header>

        <div class="pay-top">
            <p class="top-one">应缴服务费（元）</p>
            <p class="top-two">{{money | changemoney}}</p>
            <mt-button class="topPay" @click.native="handPayment" type="primary">立即交费</mt-button>
            <p class="top-three">
                <span @click="handRecord">缴费记录</span>
                <span>|</span>
                <span @click="handBill">月份账单</span>
            </p>
        </div>
        <div class="pay-date">
            <div class="date-left">
                <p class="date-pone">2018-07-01至2018-07-25</p>
                <p class="data-ptwo">服务费100笔，共{{money | changemoney}}元</p>
            </div>
            <div class="date-right" @click="handdate">
                <img class="sel-date" src="../../../../static/images/calendar.png" alt="选择时间">
                <p class="data-pthree">自定义查询</p>
            </div>
        </div>
        <div class="pay-cont">
            <div class="item" v-for="(item,index) in lists" :key='index' :id='index'>
                <div class="item-left">
                    <p class="left-one">{{item.name}}</p>
                    <p class="left-two">{{item.date}}</p>
                </div>
                <div class="item-right">{{item.money | changemoney}}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'payment',
    data(){
        return {
            money:4324,
            lists:[
                {
                    name:'10元代金券',
                    date:'2018-07-14 15:31',
                    money:1
                },
                {
                    name:'20元代金券',
                    date:'2018-07-16 11:31',
                    money:2
                },
                {
                    name:'30元代金券',
                    date:'2018-07-21 9:31',
                    money:3
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
        handPayment:function(){//点击立即交费
            console.log('handPayment')
        },
        handRecord:function(){//点击缴费记录
           this.$router.push('/annal')
        },
        handBill:function(){//点击月份账单
           this.$router.push('/historyofthebill')
            console.log('handRecord')
        },
        handdate:function(){ //点击日历图标
           this.$router.push('/customize')
        }
    }
}
</script>

<style lang="less">
    .payment{
        position: fixed;
        width: 100%;
        height: 100%;
        background: #ebebeb;
        .pay-top{
            padding-top: 80px;
            width: 100%;
            height: 444px;
            background: #fff;
            .top-one{
                color: #191919;
                font-size: 28px;
                text-align: center;
                padding-top: 60px;
            }
            .top-two{
                color: #191919;
                font-size: 60px;
                text-align: center;
                margin-top: 35px;
                margin-bottom: 61px;
            }
            .topPay{
                width: 694px;
                background: #FC5E2D;
            }
            .top-three{
                color: #5972A1;
                font-size: 30px;
                text-align: center;
                margin-top: 31px;
            }
            .top-three span:nth-child(2){
                margin: 0 40px;
            }
        }
        .pay-date{
            width: 672px;
            padding: 0 39px;
            height: 113px;
            .date-left{
                width: 70%;
                height: 100%;
                float: left;
                &>p{
                    text-align: left;
                    height: 40px;
                    line-height: 40px;
                }
                .date-pone{
                    margin-top: 16.5px;
                    color: #191919;
                    font-size: 28px;
                }
                .data-ptwo{
                    color: #808080;
                    font-size: 24px;
                }
            }
            .date-right{
                width: 27%;
                height: 100%;
                float: right;
                position: relative;
                .sel-date{
                    width: 54px;
                    height: 46px;
                    margin-top: 19px;
                    float: right;
                    display:block;
                }
                .data-pthree{
                    color: #5972A1;
                    font-size: 20px;
                    position: relative;
                    top: 75px;
                    left: 90px;
                }
            }
        }
        .pay-cont{
            width: 672px;
            padding: 0 39px;
            background: #fff;
            .item{
                width: 100%;
                height: 90px;
                padding: 15px 0;
                .item-left{
                    width: 70%;
                    height: 100%;
                    float: left;
                    &>p{
                        width: 100%;
                        overflow: hidden;
                        text-align: left;
                    }
                    .left-one{
                        height: 50px;
                        line-height: 50px;
                        color: #191919;
                        font-size: 30px;
                    }
                    .left-two{
                        height: 40px;
                        line-height: 40px;
                        color: #808080;
                        font-size: 24px;
                    }
                }
                .item-right{
                    width: 28%;
                    height: 100%;
                    line-height: 120px;
                    color: #191919;
                    font-size: 36px;
                    overflow: hidden;
                    float: right;
                    text-align: right;
                }
            }
        }
    }
</style>













