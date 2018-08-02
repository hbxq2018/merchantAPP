<template>
    <div class="customize">
        <mt-header fixed title="自定义查询">
          <router-link slot="left" :to="{path:'payment'}">
            <mt-button icon="back"></mt-button>
          </router-link>
        </mt-header>
        <div class="legend">目前仅支持查询最多31天数据</div>
        <mt-field label="开始时间" placeholder="选择开始时间" type="date" v-model="startTime"></mt-field>
        <mt-field label="结束时间" placeholder="选择结束时间" type="date" v-model="endTime"></mt-field>
        <div class="inquiry" @click="inquiry">查询</div>
        
        <div class="cus-date" v-if="startTime && endTime">
            <p class="date-pone">{{startTime}}至{{endTime}}</p>
            <p class="date-ptwo">服务费100笔，共{{money | changemoney}}元</p>
        </div>
        
        <div class="cus-cont" v-if="startTime && endTime">
            <div class="item" v-for="(item,index) in lists" :key="index">
                <div class="item-left">
                    <p class="leftpone">{{item.name}}</p>
                    <p class="lefttwo">{{item.date}}</p>
                </div>
                <div class="item-right">{{item.money | changemoney}}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'customize',
    data(){
        return {
            startTime:'',
            endTime:'',
            money:244.50,
            lists:[
                {
                    name:'20元代金券',
                    date:'2018-07-23 12:43',
                    money:20
                },
                {
                    name:'20元代金券',
                    date:'2018-07-23 12:43',
                    money:20
                },{
                    name:'20元代金券',
                    date:'2018-07-23 12:43',
                    money:20
                },{
                    name:'20元代金券',
                    date:'2018-07-23 12:43',
                    money:20
                },{
                    name:'20元代金券',
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
    },
    methods:{
        inquiry:function(){
            let d1 = this.startTime,d2=this.endTime;
            if((new Date(d1.replace(/-/g,"\/"))) < (new Date(d2.replace(/-/g,"\/")))){
                console.log("下一步")
            }else{
                this.startTime='';
                this.endTime='';
                console.log('开始时间不得比结束时间晚')
            }
        }
    }
}
</script>

<style lang="less">
    .customize{
        position: fixed;
        width: 100%;
        height: 100%;
        background: #ebebeb;
        .legend{
            width: 674px;
            padding: 80px 38px 0 38px;
            height: 62px;
            line-height: 62px;
            color: #555;
            font-size: 24px;
            text-align: left;
        }
        .inquiry{
            width: 100%;
            height: 100px;
            line-height: 100px;
            font-size: 30px;
            background: #fff;
            text-align: center;
            color: #FC5E2D;
        }
        .cus-date{
            width: 674px;
            height: 80px;
            padding:17px 38px;
            &>p{
                width: 100%;
                height: 40px;
                line-height: 40px;
                text-align: left;
            }
            .date-pone{
                color: #191919;
                font-size: 28px;
            }
            .date-ptwo{
                color: #808080;
                font-size: 24px;
            }
        }
        .cus-cont{
            width: 100%;
            background: #fff;
            .item{
                width: 674px;
                height: 110px;
                padding:17px 38px;
                .item-left{
                    float: left;
                    width: 70%;
                    &>p{
                        text-align: left;
                        height: 55px;
                        line-height: 55px;
                    }
                    .leftpone{
                        color: #1F1F1F;
                        font-size: 30px;
                    }
                    .lefttwo{
                        color: #929292;
                        font-size: 27px;
                    }
                }
                .item-right{
                    float: right;
                    text-align: right;
                    width: 30%;
                    height: 100%;
                    line-height: 110px;
                }
            }
        }
    }
</style>

