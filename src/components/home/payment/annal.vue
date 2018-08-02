<template>
    <div class="annal">
        <mt-header fixed title="缴费记录">
          <router-link slot="left" :to="{path:'payment'}">
            <mt-button icon="back"></mt-button>
          </router-link>
        </mt-header>
        <div class="ann-cont">
            <div class="item" v-for="(item,index) in lists" :key="index" :id='index'>
                <div class="item-left">
                    <p class="left-one">{{item.name}}</p>
                    <p class="left-two">{{item.date}}</p>
                </div>
                <div class="item-right">
                    {{item.money  | changemoney}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'annal',
    data(){
        return {
            lists:[
                {
                    name:'缴费',
                    date:'2018-07-23 12:43',
                    money:20
                },
                {
                    name:'缴费',
                    date:'2018-07-23 12:43',
                    money:20
                },{
                    name:'缴费',
                    date:'2018-07-23 12:43',
                    money:20
                },{
                    name:'缴费',
                    date:'2018-07-23 12:43',
                    money:20
                },{
                    name:'缴费',
                    date:'2018-07-23 12:43',
                    money:20
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
    }
}
</script>

<style lang="less">
    .annal{
        position: fixed;
        width: 100%;
        height: 100%;
        background: #ebebeb;
        .ann-cont{
            padding-top: 80px;
            width: 100%;
            background: #fff;
            .item{
                width: 676px;
                height: 90px;
                padding:15px 37px;
                border-bottom: 1px solid #ebebeb;
                .item-left{
                    width: 70%;
                    height: 100%;
                    float: left;
                    &>p{
                        height: 40px;
                        line-height: 40px;
                        text-align: left;
                        overflow: hidden;
                    }
                }
                .item-right{
                    text-align: right;
                    width: 30%;
                    height: 100%;
                    line-height: 90px;
                    color: #191919;
                    font-size: 36px;
                    float: right;
                }
            }
        }
    }
</style>








